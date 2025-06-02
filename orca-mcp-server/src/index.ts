#!/usr/bin/env node

/**
 * ORCA MCP Server
 *
 * This server provides tools and resources to help users generate,
 * validate, and optimize ORCA quantum chemistry input files.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import { KeywordManager } from "./core/keywordManager.js";
import { CoordinateProcessor } from "./core/coordinateProcessor.js";
import { ParameterBlockManager } from "./core/parameterBlockManager.js";
import { CalculationTemplateEngine } from "./core/calculationTemplateEngine.js";
import { ParameterRecommendationEngine } from "./intelligent/parameterRecommendationEngine.js";
import { ConvergenceDiagnostic } from "./intelligent/convergenceDiagnostic.js";
import { ORCAInputValidator } from "./validation/orcaInputValidator.js";
import {
    MolecularStructure,
    ORCAInputFile,
    CalculationType,
    ORCATemplate,
    ValidationResult,
    ValidationIssue,
    KeywordSuggestions,
    ZMatrixStructure,
    ExternalCoordConfig,
    CoordFormat,
    BasisSetRecommendation,
    SCFOptimization,
    MemoryConfig,
    SCFDifficulty,
    DiagnosisResult,
    FixSuggestions,
    ValidationAndFixResult,
    ImprovementSuggestions,
    UserRequirements,
    CustomTemplate,
    ConvertedCoords,
    GeometryValidation
} from "./types/orca.types.js";

/**
 * Create an MCP server for ORCA.
 */
const server = new Server(
  {
    name: "orca-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Instantiate core components
const keywordManager = new KeywordManager();
const coordinateProcessor = new CoordinateProcessor();
const parameterBlockManager = new ParameterBlockManager();
const templateEngine = new CalculationTemplateEngine();
const recommendationEngine = new ParameterRecommendationEngine();
const convergenceDiagnostician = new ConvergenceDiagnostic();
const inputValidator = new ORCAInputValidator(keywordManager, coordinateProcessor);

// Define Zod schemas for tools
const GenerateInputFileSchema = z.object({
    calculation_type: z.string().describe("Type of calculation (e.g., 'single_point', 'optimization', 'frequency', 'optimization_frequency', 'td_dft')."),
    molecule_description: z.string().optional().describe("SMILES string, XYZ string, or name for lookup (future). For now, expect direct coordinates in coordinates_xyz_or_internal if this is not an XYZ string."),
    charge: z.number().int().describe("Charge of the molecule."),
    multiplicity: z.number().int().min(1).describe("Spin multiplicity of the molecule."),
    keywords: z.array(z.string()).optional().describe("List of ORCA keywords (e.g., ['B3LYP', 'def2-SVP', 'Opt'])."),
    blocks: z.record(z.string()).optional().describe("Record of parameter blocks, e.g., {'scf': 'MaxIter 300\\nTolE 1e-7', 'pal': 'NProcs 4'}. Key is block name (scf, pal, basis, etc.), value is the content of the block without %blockname and end."),
    coordinates_xyz_or_internal: z.string().optional().describe("Raw XYZ or Z-matrix coordinate block. Required if molecule_description is not a direct XYZ string."),
    external_coord_file: z.object({
        path: z.string().describe("Path to the external coordinate file."),
        type: z.enum(['xyzfile', 'gzmtfile']).describe("Type of the external coordinate file.")
    }).optional().describe("Reference to an external coordinate file."),
    accuracy_level: z.enum(['low', 'medium', 'high']).optional().describe("Desired accuracy level, influences default keyword choices."),
    additional_requirements: z.record(z.any()).optional().describe("Additional requirements like solvent effects, relativistic effects (future)."),
    filename_prefix: z.string().optional().describe("Optional prefix for the generated filename.")
});

const ValidateInputSyntaxSchema = z.object({
  inputContent: z.string().describe("The entire content of the ORCA input file as a string.")
});

const SuggestKeywordsSchema = z.object({
  calculation_type: z.string().describe("The intended type of calculation (e.g., 'OPT', 'FREQ', 'DFT_SP', 'TD-DFT')."),
  current_keywords: z.array(z.string()).optional().describe("An array of keywords already present in the input.")
});

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate_input_file",
        description: "Generate an ORCA input file based on calculation parameters",
        inputSchema: GenerateInputFileSchema,
      },
      {
        name: "validate_input_syntax",
        description: "Validate the syntax of an ORCA input file",
        inputSchema: ValidateInputSyntaxSchema,
      },
      {
        name: "suggest_keywords",
        description: "Suggest missing or complementary keywords for a calculation",
        inputSchema: SuggestKeywordsSchema,
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "generate_input_file": {
      const params = GenerateInputFileSchema.parse(args);
      
      let molecule: MolecularStructure | null = null;
      let coord_block_type_for_orca: 'xyz' | 'xyzfile' | 'gzmtfile' | 'internal' = 'xyz';

      if (params.external_coord_file) {
          coord_block_type_for_orca = params.external_coord_file.type;
          molecule = {
              atoms: [],
              charge: params.charge,
              multiplicity: params.multiplicity,
              coordinate_block: `${params.external_coord_file.type} ${params.charge} ${params.multiplicity} ${params.external_coord_file.path}`,
              source_format: 'external_ref'
          };
      } else if (params.coordinates_xyz_or_internal) {
          const firstCoordLine = params.coordinates_xyz_or_internal.trim().split('\n')[0];
          if (firstCoordLine.trim().split(/\s+/).length === 4 && !isNaN(parseFloat(firstCoordLine.trim().split(/\s+/)[1]))) {
              molecule = coordinateProcessor.parse_xyz_coordinates(params.coordinates_xyz_or_internal, params.charge, params.multiplicity);
              coord_block_type_for_orca = 'xyz';
          } else {
              const tempZMatrix = coordinateProcessor.parse_internal_coordinates(params.coordinates_xyz_or_internal, params.charge, params.multiplicity);
              molecule = {
                  atoms: [],
                  charge: tempZMatrix.charge,
                  multiplicity: tempZMatrix.multiplicity,
                  coordinate_block: tempZMatrix.coordinate_block,
                  source_format: 'internal'
              };
              coord_block_type_for_orca = 'internal';
          }
      } else if (params.molecule_description && params.molecule_description.trim().split('\n')[0].trim().split(/\s+/).length === 4) {
           molecule = coordinateProcessor.parse_xyz_coordinates(params.molecule_description, params.charge, params.multiplicity);
           coord_block_type_for_orca = 'xyz';
      } else {
          throw new Error("Coordinate information is missing. Provide 'coordinates_xyz_or_internal', 'external_coord_file', or a direct XYZ string in 'molecule_description'.");
      }

      if (!molecule) {
          throw new Error("Failed to process molecular coordinates.");
      }

      const calcType = params.calculation_type as CalculationType;
      const baseKeywords = params.keywords || [];
      let finalKeywords = [...baseKeywords];

      const defaultFunctional = params.accuracy_level === 'high' ? "PWPB95-D3BJ" : (params.accuracy_level === 'medium' ? "B3LYP-D3BJ" : "PBE");
      const defaultBasis = params.accuracy_level === 'high' ? "def2-TZVP" : (params.accuracy_level === 'medium' ? "def2-SVP" : "def2-SVP");

      const functionalInKeywords = finalKeywords.some(kw => keywordManager.getAllKeywords().has(kw.toUpperCase()));
      const basisInKeywords = finalKeywords.some(kw => keywordManager.getAllKeywords().has(kw.toUpperCase()));

      if (!functionalInKeywords) finalKeywords.unshift(defaultFunctional);
      if (!basisInKeywords) finalKeywords.push(defaultBasis);

      if (calcType === 'optimization' || calcType === 'optimization_frequency') {
          if (!finalKeywords.includes("Opt")) finalKeywords.push("Opt");
      }
      if (calcType === 'frequency' || calcType === 'optimization_frequency') {
          if (!finalKeywords.includes("Freq")) finalKeywords.push("Freq");
      }
      
      finalKeywords = [...new Set(finalKeywords)];

      let inputFileContent = `! ${finalKeywords.join(" ")}\n\n`;

      if (params.blocks) {
          for (const blockName in params.blocks) {
              if (blockName.toLowerCase() === 'pal' && params.blocks[blockName].toLowerCase().includes('nprocs')) {
                   inputFileContent += `%${blockName}\n  ${params.blocks[blockName].replace(/\n/g, '\n  ')}\nend\n\n`;
              } else if (blockName.toLowerCase() !== 'pal') {
                   inputFileContent += `%${blockName}\n${params.blocks[blockName]}\nend\n\n`;
              }
          }
      }
      if (!params.blocks || !params.blocks['pal']) {
          inputFileContent += `%pal NProcs 2 end\n\n`;
      }

      if (coord_block_type_for_orca === 'xyzfile' || coord_block_type_for_orca === 'gzmtfile') {
          inputFileContent += `* ${molecule.coordinate_block.trim()} *\n`;
      } else if (coord_block_type_for_orca === 'internal') {
           inputFileContent += `* int ${molecule.charge} ${molecule.multiplicity}\n${molecule.coordinate_block.trim()}\n*\n`;
      }
      else {
          inputFileContent += `* xyz ${molecule.charge} ${molecule.multiplicity}\n${molecule.coordinate_block.trim()}\n*\n`;
      }
      
      const filename = `${params.filename_prefix || 'orca_input'}_${calcType}_${finalKeywords.filter(kw => kw === defaultFunctional || kw === defaultBasis || kw === "Opt" || kw === "Freq").join('_')}.inp`.replace(/[^a-zA-Z0-9_.-]/g, '_').replace(/__+/g, '_');

      const result: ORCAInputFile = {
        content: inputFileContent,
        filename: filename,
        warnings: []
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case "validate_input_syntax": {
      const params = ValidateInputSyntaxSchema.parse(args);
      const issues: ValidationIssue[] = [];
      const lines = params.inputContent.split('\n');

      const keywordLineIndex = lines.findIndex(line => line.trim().startsWith("!"));
      if (keywordLineIndex === -1) {
        issues.push({
          type: "SYNTAX_ERROR",
          message: "Missing keyword line. ORCA input must contain a line starting with '!'.",
          line: 1,
          suggestion: "Add a keyword line, e.g., '! B3LYP def2-SVP Opt'"
        });
      }

      let inCoordBlock = false;
      let coordBlockStartLine = -1;
      let coordBlockEndLine = -1;
      let asteriskCount = 0;

      lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("*")) {
          asteriskCount++;
          if (!inCoordBlock) {
            const parts = trimmedLine.split(/\s+/);
            if (parts.length >= 4 && (parts[1].toLowerCase() === 'xyz' || parts[1].toLowerCase() === 'int' || parts[1].toLowerCase() === 'internal' || parts[1].toLowerCase() === 'zmat' || parts[1].toLowerCase() === 'xyzfile' || parts[1].toLowerCase() === 'gzmtfile')) {
              inCoordBlock = true;
              coordBlockStartLine = index + 1;
            } else if (parts.length === 1 && coordBlockStartLine !== -1) {
              if (inCoordBlock) {
                   coordBlockEndLine = index + 1;
                   inCoordBlock = false;
              }
            }
          } else {
             if (trimmedLine === "*") {
               coordBlockEndLine = index + 1;
               inCoordBlock = false;
             }
          }
        }
      });
      
      if (coordBlockStartLine !== -1 && coordBlockEndLine === -1) {
           issues.push({
              type: "SYNTAX_ERROR",
              message: "Coordinate block or other '*' block started but not properly closed with a matching '*'.",
              line: coordBlockStartLine,
              suggestion: "Ensure every block starting with '*' (like coordinate blocks) is terminated with a line containing only '*'."
          });
      }

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

      const result: ValidationResult = {
        isValid: issues.length === 0,
        issues: issues,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case "suggest_keywords": {
      const params = SuggestKeywordsSchema.parse(args);
      const calcType = params.calculation_type;
      const currentKeywords = params.current_keywords || [];
      
      const suggestions = await keywordManager.suggest_missing_keywords(calcType, currentKeywords);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(suggestions, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

/**
 * Start the server using stdio transport.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
