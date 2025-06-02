import { ParameterBlockManager } from '../../src/core/parameterBlockManager.js';
import { SCFSettings, BasisSetConfig } from '../../src/types/orca.types.js';

describe('ParameterBlockManager', () => {
  let manager: ParameterBlockManager;

  beforeEach(() => {
    manager = new ParameterBlockManager();
  });

  describe('create_scf_block', () => {
    it('should create basic SCF block with all settings', () => {
      const settings: SCFSettings = {
        max_iter: 200,
        convergence_level: 'Tight',
        tolerance_energy: 1e-7,
        diis_type: 'KDIIS'
      };

      const block = manager.create_scf_block(settings);

      expect(block).toContain('%scf');
      expect(block).toContain('MaxIter 200');
      expect(block).toContain('Convergence Tight');
      expect(block).toContain('TolE 1.0e-7');
      expect(block).toContain('DIIS KDIIS');
      expect(block).toContain('end');
    });

    it('should create SCF block with only some settings', () => {
      const settings: SCFSettings = {
        max_iter: 150,
        convergence_level: 'Normal'
      };

      const block = manager.create_scf_block(settings);

      expect(block).toContain('%scf');
      expect(block).toContain('MaxIter 150');
      expect(block).toContain('Convergence Normal');
      expect(block).not.toContain('TolE');
      expect(block).not.toContain('DIIS');
      expect(block).toContain('end');
    });

    it('should include custom lines', () => {
      const settings: SCFSettings = {
        max_iter: 100,
        custom_lines: ['DampFac 0.7', 'DampErr 0.05', 'Shift Shift 0.1 Erroff 0.05']
      };

      const block = manager.create_scf_block(settings);

      expect(block).toContain('MaxIter 100');
      expect(block).toContain('DampFac 0.7');
      expect(block).toContain('DampErr 0.05');
      expect(block).toContain('Shift Shift 0.1 Erroff 0.05');
    });

    it('should handle custom lines only', () => {
      const settings: SCFSettings = {
        custom_lines: ['SOSCF true', 'DirectResetFreq 1']
      };

      const block = manager.create_scf_block(settings);

      expect(block).toContain('%scf');
      expect(block).toContain('SOSCF true');
      expect(block).toContain('DirectResetFreq 1');
      expect(block).toContain('end');
    });

    it('should return empty string for empty settings', () => {
      const settings: SCFSettings = {};

      const block = manager.create_scf_block(settings);

      expect(block).toBe('');
    });

    it('should handle different convergence levels', () => {
      const levels: Array<SCFSettings['convergence_level']> = ['Loose', 'Normal', 'Tight', 'VeryTight'];
      
      levels.forEach(level => {
        const settings: SCFSettings = { convergence_level: level };
        const block = manager.create_scf_block(settings);
        expect(block).toContain(`Convergence ${level}`);
      });
    });

    it('should format tolerance energy in scientific notation', () => {
      const settings: SCFSettings = {
        tolerance_energy: 0.000001
      };

      const block = manager.create_scf_block(settings);

      expect(block).toContain('TolE 1.0e-6');
    });
  });

  describe('create_basis_block', () => {
    it('should create basic basis block with main basis', () => {
      const config: BasisSetConfig = {
        main_basis: 'def2-TZVP'
      };

      const block = manager.create_basis_block(config);

      expect(block).toContain('%basis');
      expect(block).toContain('NewGTO All "def2-TZVP" end');
      expect(block).toContain('end');
    });

    it('should include auxiliary basis sets', () => {
      const config: BasisSetConfig = {
        main_basis: 'def2-SVP',
        aux_basis_jk: 'def2/JK',
        aux_basis_cosx: 'def2/J'
      };

      const block = manager.create_basis_block(config);

      expect(block).toContain('NewGTO All "def2-SVP" end');
      expect(block).toContain('NewAuxJK All "def2/JK" end');
      expect(block).toContain('NewAuxBasis All "def2/J" end');
    });

    it('should include custom GTO lines', () => {
      const config: BasisSetConfig = {
        custom_gto_lines: [
          'NewGTO C "cc-pVTZ" end',
          'NewGTO H "cc-pVDZ" end',
          'NewAuxJK C "cc-pVTZ/JK" end'
        ]
      };

      const block = manager.create_basis_block(config);

      expect(block).toContain('NewGTO C "cc-pVTZ" end');
      expect(block).toContain('NewGTO H "cc-pVDZ" end');
      expect(block).toContain('NewAuxJK C "cc-pVTZ/JK" end');
    });

    it('should combine main basis and custom lines', () => {
      const config: BasisSetConfig = {
        main_basis: 'def2-SVP',
        aux_basis_jk: 'def2/JK',
        custom_gto_lines: ['NewGTO Fe "SARC-DKH-TZVP" end']
      };

      const block = manager.create_basis_block(config);

      expect(block).toContain('NewGTO All "def2-SVP" end');
      expect(block).toContain('NewAuxJK All "def2/JK" end');
      expect(block).toContain('NewGTO Fe "SARC-DKH-TZVP" end');
    });

    it('should return empty string for empty config', () => {
      const config: BasisSetConfig = {};

      const block = manager.create_basis_block(config);

      expect(block).toBe('');
    });

    it('should handle only auxiliary basis without main basis', () => {
      const config: BasisSetConfig = {
        aux_basis_jk: 'def2/JK',
        aux_basis_cosx: 'def2/J'
      };

      const block = manager.create_basis_block(config);

      expect(block).toContain('NewAuxJK All "def2/JK" end');
      expect(block).toContain('NewAuxBasis All "def2/J" end');
      expect(block).not.toContain('NewGTO All');
    });
  });

  describe('create_memory_block', () => {
    it('should create memory block with valid memory', () => {
      const block = manager.create_memory_block(4000);

      expect(block).toBe('%MaxCore 4000\n');
    });

    it('should handle different memory values', () => {
      const memoryValues = [1000, 2048, 8192, 16384];
      
      memoryValues.forEach(memory => {
        const block = manager.create_memory_block(memory);
        expect(block).toBe(`%MaxCore ${memory}\n`);
      });
    });

    it('should return empty string for zero memory', () => {
      const block = manager.create_memory_block(0);

      expect(block).toBe('');
    });

    it('should return empty string for negative memory', () => {
      const block = manager.create_memory_block(-1000);

      expect(block).toBe('');
    });

    it('should handle fractional memory values', () => {
      const block = manager.create_memory_block(4000.5);

      expect(block).toBe('%MaxCore 4000.5\n');
    });
  });

  describe('block formatting', () => {
    it('should properly indent SCF block content', () => {
      const settings: SCFSettings = {
        max_iter: 200,
        convergence_level: 'Tight',
        custom_lines: ['DampFac 0.7']
      };

      const block = manager.create_scf_block(settings);
      const lines = block.split('\n');

      // Check that content lines are indented
      expect(lines[1]).toMatch(/^\s+MaxIter/);
      expect(lines[2]).toMatch(/^\s+Convergence/);
      expect(lines[3]).toMatch(/^\s+DampFac/);
    });

    it('should properly indent basis block content', () => {
      const config: BasisSetConfig = {
        main_basis: 'def2-SVP',
        custom_gto_lines: ['NewGTO C "cc-pVTZ" end']
      };

      const block = manager.create_basis_block(config);
      const lines = block.split('\n');

      // Check that content lines are indented
      expect(lines[1]).toMatch(/^\s+NewGTO/);
      expect(lines[2]).toMatch(/^\s+NewGTO/);
    });

    it('should handle custom lines with existing indentation', () => {
      const settings: SCFSettings = {
        custom_lines: ['  DampFac 0.7', '\tDampErr 0.05']
      };

      const block = manager.create_scf_block(settings);

      expect(block).toContain('DampFac 0.7');
      expect(block).toContain('DampErr 0.05');
    });
  });
});