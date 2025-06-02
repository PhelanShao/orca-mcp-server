// src/core/keywordManager.ts

import { ValidationResult, KeywordSuggestions, ValidationIssue } from '../types/orca.types.js';

// TODO: Consider using a more structured way to store keyword properties,
// e.g., compatibility, typical usage, if it's a basis set or functional, etc.

// Define a type for the context7 accessor function
// This is a simplified version; a more robust type would define the expected tool names and their schemas.
type Context7Accessor = (toolName: string, args: any) => Promise<any>;

export class KeywordManager {
  private functional_keywords: Set<string>;
  private basis_set_keywords: Set<string>;
  private method_keywords: Set<string>;
  private special_keywords: Set<string>;
  private parallel_keywords: Set<string>;
  private all_known_keywords: Set<string>;
  private context7?: Context7Accessor; // Optional Context7 accessor

  constructor(context7Accessor?: Context7Accessor) {
    this.context7 = context7Accessor;
    // Initial keyword lists based on user prompt and common ORCA keywords.
    // These should be expanded and potentially loaded from a configuration file or context7.
    // TODO: Add an async initialization method to load keywords from Context7 if accessor is provided.
    this.functional_keywords = new Set([
      "B3LYP", "PBE", "TPSS", "M06-2X", "SCAN", "wB97X-D3", "BLYP", "BP86",
      // Common hybrids
      "PBE0", "BHandHLYP",
      // Double hybrids
      "DSD-PBEP86-D3BJ", "PWPB95-D3BJ",
      // Range-separated
      "LC-BLYP", "CAM-B3LYP",
    ]);

    this.basis_set_keywords = new Set([
      "def2-SVP", "def2-TZVP", "def2-TZVPP", "def2-QZVP", "def2-QZVPP",
      "cc-pVDZ", "cc-pVTZ", "cc-pVQZ", "aug-cc-pVDZ", "aug-cc-pVTZ",
      "pc-1", "pc-2", "pcseg-1", "pcseg-2",
      "STO-3G", "3-21G", "6-31G*", "6-31+G*",
      // Auxiliary basis sets (often specified with /J or /C)
      "def2/J", "def2/JK", "RIJCOSX", "RIJK",
    ]);

    this.method_keywords = new Set([
      "HF", "DFT", // DFT is often implicit with a functional
      "MP2", "RI-MP2", "MP3",
      "CCSD", "CCSD(T)", "LPNO-CCSD", "DLPNO-CCSD(T)",
      "CASSCF", "NEVPT2", "MRCI",
      "TD-DFT", "CIS", "EOM-CCSD",
    ]);

    this.special_keywords = new Set([
      // Relativistic
      "ZORA", "DKH", "DKH2", "X2C",
      // SCF convergence & options
      "TightSCF", "VeryTightSCF", "LooseSCF", "SlowConv", "VerySlowConv", "SOSCF", "KDIIS", "Direct",
      // Solvation
      "CPCM", "SMD",
      // Optimization
      "Opt", "OptTS", "Freq", "NumFreq",
      // Other
      "UNO", "UCO", "RI", "RIJONX", "RIJCOSX", // RIJCOSX also in basis sets for its aux part
      "Grid4", "Grid5", "FinalGrid6",
      "PrintBasis", "PrintMOs",
    ]);

    this.parallel_keywords = new Set([
      "PAL1", "PAL2", "PAL3", "PAL4", "PAL5", "PAL6", "PAL8", "PAL12", "PAL16", "PAL24", "PAL32", "PAL48", "PAL64"
    ]);

    this.all_known_keywords = new Set([
      ...this.functional_keywords,
      ...this.basis_set_keywords,
      ...this.method_keywords,
      ...this.special_keywords,
      ...this.parallel_keywords,
    ]);
  }

  /**
   * Validates the combination of keywords for compatibility.
   * Basic initial implementation.
   * @param keywords - A list of keywords to validate.
   * @returns ValidationResult indicating if the combination is valid and any issues.
   */
  public async validate_keyword_combination(keywords: string[]): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const keywordSet = new Set(keywords.map(k => k.toUpperCase())); // Case-insensitive check

    // Placeholder: Basic check for unknown keywords
    keywords.forEach(kw => {
      if (!this.all_known_keywords.has(kw.toUpperCase()) && !kw.includes('/')) { // Allow basis/aux combinations
        // A more sophisticated check would parse compound keywords like "def2-SVP/J"
        // For now, we skip keywords with '/' to avoid false positives on aux basis sets.
        // Also, some keywords are numbers or specific options not in these general lists.
        // This check is very basic and needs refinement.
      }
    });

    // TODO: Implement detailed compatibility checks using this.context7 if available.
    // Example:
    // if (this.context7) {
    //   try {
    //     const orcaManualId = await this.context7('resolve-library-id', { libraryName: "ORCA Manual" });
    //     if (orcaManualId && orcaManualId.id) {
    //       const docs = await this.context7('get-library-docs', {
    //         context7CompatibleLibraryID: orcaManualId.id,
    //         topic: "keyword compatibility " + keywords.join(" ")
    //       });
    //       // Parse docs to find compatibility issues...
    //     }
    //   } catch (error) {
    //     console.error("Error fetching keyword compatibility from Context7:", error);
    //     // Fallback to local rules or add a warning issue
    //   }
    // }

    // - Functional vs. Method (e.g., DFT functional with HF method explicitly is unusual)
    // - Multiple functionals or basis sets
    // - Conflicting special keywords (e.g., ZORA and DKH together)
    // - Required keywords for certain methods (e.g., Opt often needs a method)

    if (keywordSet.has("HF") && Array.from(keywordSet).some(kw => this.functional_keywords.has(kw))) {
        issues.push({
            type: "KEYWORD_CONFLICT",
            message: "HF method specified alongside a DFT functional. DFT functionals imply the DFT method.",
            suggestion: "Remove 'HF' if using a DFT functional, or remove the functional if HF is intended."
        });
    }

    const providedFunctionals = keywords.filter(kw => this.functional_keywords.has(kw.toUpperCase()));
    if (providedFunctionals.length > 1) {
        issues.push({
            type: "KEYWORD_CONFLICT",
            message: `Multiple DFT functionals specified: ${providedFunctionals.join(', ')}. Only one functional should be used.`,
            suggestion: "Choose a single DFT functional."
        });
    }

    const providedBasisSets = keywords.filter(kw => {
        // Simple check, doesn't handle composite basis like "aug-cc-pVTZ/C" correctly yet
        return this.basis_set_keywords.has(kw.toUpperCase()) && !kw.includes('/');
    });
    if (providedBasisSets.length > 1) {
         issues.push({
            type: "KEYWORD_CONFLICT",
            message: `Multiple main basis sets specified: ${providedBasisSets.join(', ')}. Only one main basis set should be used.`,
            suggestion: "Choose a single main basis set. Auxiliary basis sets are specified differently (e.g., with /J)."
        });
    }


    return {
      isValid: issues.length === 0,
      issues: issues,
    };
  }

  /**
   * Suggests missing or complementary keywords based on the calculation type and existing keywords.
   * Basic initial implementation.
   * @param calculation_type - The intended type of calculation (e.g., "OPT", "FREQ", "DFT_SP").
   * @param current_keywords - A list of keywords already present.
   * @returns KeywordSuggestions with recommended and optional keywords.
   */
  public async suggest_missing_keywords(calculation_type: string, current_keywords: string[] = []): Promise<KeywordSuggestions> {
    const recommendations: KeywordSuggestions = {
      recommended: [],
      optional: [],
      warnings: [],
      notes: ""
    };
    const currentKeywordSet = new Set(current_keywords.map(k => k.toUpperCase()));

    // TODO: Implement logic based on calculation_type, potentially enhanced by Context7.
    // Example:
    // if (this.context7) {
    //   try {
    //     // ... fetch relevant docs for calculation_type ...
    //     // ... parse docs to find common/recommended keywords ...
    //   } catch (error) {
    //     console.error("Error fetching keyword suggestions from Context7:", error);
    //   }
    // }

    // e.g., if 'Opt' is present, suggest 'Freq' for verification.
    // If a functional is present, ensure 'DFT' method or no conflicting method.
    // If heavy elements, suggest relativistic keywords.

    if (calculation_type.toUpperCase().includes("OPT") && !currentKeywordSet.has("OPT")) {
        recommendations.recommended.push("Opt");
    }
    if (calculation_type.toUpperCase().includes("FREQ") && !currentKeywordSet.has("FREQ")) {
        recommendations.recommended.push("Freq");
    }

    // Basic check for a functional if DFT is implied or specified
    const hasFunctional = Array.from(currentKeywordSet).some(kw => this.functional_keywords.has(kw));
    if ((calculation_type.toUpperCase().includes("DFT") || hasFunctional) && !hasFunctional) {
        recommendations.recommended.push("B3LYP"); // Suggest a default functional
        recommendations.notes = (recommendations.notes || "") + "A DFT functional is recommended for DFT calculations. B3LYP is a common default. ";
    }

    // Basic check for a basis set
    const hasBasisSet = Array.from(currentKeywordSet).some(kw => this.basis_set_keywords.has(kw) && !kw.includes('/'));
    if (!hasBasisSet) {
        recommendations.recommended.push("def2-SVP"); // Suggest a default basis set
        recommendations.notes = (recommendations.notes || "") + "A basis set is required. def2-SVP is a common default. ";
    }


    // Remove duplicates that might already be in current_keywords
    recommendations.recommended = recommendations.recommended.filter((kw: string) => !currentKeywordSet.has(kw.toUpperCase()));

    return recommendations;
  }

  /**
   * Retrieves all known keywords for basic validation or listing.
   */
  public getAllKeywords(): Set<string> {
    return new Set(this.all_known_keywords);
  }
}