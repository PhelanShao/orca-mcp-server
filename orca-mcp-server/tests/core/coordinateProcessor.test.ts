import { CoordinateProcessor } from '../../src/core/coordinateProcessor.js';
import { MolecularStructure, ZMatrixStructure, ExternalCoordConfig, ValidationIssue } from '../../src/types/orca.types.js';

describe('CoordinateProcessor', () => {
  let processor: CoordinateProcessor;

  beforeEach(() => {
    processor = new CoordinateProcessor();
  });

  describe('parse_xyz_coordinates', () => {
    it('should parse valid XYZ coordinates', () => {
      const xyzBlock = `C 0.0 0.0 0.0
H 0.0 0.0 1.0
H 0.0 1.0 0.0
H 1.0 0.0 0.0`;
      
      const result: MolecularStructure = processor.parse_xyz_coordinates(xyzBlock, 0, 1);
      
      expect(result.atoms).toHaveLength(4);
      expect(result.atoms[0]).toEqual({ element: 'C', x: 0.0, y: 0.0, z: 0.0 });
      expect(result.atoms[1]).toEqual({ element: 'H', x: 0.0, y: 0.0, z: 1.0 });
      expect(result.charge).toBe(0);
      expect(result.multiplicity).toBe(1);
      expect(result.source_format).toBe('xyz');
      expect(result.coordinate_block).toBe(xyzBlock);
    });

    it('should handle empty lines in XYZ block', () => {
      const xyzBlock = `C 0.0 0.0 0.0

H 0.0 0.0 1.0

H 0.0 1.0 0.0`;
      
      const result: MolecularStructure = processor.parse_xyz_coordinates(xyzBlock, 0, 1);
      
      expect(result.atoms).toHaveLength(3);
      expect(result.atoms[0].element).toBe('C');
      expect(result.atoms[1].element).toBe('H');
      expect(result.atoms[2].element).toBe('H');
    });

    it('should throw error for invalid coordinate format', () => {
      const invalidXyzBlock = `C 0.0 0.0
H invalid 0.0 1.0`;
      
      expect(() => {
        processor.parse_xyz_coordinates(invalidXyzBlock, 0, 1);
      }).toThrow('Invalid XYZ coordinate line format');
    });

    it('should throw error for invalid coordinate values', () => {
      const invalidXyzBlock = `C 0.0 invalid 0.0
H 0.0 0.0 1.0`;
      
      expect(() => {
        processor.parse_xyz_coordinates(invalidXyzBlock, 0, 1);
      }).toThrow('Invalid coordinate value in line');
    });

    it('should throw error for empty coordinate block', () => {
      expect(() => {
        processor.parse_xyz_coordinates('', 0, 1);
      }).toThrow('No valid atoms found in the provided XYZ block');
    });
  });

  describe('parse_internal_coordinates', () => {
    it('should parse basic Z-matrix', () => {
      const zmatrixBlock = `O
H 1 0.96
H 1 0.96 2 104.5`;
      
      const result: ZMatrixStructure = processor.parse_internal_coordinates(zmatrixBlock, 0, 1);
      
      expect(result.entries).toHaveLength(3);
      expect(result.entries[0].atom).toBe('O');
      expect(result.entries[1].atom).toBe('H');
      expect(result.entries[1].bond_to_atom_index).toBe(0); // 1-based to 0-based conversion
      expect(result.entries[1].bond_length_var).toBe(0.96);
      expect(result.entries[2].atom).toBe('H');
      expect(result.entries[2].bond_to_atom_index).toBe(0);
      expect(result.entries[2].angle_to_atom_index).toBe(1);
      expect(result.entries[2].angle_var).toBe(104.5);
      expect(result.charge).toBe(0);
      expect(result.multiplicity).toBe(1);
      expect(result.source_format).toBe('internal');
    });

    it('should handle Z-matrix with variables', () => {
      const zmatrixBlock = `O
H 1 R1
H 1 R2 2 A1`;
      
      const result: ZMatrixStructure = processor.parse_internal_coordinates(zmatrixBlock, 0, 1);
      
      expect(result.entries).toHaveLength(3);
      expect(result.entries[1].bond_length_var).toBe('R1');
      expect(result.entries[2].bond_length_var).toBe('R2');
      expect(result.entries[2].angle_var).toBe('A1');
    });

    it('should throw error for empty Z-matrix block', () => {
      expect(() => {
        processor.parse_internal_coordinates('', 0, 1);
      }).toThrow('No valid entries found in the provided internal coordinates block');
    });
  });

  describe('handle_external_files', () => {
    it('should parse xyzfile reference', () => {
      const fileRef = '0 1 molecule.xyz';
      
      const result: ExternalCoordConfig = processor.handle_external_files(fileRef, 'xyzfile');
      
      expect(result.file_type).toBe('xyzfile');
      expect(result.charge).toBe(0);
      expect(result.multiplicity).toBe(1);
      expect(result.filename).toBe('molecule.xyz');
      expect(result.source_format).toBe('external_ref');
    });

    it('should parse gzmtfile reference', () => {
      const fileRef = '-1 2 complex_molecule.gzmt';
      
      const result: ExternalCoordConfig = processor.handle_external_files(fileRef, 'gzmtfile');
      
      expect(result.file_type).toBe('gzmtfile');
      expect(result.charge).toBe(-1);
      expect(result.multiplicity).toBe(2);
      expect(result.filename).toBe('complex_molecule.gzmt');
    });

    it('should handle filename with spaces', () => {
      const fileRef = '0 1 my molecule file.xyz';
      
      const result: ExternalCoordConfig = processor.handle_external_files(fileRef, 'xyzfile');
      
      expect(result.filename).toBe('my molecule file.xyz');
    });

    it('should throw error for invalid format', () => {
      const invalidRef = '0';
      
      expect(() => {
        processor.handle_external_files(invalidRef, 'xyzfile');
      }).toThrow('Invalid external file reference details');
    });

    it('should throw error for invalid charge', () => {
      const invalidRef = 'invalid 1 molecule.xyz';
      
      expect(() => {
        processor.handle_external_files(invalidRef, 'xyzfile');
      }).toThrow('Invalid charge in external file reference');
    });

    it('should throw error for invalid multiplicity', () => {
      const invalidRef = '0 invalid molecule.xyz';
      
      expect(() => {
        processor.handle_external_files(invalidRef, 'xyzfile');
      }).toThrow('Invalid multiplicity in external file reference');
    });
  });

  describe('validate_charge_multiplicity', () => {
    const waterAtoms = [
      { element: 'O', x: 0, y: 0, z: 0 },
      { element: 'H', x: 0, y: 0, z: 1 },
      { element: 'H', x: 0, y: 1, z: 0 }
    ];

    it('should validate correct charge and multiplicity for water', () => {
      const issues: ValidationIssue[] = processor.validate_charge_multiplicity(0, 1, waterAtoms);
      
      expect(issues).toHaveLength(0);
    });

    it('should detect invalid charge type', () => {
      const issues: ValidationIssue[] = processor.validate_charge_multiplicity(0.5, 1, waterAtoms);
      
      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('INVALID_CHARGE');
      expect(issues[0].message).toContain('Charge must be an integer');
    });

    it('should detect invalid multiplicity', () => {
      const issues: ValidationIssue[] = processor.validate_charge_multiplicity(0, 0, waterAtoms);
      
      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('INVALID_MULTIPLICITY');
      expect(issues[0].message).toContain('Multiplicity must be a positive integer');
    });

    it('should detect charge-multiplicity parity mismatch', () => {
      // Water with charge 0 should have even number of electrons (10), so multiplicity should be odd (1, 3, 5...)
      // Multiplicity 2 (doublet) requires odd number of electrons
      const issues: ValidationIssue[] = processor.validate_charge_multiplicity(0, 2, waterAtoms);
      
      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('CHARGE_MULTIPLICITY_MISMATCH');
      expect(issues[0].message).toContain('Parity mismatch');
    });

    it('should detect negative electron count', () => {
      // Water (10 electrons) with charge +15 would give -5 electrons
      const issues: ValidationIssue[] = processor.validate_charge_multiplicity(15, 1, waterAtoms);
      
      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('INVALID_ELECTRON_COUNT');
      expect(issues[0].message).toContain('negative');
    });

    it('should handle unknown elements gracefully', () => {
      const unknownAtoms = [
        { element: 'X', x: 0, y: 0, z: 0 },
        { element: 'Y', x: 0, y: 0, z: 1 }
      ];
      
      const issues: ValidationIssue[] = processor.validate_charge_multiplicity(0, 1, unknownAtoms);
      
      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('INFO_CHARGE_MULTIPLICITY');
      expect(issues[0].message).toContain('unknown elements');
    });

    it('should handle empty atom list', () => {
      const issues: ValidationIssue[] = processor.validate_charge_multiplicity(0, 1, []);
      
      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('INFO_CHARGE_MULTIPLICITY');
      expect(issues[0].message).toContain('empty');
    });
  });
});