# ORCA MCP Server

A Model Context Protocol (MCP) server for ORCA quantum chemistry software that provides intelligent tools for generating, validating, and optimizing ORCA input files.

## Overview

The ORCA MCP Server is a comprehensive tool designed to assist quantum chemistry researchers and computational chemists in working with ORCA calculations. It provides intelligent assistance for:

- **Input File Generation**: Automatically generate ORCA input files based on molecular structures and calculation requirements
- **Syntax Validation**: Validate ORCA input file syntax and detect common errors
- **Parameter Optimization**: Recommend optimal basis sets, SCF settings, and memory configurations
- **Convergence Diagnostics**: Analyze failed calculations and suggest fixes
- **Keyword Management**: Suggest appropriate keywords and detect conflicts

## Features

### Core Functionality

- **🔧 Input File Generation**: Create complete ORCA input files from molecular coordinates and calculation parameters
- **✅ Syntax Validation**: Comprehensive validation of ORCA input file syntax with detailed error reporting
- **💡 Keyword Suggestions**: Intelligent keyword recommendations based on calculation type and current settings
- **🎯 Parameter Optimization**: Smart recommendations for basis sets, SCF settings, and memory allocation
- **🔍 Convergence Diagnostics**: Analyze SCF convergence failures and provide targeted solutions

### Supported Calculation Types

- Single Point Energy Calculations
- Geometry Optimizations
- Frequency Calculations
- Combined Optimization + Frequency
- TD-DFT (Time-Dependent DFT)
- MP2 and Coupled Cluster methods
- NMR and EPR calculations

### Coordinate Format Support

- **XYZ Coordinates**: Standard Cartesian coordinates
- **Internal Coordinates**: Z-matrix format
- **External Files**: References to .xyz and .gzmt files

## Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- TypeScript 5.0+

### Install Dependencies

```bash
npm install
```

### Build the Server

```bash
npm run build
```

### Run Tests

```bash
npm test
```

### Run with Coverage

```bash
npm run test:coverage
```

## Usage

### As an MCP Server

The server can be used with any MCP-compatible client. Configure your client to connect to this server using stdio transport.

Example configuration for Claude Desktop:

```json
{
  "mcpServers": {
    "orca-mcp-server": {
      "command": "node",
      "args": ["path/to/orca-mcp-server/build/index.js"],
      "env": {}
    }
  }
}
```

### Available Tools

#### `generate_input_file`

Generate a complete ORCA input file based on calculation parameters.

**Parameters:**
- `calculation_type` (string): Type of calculation ("single_point", "optimization", "frequency", etc.)
- `charge` (number): Molecular charge
- `multiplicity` (number): Spin multiplicity
- `coordinates_xyz_or_internal` (string, optional): Molecular coordinates
- `keywords` (array, optional): Additional ORCA keywords
- `accuracy_level` (string, optional): "low", "medium", or "high"
- `blocks` (object, optional): Custom parameter blocks

**Example:**
```json
{
  "calculation_type": "optimization",
  "charge": 0,
  "multiplicity": 1,
  "coordinates_xyz_or_internal": "C 0.0 0.0 0.0\nH 0.0 0.0 1.0\nH 0.0 1.0 0.0\nH 1.0 0.0 0.0",
  "keywords": ["B3LYP", "def2-SVP"],
  "accuracy_level": "medium"
}
```

#### `validate_input_syntax`

Validate the syntax of an ORCA input file and detect common errors.

**Parameters:**
- `inputContent` (string): Complete ORCA input file content

**Returns:**
- Validation status and detailed error reports

#### `suggest_keywords`

Get keyword suggestions based on calculation type and current keywords.

**Parameters:**
- `calculation_type` (string): Intended calculation type
- `current_keywords` (array, optional): Already present keywords

**Returns:**
- Recommended and optional keywords with explanations

### Programming Interface

You can also use the server components directly in your TypeScript/JavaScript code:

```typescript
import { KeywordManager } from './src/core/keywordManager.js';
import { CoordinateProcessor } from './src/core/coordinateProcessor.js';
import { CalculationTemplateEngine } from './src/core/calculationTemplateEngine.js';

// Initialize components
const keywordManager = new KeywordManager();
const coordinateProcessor = new CoordinateProcessor();
const templateEngine = new CalculationTemplateEngine();

// Parse coordinates
const molecule = coordinateProcessor.parse_xyz_coordinates(
  'C 0.0 0.0 0.0\nH 0.0 0.0 1.0',
  0, 1
);

// Generate template
const template = templateEngine.generate_dft_template(molecule, 'B3LYP', 'def2-SVP');

// Validate keywords
const validation = await keywordManager.validate_keyword_combination(['B3LYP', 'def2-SVP', 'Opt']);
```

## Architecture

### Core Components

- **KeywordManager**: Manages ORCA keywords, validates combinations, and suggests missing keywords
- **CoordinateProcessor**: Handles molecular coordinate parsing and validation
- **ParameterBlockManager**: Generates ORCA parameter blocks (%scf, %basis, etc.)
- **CalculationTemplateEngine**: Creates calculation templates for different job types

### Intelligent Components

- **ParameterRecommendationEngine**: Provides intelligent recommendations for basis sets, SCF settings, and memory
- **ConvergenceDiagnostic**: Analyzes convergence failures and suggests solutions
- **ORCAInputValidator**: Comprehensive input file validation

### Type System

The server uses a comprehensive TypeScript type system defined in `src/types/orca.types.ts` that covers:

- Molecular structures and coordinate formats
- ORCA calculation types and parameters
- Validation results and error reporting
- Recommendation and diagnostic results

## Examples

### Basic DFT Optimization

```typescript
// Generate input for geometry optimization
const result = await generateInputFile({
  calculation_type: "optimization",
  charge: 0,
  multiplicity: 1,
  coordinates_xyz_or_internal: `
    C 0.0 0.0 0.0
    H 0.0 0.0 1.0
    H 0.0 1.0 0.0
    H 1.0 0.0 0.0
    H -1.0 0.0 0.0
  `,
  accuracy_level: "medium"
});

console.log(result.content);
// Output:
// ! B3LYP-D3BJ def2-SVP Opt
// 
// %pal NProcs 2 end
// 
// * xyz 0 1
// C 0.0 0.0 0.0
// H 0.0 0.0 1.0
// H 0.0 1.0 0.0
// H 1.0 0.0 0.0
// H -1.0 0.0 0.0
// *
```

### Heavy Element Calculation

```typescript
// Get recommendations for heavy elements
const basisRecommendation = await recommendationEngine.recommend_basis_set(
  ['Au', 'Cl'],
  'high',
  2
);

console.log(basisRecommendation);
// Output:
// {
//   orbital_basis: "SARC-DKH-TZVP",
//   auxiliary_basis_jk: "SARC/JK",
//   auxiliary_basis_cosx: "SARC/J",
//   relativistic_method: "DKH",
//   reasoning: "High accuracy with heavy elements: SARC-DKH-TZVP with DKH relativistic treatment is recommended."
// }
```

### SCF Convergence Troubleshooting

```typescript
// Analyze convergence failure
const diagnosis = convergenceDiagnostic.analyze_scf_failure(`
  SCF NOT CONVERGED AFTER 125 ITERATIONS
  oscillating behavior in DIIS
  Energy change: 1.234e-03
`);

console.log(diagnosis);
// Output:
// {
//   problem_type: "SCF_OSCILLATION",
//   summary: "SCF convergence is likely hindered by oscillating behavior...",
//   recommendations: [
//     "Try damping: %scf DampFac 0.7 DampErr 0.05 end",
//     "Use a level shifter: %scf Shift Shift 0.5 Erroff 0.1 end"
//   ],
//   suggested_keywords_add: ["VerySlowConv"],
//   suggested_block_modifications: {
//     scf: "DampFac 0.7\nDampErr 0.05"
//   }
// }
```

## Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure

- **Unit Tests**: Individual component testing
  - `tests/core/`: Core functionality tests
  - `tests/intelligent/`: AI/ML component tests
  - `tests/validation/`: Validation system tests
- **Integration Tests**: End-to-end workflow testing
  - `tests/integration/`: Complete workflow tests

## Development

### Project Structure

```
orca-mcp-server/
├── src/
│   ├── core/                 # Core functionality
│   │   ├── keywordManager.ts
│   │   ├── coordinateProcessor.ts
│   │   ├── parameterBlockManager.ts
│   │   └── calculationTemplateEngine.ts
│   ├── intelligent/          # AI/ML components
│   │   ├── parameterRecommendationEngine.ts
│   │   └── convergenceDiagnostic.ts
│   ├── validation/           # Validation systems
│   │   └── orcaInputValidator.ts
│   ├── types/               # TypeScript definitions
│   │   └── orca.types.ts
│   └── index.ts             # MCP server entry point
├── tests/                   # Test suites
├── build/                   # Compiled JavaScript
└── docs/                    # Documentation
```

### Building

```bash
# Development build
npm run build

# Watch mode for development
npm run watch
```

### Code Quality

The project uses:
- **TypeScript** for type safety
- **Jest** for testing
- **ESLint** for code linting
- **Prettier** for code formatting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines

- Write comprehensive tests for new features
- Follow TypeScript best practices
- Document public APIs
- Use meaningful commit messages
- Ensure backward compatibility

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **ORCA Quantum Chemistry Package** - The quantum chemistry software this server supports
- **Model Context Protocol** - The protocol framework this server implements
- **TypeScript Community** - For excellent tooling and type system

## Support

For questions, issues, or contributions:

1. Check the [Issues](https://github.com/your-repo/orca-mcp-server/issues) page
2. Create a new issue with detailed information
3. Join discussions in the project's discussion forum

## Roadmap

### Upcoming Features

- [ ] **Context7 Integration**: Enhanced documentation lookup and recommendations
- [ ] **Basis Set Optimization**: Automatic basis set selection based on molecular properties
- [ ] **Job Monitoring**: Integration with ORCA job status monitoring
- [ ] **Result Analysis**: Post-calculation analysis and visualization tools
- [ ] **Template Library**: Expandable library of calculation templates
- [ ] **Performance Profiling**: Calculation performance analysis and optimization

### Long-term Goals

- [ ] **Machine Learning Integration**: ML-based parameter optimization
- [ ] **Multi-software Support**: Support for other quantum chemistry packages
- [ ] **Web Interface**: Browser-based interface for the MCP server
- [ ] **Cloud Integration**: Support for cloud-based calculations
- [ ] **Collaborative Features**: Multi-user calculation sharing and collaboration

---

**Note**: This is an independent project and is not officially affiliated with the ORCA quantum chemistry package developers.
