/**
 * Integration tests for MCP tools
 * These tests verify the overall functionality of the ORCA MCP server tools
 */

import { KeywordManager } from '../../src/core/keywordManager.js';
import { CoordinateProcessor } from '../../src/core/coordinateProcessor.js';
import { CalculationTemplateEngine } from '../../src/core/calculationTemplateEngine.js';
import { ParameterRecommendationEngine } from '../../src/intelligent/parameterRecommendationEngine.js';
import { ConvergenceDiagnostic } from '../../src/intelligent/convergenceDiagnostic.js';
import { ORCAInputValidator } from '../../src/validation/orcaInputValidator.js';

describe('MCP Tools Integration', () => {
  let keywordManager: KeywordManager;
  let coordinateProcessor: CoordinateProcessor;
  let templateEngine: CalculationTemplateEngine;
  let recommendationEngine: ParameterRecommendationEngine;
  let convergenceDiagnostic: ConvergenceDiagnostic;
  let inputValidator: ORCAInputValidator;

  beforeEach(() => {
    keywordManager = new KeywordManager();
    coordinateProcessor = new CoordinateProcessor();
    templateEngine = new CalculationTemplateEngine();
    recommendationEngine = new ParameterRecommendationEngine();
    convergenceDiagnostic = new ConvergenceDiagnostic();
    inputValidator = new ORCAInputValidator(keywordManager, coordinateProcessor);
  });

  describe('Complete Workflow Integration', () => {
    it('should generate, validate, and suggest improvements for an ORCA input file', async () => {
      // Step 1: Generate a template
      const molecule = coordinateProcessor.parse_xyz_coordinates(
        'C 0.0 0.0 0.0\nH 0.0 0.0 1.0\nH 0.0 1.0 0.0\nH 1.0 0.0 0.0\nH -1.0 0.0 0.0',
        0,
        1
      );

      const template = templateEngine.generate_dft_template(molecule, 'B3LYP', 'def2-SVP');
      
      expect(template.content).toContain('! B3LYP def2-SVP');
      expect(template.content).toContain('* xyz 0 1');
      expect(template.content).toContain('C 0.0 0.0 0.0');

      // Step 2: Validate the generated input
      const validationReport = await inputValidator.validate_complete_input(template.content);
      
      expect(validationReport.overall_isValid).toBe(true);
      expect(validationReport.syntax_issues).toHaveLength(0);

      // Step 3: Get keyword suggestions
      const keywordSuggestions = await keywordManager.suggest_missing_keywords(
        'optimization',
        ['B3LYP', 'def2-SVP']
      );
      
      expect(keywordSuggestions.recommended).toContain('Opt');

      // Step 4: Get basis set recommendations
      const basisRecommendation = await recommendationEngine.recommend_basis_set(
        ['C', 'H'],
        'medium',
        5
      );
      
      expect(basisRecommendation.orbital_basis).toBe('def2-SVP');
      expect(basisRecommendation.auxiliary_basis_jk).toBe('def2/JK');
    });

    it('should handle optimization workflow with frequency calculation', async () => {
      // Generate optimization + frequency template
      const molecule = coordinateProcessor.parse_xyz_coordinates(
        'O 0.0 0.0 0.0\nH 0.0 0.0 1.0\nH 0.0 1.0 0.0',
        0,
        1
      );

      const template = templateEngine.generate_opt_freq_template(molecule, 'PBE0', 'def2-TZVP');
      
      expect(template.content).toContain('! PBE0 def2-TZVP Opt Freq');
      expect(template.content).toContain('* xyz 0 1');

      // Validate charge/multiplicity
      const chargeValidation = coordinateProcessor.validate_charge_multiplicity(0, 1, molecule.atoms);
      expect(chargeValidation).toHaveLength(0); // No issues expected for neutral water

      // Check keyword compatibility
      const keywordValidation = await keywordManager.validate_keyword_combination(['PBE0', 'def2-TZVP', 'Opt', 'Freq']);
      expect(keywordValidation.isValid).toBe(true);
    });

    it('should handle heavy element calculations with relativistic effects', async () => {
      // Test with heavy elements
      const heavyMolecule = coordinateProcessor.parse_xyz_coordinates(
        'Au 0.0 0.0 0.0\nCl 0.0 0.0 2.5',
        0,
        1
      );

      // Get recommendations for heavy elements
      const basisRecommendation = await recommendationEngine.recommend_basis_set(
        ['Au', 'Cl'],
        'high',
        2
      );
      
      expect(basisRecommendation.relativistic_method).toBe('DKH');
      expect(basisRecommendation.orbital_basis).toBe('SARC-DKH-TZVP');

      // Generate template with recommended settings
      const template = templateEngine.generate_dft_template(
        heavyMolecule,
        'PBE0',
        basisRecommendation.orbital_basis
      );
      
      expect(template.content).toContain('PBE0');
      expect(template.content).toContain('SARC-DKH-TZVP');
    });

    it('should diagnose and suggest fixes for SCF convergence issues', async () => {
      // Simulate SCF convergence failure
      const failedOutput = `
        SCF NOT CONVERGED AFTER 125 ITERATIONS
        oscillating behavior in DIIS
        Energy change: 1.234e-03
      `;

      const diagnosis = convergenceDiagnostic.analyze_scf_failure(failedOutput);
      
      expect(diagnosis).not.toBeNull();
      expect(diagnosis!.problem_type).toBe('SCF_OSCILLATION');
      expect(diagnosis!.suggested_keywords_add).toContain('VerySlowConv');
      expect(diagnosis!.suggested_block_modifications?.scf).toContain('DampFac 0.7');

      // Get SCF recommendations based on system characteristics
      const scfRecommendation = recommendationEngine.recommend_scf_settings({
        convergence_history: ['oscillating'],
        has_heavy_atoms: true
      });
      
      expect(scfRecommendation.convergence_keywords).toContain('VerySlowConv');
      expect(scfRecommendation.custom_scf_block).toContain('DampFac 0.7');
    });

    it('should handle memory and performance optimization', async () => {
      // Test memory recommendations for different system sizes
      const smallSystemMemory = recommendationEngine.suggest_memory_settings(
        10,    // atoms
        'def2-SVP',
        4,     // cores
        16     // GB RAM
      );
      
      expect(smallSystemMemory.max_core_mb).toBeGreaterThan(0);
      expect(smallSystemMemory.max_core_mb).toBeLessThanOrEqual(16000);

      const largeSystemMemory = recommendationEngine.suggest_memory_settings(
        200,   // atoms
        'def2-TZVP',
        8,     // cores
        64     // GB RAM
      );
      
      expect(largeSystemMemory.total_ram_gb_recommendation!).toBeGreaterThan(
        smallSystemMemory.total_ram_gb_recommendation!
      );
    });

    it('should validate complex input files with multiple blocks', async () => {
      const complexInput = `! B3LYP def2-SVP Opt TightSCF

%scf
  MaxIter 200
  TolE 1e-7
  DampFac 0.8
end

%pal
  NProcs 8
end

%basis
  NewGTO C "def2-TZVP" end
  NewGTO H "def2-SVP" end
end

* xyz 0 1
C 0.0 0.0 0.0
H 0.0 0.0 1.0
H 0.0 1.0 0.0
H 1.0 0.0 0.0
H -1.0 0.0 0.0
*`;

      const validationReport = await inputValidator.validate_complete_input(complexInput);
      
      expect(validationReport.overall_isValid).toBe(true);
      expect(validationReport.syntax_issues).toHaveLength(0);
      expect(validationReport.keyword_issues).toHaveLength(0);
    });

    it('should handle coordinate format conversions', async () => {
      // Test XYZ parsing
      const xyzCoords = 'C 0.0 0.0 0.0\nH 0.0 0.0 1.0\nH 0.0 1.0 0.0';
      const molecule = coordinateProcessor.parse_xyz_coordinates(xyzCoords, 0, 1);
      
      expect(molecule.atoms).toHaveLength(3);
      expect(molecule.atoms[0].element).toBe('C');
      expect(molecule.source_format).toBe('xyz');

      // Test Z-matrix parsing
      const zmatrix = 'O\nH 1 0.96\nH 1 0.96 2 104.5';
      const zmatrixStructure = coordinateProcessor.parse_internal_coordinates(zmatrix, 0, 1);
      
      expect(zmatrixStructure.entries).toHaveLength(3);
      expect(zmatrixStructure.entries[0].atom).toBe('O');
      expect(zmatrixStructure.source_format).toBe('internal');

      // Test external file handling
      const externalRef = '0 1 molecule.xyz';
      const externalConfig = coordinateProcessor.handle_external_files(externalRef, 'xyzfile');
      
      expect(externalConfig.file_type).toBe('xyzfile');
      expect(externalConfig.filename).toBe('molecule.xyz');
      expect(externalConfig.charge).toBe(0);
      expect(externalConfig.multiplicity).toBe(1);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle invalid coordinates gracefully', () => {
      expect(() => {
        coordinateProcessor.parse_xyz_coordinates('invalid coordinates', 0, 1);
      }).toThrow();

      expect(() => {
        coordinateProcessor.parse_xyz_coordinates('C invalid 0.0 0.0', 0, 1);
      }).toThrow('Invalid coordinate value');
    });

    it('should detect and report validation issues', async () => {
      const invalidInput = `! B3LYP def2-SVP

%scf
  MaxIter 200
  # Missing 'end' statement

* xyz 0 1
C 0.0 0.0 0.0
# Missing closing asterisk`;

      const validationReport = await inputValidator.validate_complete_input(invalidInput);
      
      expect(validationReport.overall_isValid).toBe(false);
      expect(validationReport.syntax_issues.length).toBeGreaterThan(0);
    });

    it('should handle empty or minimal inputs', async () => {
      const minimalInput = '! B3LYP def2-SVP';
      
      const validationReport = await inputValidator.validate_complete_input(minimalInput);
      
      // Should be syntactically valid even if minimal
      expect(validationReport.syntax_issues.filter(issue => issue.type === 'SYNTAX_ERROR')).toHaveLength(0);
    });

    it('should provide meaningful error messages', async () => {
      const conflictingInput = '! HF B3LYP PBE def2-SVP def2-TZVP';
      
      const keywordValidation = await keywordManager.validate_keyword_combination(
        ['HF', 'B3LYP', 'PBE', 'def2-SVP', 'def2-TZVP']
      );
      
      expect(keywordValidation.isValid).toBe(false);
      expect(keywordValidation.issues.length).toBeGreaterThan(0);
      expect(keywordValidation.issues.some(issue => 
        issue.message.includes('Multiple DFT functionals')
      )).toBe(true);
      expect(keywordValidation.issues.some(issue => 
        issue.message.includes('Multiple main basis sets')
      )).toBe(true);
    });
  });
});