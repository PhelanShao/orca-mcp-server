import { ConvergenceDiagnostic } from '../../src/intelligent/convergenceDiagnostic.js';
import { DiagnosisResult } from '../../src/types/orca.types.js';

describe('ConvergenceDiagnostic', () => {
  let diagnostic: ConvergenceDiagnostic;

  beforeEach(() => {
    diagnostic = new ConvergenceDiagnostic();
  });

  describe('analyze_scf_failure', () => {
    it('should return null for successful SCF convergence', () => {
      const successfulOutput = `
        SCF CONVERGED AFTER 15 ITERATIONS
        Total Energy: -76.123456 Eh
        Final SCF energy: -76.123456
      `;

      const result = diagnostic.analyze_scf_failure(successfulOutput);

      expect(result).toBeNull();
    });

    it('should detect basic SCF non-convergence', () => {
      const failedOutput = `
        SCF NOT CONVERGED AFTER 125 ITERATIONS
        Energy change: 1.234e-03
        Density change: 5.678e-04
      `;

      const result: DiagnosisResult = diagnostic.analyze_scf_failure(failedOutput)!;

      expect(result).not.toBeNull();
      expect(result.summary).toContain('SCF did not converge within the maximum number of iterations');
      expect(result.suggested_keywords_add).toContain('SlowConv');
      expect(result.suggested_block_modifications?.scf).toContain('MaxIter 200');
    });

    it('should detect SCF oscillation', () => {
      const oscillatingOutput = `
        SCF NOT CONVERGED AFTER 125 ITERATIONS
        oscillating behavior in DIIS
        Energy oscillating between -76.123 and -76.124
      `;

      const result: DiagnosisResult = diagnostic.analyze_scf_failure(oscillatingOutput)!;

      expect(result).not.toBeNull();
      expect(result.problem_type).toBe('SCF_OSCILLATION');
      expect(result.summary).toContain('oscillating behavior');
      expect(result.recommendations[0]).toContain('damping');
      expect(result.suggested_keywords_add).toContain('VerySlowConv');
      expect(result.suggested_block_modifications?.scf).toContain('DampFac 0.7');
      expect(result.suggested_block_modifications?.scf).toContain('DampErr 0.05');
    });

    it('should detect alternative SCF oscillation pattern', () => {
      const oscillatingOutput = `
        SCF NOT CONVERGED AFTER 125 ITERATIONS
        SCF is oscillating
        Unable to achieve convergence
      `;

      const result: DiagnosisResult = diagnostic.analyze_scf_failure(oscillatingOutput)!;

      expect(result).not.toBeNull();
      expect(result.problem_type).toBe('SCF_OSCILLATION');
      expect(result.summary).toContain('oscillating behavior');
      expect(result.suggested_keywords_add).toContain('VerySlowConv');
    });

    it('should detect DIIS problems without oscillation', () => {
      const diisOutput = `
        SCF NOT CONVERGED AFTER 125 ITERATIONS
        Problem in DIIS
        DIIS extrapolation failed
      `;

      const result: DiagnosisResult = diagnostic.analyze_scf_failure(diisOutput)!;

      expect(result).not.toBeNull();
      expect(result.problem_type).toBe('DIIS_ERROR');
      expect(result.summary).toContain('issue occurred within the DIIS procedure');
      expect(result.recommendations[0]).toContain('KDIIS');
      expect(result.suggested_block_modifications?.scf).toContain('DIIS KDIIS');
    });

    it('should detect large gradient problems', () => {
      const largeGradientOutput = `
        SCF NOT CONVERGED AFTER 125 ITERATIONS
        gradient is too large
        Geometry optimization may be needed
      `;

      const result: DiagnosisResult = diagnostic.analyze_scf_failure(largeGradientOutput)!;

      expect(result).not.toBeNull();
      expect(result.problem_type).toBe('LARGE_GRADIENT');
      expect(result.summary).toContain('Initial geometry might be too far from a minimum');
      expect(result.recommendations[0]).toContain('starting geometry is reasonable');
    });

    it('should detect fragment file not found errors', () => {
      const fragmentOutput = `
        Unable to open fragment file
        Fragment file "fragment.xyz" not found
        Check file path and permissions
      `;

      const result: DiagnosisResult = diagnostic.analyze_scf_failure(fragmentOutput)!;

      expect(result).not.toBeNull();
      expect(result.problem_type).toBe('FILE_NOT_FOUND_FRAG');
      expect(result.summary).toContain('fragment file specified in the input');
      expect(result.recommendations[0]).toContain('Check the path and filename');
    });

    it('should handle multiple issues in one output', () => {
      const multipleIssuesOutput = `
        SCF NOT CONVERGED AFTER 125 ITERATIONS
        oscillating behavior in DIIS
        MaxIter 100
        Energy change: 1.234e-03
      `;

      const result: DiagnosisResult = diagnostic.analyze_scf_failure(multipleIssuesOutput)!;

      expect(result).not.toBeNull();
      expect(result.problem_type).toBe('SCF_OSCILLATION');
      expect(result.suggested_keywords_add).toContain('VerySlowConv');
      expect(result.suggested_block_modifications?.scf).toContain('DampFac 0.7');
      expect(result.suggested_block_modifications?.scf).toContain('MaxIter 200');
    });

    it('should not suggest MaxIter increase if already high', () => {
      const highMaxIterOutput = `
        SCF NOT CONVERGED AFTER 300 ITERATIONS
        MaxIter 300
        Energy change: 1.234e-03
      `;

      const result: DiagnosisResult = diagnostic.analyze_scf_failure(highMaxIterOutput)!;

      expect(result).not.toBeNull();
      expect(result.suggested_block_modifications?.scf).not.toContain('MaxIter 200');
    });

    it('should clean up SCF block modifications', () => {
      const oscillatingOutput = `
        SCF NOT CONVERGED AFTER 125 ITERATIONS
        oscillating behavior in DIIS
      `;

      const result: DiagnosisResult = diagnostic.analyze_scf_failure(oscillatingOutput)!;

      expect(result.suggested_block_modifications?.scf).not.toMatch(/^\s+/);
      expect(result.suggested_block_modifications?.scf).not.toMatch(/\s+$/);
    });

    it('should provide general recommendations for unspecific failures', () => {
      const genericFailureOutput = `
        SCF NOT CONVERGED AFTER 125 ITERATIONS
        Some generic error message
      `;

      const result: DiagnosisResult = diagnostic.analyze_scf_failure(genericFailureOutput)!;

      expect(result).not.toBeNull();
      expect(result.recommendations).toContain('Inspect the ORCA output file carefully around the SCF iteration section for error messages.');
      expect(result.recommendations).toContain('Ensure molecular geometry is reasonable.');
      expect(result.recommendations).toContain('Try a different initial guess (e.g., Guess=Hueckel, Guess=PM7).');
      expect(result.recommendations).toContain('Increase MaxIter in %scf block.');
    });

    it('should handle case insensitive pattern matching', () => {
      const mixedCaseOutput = `
        scf not converged after 125 iterations
        OSCILLATING BEHAVIOR IN DIIS
      `;

      const result: DiagnosisResult = diagnostic.analyze_scf_failure(mixedCaseOutput)!;

      expect(result).not.toBeNull();
      expect(result.problem_type).toBe('SCF_OSCILLATION');
    });

    it('should remove duplicate keywords', () => {
      const output = `
        SCF NOT CONVERGED AFTER 125 ITERATIONS
        oscillating behavior in DIIS
      `;

      const result: DiagnosisResult = diagnostic.analyze_scf_failure(output)!;

      expect(result.suggested_keywords_add).toBeDefined();
      const uniqueKeywords = new Set(result.suggested_keywords_add);
      expect(result.suggested_keywords_add!.length).toBe(uniqueKeywords.size);
    });

    it('should handle empty or whitespace-only output', () => {
      const emptyOutput = '';
      const whitespaceOutput = '   \n\t  \n  ';

      expect(diagnostic.analyze_scf_failure(emptyOutput)).toBeNull();
      expect(diagnostic.analyze_scf_failure(whitespaceOutput)).toBeNull();
    });

    it('should handle output with no SCF information', () => {
      const noScfOutput = `
        This is some random output
        No SCF information here
        Just some other calculations
      `;

      const result = diagnostic.analyze_scf_failure(noScfOutput);

      expect(result).toBeNull();
    });
  });
});