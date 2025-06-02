// src/core/parameterBlockManager.ts

import { SCFSettings, BasisSetConfig } from '../types/orca.types.js';

export class ParameterBlockManager {
  constructor() {
    // Initialization if needed
  }

  /**
   * Generates an SCF parameter block string.
   * Example:
   * %scf
   *   MaxIter 200
   *   Convergence Tight
   *   TolE 1e-7
   *   DIIS KDIIS
   * end
   * @param settings - SCFSettings object.
   * @returns A string representing the SCF block.
   */
  public create_scf_block(settings: SCFSettings): string {
    if (Object.keys(settings).length === 0 && (!settings.custom_lines || settings.custom_lines.length === 0)) {
      return ""; // Return empty if no settings are provided
    }

    let block = "%scf\n";
    if (settings.max_iter) {
      block += `  MaxIter ${settings.max_iter}\n`;
    }
    if (settings.convergence_level) {
      block += `  Convergence ${settings.convergence_level}\n`;
    }
    if (settings.tolerance_energy) {
      block += `  TolE ${settings.tolerance_energy.toExponential(1)}\n`; // e.g., 1e-7
    }
    if (settings.diis_type) {
      block += `  DIIS ${settings.diis_type}\n`; // Or specific DIIS like KDIIS, EDIIS etc.
    }
    if (settings.custom_lines && settings.custom_lines.length > 0) {
      settings.custom_lines.forEach(line => {
        block += `  ${line.trim()}\n`;
      });
    }
    block += "end\n";
    return block;
  }

  /**
   * Generates a custom basis set block string.
   * Example:
   * %basis
   *   NewGTO C "def2-SVP" end
   *   NewAuxJK C "def2/JK" end
   * end
   * Or for specific custom lines:
   * %basis
   *   GTONames
   *   N Nucleus "vDZ"
   *   N Core None
   *   NValence 5
   *   NValShells 2
   *   EndGTONames
   * end
   * @param config - BasisSetConfig object.
   * @returns A string representing the basis block.
   */
  public create_basis_block(config: BasisSetConfig): string {
    if (Object.keys(config).length === 0 && (!config.custom_gto_lines || config.custom_gto_lines.length === 0)) {
      return ""; // Return empty if no settings are provided
    }

    let block = "%basis\n";
    if (config.main_basis) {
      // Assuming main_basis applies to all atoms if not specified per element.
      // For per-element basis sets, a more complex input structure for BasisSetConfig is needed.
      // This is a simplified version.
      block += `  NewGTO All "${config.main_basis}" end\n`;
    }
    if (config.aux_basis_jk) {
      block += `  NewAuxJK All "${config.aux_basis_jk}" end\n`;
    }
    if (config.aux_basis_cosx) {
      // For RIJCOSX, the auxiliary basis is often specified with /J with the main basis keyword
      // or as a separate NewAuxBasis block. This is a simplification.
      // ORCA manual: "For RIJCOSX the auxiliary basis set is specified using the keyword RIJCOSXAux."
      // or by appending /J to the orbital basis set name.
      // A more robust implementation would handle this based on context.
      // For now, let's assume it's for a generic auxiliary basis if provided this way.
      block += `  NewAuxBasis All "${config.aux_basis_cosx}" end\n`;
    }

    if (config.custom_gto_lines && config.custom_gto_lines.length > 0) {
      config.custom_gto_lines.forEach(line => {
        block += `  ${line.trim()}\n`;
      });
    }
    block += "end\n";
    return block;
  }

  /**
   * Generates a memory setting line (e.g., %MaxCore).
   * ORCA typically uses %MaxCore per core.
   * @param memory_mb_per_core - Memory in MB to allocate per core.
   * @returns A string for the memory setting line.
   */
  public create_memory_block(memory_mb_per_core: number): string {
    if (memory_mb_per_core <= 0) {
      return "";
    }
    // ORCA's %MaxCore is per core.
    return `%MaxCore ${memory_mb_per_core}\n`;
  }
}