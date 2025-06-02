// src/types/orca.types.ts

/**
 * Represents the result of a validation operation.
 */
export interface ValidationIssue {
  type: string; // e.g., "KEYWORD_CONFLICT", "SYNTAX_ERROR", "MISSING_REQUIRED_KEYWORD"
  message: string;
  line?: number; // Optional line number where the issue occurred
  suggestion?: string; // Optional suggestion to fix the issue
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
}

/**
 * Represents keyword suggestions.
 */
export interface KeywordSuggestions {
  recommended: string[];
  optional: string[];
  warnings: string[]; // Warnings about potential incompatibilities or deprecated keywords
  notes?: string; // General notes or explanations
}

// Add other ORCA-specific types as needed
// e.g., MolecularStructure, SCFSettings, BasisSetConfig, etc.
/**
 * Represents a single atom with its element symbol and coordinates.
 */
export interface Atom {
  element: string;
  x: number;
  y: number;
  z: number;
}

/**
 * Represents a molecular structure, typically from XYZ coordinates.
 */
export interface MolecularStructure {
  atoms: Atom[];
  charge: number;
  multiplicity: number;
  coordinate_block: string; // The raw string block of coordinates
  source_format: 'xyz' | 'internal' | 'external_ref' | 'unknown';
}

/**
 * Represents a single entry in a Z-matrix.
 */
export interface ZMatrixEntry {
  atom: string;
  bond_to_atom_index?: number; // Index of atom it's bonded to (0-based)
  bond_length_var?: string | number; // Variable name or value for bond length
  angle_to_atom_index?: number; // Index of atom for angle definition
  angle_var?: string | number; // Variable name or value for angle
  dihedral_to_atom_index?: number; // Index of atom for dihedral definition
  dihedral_var?: string | number; // Variable name or value for dihedral
}

/**
 * Represents a molecular structure defined by a Z-matrix (internal coordinates).
 */
export interface ZMatrixStructure {
  entries: ZMatrixEntry[];
  variables?: Record<string, number>; // Optional section for variable definitions
  charge: number;
  multiplicity: number;
  coordinate_block: string; // The raw string block of the Z-matrix
  source_format: 'internal';
}

/**
 * Configuration for coordinates loaded from an external file.
 */
export interface ExternalCoordConfig {
  file_type: 'xyzfile' | 'gzmtfile'; // or other ORCA supported types
  charge: number;
  multiplicity: number;
  filename: string;
  source_format: 'external_ref';
}

/**
 * Represents different coordinate formats that can be parsed or converted.
 */
export type CoordFormat = 'xyz' | 'internal' | 'xyzfile' | 'gzmtfile';

/**
 * Represents the result of a coordinate conversion.
 */
export interface ConvertedCoords {
  new_coords_block: string;
  format: CoordFormat;
  messages?: string[];
}

/**
 * Represents the result of a geometry validation.
 */
export interface GeometryValidation {
  isValid: boolean;
  issues: ValidationIssue[]; // Re-use ValidationIssue for consistency
}

/**
 * Represents SCF (Self-Consistent Field) settings.
 */
export interface SCFSettings {
  max_iter?: number;
  convergence_level?: 'Loose' | 'Normal' | 'Tight' | 'VeryTight'; // Example levels
  tolerance_energy?: number; // e.g., TolE
  diis_type?: string; // e.g., KDIIS, EDIIS
  custom_lines?: string[]; // For any other custom SCF settings
}

/**
 * Represents custom basis set configuration.
 */
export interface BasisSetConfig {
  main_basis?: string; // e.g., "def2-SVP"
  aux_basis_jk?: string; // e.g., "def2/JK" for RIJK
  aux_basis_cosx?: string; // e.g., "def2/J" for RIJCOSX
  custom_gto_lines?: string[]; // For %basis newgto ... end
}

/**
 * Represents memory configuration suggestions.
 */
export interface MemoryConfig {
  max_core_mb?: number; // %MaxCore
  total_ram_gb_recommendation?: number;
  notes?: string;
}

/**
 * Represents a recommendation for a basis set.
 */
export interface BasisSetRecommendation {
  orbital_basis: string;
  auxiliary_basis_jk?: string;
  auxiliary_basis_cosx?: string;
  relativistic_method?: 'ZORA' | 'DKH' | 'X2C' | null;
  reasoning?: string;
  warnings?: string[];
}

/**
 * Represents SCF optimization/recommendation.
 */
export interface SCFOptimization {
  convergence_keywords?: string[]; // e.g., "TightSCF", "SlowConv"
  custom_scf_block?: string; // A fully formed %scf ... end block
  reasoning?: string;
}

/**
 * Represents an ORCA calculation template.
 */
export interface ORCATemplate {
  content: string;
  description?: string;
  required_info?: string[]; // e.g., "molecule coordinates", "charge", "multiplicity"
}

/**
 * Represents user requirements for creating a custom template.
 */
export interface UserRequirements {
  calculation_type: string;
  molecule_info?: any; // Could be SMILES, name, or pre-parsed structure
  desired_keywords?: string[];
  custom_blocks?: Record<string, string>; // e.g., {"scf": "MaxIter 300\nTolE 1e-7"}
  target_properties?: string[];
  accuracy_level?: 'low' | 'medium' | 'high';
}

/**
 * Represents a custom template created based on user requirements.
 */
export interface CustomTemplate extends ORCATemplate {
  source_requirements: UserRequirements;
}

/**
 * Represents the result of a diagnostic operation, e.g., for convergence issues.
 */
export interface DiagnosisResult {
  problem_type: string; // e.g., "SCF_OSCILLATION", "GEOMETRY_STEP_TOO_LARGE"
  summary: string;
  recommendations: string[]; // Textual recommendations
  suggested_keywords_add?: string[];
  suggested_keywords_remove?: string[];
  suggested_block_modifications?: Record<string, string>; // e.g., {"scf": "DampFac 0.8"}
}

/**
 * Represents suggestions for fixing validation issues.
 */
export interface FixSuggestions {
  applied_fixes_count: number;
  modified_content?: string; // If automatic fixes can be applied
  manual_suggestions: Array<{
    issue_message: string;
    suggestion: string;
    line?: number;
  }>;
}

/**
 * Represents the input configuration for generating an ORCA file.
 * Corresponds to ORCAConfig in the initial prompt.
 */
export interface ORCAConfig {
  calculation_type: string; // e.g., "single_point", "optimization", "frequency"
  molecule_description: string; // SMILES, XYZ string, or name for lookup
  charge: number;
  multiplicity: number;
  keywords?: string[];
  blocks?: Record<string, string>; // e.g., %scf, %basis
  coordinates_xyz_or_internal?: string; // Raw XYZ or Z-matrix block
  external_coord_file?: { path: string; type: 'xyzfile' | 'gzmtfile' };
  accuracy_level?: 'low' | 'medium' | 'high';
  additional_requirements?: Record<string, any>; // e.g., solvent, relativistic effects
}

/**
 * Represents a generated ORCA input file.
 */
export interface ORCAInputFile {
  content: string;
  filename: string; // Suggested filename, e.g., "molecule_b3lyp_svp_opt.inp"
  warnings?: string[];
}

/**
 * Represents the result of validation and fixing operation.
 */
export interface ValidationAndFixResult {
  original_content: string;
  validated_content?: string; // Content after applying automatic fixes
  validation_report: ValidationResult;
  fix_suggestions: FixSuggestions;
  is_fully_fixed: boolean;
}

/**
 * Represents suggestions for improving a calculation.
 */
export interface ImprovementSuggestions {
  target_property: string;
  current_setup_summary: string;
  suggestions: Array<{
    area: string; // e.g., "Basis Set", "Functional", "SCF Settings", "Method"
    recommendation: string;
    reasoning?: string;
    impact_on_accuracy?: string;
    impact_on_cost?: string;
  }>;
}

/**
 * Represents different levels of SCF difficulty indicators.
 */
export interface SCFDifficulty {
    has_heavy_atoms?: boolean;
    is_open_shell?: boolean;
    has_convergence_issues_previously?: boolean; // General flag
    convergence_history?: string[]; // More specific history, e.g., ["oscillating", "slow"]
    system_size_atoms?: number;
    basis_set_type?: string; // e.g., "diffuse", "large"
}

/**
 * Represents system resources for memory calculation.
 */
export interface SystemResources {
    available_ram_gb: number;
    cores_per_node: number;
    scratch_space_gb?: number;
}

/**
 * Represents a type of calculation.
 * This could be an enum or a string literal union.
 */
export type CalculationType =
  | "single_point"
  | "optimization"
  | "frequency"
  | "optimization_frequency" // Added for combined Opt+Freq jobs
  | "td_dft"
  | "mp2"
  | "ccsd"
  | "nmr"
  | "epr"
  | "other"; // Add more as needed
/**
 * Represents a common mistake found during validation.
 * Extends ValidationIssue for consistency but can be more specific.
 */
export interface CommonMistake extends ValidationIssue {
  // CommonMistake might have more specific fields in the future
  // For now, it shares the structure of ValidationIssue.
}

/**
 * Represents a comprehensive validation report for an ORCA input file.
 */
export interface ValidationReport {
  overall_isValid: boolean;
  syntax_issues: ValidationIssue[];
  keyword_issues: ValidationIssue[];
  coordinate_issues: ValidationIssue[];
  parameter_issues: ValidationIssue[]; // Issues related to %block parameters
  common_mistakes: CommonMistake[];
  // Add other specific issue categories as needed
}