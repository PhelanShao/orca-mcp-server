// src/validation/orcaInputValidator.ts

import {
  ValidationReport,
  ValidationIssue,
  CommonMistake
} from '../types/orca.types.js';
import { KeywordManager } from '../core/keywordManager.js';
import { CoordinateProcessor } from '../core/coordinateProcessor.js';
// import { ParameterBlockManager } from '../core/parameterBlockManager.js'; // If needed for block content validation

// Define a type for the context7 accessor function (can be shared if defined globally)
type Context7Accessor = (toolName: string, args: any) => Promise<any>;

export class ORCAInputValidator {
  private keywordManager: KeywordManager;
  private coordinateProcessor: CoordinateProcessor;
  private context7?: Context7Accessor;
  // private parameterBlockManager: ParameterBlockManager;

  constructor(
    keywordManager: KeywordManager,
    coordinateProcessor: CoordinateProcessor,
    context7Accessor?: Context7Accessor
  ) {
    this.keywordManager = keywordManager;
    this.coordinateProcessor = coordinateProcessor;
    this.context7 = context7Accessor;
    // this.parameterBlockManager = new ParameterBlockManager();
  }

  /**
   * Performs a comprehensive validation of the ORCA input file content.
   * This is a placeholder for now and will be expanded.
   * @param inputContent - The full string content of the ORCA input file.
   * @returns A ValidationReport object.
   */
  public async validate_complete_input(inputContent: string): Promise<ValidationReport> {
    // Keyword issues might now be async due to KeywordManager changes
    const keywordValidationResult = await this.keywordManager.validate_keyword_combination(
        this.extractKeywords(inputContent) // Helper function to get keywords
    );

    const report: ValidationReport = {
      overall_isValid: true, // Will be set to false if any issues are found
      syntax_issues: this.check_syntax_rules(inputContent),
      keyword_issues: keywordValidationResult.issues,
      coordinate_issues: [], // Placeholder, to be implemented
      parameter_issues: [], // Placeholder, to be implemented
      common_mistakes: await this.check_common_mistakes(inputContent), // Now async
    };

    // Consolidate overall_isValid
    if (
      report.syntax_issues.length > 0 ||
      report.keyword_issues.length > 0 ||
      report.coordinate_issues.length > 0 ||
      report.parameter_issues.length > 0 ||
      report.common_mistakes.length > 0
    ) {
      report.overall_isValid = false;
    }
    
    // TODO: Implement detailed checks for keywords, coordinates, and parameters.
    // - Keyword compatibility (using KeywordManager)
    // - Coordinate block integrity, charge/multiplicity consistency (using CoordinateProcessor)
    // - Parameter block syntax and known parameter validation

    return report;
  }

  /**
   * Checks for basic syntax rules in the input content.
   * This is an expansion of the basic syntax check in index.ts's validate_input_syntax tool.
   * @param inputContent The ORCA input file content.
   * @returns An array of ValidationIssue.
   */
  private check_syntax_rules(inputContent: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const lines = inputContent.split(/\r?\n/); // Handle both LF and CRLF

    // 1. Check for keyword line
    const keywordLineIndex = lines.findIndex(line => line.trim().startsWith("!"));
    if (keywordLineIndex === -1) {
      issues.push({
        type: "SYNTAX_ERROR",
        message: "Missing keyword line. ORCA input must contain a line starting with '!'.",
        line: 1,
        suggestion: "Add a keyword line, e.g., '! B3LYP def2-SVP Opt'"
      });
    }

    // 2. Check for %block endings
    const blockStack: { name: string, line: number }[] = [];
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("%")) {
        const blockName = trimmedLine.split(/\s+/)[0].toLowerCase();
        blockStack.push({ name: blockName, line: index + 1 });
      } else if (trimmedLine.toLowerCase() === "end") {
        if (blockStack.length > 0) {
          blockStack.pop();
        } else {
          issues.push({
            type: "SYNTAX_ERROR",
            message: "Found 'end' without a corresponding opening %block.",
            line: index + 1,
            suggestion: "Ensure every 'end' matches an opening %block (e.g., %scf, %basis)."
          });
        }
      }
    });

    blockStack.forEach(block => {
      issues.push({
        type: "SYNTAX_ERROR",
        message: `Block '${block.name}' started on line ${block.line} was not closed with 'end'.`,
        line: block.line,
        suggestion: `Add 'end' to close the ${block.name} block.`
      });
    });
    
    // More syntax rules can be added here.
    // For example, checking for valid characters, line length limits (if any), etc.

    return issues;
  }


  /**
   * Checks for common mistakes in the ORCA input file.
   * @param inputContent - The full string content of the ORCA input file.
   * @returns An array of CommonMistake objects.
   */
  public async check_common_mistakes(inputContent: string): Promise<CommonMistake[]> {
    const mistakes: CommonMistake[] = [];
    // TODO: Integrate Context7 calls here to fetch common error patterns and solutions.
    // Example:
    // if (this.context7) {
    //   try {
    //     const orcaManualId = await this.context7('resolve-library-id', { libraryName: "ORCA Manual" });
    //     if (orcaManualId && orcaManualId.id) {
    //       const docs = await this.context7('get-library-docs', {
    //         context7CompatibleLibraryID: orcaManualId.id,
    //         topic: "common ORCA input mistakes"
    //       });
    //       // Parse docs and add to 'mistakes' if patterns are found in inputContent
    //     }
    //   } catch (error) {
    //     console.error("Error fetching common mistakes info from Context7:", error);
    //   }
    // }
    const lines = inputContent.split(/\r?\n/);

    // 1. Check for missing asterisks in coordinate blocks
    // This is a simplified check. A more robust parser would be better.
    let inCoordBlockDefinition = false; // e.g. * xyz 0 1
    let coordBlockStartLineNumber = -1;
    let potentialCoordBlockEndFound = false;
    let asteriskLines: number[] = [];

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("*")) {
            asteriskLines.push(index + 1);
            const parts = trimmedLine.split(/\s+/);
            if (parts.length >= 3 && (parts[1].toLowerCase() === 'xyz' || parts[1].toLowerCase() === 'int' || parts[1].toLowerCase() === 'internal' || parts[1].toLowerCase() === 'zmat' || parts[1].toLowerCase() === 'xyzfile' || parts[1].toLowerCase() === 'gzmtfile')) {
                inCoordBlockDefinition = true;
                coordBlockStartLineNumber = index + 1;
                potentialCoordBlockEndFound = false; // Reset for this new block
            } else if (parts.length === 1 && trimmedLine === "*" && inCoordBlockDefinition) {
                potentialCoordBlockEndFound = true;
                // inCoordBlockDefinition = false; // A block is now closed
            }
        } else if (inCoordBlockDefinition && trimmedLine !== "" && !potentialCoordBlockEndFound) {
            // Content inside a coordinate block
        } else if (trimmedLine === "" && inCoordBlockDefinition && !potentialCoordBlockEndFound) {
            // Empty line inside a coordinate block (usually fine)
        }
    });

    // A simple check: if a coordinate block was defined, there should be at least two asterisks.
    // And typically, they come in pairs.
    if (coordBlockStartLineNumber !== -1 && asteriskLines.length < 2) {
         mistakes.push({
            type: "SYNTAX_ERROR",
            message: "A coordinate block definition (e.g., '* xyz 0 1') was found, but it appears to be missing its closing asterisk.",
            line: coordBlockStartLineNumber,
            suggestion: "Ensure your coordinate block is properly terminated with a line containing only '*'."
        });
    } else if (asteriskLines.length % 2 !== 0 && inputContent.includes("*")) {
        // This is a very general check and might be too aggressive.
        // It assumes asterisks for blocks always come in pairs.
        // Some ORCA inputs might use single asterisks for comments if not at start of line.
        // For now, only trigger if it's a line starting with *
        const oddAsteriskLine = lines.findIndex(line => line.trim().startsWith("*") && line.trim() !== "*");
        if (oddAsteriskLine !== -1 && lines.filter(l => l.trim() === "*").length % 2 !== 0 ) {
            // This condition is still tricky.
        }
    }
    
    // TODO: Add more common mistake checks:
    // - Typo in common keywords (e.g., "B3LYP" vs "B3LPY") - requires KeywordManager
    // - Incorrect charge/multiplicity for common neutral molecules (e.g. H2O mult 3) - requires CoordinateProcessor and element data
    // - Using Opt and Freq without a method (though ORCA might default, it's good practice to specify)

    return mistakes;
  }

  /**
   * Helper to find the line number of a coordinate block start for error reporting.
   * This is a simplified version.
   */
  private find_coordinate_block_line(inputContent: string): number | undefined {
    const lines = inputContent.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const trimmedLine = lines[i].trim();
      if (trimmedLine.startsWith("*") && trimmedLine.split(/\s+/).length > 1) {
        // Basic check for a line like * xyz 0 1
        return i + 1;
      }
    }
    return undefined;
  }

  // Helper method to extract keywords from input string (basic implementation)
  private extractKeywords(inputContent: string): string[] {
    const lines = inputContent.split(/\r?\n/);
    const keywordLine = lines.find(line => line.trim().startsWith("!"));
    if (keywordLine) {
      return keywordLine.trim().substring(1).trim().split(/\s+/).filter(kw => kw.length > 0);
    }
    return [];
  }
}