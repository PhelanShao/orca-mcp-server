// src/intelligent/convergenceDiagnostic.ts

import { DiagnosisResult } from '../types/orca.types.js';

export class ConvergenceDiagnostic {
  constructor() {
    // Initialization if needed
  }

  /**
   * Analyzes an ORCA output log for SCF convergence failure patterns.
   * This is a basic implementation focusing on common issues.
   * @param orca_output_log - The string content of the ORCA output file.
   * @returns A DiagnosisResult object with findings and recommendations.
   */
  public analyze_scf_failure(orca_output_log: string): DiagnosisResult | null {
    const lines = orca_output_log.split(/\r?\n/);
    let problem_type = "UNKNOWN_SCF_FAILURE";
    let summary = "SCF convergence failure detected. Cause not specifically identified by basic patterns.";
    const recommendations: string[] = [
        "Inspect the ORCA output file carefully around the SCF iteration section for error messages.",
        "Ensure molecular geometry is reasonable.",
        "Try a different initial guess (e.g., Guess=Hueckel, Guess=PM7).",
        "Increase MaxIter in %scf block.",
    ];
    const suggested_keywords_add: string[] = [];
    const suggested_block_modifications: Record<string, string> = {};

    // Common patterns for SCF issues:
    if (orca_output_log.includes("SCF NOT CONVERGED AFTER")) {
        summary = "SCF did not converge within the maximum number of iterations.";
        suggested_keywords_add.push("SlowConv"); // General first step
        const maxIterMatch = orca_output_log.match(/MaxIter\s+(\d+)/i);
        const currentMaxIter = maxIterMatch && maxIterMatch[1] ? parseInt(maxIterMatch[1], 10) : 0;
        if (!maxIterMatch || currentMaxIter < 200) {
             suggested_block_modifications["scf"] = (suggested_block_modifications["scf"] || "") + "\n  MaxIter 200";
        }
    }

    if (orca_output_log.match(/oscillating behavior in DIIS/i) || orca_output_log.match(/SCF is oscillating/i)) {
      problem_type = "SCF_OSCILLATION";
      summary = "SCF convergence is likely hindered by oscillating behavior, often seen with DIIS.";
      recommendations.unshift( // Add to the beginning
        "Try damping: %scf DampFac 0.7 DampErr 0.05 end",
        "Use a level shifter: %scf Shift Shift 0.5 Erroff 0.1 end",
        "Try KDIIS or EDIIS if not already used: %scf DIIS KDIIS end"
      );
      if (!suggested_block_modifications["scf"]?.includes("DampFac")) {
        suggested_block_modifications["scf"] = (suggested_block_modifications["scf"] || "") + "\n  DampFac 0.7\n  DampErr 0.05";
      }
      if (!suggested_keywords_add.includes("VerySlowConv")) suggested_keywords_add.push("VerySlowConv");

    } else if (orca_output_log.match(/Problem in DIIS/i) && !orca_output_log.match(/oscillating/i)) {
        problem_type = "DIIS_ERROR";
        summary = "An issue occurred within the DIIS procedure, not necessarily oscillation.";
        recommendations.unshift("Try KDIIS: %scf DIIS KDIIS end", "Try SOSCF: ! SOSCF");
        if (!suggested_block_modifications["scf"]?.includes("DIIS KDIIS")) {
             suggested_block_modifications["scf"] = (suggested_block_modifications["scf"] || "") + "\n  DIIS KDIIS";
        }
    }
    
    if (orca_output_log.match(/gradient is too large/i)) {
        problem_type = "LARGE_GRADIENT";
        summary = "Initial geometry might be too far from a minimum, leading to large gradients and SCF difficulty.";
        recommendations.unshift("Ensure your starting geometry is reasonable. Pre-optimize with a cheaper method/basis if possible.");
        // No specific keyword, more of a structural issue.
    }

    if (orca_output_log.match(/Unable to open fragment file/i)) {
        problem_type = "FILE_NOT_FOUND_FRAG";
        summary = "A fragment file specified in the input (e.g., for ERO or embedding) could not be found.";
        recommendations.unshift("Check the path and filename for all specified fragment files.");
    }
    
    // If any modifications were suggested for scf block, clean it up
    if (suggested_block_modifications["scf"]) {
        suggested_block_modifications["scf"] = suggested_block_modifications["scf"].trim();
    }


    // Only return a result if a clear sign of SCF failure was found.
    // This can be refined to be more sensitive or to always return a default if called.
    if (summary !== "SCF convergence failure detected. Cause not specifically identified by basic patterns." || orca_output_log.includes("SCF NOT CONVERGED")) {
      return {
        problem_type,
        summary,
        recommendations,
        suggested_keywords_add: suggested_keywords_add.length > 0 ? [...new Set(suggested_keywords_add)] : undefined,
        suggested_block_modifications: Object.keys(suggested_block_modifications).length > 0 ? suggested_block_modifications : undefined,
      };
    }

    return null; // No clear SCF failure pattern matched from the basic checks
  }
}