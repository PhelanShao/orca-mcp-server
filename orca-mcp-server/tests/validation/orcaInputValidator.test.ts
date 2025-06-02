import { ORCAInputValidator } from '../../src/validation/orcaInputValidator.js';
import { KeywordManager } from '../../src/core/keywordManager.js';
import { CoordinateProcessor } from '../../src/core/coordinateProcessor.js';
import { ValidationReport, ValidationIssue, CommonMistake } from '../../src/types/orca.types.js';

describe('ORCAInputValidator', () => {
  let validator: ORCAInputValidator;
  let keywordManager: KeywordManager;
  let coordinateProcessor: CoordinateProcessor;

  beforeEach(() => {
    keywordManager = new KeywordManager();
    coordinateProcessor = new CoordinateProcessor();
    validator = new ORCAInputValidator(keywordManager, coordinateProcessor);
  });

  describe('validate_complete_input', () => {
    it('should validate a correct ORCA input file', async () => {
      const validInput = `! B3LYP def2-SVP Opt

%pal NProcs 4 end

* xyz 0 1
C 0.0 0.0 0.0
H 0.0 0.0 1.0
H 0.0 1.0 0.0
H 1.0 0.0 0.0
*`;

      const report: ValidationReport = await validator.validate_complete_input(validInput);

      expect(report.overall_isValid).toBe(true);
      expect(report.syntax_issues).toHaveLength(0);
      expect(report.keyword_issues).toHaveLength(0);
      expect(report.coordinate_issues).toHaveLength(0);
      expect(report.parameter_issues).toHaveLength(0);
      expect(report.common_mistakes).toHaveLength(0);
    });

    it('should detect missing keyword line', async () => {
      const invalidInput = `%pal NProcs 4 end

* xyz 0 1
C 0.0 0.0 0.0
H 0.0 0.0 1.0
*`;

      const report: ValidationReport = await validator.validate_complete_input(invalidInput);

      expect(report.overall_isValid).toBe(false);
      expect(report.syntax_issues).toHaveLength(1);
      expect(report.syntax_issues[0].type).toBe('SYNTAX_ERROR');
      expect(report.syntax_issues[0].message).toContain('Missing keyword line');
    });

    it('should detect unclosed parameter blocks', async () => {
      const invalidInput = `! B3LYP def2-SVP

%scf
  MaxIter 200
  TolE 1e-7

* xyz 0 1
C 0.0 0.0 0.0
*`;

      const report: ValidationReport = await validator.validate_complete_input(invalidInput);

      expect(report.overall_isValid).toBe(false);
      expect(report.syntax_issues).toHaveLength(1);
      expect(report.syntax_issues[0].type).toBe('SYNTAX_ERROR');
      expect(report.syntax_issues[0].message).toContain('was not closed with \'end\'');
    });

    it('should detect orphaned end statements', async () => {
      const invalidInput = `! B3LYP def2-SVP

end

* xyz 0 1
C 0.0 0.0 0.0
*`;

      const report: ValidationReport = await validator.validate_complete_input(invalidInput);

      expect(report.overall_isValid).toBe(false);
      expect(report.syntax_issues).toHaveLength(1);
      expect(report.syntax_issues[0].type).toBe('SYNTAX_ERROR');
      expect(report.syntax_issues[0].message).toContain('Found \'end\' without a corresponding opening %block');
    });

    it('should detect keyword conflicts', async () => {
      const invalidInput = `! HF B3LYP def2-SVP

* xyz 0 1
C 0.0 0.0 0.0
*`;

      const report: ValidationReport = await validator.validate_complete_input(invalidInput);

      expect(report.overall_isValid).toBe(false);
      expect(report.keyword_issues).toHaveLength(1);
      expect(report.keyword_issues[0].type).toBe('KEYWORD_CONFLICT');
      expect(report.keyword_issues[0].message).toContain('HF method specified alongside a DFT functional');
    });

    it('should handle multiple parameter blocks correctly', async () => {
      const validInput = `! B3LYP def2-SVP

%scf
  MaxIter 200
end

%pal
  NProcs 4
end

* xyz 0 1
C 0.0 0.0 0.0
*`;

      const report: ValidationReport = await validator.validate_complete_input(validInput);

      expect(report.overall_isValid).toBe(true);
      expect(report.syntax_issues).toHaveLength(0);
    });

    it('should handle nested or complex block structures', async () => {
      const invalidInput = `! B3LYP def2-SVP

%scf
  MaxIter 200
  %nested
    SomeOption true
  end
end

* xyz 0 1
C 0.0 0.0 0.0
*`;

      const report: ValidationReport = await validator.validate_complete_input(invalidInput);

      // This should detect the nested block issue
      expect(report.overall_isValid).toBe(false);
    });
  });

  describe('check_common_mistakes', () => {
    it('should detect missing coordinate block closing asterisk', async () => {
      const invalidInput = `! B3LYP def2-SVP

* xyz 0 1
C 0.0 0.0 0.0
H 0.0 0.0 1.0`;

      const mistakes: CommonMistake[] = await validator.check_common_mistakes(invalidInput);

      expect(mistakes).toHaveLength(1);
      expect(mistakes[0].type).toBe('SYNTAX_ERROR');
      expect(mistakes[0].message).toContain('missing its closing asterisk');
    });

    it('should handle properly closed coordinate blocks', async () => {
      const validInput = `! B3LYP def2-SVP

* xyz 0 1
C 0.0 0.0 0.0
H 0.0 0.0 1.0
*`;

      const mistakes: CommonMistake[] = await validator.check_common_mistakes(validInput);

      expect(mistakes).toHaveLength(0);
    });

    it('should handle multiple coordinate blocks', async () => {
      const validInput = `! B3LYP def2-SVP

* xyz 0 1
C 0.0 0.0 0.0
*

* xyz 0 1
H 0.0 0.0 1.0
*`;

      const mistakes: CommonMistake[] = await validator.check_common_mistakes(validInput);

      expect(mistakes).toHaveLength(0);
    });

    it('should handle internal coordinate blocks', async () => {
      const validInput = `! B3LYP def2-SVP

* int 0 1
O
H 1 0.96
H 1 0.96 2 104.5
*`;

      const mistakes: CommonMistake[] = await validator.check_common_mistakes(validInput);

      expect(mistakes).toHaveLength(0);
    });

    it('should handle external coordinate file references', async () => {
      const validInput = `! B3LYP def2-SVP

* xyzfile 0 1 molecule.xyz *`;

      const mistakes: CommonMistake[] = await validator.check_common_mistakes(validInput);

      expect(mistakes).toHaveLength(0);
    });

    it('should handle gzmt file references', async () => {
      const validInput = `! B3LYP def2-SVP

* gzmtfile 0 1 molecule.gzmt *`;

      const mistakes: CommonMistake[] = await validator.check_common_mistakes(validInput);

      expect(mistakes).toHaveLength(0);
    });

    it('should handle empty input gracefully', async () => {
      const emptyInput = '';

      const mistakes: CommonMistake[] = await validator.check_common_mistakes(emptyInput);

      expect(mistakes).toHaveLength(0);
    });

    it('should handle input with no coordinate blocks', async () => {
      const noCoordInput = `! B3LYP def2-SVP

%pal NProcs 4 end`;

      const mistakes: CommonMistake[] = await validator.check_common_mistakes(noCoordInput);

      expect(mistakes).toHaveLength(0);
    });
  });

  describe('syntax validation edge cases', () => {
    it('should handle Windows line endings', async () => {
      const windowsInput = `! B3LYP def2-SVP\r\n\r\n* xyz 0 1\r\nC 0.0 0.0 0.0\r\n*`;

      const report: ValidationReport = await validator.validate_complete_input(windowsInput);

      expect(report.overall_isValid).toBe(true);
    });

    it('should handle mixed line endings', async () => {
      const mixedInput = `! B3LYP def2-SVP\r\n\n* xyz 0 1\nC 0.0 0.0 0.0\r\n*`;

      const report: ValidationReport = await validator.validate_complete_input(mixedInput);

      expect(report.overall_isValid).toBe(true);
    });

    it('should handle extra whitespace', async () => {
      const whitespaceInput = `   ! B3LYP def2-SVP   

   * xyz 0 1   
   C 0.0 0.0 0.0   
   *   `;

      const report: ValidationReport = await validator.validate_complete_input(whitespaceInput);

      expect(report.overall_isValid).toBe(true);
    });

    it('should handle comments and empty lines', async () => {
      const commentInput = `! B3LYP def2-SVP

# This is a comment

* xyz 0 1

C 0.0 0.0 0.0

*`;

      const report: ValidationReport = await validator.validate_complete_input(commentInput);

      expect(report.overall_isValid).toBe(true);
    });

    it('should detect case-insensitive block keywords', async () => {
      const caseInput = `! B3LYP def2-SVP

%SCF
  MaxIter 200
END

* xyz 0 1
C 0.0 0.0 0.0
*`;

      const report: ValidationReport = await validator.validate_complete_input(caseInput);

      expect(report.overall_isValid).toBe(true);
    });

    it('should handle multiple keyword lines', async () => {
      const multiKeywordInput = `! B3LYP def2-SVP
! Opt TightSCF

* xyz 0 1
C 0.0 0.0 0.0
*`;

      const report: ValidationReport = await validator.validate_complete_input(multiKeywordInput);

      expect(report.overall_isValid).toBe(true);
    });
  });

  describe('extractKeywords helper', () => {
    it('should extract keywords from input', async () => {
      const input = `! B3LYP def2-SVP Opt TightSCF

* xyz 0 1
C 0.0 0.0 0.0
*`;

      const report: ValidationReport = await validator.validate_complete_input(input);

      // The keywords should be extracted and validated
      // We can infer this worked if keyword validation ran without errors for valid keywords
      expect(report.keyword_issues).toHaveLength(0);
    });

    it('should handle multiple spaces in keyword line', async () => {
      const input = `!   B3LYP    def2-SVP     Opt

* xyz 0 1
C 0.0 0.0 0.0
*`;

      const report: ValidationReport = await validator.validate_complete_input(input);

      expect(report.keyword_issues).toHaveLength(0);
    });

    it('should handle empty keyword line', async () => {
      const input = `!

* xyz 0 1
C 0.0 0.0 0.0
*`;

      const report: ValidationReport = await validator.validate_complete_input(input);

      // Should still be valid, just no keywords
      expect(report.syntax_issues).toHaveLength(0);
    });
  });
});