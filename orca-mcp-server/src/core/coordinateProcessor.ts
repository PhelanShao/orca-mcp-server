// src/core/coordinateProcessor.ts

import {
  Atom,
  MolecularStructure,
  ZMatrixStructure,
  ZMatrixEntry,
  ExternalCoordConfig,
  ValidationIssue,
  // CoordFormat // Not directly used in this file yet, but good to have for context
} from '../types/orca.types.js';

// A simple map for atomic numbers (can be expanded or moved to a utility file)
const atomicNumbers: { [element: string]: number } = {
  H: 1, HE: 2, LI: 3, BE: 4, B: 5, C: 6, N: 7, O: 8, F: 9, NE: 10,
  NA: 11, MG: 12, AL: 13, SI: 14, P: 15, S: 16, CL: 17, AR: 18,
  K: 19, CA: 20, SC: 21, TI: 22, V: 23, CR: 24, MN: 25, FE: 26, CO: 27, NI: 28, CU: 29, ZN: 30,
  GA: 31, GE: 32, AS: 33, SE: 34, BR: 35, KR: 36,
  // ... add more as needed
};


export class CoordinateProcessor {
  constructor() {
    // Initialization if needed
  }

  /**
   * Parses a block of XYZ coordinates.
   * Example:
   * C 0.0 0.0 0.0
   * H 0.0 0.0 1.0
   * @param xyz_block - The string containing the XYZ coordinate lines.
   * @param charge - The charge of the molecule.
   * @param multiplicity - The spin multiplicity of the molecule.
   * @returns A MolecularStructure object.
   * @throws Error if parsing fails.
   */
  public parse_xyz_coordinates(xyz_block: string, charge: number, multiplicity: number): MolecularStructure {
    const atoms: Atom[] = [];
    const lines = xyz_block.trim().split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine === "") continue; // Skip empty lines

      const parts = trimmedLine.split(/\s+/);
      if (parts.length === 4) {
        const element = parts[0];
        const x = parseFloat(parts[1]);
        const y = parseFloat(parts[2]);
        const z = parseFloat(parts[3]);

        if (isNaN(x) || isNaN(y) || isNaN(z)) {
          throw new Error(`Invalid coordinate value in line: "${line}"`);
        }
        atoms.push({ element, x, y, z });
      } else {
        throw new Error(`Invalid XYZ coordinate line format: "${line}". Expected "Element X Y Z".`);
      }
    }

    if (atoms.length === 0 && xyz_block.trim() !== "") {
        throw new Error("No valid atoms found in the provided XYZ block.");
    }
    
    return {
      atoms,
      charge,
      multiplicity,
      coordinate_block: xyz_block, // Store the original block
      source_format: 'xyz',
    };
  }

  /**
   * Parses a block of internal coordinates (Z-matrix).
   * This is a placeholder and needs a more sophisticated parser.
   * Example:
   * O
   * H 1 0.96
   * H 1 0.96 2 104.5
   * @param internal_block - The string containing the Z-matrix.
   * @param charge - The charge of the molecule.
   * @param multiplicity - The spin multiplicity of the molecule.
   * @returns A ZMatrixStructure object.
   * @throws Error if parsing fails (currently not implemented in detail).
   */
  public parse_internal_coordinates(internal_block: string, charge: number, multiplicity: number): ZMatrixStructure {
    const entries: ZMatrixEntry[] = [];
    const lines = internal_block.trim().split('\n');
    
    // TODO: Implement robust Z-matrix parsing logic.
    // This includes handling atom definitions, bond lengths, angles, dihedrals,
    // and variable definitions if present.
    // For now, this is a very simplified placeholder.
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine === "") return; // Skip empty lines

        const parts = trimmedLine.split(/\s+/);
        if (parts.length > 0) {
            const entry: ZMatrixEntry = { atom: parts[0] };
            if (parts.length >= 3) { // Atom, ref1, bond
                entry.bond_to_atom_index = parseInt(parts[1], 10) -1; // 1-based to 0-based
                entry.bond_length_var = isNaN(parseFloat(parts[2])) ? parts[2] : parseFloat(parts[2]);
            }
            if (parts.length >= 5) { // Atom, ref1, bond, ref2, angle
                entry.angle_to_atom_index = parseInt(parts[3], 10) -1;
                entry.angle_var = isNaN(parseFloat(parts[4])) ? parts[4] : parseFloat(parts[4]);
            }
            if (parts.length >= 7) { // Atom, ref1, bond, ref2, angle, ref3, dihedral
                entry.dihedral_to_atom_index = parseInt(parts[5], 10) -1;
                entry.dihedral_var = isNaN(parseFloat(parts[6])) ? parts[6] : parseFloat(parts[6]);
            }
            entries.push(entry);
        } else {
            throw new Error(`Malformed Z-matrix line ${index + 1}: "${line}"`);
        }
    });

    if (entries.length === 0 && internal_block.trim() !== "") {
        throw new Error("No valid entries found in the provided internal coordinates block.");
    }

    return {
      entries,
      charge,
      multiplicity,
      coordinate_block: internal_block,
      source_format: 'internal',
      // variables: {} // TODO: Parse variables if present
    };
  }

  /**
   * Handles references to external coordinate files.
   * @param file_ref_details - The part of the line *after* the file type keyword (e.g., "0 1 molecule.xyz").
   * @param file_type - The type of file reference ('xyzfile' or 'gzmtfile').
   * @returns An ExternalCoordConfig object.
   * @throws Error if the format is incorrect.
   */
  public handle_external_files(file_ref_details: string, file_type: 'xyzfile' | 'gzmtfile'): ExternalCoordConfig {
    const parts = file_ref_details.trim().split(/\s+/);
    
    if (parts.length < 3) {
      throw new Error(`Invalid external file reference details: "${file_ref_details}". Expected format: "charge multiplicity filename".`);
    }

    const charge = parseInt(parts[0], 10);
    const multiplicity = parseInt(parts[1], 10);
    const filename = parts.slice(2).join(" "); 

    if (isNaN(charge)) {
      throw new Error(`Invalid charge in external file reference: "${parts[0]}"`);
    }
    if (isNaN(multiplicity) || multiplicity < 1) {
      throw new Error(`Invalid multiplicity in external file reference: "${parts[1]}"`);
    }
    if (!filename) {
        throw new Error(`Missing filename in external file reference: "${file_ref_details}"`);
    }

    return {
      file_type,
      charge,
      multiplicity,
      filename,
      source_format: 'external_ref',
    };
  }

  /**
   * Validates the charge and spin multiplicity for a given set of atoms.
   * @param charge - The total charge of the molecule.
   * @param multiplicity - The spin multiplicity (2S+1).
   * @param atoms - An array of Atom objects.
   * @returns A list of ValidationIssue objects if problems are found.
   */
  public validate_charge_multiplicity(charge: number, multiplicity: number, atoms: Atom[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (!Number.isInteger(charge)) {
        issues.push({
            type: "INVALID_CHARGE",
            message: `Charge must be an integer. Received: ${charge}`
        });
    }
    if (!Number.isInteger(multiplicity) || multiplicity < 1) {
        issues.push({
            type: "INVALID_MULTIPLICITY",
            message: `Multiplicity must be a positive integer (>= 1). Received: ${multiplicity}`
        });
    }

    if (atoms && atoms.length > 0) {
        let totalElectrons = 0;
        let unknownElements = false;
        for (const atom of atoms) {
            const atomicNum = atomicNumbers[atom.element.toUpperCase()];
            if (atomicNum === undefined) {
                // issues.push({ // This might be too noisy if element check is separate
                //     type: "UNKNOWN_ELEMENT",
                //     message: `Unknown element symbol: ${atom.element} for electron counting.`
                // });
                unknownElements = true; // Can't perform parity check if an element is unknown
                break;
            }
            totalElectrons += atomicNum;
        }

        if (!unknownElements) {
            const numNetElectrons = totalElectrons - charge;
            if (numNetElectrons < 0) {
                issues.push({
                    type: "INVALID_ELECTRON_COUNT",
                    message: `Calculated net number of electrons (${numNetElectrons}) is negative. Check charge and atomic composition.`
                });
            }

            // Parity check: (Number of electrons) and (Multiplicity - 1) must have the same parity.
            // (numNetElectrons % 2) === ((multiplicity - 1) % 2)
            // Singlet (mult=1): (M-1)=0 (even). numNetElectrons must be even.
            // Doublet (mult=2): (M-1)=1 (odd). numNetElectrons must be odd.
            // Triplet (mult=3): (M-1)=2 (even). numNetElectrons must be even.
            if (Number.isInteger(multiplicity) && multiplicity >=1 && numNetElectrons >= 0) {
                 if ((numNetElectrons % 2) !== ((multiplicity - 1) % 2)) {
                    issues.push({
                        type: "CHARGE_MULTIPLICITY_MISMATCH",
                        message: `Parity mismatch: Number of net electrons (${numNetElectrons}) is ${numNetElectrons % 2 === 0 ? 'even' : 'odd'}, while multiplicity ${multiplicity} implies ${ (multiplicity - 1) % 2 === 0 ? 'even' : 'odd'} unpaired electrons.`,
                        suggestion: "Verify the charge, multiplicity, and atomic composition."
                    });
                }
            }
        } else {
             issues.push({
                type: "INFO_CHARGE_MULTIPLICITY",
                message: "Could not perform full charge/multiplicity parity check due to unknown elements in the coordinate list."
            });
        }
    } else if (atoms === null || atoms.length === 0) {
         issues.push({
            type: "INFO_CHARGE_MULTIPLICITY",
            message: "Atom list not provided or empty; cannot perform full charge/multiplicity parity check."
        });
    }


    return issues;
  }
}