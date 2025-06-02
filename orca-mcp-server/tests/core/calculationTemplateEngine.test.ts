import { CalculationTemplateEngine } from '../../src/core/calculationTemplateEngine.js';
import { MolecularStructure, ORCATemplate, CalculationType } from '../../src/types/orca.types.js';

describe('CalculationTemplateEngine', () => {
  let engine: CalculationTemplateEngine;
  let testMolecule: MolecularStructure;

  beforeEach(() => {
    engine = new CalculationTemplateEngine();
    testMolecule = {
      atoms: [
        { element: 'C', x: 0.0, y: 0.0, z: 0.0 },
        { element: 'H', x: 0.0, y: 0.0, z: 1.0 },
        { element: 'H', x: 0.0, y: 1.0, z: 0.0 },
        { element: 'H', x: 1.0, y: 0.0, z: 0.0 },
        { element: 'H', x: -1.0, y: 0.0, z: 0.0 }
      ],
      charge: 0,
      multiplicity: 1,
      coordinate_block: 'C 0.0 0.0 0.0\nH 0.0 0.0 1.0\nH 0.0 1.0 0.0\nH 1.0 0.0 0.0\nH -1.0 0.0 0.0',
      source_format: 'xyz'
    };
  });

  describe('identify_calculation_type', () => {
    it('should identify optimization calculation', () => {
      expect(engine.identify_calculation_type('geometry optimization')).toBe('optimization');
      expect(engine.identify_calculation_type('optimize structure')).toBe('optimization');
      expect(engine.identify_calculation_type('opt calculation')).toBe('optimization');
    });

    it('should identify frequency calculation', () => {
      expect(engine.identify_calculation_type('frequency analysis')).toBe('frequency');
      expect(engine.identify_calculation_type('freq calculation')).toBe('frequency');
      expect(engine.identify_calculation_type('vibrational frequencies')).toBe('frequency');
    });

    it('should identify combined optimization and frequency', () => {
      expect(engine.identify_calculation_type('optimization and frequency')).toBe('optimization_frequency');
      expect(engine.identify_calculation_type('opt freq calculation')).toBe('optimization_frequency');
    });

    it('should identify TD-DFT calculation', () => {
      expect(engine.identify_calculation_type('td-dft calculation')).toBe('td_dft');
      expect(engine.identify_calculation_type('excited state calculation')).toBe('td_dft');
      expect(engine.identify_calculation_type('uv-vis spectrum')).toBe('td_dft');
    });

    it('should identify NMR calculation', () => {
      expect(engine.identify_calculation_type('nmr shielding')).toBe('nmr');
      expect(engine.identify_calculation_type('NMR calculation')).toBe('nmr');
    });

    it('should identify EPR calculation', () => {
      expect(engine.identify_calculation_type('epr calculation')).toBe('epr');
      expect(engine.identify_calculation_type('esr spectrum')).toBe('epr');
    });

    it('should identify MP2 calculation', () => {
      expect(engine.identify_calculation_type('mp2 calculation')).toBe('mp2');
      expect(engine.identify_calculation_type('MP2 energy')).toBe('mp2');
    });

    it('should identify CCSD calculation', () => {
      expect(engine.identify_calculation_type('ccsd calculation')).toBe('ccsd');
      expect(engine.identify_calculation_type('CCSD(T) energy')).toBe('ccsd');
    });

    it('should default to single point', () => {
      expect(engine.identify_calculation_type('energy calculation')).toBe('single_point');
      expect(engine.identify_calculation_type('unknown type')).toBe('single_point');
      expect(engine.identify_calculation_type('')).toBe('single_point');
    });
  });

  describe('generate_dft_template', () => {
    it('should generate basic DFT template with defaults', () => {
      const template: ORCATemplate = engine.generate_dft_template(testMolecule);
      
      expect(template.content).toContain('! B3LYP def2-SVP');
      expect(template.content).toContain('%pal NProcs 2 end');
      expect(template.content).toContain('* xyz 0 1');
      expect(template.content).toContain('C 0.0 0.0 0.0');
      expect(template.content).toContain('*');
      expect(template.description).toContain('DFT Single Point calculation');
      expect(template.required_info).toContain('molecule.charge');
      expect(template.required_info).toContain('molecule.multiplicity');
      expect(template.required_info).toContain('molecule.coordinate_block');
    });

    it('should generate DFT template with custom functional and basis', () => {
      const template: ORCATemplate = engine.generate_dft_template(testMolecule, 'PBE0', 'def2-TZVP');
      
      expect(template.content).toContain('! PBE0 def2-TZVP');
      expect(template.description).toContain('PBE0/def2-TZVP');
    });

    it('should include additional keywords', () => {
      const template: ORCATemplate = engine.generate_dft_template(testMolecule, 'B3LYP', 'def2-SVP', ['TightSCF', 'Grid5']);
      
      expect(template.content).toContain('! B3LYP def2-SVP TightSCF Grid5');
    });

    it('should handle internal coordinates', () => {
      const internalMolecule = { ...testMolecule, source_format: 'internal' as const };
      const template: ORCATemplate = engine.generate_dft_template(internalMolecule);
      
      expect(template.content).toContain('* coords 0 1');
    });
  });

  describe('generate_optimization_template', () => {
    it('should generate optimization template with Opt keyword', () => {
      const template: ORCATemplate = engine.generate_optimization_template(testMolecule);
      
      expect(template.content).toContain('! B3LYP def2-SVP Opt');
      expect(template.description).toContain('Geometry Optimization');
    });

    it('should not duplicate Opt keyword if already present', () => {
      const template: ORCATemplate = engine.generate_optimization_template(testMolecule, 'B3LYP', 'def2-SVP', ['Opt', 'TightSCF']);
      
      const optMatches = template.content.match(/Opt/g);
      expect(optMatches).toHaveLength(1);
    });

    it('should handle custom functional and basis', () => {
      const template: ORCATemplate = engine.generate_optimization_template(testMolecule, 'PBE0', 'def2-TZVP');
      
      expect(template.content).toContain('! PBE0 def2-TZVP Opt');
      expect(template.description).toContain('PBE0/def2-TZVP');
    });
  });

  describe('generate_frequency_template', () => {
    it('should generate frequency template with Freq keyword', () => {
      const template: ORCATemplate = engine.generate_frequency_template(testMolecule);
      
      expect(template.content).toContain('! B3LYP def2-SVP Freq');
      expect(template.description).toContain('Frequency calculation');
    });

    it('should not duplicate Freq keyword if already present', () => {
      const template: ORCATemplate = engine.generate_frequency_template(testMolecule, 'B3LYP', 'def2-SVP', ['Freq', 'TightSCF']);
      
      const freqMatches = template.content.match(/Freq/g);
      expect(freqMatches).toHaveLength(1);
    });
  });

  describe('generate_opt_freq_template', () => {
    it('should generate combined optimization and frequency template', () => {
      const template: ORCATemplate = engine.generate_opt_freq_template(testMolecule);
      
      expect(template.content).toContain('! B3LYP def2-SVP Opt Freq');
      expect(template.description).toContain('Optimization and Frequency calculation');
    });

    it('should not duplicate keywords if already present', () => {
      const template: ORCATemplate = engine.generate_opt_freq_template(testMolecule, 'B3LYP', 'def2-SVP', ['Opt', 'Freq', 'TightSCF']);
      
      const optMatches = template.content.match(/Opt/g);
      const freqMatches = template.content.match(/Freq/g);
      expect(optMatches).toHaveLength(1);
      expect(freqMatches).toHaveLength(1);
    });

    it('should handle custom parameters', () => {
      const template: ORCATemplate = engine.generate_opt_freq_template(testMolecule, 'wB97X-D3', 'def2-TZVP', ['TightSCF']);
      
      expect(template.content).toContain('! wB97X-D3 def2-TZVP Opt Freq TightSCF');
      expect(template.description).toContain('wB97X-D3/def2-TZVP');
    });
  });

  describe('template structure validation', () => {
    it('should always include PAL block', () => {
      const template: ORCATemplate = engine.generate_dft_template(testMolecule);
      
      expect(template.content).toContain('%pal NProcs 2 end');
    });

    it('should include coordinate block with proper format', () => {
      const template: ORCATemplate = engine.generate_dft_template(testMolecule);
      
      expect(template.content).toMatch(/\* xyz \d+ \d+/);
      expect(template.content).toContain(testMolecule.coordinate_block);
      expect(template.content).toMatch(/\*\s*$/m);
    });

    it('should have proper line structure', () => {
      const template: ORCATemplate = engine.generate_dft_template(testMolecule);
      const lines = template.content.split('\n');
      
      // Should start with keyword line
      expect(lines[0]).toMatch(/^!/);
      
      // Should contain PAL block
      expect(template.content).toContain('%pal');
      expect(template.content).toContain('end');
      
      // Should end with coordinate block
      expect(template.content).toMatch(/\*\s*$/);
    });
  });
});