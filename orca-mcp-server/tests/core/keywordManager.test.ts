import { KeywordManager } from '../../src/core/keywordManager.js';
import { ValidationResult, KeywordSuggestions } from '../../src/types/orca.types.js';

describe('KeywordManager', () => {
  let keywordManager: KeywordManager;

  beforeEach(() => {
    keywordManager = new KeywordManager();
  });

  describe('validate_keyword_combination', () => {
    it('should validate compatible keywords', async () => {
      const keywords = ['B3LYP', 'def2-SVP', 'Opt'];
      const result: ValidationResult = await keywordManager.validate_keyword_combination(keywords);
      
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should detect conflicting HF and DFT functional', async () => {
      const keywords = ['HF', 'B3LYP'];
      const result: ValidationResult = await keywordManager.validate_keyword_combination(keywords);
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].type).toBe('KEYWORD_CONFLICT');
      expect(result.issues[0].message).toContain('HF method specified alongside a DFT functional');
    });

    it('should detect multiple DFT functionals', async () => {
      const keywords = ['B3LYP', 'PBE', 'def2-SVP'];
      const result: ValidationResult = await keywordManager.validate_keyword_combination(keywords);
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].type).toBe('KEYWORD_CONFLICT');
      expect(result.issues[0].message).toContain('Multiple DFT functionals specified');
    });

    it('should detect multiple basis sets', async () => {
      const keywords = ['B3LYP', 'def2-SVP', 'def2-TZVP'];
      const result: ValidationResult = await keywordManager.validate_keyword_combination(keywords);
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].type).toBe('KEYWORD_CONFLICT');
      expect(result.issues[0].message).toContain('Multiple main basis sets specified');
    });

    it('should handle case insensitive keywords', async () => {
      const keywords = ['b3lyp', 'DEF2-SVP', 'opt'];
      const result: ValidationResult = await keywordManager.validate_keyword_combination(keywords);
      
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });

  describe('suggest_missing_keywords', () => {
    it('should suggest Opt keyword for optimization calculation', async () => {
      const result: KeywordSuggestions = await keywordManager.suggest_missing_keywords('optimization', ['B3LYP', 'def2-SVP']);
      
      expect(result.recommended).toContain('Opt');
    });

    it('should suggest Freq keyword for frequency calculation', async () => {
      const result: KeywordSuggestions = await keywordManager.suggest_missing_keywords('frequency', ['B3LYP', 'def2-SVP']);
      
      expect(result.recommended).toContain('Freq');
    });

    it('should suggest functional when missing for DFT calculation', async () => {
      const result: KeywordSuggestions = await keywordManager.suggest_missing_keywords('DFT', ['def2-SVP']);
      
      expect(result.recommended).toContain('B3LYP');
      expect(result.notes).toContain('DFT functional is recommended');
    });

    it('should suggest basis set when missing', async () => {
      const result: KeywordSuggestions = await keywordManager.suggest_missing_keywords('single_point', ['B3LYP']);
      
      expect(result.recommended).toContain('def2-SVP');
      expect(result.notes).toContain('basis set is required');
    });

    it('should not suggest already present keywords', async () => {
      const result: KeywordSuggestions = await keywordManager.suggest_missing_keywords('optimization', ['B3LYP', 'def2-SVP', 'Opt']);
      
      expect(result.recommended).not.toContain('Opt');
      expect(result.recommended).not.toContain('B3LYP');
      expect(result.recommended).not.toContain('def2-SVP');
    });
  });

  describe('getAllKeywords', () => {
    it('should return a set of known keywords', () => {
      const keywords = keywordManager.getAllKeywords();
      
      expect(keywords).toBeInstanceOf(Set);
      expect(keywords.size).toBeGreaterThan(0);
      expect(keywords.has('B3LYP')).toBe(true);
      expect(keywords.has('def2-SVP')).toBe(true);
      expect(keywords.has('Opt')).toBe(true);
    });
  });
});