// src/core/calculationTemplateEngine.ts

import {
  MolecularStructure,
  ORCATemplate,
  CalculationType,
  // ZMatrixStructure // Not used directly in basic templates yet
} from '../types/orca.types.js';

export class CalculationTemplateEngine {
  constructor() {
    // Initialization if needed
  }

  /**
   * Identifies the calculation type from a user description (very basic).
   * @param user_description - A string describing the desired calculation.
   * @returns A CalculationType.
   */
  public identify_calculation_type(user_description: string): CalculationType {
    const desc = user_description.toLowerCase();
    if (desc.includes("optimize") || desc.includes("optimization") || desc.includes("opt")) {
      if (desc.includes("frequency") || desc.includes("freq")) {
        return "optimization_frequency"; // A common combined job
      }
      return "optimization";
    }
    if (desc.includes("frequency") || desc.includes("freq")) {
      return "frequency";
    }
    if (desc.includes("td-dft") || desc.includes("excited state") || desc.includes("uv-vis")) {
      return "td_dft";
    }
    if (desc.includes("nmr")) {
      return "nmr";
    }
    if (desc.includes("epr") || desc.includes("esr")) {
        return "epr";
    }
    if (desc.includes("mp2")) {
        return "mp2";
    }
    if (desc.includes("ccsd")) {
        return "ccsd";
    }
    // Default to single point if no other keywords match
    return "single_point";
  }

  /**
   * Generates a basic DFT single point calculation template.
   * @param molecule - MolecularStructure object.
   * @param functional - DFT functional keyword (e.g., "B3LYP").
   * @param basis_set - Basis set keyword (e.g., "def2-SVP").
   * @param additional_keywords - Optional array of additional keywords.
   * @returns An ORCATemplate object.
   */
  public generate_dft_template(
    molecule: MolecularStructure,
    functional: string = "B3LYP",
    basis_set: string = "def2-SVP",
    additional_keywords: string[] = []
  ): ORCATemplate {
    const keywords = [functional, basis_set, ...additional_keywords].join(" ");
    const content = `! ${keywords}
%pal NProcs 2 end # Example: Request 2 processors

* ${molecule.source_format === 'xyz' ? 'xyz' : 'coords'} ${molecule.charge} ${molecule.multiplicity}
${molecule.coordinate_block.trim()}
*
`;
    return {
      content,
      description: `DFT Single Point calculation with ${functional}/${basis_set}.`,
      required_info: ["molecule.charge", "molecule.multiplicity", "molecule.coordinate_block"]
    };
  }

  /**
   * Generates a basic geometry optimization template.
   * @param molecule - MolecularStructure object.
   * @param functional - DFT functional keyword (e.g., "B3LYP").
   * @param basis_set - Basis set keyword (e.g., "def2-SVP").
   * @param additional_keywords - Optional array of additional keywords.
   * @returns An ORCATemplate object.
   */
  public generate_optimization_template(
    molecule: MolecularStructure,
    functional: string = "B3LYP",
    basis_set: string = "def2-SVP",
    additional_keywords: string[] = []
  ): ORCATemplate {
    const defaultOptKeywords = ["Opt"];
    const keywords = [
        functional, 
        basis_set, 
        ...defaultOptKeywords, 
        ...additional_keywords
    ].filter((kw, index, self) => kw && self.indexOf(kw) === index).join(" "); // Ensure Opt is present and unique

    const content = `! ${keywords}
%pal NProcs 2 end

* ${molecule.source_format === 'xyz' ? 'xyz' : 'coords'} ${molecule.charge} ${molecule.multiplicity}
${molecule.coordinate_block.trim()}
*
`;
    return {
      content,
      description: `Geometry Optimization with ${functional}/${basis_set}.`,
      required_info: ["molecule.charge", "molecule.multiplicity", "molecule.coordinate_block"]
    };
  }

  /**
   * Generates a basic frequency calculation template.
   * Assumes geometry is already optimized or it's for a single point.
   * @param molecule - MolecularStructure object.
   * @param functional - DFT functional keyword (e.g., "B3LYP").
   * @param basis_set - Basis set keyword (e.g., "def2-SVP").
   * @param additional_keywords - Optional array of additional keywords.
   * @returns An ORCATemplate object.
   */
  public generate_frequency_template(
    molecule: MolecularStructure,
    functional: string = "B3LYP",
    basis_set: string = "def2-SVP",
    additional_keywords: string[] = []
  ): ORCATemplate {
    const defaultFreqKeywords = ["Freq"];
     const keywords = [
        functional, 
        basis_set, 
        ...defaultFreqKeywords, 
        ...additional_keywords
    ].filter((kw, index, self) => kw && self.indexOf(kw) === index).join(" "); // Ensure Freq is present and unique

    const content = `! ${keywords}
%pal NProcs 2 end

* ${molecule.source_format === 'xyz' ? 'xyz' : 'coords'} ${molecule.charge} ${molecule.multiplicity}
${molecule.coordinate_block.trim()}
*
`;
    return {
      content,
      description: `Frequency calculation with ${functional}/${basis_set}.`,
      required_info: ["molecule.charge", "molecule.multiplicity", "molecule.coordinate_block"]
    };
  }

   /**
   * Generates a template for a combined Optimization and Frequency calculation.
   * @param molecule The molecular structure.
   * @param functional DFT functional.
   * @param basis_set Basis set.
   * @param additional_keywords Optional additional keywords.
   * @returns An ORCATemplate object.
   */
  public generate_opt_freq_template(
    molecule: MolecularStructure,
    functional: string = "B3LYP",
    basis_set: string = "def2-SVP",
    additional_keywords: string[] = []
  ): ORCATemplate {
    const defaultKeywords = ["Opt", "Freq"];
    const keywords = [
        functional, 
        basis_set, 
        ...defaultKeywords, 
        ...additional_keywords
    ].filter((kw, index, self) => kw && self.indexOf(kw) === index).join(" ");

    const content = `! ${keywords}
%pal NProcs 2 end

* ${molecule.source_format === 'xyz' ? 'xyz' : 'coords'} ${molecule.charge} ${molecule.multiplicity}
${molecule.coordinate_block.trim()}
*
`;
    return {
      content,
      description: `Optimization and Frequency calculation with ${functional}/${basis_set}.`,
      required_info: ["molecule.charge", "molecule.multiplicity", "molecule.coordinate_block"]
    };
  }
}