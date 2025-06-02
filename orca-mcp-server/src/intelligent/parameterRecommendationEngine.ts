// src/intelligent/parameterRecommendationEngine.ts

import {
  BasisSetRecommendation,
  SCFOptimization, // Matches SCFOptimization in orca.types.ts, Python example used SCFRecommendation
  MemoryConfig,
  // Atom, // May need if we get full atom objects
  CalculationType
} from '../types/orca.types.js';

// Define a type for the context7 accessor function
// This is a simplified version; a more robust type would define the expected tool names and their schemas.
type Context7Accessor = (toolName: string, args: any) => Promise<any>;

// Placeholder for atomic numbers, ideally from a shared utility or context7
const basicAtomicData: { [element: string]: { atomicNumber: number, name?: string } } = {
  H: { atomicNumber: 1 }, LI: { atomicNumber: 3 }, BE: { atomicNumber: 4 }, B: { atomicNumber: 5 }, C: { atomicNumber: 6 }, N: { atomicNumber: 7 }, O: { atomicNumber: 8 }, F: { atomicNumber: 9 },
  NA: { atomicNumber: 11 }, MG: { atomicNumber: 12 }, AL: { atomicNumber: 13 }, SI: { atomicNumber: 14 }, P: { atomicNumber: 15 }, S: { atomicNumber: 16 }, CL: { atomicNumber: 17 },
  K: { atomicNumber: 19 }, CA: { atomicNumber: 20 },
  SC: { atomicNumber: 21 }, TI: { atomicNumber: 22 }, V: { atomicNumber: 23 }, CR: { atomicNumber: 24 }, MN: { atomicNumber: 25 },
  FE: { atomicNumber: 26 }, CO: { atomicNumber: 27 }, NI: { atomicNumber: 28 }, CU: { atomicNumber: 29 }, ZN: { atomicNumber: 30 },
  GA: { atomicNumber: 31 }, GE: { atomicNumber: 32 }, AS: { atomicNumber: 33 }, SE: { atomicNumber: 34 }, BR: { atomicNumber: 35 }, KR: { atomicNumber: 36 },
  RB: { atomicNumber: 37 }, SR: { atomicNumber: 38 }, Y: { atomicNumber: 39 }, ZR: { atomicNumber: 40 }, NB: { atomicNumber: 41 }, MO: { atomicNumber: 42 }, TC: { atomicNumber: 43 }, RU: { atomicNumber: 44 }, RH: { atomicNumber: 45 }, PD: { atomicNumber: 46 }, AG: { atomicNumber: 47 }, CD: { atomicNumber: 48 },
  IN: { atomicNumber: 49 }, SN: { atomicNumber: 50 }, SB: { atomicNumber: 51 }, TE: { atomicNumber: 52 }, I: { atomicNumber: 53 }, XE: { atomicNumber: 54 },
  CS: { atomicNumber: 55 }, BA: { atomicNumber: 56 },
  AU: { atomicNumber: 79 }, HG: { atomicNumber: 80 }, PB: { atomicNumber: 82 }, BI: { atomicNumber: 83 },
  // Add more as needed, especially for heavy elements relevant to relativistic effects
};


export class ParameterRecommendationEngine {
  private context7?: Context7Accessor;

  constructor(context7Accessor?: Context7Accessor) {
    this.context7 = context7Accessor;
    // Initialization if needed
  }

  /**
   * Recommends a basis set based on elements, accuracy level, and system size.
   * This is a basic implementation. Context7 integration will enhance this.
   * @param elements - Array of element symbols (e.g., ["C", "H", "O"]).
   * @param accuracy_level - "low", "medium", or "high".
   * @param system_size_atoms - Number of atoms in the system.
   * @param calculation_type - Type of calculation.
   * @returns A BasisSetRecommendation object.
   */
  public async recommend_basis_set(
    elements: string[],
    accuracy_level: 'low' | 'medium' | 'high',
    system_size_atoms: number, // Currently not used in basic logic, but available for future
    calculation_type?: CalculationType // Currently not used in basic logic
  ): Promise<BasisSetRecommendation> {
    // TODO: Integrate Context7 calls here to fetch ORCA documentation
    // for basis set recommendations based on elements, accuracy, and calculation type.
    // Example:
    // if (this.context7) {
    //   try {
    //     const orcaManualId = await this.context7('resolve-library-id', { libraryName: "ORCA Manual" });
    //     if (orcaManualId && orcaManualId.id) {
    //       const docs = await this.context7('get-library-docs', {
    //         context7CompatibleLibraryID: orcaManualId.id,
    //         topic: `basis set recommendation for elements ${elements.join(", ")} accuracy ${accuracy_level} type ${calculation_type}`
    //       });
    //       // Parse docs and potentially override/enhance local logic...
    //       // reasoning += " (Enhanced by Context7 documentation)";
    //     }
    //   } catch (error) {
    //     console.error("Error fetching basis set info from Context7:", error);
    //   }
    // }

    const upperElements = elements.map(el => el.toUpperCase());
    const hasHeavyElements = upperElements.some(el => 
        (basicAtomicData[el]?.atomicNumber ?? 0) > 36 && // Kr
        (basicAtomicData[el]?.atomicNumber ?? 0) !== 54  // Xe, often handled by def2 without special ZORA/DKH for non-core properties
    ); 
    // More precise heavy element definition might be needed, e.g., 5th row and beyond (Rb+) or specific ones like Au, Hg, Pb.

    // Default recommendations
    let orbital_basis = "def2-SVP";
    let auxiliary_basis_jk: string | undefined = "def2/JK"; // For RI-MP2 or HF-RIJK
    let auxiliary_basis_cosx: string | undefined = "def2/J"; // For RIJCOSX (DFT)
    let relativistic_method: 'ZORA' | 'DKH' | 'X2C' | null = null;
    let reasoning = "Standard default recommendation.";
    const warnings: string[] = [];

    if (accuracy_level === "high") {
      orbital_basis = "def2-TZVP";
      reasoning = "High accuracy requested, def2-TZVP is a good starting point.";
      if (system_size_atoms > 100) {
        warnings.push("def2-TZVP on a large system (>100 atoms) can be computationally expensive.");
      }
      if (hasHeavyElements) {
        orbital_basis = "SARC-DKH-TZVP"; // Example specific basis for heavy elements + DKH
        // auxiliary_basis_cosx = "SARC/J"; // Corresponding auxiliary
        // auxiliary_basis_jk = undefined; // SARC/JK might also exist
        relativistic_method = "DKH"; // DKH is often paired with SARC bases
        reasoning = "High accuracy with heavy elements: SARC-DKH-TZVP with DKH relativistic treatment is recommended.";
      }
    } else if (accuracy_level === "medium") {
      orbital_basis = "def2-SVP"; // Could also be def2-TZVP for smaller systems
      reasoning = "Medium accuracy requested, def2-SVP is a balanced choice.";
       if (hasHeavyElements) {
        // For medium accuracy with heavy elements, def2-SVP with ZORA might be a cost-effective start
        // or a smaller DKH-contracted basis if available and appropriate.
        // orbital_basis = "def2-SVP"; // Keep SVP for medium
        relativistic_method = "ZORA"; // ZORA is generally cheaper than DKH
        reasoning = "Medium accuracy with heavy elements: def2-SVP with ZORA relativistic treatment is a common choice.";
        warnings.push("For very heavy elements or high accuracy needs with heavy elements, consider DKH and larger basis sets like def2-TZVP(-DKH).");
      }
    } else { // low accuracy
      orbital_basis = "STO-3G"; // Or perhaps def2-SV(P) for a slightly better "low"
      auxiliary_basis_cosx = undefined; // RI often not used or beneficial with minimal basis
      auxiliary_basis_jk = undefined;
      reasoning = "Low accuracy requested, STO-3G is a minimal basis. Consider def2-SVP for slightly better results if resources allow.";
      if (hasHeavyElements) {
         warnings.push("Minimal basis sets like STO-3G are generally unsuitable for systems with heavy elements.");
         // Relativistic usually not paired with STO-3G.
      }
    }
    
    // Adjust auxiliary basis based on orbital basis if not SARC
    if (!orbital_basis.startsWith("SARC")) {
        if (orbital_basis.includes("TZVP")) {
            auxiliary_basis_cosx = "def2-TZVP/J";
            auxiliary_basis_jk = "def2-TZVP/JK";
        } else if (orbital_basis.includes("QZVP")) {
            auxiliary_basis_cosx = "def2-QZVP/J";
            auxiliary_basis_jk = "def2-QZVP/JK";
        } else { // SVP or others
            auxiliary_basis_cosx = "def2/J";
            auxiliary_basis_jk = "def2/JK";
        }
    } else { // SARC basis might have specific aux basis naming
        auxiliary_basis_cosx = "SARC/J";
        auxiliary_basis_jk = "SARC/JK"; // Assuming SARC/JK exists, otherwise undefined
    }


    // If calculation type does not typically use RIJK (e.g. DFT), undefine aux_basis_jk
    if (calculation_type && calculation_type.toLowerCase().includes('dft') || calculation_type === 'single_point' || calculation_type === 'optimization' || calculation_type === 'frequency') {
        // DFT typically uses RIJCOSX (aux_basis_cosx) or RIJONX, not RIJK for HF exchange part unless it's a hybrid functional handled by ORCA's RI-HF.
        // For simplicity, if it's a DFT-like calc, we prioritize aux_basis_cosx.
        // This logic can be refined.
    }
    if (calculation_type === 'mp2' && !orbital_basis.startsWith("SARC")) { // RI-MP2 is common
        // aux_basis_jk is relevant for RI-MP2 (often called RI-MP2 aux basis or CABS)
        // The naming convention can vary. def2/JK is a common one.
    }


    return {
      orbital_basis,
      auxiliary_basis_jk,
      auxiliary_basis_cosx,
      relativistic_method,
      reasoning,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Recommends SCF settings based on system difficulty indicators.
   * @param difficulty_indicators - A dictionary of indicators like has_heavy_atoms, open_shell.
   * @returns An SCFOptimization object.
   */
  public recommend_scf_settings(
    difficulty_indicators: {
      has_heavy_atoms?: boolean;
      open_shell?: boolean;
      convergence_history?: string[]; // e.g., ["oscillating", "slow"]
      system_size_atoms?: number;
    }
  ): SCFOptimization {
    const convergence_keywords: string[] = [];
    let custom_scf_block_lines: string[] = [];
    let reasoning = "Default SCF settings are usually robust.";

    if (difficulty_indicators.has_heavy_atoms || (difficulty_indicators.system_size_atoms && difficulty_indicators.system_size_atoms > 150)) {
      convergence_keywords.push("SlowConv"); // General for large/complex systems
      reasoning += " For systems with heavy atoms or very large systems, SlowConv can help.";
    }

    if (difficulty_indicators.open_shell) {
      // For open-shell systems, KDIIS is often more robust than default DIIS.
      // However, ORCA's default DIIS is often fine. SOSCF can be an alternative.
      // custom_scf_block_lines.push("DIIS KDIIS"); // Example
      // reasoning += " For open-shell systems, KDIIS might be more stable if default DIIS fails.";
      // No specific default change for open_shell yet, unless convergence issues.
    }
    
    if (difficulty_indicators.convergence_history && difficulty_indicators.convergence_history.includes("oscillating")) {
        custom_scf_block_lines.push("DampFac 0.7"); // Stronger damping for oscillation
        custom_scf_block_lines.push("DampErr 0.05"); // Start damping earlier
        convergence_keywords.push("VerySlowConv");
        reasoning += " Oscillation detected: Increased damping (DampFac, DampErr) and VerySlowConv suggested.";
    } else if (difficulty_indicators.convergence_history && difficulty_indicators.convergence_history.includes("slow")) {
        convergence_keywords.push("SlowConv"); // Already covered if heavy atoms, but good general
        // custom_scf_block_lines.push("Shift Shift 0.1 Erroff 0.05"); // Level shifting
        reasoning += " Slow convergence noted: SlowConv keyword is active. Consider level shifting if problems persist.";
    }
    
    // Default to TightSCF for better accuracy, can be overridden by user
    if (!convergence_keywords.some(kw => kw.toUpperCase().includes("SCF"))) {
        convergence_keywords.push("TightSCF");
    }


    // Remove duplicates from convergence_keywords
    const unique_convergence_keywords = [...new Set(convergence_keywords)];
    
    let final_custom_scf_block: string | undefined = undefined;
    if (custom_scf_block_lines.length > 0) {
        final_custom_scf_block = custom_scf_block_lines.join("\n");
    }

    return {
      convergence_keywords: unique_convergence_keywords.length > 0 ? unique_convergence_keywords : undefined,
      custom_scf_block: final_custom_scf_block,
      reasoning
    };
  }

  /**
   * Suggests memory settings based on system size and resources.
   * ORCA's %MaxCore is memory per core.
   * @param system_size_atoms - Number of atoms.
   * @param basis_set_quality - A string indicating basis set size/quality (e.g., "SVP", "TZVP", "minimal", "large+diffuse").
   * @param num_cores - Number of processor cores intended for the calculation.
   * @param available_ram_gb_total - Total available RAM in GB for the ORCA job.
   * @returns A MemoryConfig object.
   */
  public suggest_memory_settings(
    system_size_atoms: number,
    basis_set_quality: string, // e.g., "STO-3G", "def2-SVP", "def2-TZVP", "aug-cc-pVTZ"
    num_cores: number,
    available_ram_gb_total: number
  ): MemoryConfig {
    let max_core_mb = 4000; // Default per core (MB)
    let notes = "";

    // Rough estimation factor based on basis set quality
    let basis_factor = 1.0; // for SVP
    if (basis_set_quality.toLowerCase().includes("minimal") || basis_set_quality.includes("STO-3G") || basis_set_quality.includes("3-21G")) {
        basis_factor = 0.5;
    } else if (basis_set_quality.toLowerCase().includes("tzvp")) {
        basis_factor = 2.0;
    } else if (basis_set_quality.toLowerCase().includes("qzvp") || basis_set_quality.toLowerCase().includes("aug-cc-pvqz")) {
        basis_factor = 4.0;
    } else if (basis_set_quality.toLowerCase().includes("aug") || basis_set_quality.toLowerCase().includes("+")) { // Diffuse functions
        basis_factor *= 1.5;
    }

    // Rough estimation based on atoms and basis factor
    // This is a very crude heuristic and should be refined with ORCA's actual memory usage patterns.
    // ORCA manual often suggests 1-4 GB per core for typical DFT.
    let estimated_total_ram_gb_needed = (system_size_atoms / 10) * basis_factor * (num_cores / 4); // Very rough
    estimated_total_ram_gb_needed = Math.max(1, estimated_total_ram_gb_needed); // At least 1 GB

    if (available_ram_gb_total > 0 && num_cores > 0) {
        max_core_mb = Math.floor((available_ram_gb_total * 1024 * 0.8) / num_cores); // Use 80% of available RAM, convert GB to MB
        max_core_mb = Math.max(500, Math.min(max_core_mb, 16000)); // Cap between 500MB and 16GB per core as a sane default range
        notes = `Calculated MaxCore based on ${available_ram_gb_total}GB total RAM and ${num_cores} cores, aiming for ~80% utilization.`;
    } else {
        notes = "Default MaxCore. Provide available RAM and core count for better estimation.";
    }
    
    if (estimated_total_ram_gb_needed > available_ram_gb_total * 0.9 && available_ram_gb_total > 0) {
         notes += ` Warning: Estimated RAM needed (${estimated_total_ram_gb_needed.toFixed(1)}GB) is close to or exceeds available RAM (${available_ram_gb_total}GB). Calculation might be slow or fail.`;
    }


    return {
      max_core_mb: max_core_mb,
      total_ram_gb_recommendation: parseFloat(estimated_total_ram_gb_needed.toFixed(1)),
      notes: notes
    };
  }
}