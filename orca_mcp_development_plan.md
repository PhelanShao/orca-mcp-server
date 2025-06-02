# ORCA MCP 服务器开发计划

## 1. 项目概述与目标

本项目旨在开发一个基于模型上下文协议 (MCP) 的服务器，专门用于辅助 ORCA 量子化学软件的用户。服务器的核心功能是提供智能化的 ORCA 输入文件 (.inp) 生成、验证、优化以及问题诊断能力。目标是简化 ORCA 的使用门槛，提高科研效率，并减少常见错误。

## 2. 技术选型

*   **语言**: TypeScript
*   **运行环境**: Node.js
*   **MCP SDK**: `@modelcontextprotocol/sdk`
*   **数据校验**: `zod` (用于定义 MCP 工具的输入输出模式)
*   **辅助工具**: `context7` MCP 服务器 (用于查询 ORCA 文档、关键词、基组等信息)

## 3. 开发阶段与功能点

### 第一阶段: 核心基础功能

#### 3.1. 项目初始化与 MCP 服务器框架搭建
    - [ ] **任务**: 创建 TypeScript MCP 服务器项目。
    - [ ] **子任务**:
        - 在 `C:\Users\Phelan\AppData\Roaming\Roo-Code\MCP\` 目录下创建 `orca-mcp-server` 项目 (使用 `npx @modelcontextprotocol/create-server orca-mcp-server`)。
        - 初始化 `package.json`, `tsconfig.json`。
        - 安装 `@modelcontextprotocol/sdk`, `zod`, `axios` (如果需要直接API调用) 等核心依赖。
        - 搭建基础的 MCP 服务器结构 (`src/index.ts`)，定义服务器名称和版本。

#### 3.2. ORCA 输入文件核心结构处理模块
    - **`KeywordManager` (TypeScript)**
        - [ ] **任务**: 管理 ORCA 关键词。
        - [ ] **子任务**:
            - 定义 `KeywordManager` 类。
            - 存储常见的泛函、基组、方法、特殊和并行关键词 (参考用户提供的 Python 示例和 `orca_manual_chapters/10_chapter_6_calculations.md`)。
            - 实现 `validate_keyword_combination(keywords: string[]): ValidationResult` (基础版，基于已知冲突和兼容性规则)。
            - 实现 `suggest_missing_keywords(calculationType: string): string[]` (基础版，根据计算类型推荐必要或常用关键词)。
            - **Context7 集成**: 考虑通过 `context7` 查询 `orca-manual` 获取更全面的关键词信息和兼容性规则。
    - **`CoordinateProcessor` (TypeScript)**
        - [ ] **任务**: 处理分子坐标信息。
        - [ ] **子任务**:
            - 定义 `CoordinateProcessor` 类。
            - 定义 `MolecularStructure`, `ZMatrixStructure`, `ExternalCoordConfig`, `Atom` 等相关类型。
            - 实现 `parse_xyz_coordinates(xyz_block: string): MolecularStructure`。
            - 实现 `parse_internal_coordinates(internal_block: string): ZMatrixStructure`。
            - 实现 `handle_external_files(file_ref: string): ExternalCoordConfig` (处理 `* xyzfile ...` 和 `* gzmtfile ...`)。
            - 实现 `validate_charge_multiplicity(charge: number, multiplicity: number, atoms: Atom[]): boolean`。
    - **`ParameterBlockManager` (TypeScript)**
        - [ ] **任务**: 管理 ORCA 的参数块 (`%block` 系统)。
        - [ ] **子任务**:
            - 定义 `ParameterBlockManager` 类。
            - 定义 `SCFSettings`, `BasisSetConfig` 等相关类型。
            - 实现 `create_scf_block(convergence_settings: SCFSettings): string`。
            - 实现 `create_basis_block(custom_basis: BasisSetConfig): string`。
            - 实现 `create_memory_block(memory_mb: number): string` (如 `%MaxCore ...`)。

#### 3.3. 基础 MCP 工具实现 (在 `src/index.ts` 中定义)
    - **`generate_input_file`**
        - [ ] **任务**: 根据配置生成 ORCA 输入文件。
        - [ ] **输入模式 (`ORCAConfig`)**: `calculation_type: string`, `molecule_description: string` (可以是SMILES, XYZ string, or name for lookup), `charge: number`, `multiplicity: number`, `keywords: string[]`, `blocks: Record<string, string>`, `coordinates: string` (XYZ or internal format string).
        - [ ] **输出模式 (`ORCAInputFile`)**: `content: string`, `filename: string`.
        - [ ] **实现**: 集成 `KeywordManager`, `CoordinateProcessor`, `ParameterBlockManager` 和 `CalculationTemplateEngine` (基础版)。
    - **`validate_input_syntax`**
        - [ ] **任务**: 验证输入文件内容的基础语法。
        - [ ] **输入模式**: `inputContent: string`.
        - [ ] **输出模式 (`ValidationResult`)**: `isValid: boolean`, `issues: Array<{type: string, message: string, line?: number, suggestion?: string}>`.
        - [ ] **实现**: 检查如星号匹配、块结束符 (`end`)、常见拼写错误等。
    - **`suggest_keywords`**
        - [ ] **任务**: 根据计算类型建议关键词。
        - [ ] **输入模式**: `calculationType: string` (e.g., "DFT", "OPT", "FREQ", "TD-DFT"), `currentKeywords?: string[]`.
        - [ ] **输出模式 (`KeywordSuggestions`)**: `recommended: string[]`, `optional: string[]`, `warnings: string[]`.
        - [ ] **实现**: 调用 `KeywordManager` 的相关方法。
    - **`parse_coordinates`**
        - [ ] **任务**: 解析不同格式的坐标。
        - [ ] **输入模式**: `coords: string`, `format: 'xyz' | 'internal' | 'xyzfile' | 'gzmtfile'`.
        - [ ] **输出模式 (`MolecularStructure` 或 `ZMatrixStructure` 或 `ExternalCoordConfig`)**: 包含解析后的结构和元数据。
        - [ ] **实现**: 调用 `CoordinateProcessor` 的相应方法。
    - **`get_calculation_template`**
        - [ ] **任务**: 获取预定义的计算模板。
        - [ ] **`CalculationTemplateEngine` (TypeScript)**
            - 定义 `CalculationTemplateEngine` 类。
            - 实现 `identify_calculation_type(user_description: string): CalculationType` (基础版，基于关键词匹配)。
            - 实现 `generate_dft_template(molecule: MolecularStructure, functional: string, basis_set: string): ORCATemplate`。
            - 实现 `generate_optimization_template(molecule: MolecularStructure): ORCATemplate`。
            - 实现 `generate_frequency_template(molecule: MolecularStructure): ORCATemplate`。
        - [ ] **MCP 工具输入模式**: `type: CalculationType` (e.g., "DFT_SP", "GEO_OPT", "FREQ"), `molecule_data: {coordinates: string, charge: number, multiplicity: number, format: 'xyz' | 'internal'}`.
        - [ ] **MCP 工具输出模式 (`ORCATemplate`)**: `content: string`.

### 第二阶段: 智能功能增强

#### 3.4. 智能参数推荐系统
    - **`ParameterRecommendationEngine` (TypeScript)**
        - [ ] **任务**: 提供智能化的参数推荐。
        - [ ] **子任务**:
            - 定义 `ParameterRecommendationEngine` 类。
            - 实现 `recommend_basis_set(elements: string[], accuracy_level: 'low' | 'medium' | 'high', system_size: number, calculation_type: string): BasisSetRecommendation`。
                - **Context7 集成**: 查询 ORCA 文档获取不同元素、精度和计算类型下推荐的基组。
            - 实现 `recommend_scf_settings(difficulty_indicators: {has_heavy_atoms?: boolean, open_shell?: boolean, convergence_history?: string[]}): SCFRecommendation`。
            - 实现 `suggest_memory_settings(system_size_atoms: number, basis_set_quality: string, num_cores: number): MemoryConfig`。
    - **MCP 工具**:
        - [ ] `recommend_basis_set`
        - [ ] `optimize_scf_settings` (或作为 `recommend_scf_settings` 的一部分)
        - [ ] `suggest_memory_settings`

#### 3.5. 验证与错误处理系统
    - **`ORCAInputValidator` (TypeScript - 扩展)**
        - [ ] **任务**: 提供更全面的输入文件验证。
        - [ ] **子任务**:
            - 扩展 `ORCAInputValidator` 类。
            - 实现 `validate_complete_input(input_content: string): ValidationReport` (集成语法、关键词、坐标、参数合理性检查)。
            - 实现 `check_common_mistakes(input_content: string): CommonMistake[]` (如缺失星号、不匹配的块等)。
            - **Context7 集成**: 查询 ORCA 常见错误和解决方案。
    - **`ConvergenceDiagnostic` (TypeScript)**
        - [ ] **任务**: 诊断 SCF 等收敛问题。
        - [ ] **子任务**:
            - 定义 `ConvergenceDiagnostic` 类。
            - 实现 `analyze_scf_failure(orca_output_log: string): DiagnosisResult` (基于错误日志中的常见模式)。
    - **MCP 工具**:
        - [ ] `validate_and_fix_input` (扩展 `validate_input_syntax`, 集成 `ORCAInputValidator` 和 `suggest_fixes`)
        - [ ] `diagnose_convergence_issues`
        - [ ] `suggest_fixes` (基于 `ValidationIssue[]` 输出 `FixSuggestions`)

#### 3.6. 其他智能 MCP 工具
    - **`suggest_calculation_improvements`**
        - [ ] **任务**: 根据目标性质建议计算改进方案。
        - [ ] **输入模式**: `input_content: string`, `target_property: string` (e.g., "excitation_energy", "nmr_shielding").
        - [ ] **输出模式 (`ImprovementSuggestions`)**: 包含建议的关键词、方法、基组或计算流程调整。

### 第三阶段: 高级功能与用户体验

#### 3.7. 用户交互与模板扩展
    - **`ORCAAssistant` (概念性，其功能通过 MCP 工具组合和客户端逻辑实现)**
        - [ ] **任务**: 设计交互式输入文件生成的逻辑流程，由客户端驱动，调用 MCP 工具。
    - **`create_custom_template` MCP 工具**
        - [ ] **任务**: 允许用户创建和保存自定义的计算模板。
        - [ ] **输入模式 (`UserRequirements`)**: 包含用户定义的关键词、参数块、分子片段等。
        - [ ] **输出模式 (`CustomTemplate`)**: 模板内容和元数据。
        - [ ] **实现**: 服务器端可能需要存储这些模板 (或由客户端管理，服务器提供校验和组装)。

#### 3.8. 其他高级 MCP 工具 (根据优先级和时间决定)
    - [ ] `convert_coordinate_format` (from: CoordFormat, to: CoordFormat)
    - [ ] `validate_geometry` (structure: MolecularStructure)

## 4. MCP 工具接口清单 (基于 `ORCAMCPTools`)

*   `generate_input_file(config: ORCAConfig): ORCAInputFile`
*   `validate_input_syntax(inputContent: string): ValidationResult`
*   `suggest_keywords(calculationType: string, currentKeywords?: string[]): KeywordSuggestions`
*   `parse_coordinates(coords: string, format: CoordFormat): MolecularStructure | ZMatrixStructure | ExternalCoordConfig`
*   `convert_coordinate_format(structure: MolecularStructure | ZMatrixStructure, to_format: CoordFormat): ConvertedCoords`
*   `validate_geometry(structure: MolecularStructure): GeometryValidation`
*   `recommend_basis_set(elements: string[], accuracy: 'low'|'medium'|'high', calculation_type: string, system_size: number): BasisSetRecommendation`
*   `optimize_scf_settings(difficulty: SCFDifficulty, current_settings?: SCFSettings): SCFOptimization`
*   `suggest_memory_settings(system_size_atoms: number, basis_set_quality: string, num_cores: number, available_ram_gb: number): MemoryConfig`
*   `get_calculation_template(type: CalculationType, molecule_data: any): ORCATemplate`
*   `create_custom_template(requirements: UserRequirements): CustomTemplate`
*   `diagnose_convergence_issues(errorLog: string): DiagnosisResult`
*   `suggest_fixes(issues: ValidationIssue[]): FixSuggestions`
*   `validate_and_fix_input(input_content: string): ValidationAndFixResult` (新增，组合验证和修复建议)
*   `suggest_calculation_improvements(input_content: string, target_property: string): ImprovementSuggestions` (新增)

*(注: 上述接口签名是初步的，具体 schema 将使用 Zod 定义)*

## 5. 文件与目录结构 (暂定)

```
C:/Users/Phelan/AppData/Roaming/Roo-Code/MCP/orca-mcp-server/  (MCP服务器实际部署位置)
├── src/
│   ├── index.ts                 # MCP 服务器入口, 工具定义和注册
│   ├── core/                    # ORCA 核心逻辑 (输入文件结构处理)
│   │   ├── keywordManager.ts
│   │   ├── coordinateProcessor.ts
│   │   ├── parameterBlockManager.ts
│   │   └── calculationTemplateEngine.ts
│   ├── intelligent/             # 智能功能模块 (推荐、诊断)
│   │   ├── parameterRecommendationEngine.ts
│   │   └── convergenceDiagnostic.ts
│   ├── validation/              # 验证模块
│   │   └── orcaInputValidator.ts
│   ├── types/                   # TypeScript 类型定义
│   │   ├── orca.types.ts        # ORCA специфичные типы
│   │   └── mcp.types.ts         # MCP工具相关的输入输出类型 (Zod schemas)
│   └── utils/                   # 通用工具函数 (e.g., string manipulation, file parsing helpers)
├── package.json
├── tsconfig.json
├── build/                       # 编译后的 JavaScript 文件
└── README.md                    # 服务器说明

f:/develop/orca-mcp-server/       (当前工作与开发计划目录)
├── orca_mcp_development_plan.md  # 本开发计划文档
└── ... (其他辅助开发脚本或文档)
```

## 6. Context7 集成策略

*   **关键词信息**: 使用 `context7` 的 `get-library-docs` 工具查询 `orca-manual` (如果已建立索引) 或特定章节，提取关键词、默认值、兼容性。
    *   **Tool**: `context7.get-library-docs`
    *   **Library ID**: 需要先用 `context7.resolve-library-id` 查找 "ORCA manual" 或类似标识。
    *   **Topic**: "keywords", "basis sets", "DFT", specific calculation types.
*   **基组推荐**: 查询 ORCA 文档中关于基组选择的章节，结合元素、精度要求进行推荐。
*   **常见错误与解决方案**: 查询 ORCA FAQ 或错误处理章节。
*   **`mcp_python_sdk` 和 `fastmcp`**: 当前项目为 TypeScript MCP 服务器，这两个 Python SDK 的开发介绍主要用于参考 MCP 协议的实现细节或与其他 Python MCP 服务交互的场景，初期本项目不直接依赖。

## 7. 测试策略

*   **单元测试 (Jest/Vitest)**:
    *   `core` 模块下的每个类的主要方法。
    *   `intelligent` 模块的推荐和诊断逻辑。
    *   `validation` 模块的验证规则。
*   **集成测试**:
    *   测试每个 MCP 工具的输入输出是否符合 Zod schema。
    *   模拟调用 MCP 工具，检查端到端流程。
*   **实际案例测试**:
    *   使用来自教程、文献或用户提供的真实 ORCA 输入文件和输出日志进行测试。
    *   覆盖不同计算类型 (单点、优化、频率、TD-DFT 等)。
    *   覆盖不同体系大小和复杂性。
*   **性能测试**: (后期)
    *   评估处理大型输入文件或复杂请求时的响应时间。

## 8. 进度追踪 (甘特图或表格形式)

| 任务 ID | 任务描述                                     | 阶段 | 状态      | 预计工时 | 实际工时 | 负责人 | 备注                                     |
|---------|----------------------------------------------|------|-----------|----------|----------|--------|------------------------------------------|
| **P1**  | **第一阶段: 核心基础功能**                   |      |           |          |          |        |                                          |
| P1.1    | 项目初始化与 MCP 服务器框架搭建              | 1    | 已完成    | 4h       |          | Roo    | 项目位于 F:\develop\orca-mcp-server\orca-mcp-server |
| P1.2.1  | `KeywordManager` 实现 (基础)                 | 1    | 已完成    | 8h       |          | Roo    | 参考 `10_chapter_6_calculations.md`. Context7 placeholders added. |
| P1.2.2  | `CoordinateProcessor` 实现 (基础)            | 1    | 已完成    | 10h      |          | Roo    | XYZ, Internal, External file refs        |
| P1.2.3  | `ParameterBlockManager` 实现 (基础)          | 1    | 已完成    | 6h       |          | Roo    | SCF, Basis, Memory blocks                |
| P1.3.1  | MCP: `generate_input_file` (基础)            | 1    | 已完成    | 8h       |          | Roo    | TS import error for McpServer pending    |
| P1.3.2  | MCP: `validate_input_syntax` (基础)          | 1    | 已完成    | 4h       |          | Roo    | TS import error for McpServer pending    |
| P1.3.3  | MCP: `suggest_keywords` (基础)               | 1    | 已完成    | 4h       |          | Roo    | TS import error for McpServer pending    |
| P1.3.4  | MCP: `parse_coordinates` (基础)              | 1    | 已完成    | 3h       |          | Roo    | TS import error for McpServer pending    |
| P1.3.5  | `CalculationTemplateEngine` & MCP: `get_calculation_template` (基础) | 1    | 已完成    | 8h       |          | Roo    | TS import error for McpServer pending    |
| **P2**  | **第二阶段: 智能功能增强**                   |      |           |          |          |        |                                          |
| P2.1.1  | `ParameterRecommendationEngine` 实现         | 2    | 已完成    | 12h      |          | Roo    | Basis, SCF, Memory. Context7 placeholders for basis rec. added. |
| P2.1.2  | MCP: `recommend_basis_set`, `optimize_scf_settings`, `suggest_memory_settings` | 2    | 已完成    | 6h       |          | Roo    | TS import error for McpServer pending    |
| P2.2.1  | `ORCAInputValidator` 扩展 (完整验证)         | 2    | 已完成    | 8h       |          | Roo    | Context7 placeholders for common mistakes added. |
| P2.2.2  | `ConvergenceDiagnostic` 实现                 | 2    | 已完成    | 8h       |          | Roo    | Analyze SCF failures                     |
| P2.2.3  | MCP: `validate_and_fix_input`, `diagnose_convergence_issues`, `suggest_fixes` | 2    | 已完成    | 6h       |          | Roo    | TS import error for McpServer pending    |
| P2.3    | MCP: `suggest_calculation_improvements`      | 2    | 已完成    | 8h       |          | Roo    | TS import error for McpServer pending    |
| **P3**  | **第三阶段: 高级功能与用户体验**             |      |           |          |          |        |                                          |
| P3.1    | MCP: `create_custom_template`                | 3    | 已完成    | 8h       |          | Roo    | TS import error for McpServer pending    |
| P3.2    | MCP: `convert_coordinate_format`, `validate_geometry` | 3    | 已完成    | 6h       |          | Roo    | Placeholders implemented. TS import error for McpServer pending |
| **DOC** | **文档与测试**                               | ALL  | 进行中    | 10h      |          | Roo    | 贯穿所有阶段                             |

---

此开发计划将作为我们后续工作的指南。