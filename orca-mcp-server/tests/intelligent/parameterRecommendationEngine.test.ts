import { ParameterRecommendationEngine } from '../../src/intelligent/parameterRecommendationEngine.js';
import { BasisSetRecommendation, SCFOptimization, MemoryConfig } from '../../src/types/orca.types.js';

describe('ParameterRecommendationEngine', () => {
  let engine: ParameterRecommendationEngine;

  beforeEach(() => {
    engine = new ParameterRecommendationEngine();
  });

  describe('recommend_basis_set', () => {
    it('should recommend def2-SVP for low accuracy', async () => {
      const recommendation: BasisSetRecommendation = await engine.recommend_basis_set(
        ['C', 'H', 'O'],
        'low',
        10
      );

      expect(recommendation.orbital_basis).toBe('STO-3G');
      expect(recommendation.auxiliary_basis_jk).toBeUndefined();
      expect(recommendation.auxiliary_basis_cosx).toBeUndefined();
      expect(recommendation.relativistic_method).toBeNull();
      expect(recommendation.reasoning).toContain('Low accuracy');
    });

    it('should recommend def2-SVP for medium accuracy', async () => {
      const recommendation: BasisSetRecommendation = await engine.recommend_basis_set(
        ['C', 'H', 'O'],
        'medium',
        20
      );

      expect(recommendation.orbital_basis).toBe('def2-SVP');
      expect(recommendation.auxiliary_basis_jk).toBe('def2/JK');
      expect(recommendation.auxiliary_basis_cosx).toBe('def2/J');
      expect(recommendation.relativistic_method).toBeNull();
      expect(recommendation.reasoning).toContain('Medium accuracy');
    });

    it('should recommend def2-TZVP for high accuracy', async () => {
      const recommendation: BasisSetRecommendation = await engine.recommend_basis_set(
        ['C', 'H', 'O'],
        'high',
        30
      );

      expect(recommendation.orbital_basis).toBe('def2-TZVP');
      expect(recommendation.auxiliary_basis_jk).toBe('def2-TZVP/JK');
      expect(recommendation.auxiliary_basis_cosx).toBe('def2-TZVP/J');
      expect(recommendation.relativistic_method).toBeNull();
      expect(recommendation.reasoning).toContain('High accuracy');
    });

    it('should recommend relativistic treatment for heavy elements', async () => {
      const recommendation: BasisSetRecommendation = await engine.recommend_basis_set(
        ['Au', 'Cl'],
        'high',
        10
      );

      expect(recommendation.orbital_basis).toBe('SARC-DKH-TZVP');
      expect(recommendation.auxiliary_basis_jk).toBe('SARC/JK');
      expect(recommendation.auxiliary_basis_cosx).toBe('SARC/J');
      expect(recommendation.relativistic_method).toBe('DKH');
      expect(recommendation.reasoning).toContain('heavy elements');
      expect(recommendation.reasoning).toContain('DKH');
    });

    it('should recommend ZORA for medium accuracy with heavy elements', async () => {
      const recommendation: BasisSetRecommendation = await engine.recommend_basis_set(
        ['Hg', 'C', 'H'],
        'medium',
        15
      );

      expect(recommendation.orbital_basis).toBe('def2-SVP');
      expect(recommendation.relativistic_method).toBe('ZORA');
      expect(recommendation.reasoning).toContain('ZORA');
      expect(recommendation.warnings).toBeDefined();
      expect(recommendation.warnings![0]).toContain('very heavy elements');
    });

    it('should warn about large systems with high accuracy', async () => {
      const recommendation: BasisSetRecommendation = await engine.recommend_basis_set(
        ['C', 'H'],
        'high',
        150
      );

      expect(recommendation.warnings).toBeDefined();
      expect(recommendation.warnings![0]).toContain('large system');
      expect(recommendation.warnings![0]).toContain('computationally expensive');
    });

    it('should warn about minimal basis with heavy elements', async () => {
      const recommendation: BasisSetRecommendation = await engine.recommend_basis_set(
        ['Pb', 'I'],
        'low',
        5
      );

      expect(recommendation.warnings).toBeDefined();
      expect(recommendation.warnings![0]).toContain('Minimal basis sets');
      expect(recommendation.warnings![0]).toContain('heavy elements');
    });

    it('should handle mixed light and heavy elements', async () => {
      const recommendation: BasisSetRecommendation = await engine.recommend_basis_set(
        ['C', 'H', 'Au', 'P'],
        'high',
        25
      );

      expect(recommendation.relativistic_method).toBe('DKH');
      expect(recommendation.orbital_basis).toBe('SARC-DKH-TZVP');
    });

    it('should handle calculation type parameter', async () => {
      const recommendation: BasisSetRecommendation = await engine.recommend_basis_set(
        ['C', 'H', 'O'],
        'medium',
        10,
        'mp2'
      );

      expect(recommendation.auxiliary_basis_jk).toBeDefined();
      expect(recommendation.orbital_basis).toBe('def2-SVP');
    });
  });

  describe('recommend_scf_settings', () => {
    it('should recommend default settings for simple systems', () => {
      const recommendation: SCFOptimization = engine.recommend_scf_settings({});

      expect(recommendation.convergence_keywords).toContain('TightSCF');
      expect(recommendation.custom_scf_block).toBeUndefined();
      expect(recommendation.reasoning).toContain('Default SCF settings');
    });

    it('should recommend SlowConv for heavy atoms', () => {
      const recommendation: SCFOptimization = engine.recommend_scf_settings({
        has_heavy_atoms: true
      });

      expect(recommendation.convergence_keywords).toContain('SlowConv');
      expect(recommendation.reasoning).toContain('heavy atoms');
    });

    it('should recommend SlowConv for large systems', () => {
      const recommendation: SCFOptimization = engine.recommend_scf_settings({
        system_size_atoms: 200
      });

      expect(recommendation.convergence_keywords).toContain('SlowConv');
      expect(recommendation.reasoning).toContain('large systems');
    });

    it('should recommend damping for oscillating convergence', () => {
      const recommendation: SCFOptimization = engine.recommend_scf_settings({
        convergence_history: ['oscillating']
      });

      expect(recommendation.convergence_keywords).toContain('VerySlowConv');
      expect(recommendation.custom_scf_block).toContain('DampFac 0.7');
      expect(recommendation.custom_scf_block).toContain('DampErr 0.05');
      expect(recommendation.reasoning).toContain('Oscillation detected');
    });

    it('should recommend SlowConv for slow convergence', () => {
      const recommendation: SCFOptimization = engine.recommend_scf_settings({
        convergence_history: ['slow']
      });

      expect(recommendation.convergence_keywords).toContain('SlowConv');
      expect(recommendation.reasoning).toContain('Slow convergence noted');
    });

    it('should handle multiple difficulty indicators', () => {
      const recommendation: SCFOptimization = engine.recommend_scf_settings({
        has_heavy_atoms: true,
        open_shell: true,
        system_size_atoms: 100,
        convergence_history: ['slow']
      });

      expect(recommendation.convergence_keywords).toContain('SlowConv');
      expect(recommendation.reasoning).toContain('heavy atoms');
    });

    it('should not duplicate convergence keywords', () => {
      const recommendation: SCFOptimization = engine.recommend_scf_settings({
        has_heavy_atoms: true,
        convergence_history: ['slow']
      });

      const slowConvCount = recommendation.convergence_keywords?.filter(kw => kw === 'SlowConv').length || 0;
      expect(slowConvCount).toBe(1);
    });

    it('should prioritize TightSCF when no specific convergence keywords are needed', () => {
      const recommendation: SCFOptimization = engine.recommend_scf_settings({
        open_shell: true
      });

      expect(recommendation.convergence_keywords).toContain('TightSCF');
    });
  });

  describe('suggest_memory_settings', () => {
    it('should calculate memory based on available RAM and cores', () => {
      const config: MemoryConfig = engine.suggest_memory_settings(
        50,        // atoms
        'def2-SVP', // basis
        4,         // cores
        16         // GB RAM
      );

      expect(config.max_core_mb).toBeGreaterThan(0);
      expect(config.max_core_mb).toBeLessThanOrEqual(16000); // Should not exceed 16GB per core
      expect(config.total_ram_gb_recommendation).toBeGreaterThan(0);
      expect(config.notes).toContain('Calculated MaxCore');
      expect(config.notes).toContain('16GB total RAM');
      expect(config.notes).toContain('4 cores');
    });

    it('should adjust memory for different basis set qualities', () => {
      const configMinimal = engine.suggest_memory_settings(20, 'STO-3G', 2, 8);
      const configLarge = engine.suggest_memory_settings(20, 'def2-QZVP', 2, 8);

      expect(configLarge.total_ram_gb_recommendation!).toBeGreaterThan(configMinimal.total_ram_gb_recommendation!);
    });

    it('should handle diffuse basis sets', () => {
      const config: MemoryConfig = engine.suggest_memory_settings(
        30,
        'aug-cc-pVTZ',
        2,
        8
      );

      expect(config.total_ram_gb_recommendation).toBeGreaterThan(1);
    });

    it('should warn when estimated RAM exceeds available', () => {
      const config: MemoryConfig = engine.suggest_memory_settings(
        500,       // large system
        'def2-QZVP', // large basis
        8,         // many cores
        4          // limited RAM
      );

      expect(config.notes).toContain('Warning');
      expect(config.notes).toContain('exceeds available RAM');
    });

    it('should enforce minimum and maximum memory limits', () => {
      // Test minimum limit
      const configLowRAM = engine.suggest_memory_settings(10, 'STO-3G', 16, 1);
      expect(configLowRAM.max_core_mb).toBeGreaterThanOrEqual(500);

      // Test maximum limit
      const configHighRAM = engine.suggest_memory_settings(10, 'STO-3G', 1, 100);
      expect(configHighRAM.max_core_mb).toBeLessThanOrEqual(16000);
    });

    it('should use 80% of available RAM', () => {
      const config: MemoryConfig = engine.suggest_memory_settings(
        20,
        'def2-SVP',
        2,
        10
      );

      const expectedMaxCore = Math.floor((10 * 1024 * 0.8) / 2);
      expect(config.max_core_mb).toBe(expectedMaxCore);
    });

    it('should handle zero or negative inputs gracefully', () => {
      const config: MemoryConfig = engine.suggest_memory_settings(
        10,
        'def2-SVP',
        2,
        0
      );

      expect(config.notes).toContain('Default MaxCore');
    });

    it('should scale with system size', () => {
      const configSmall = engine.suggest_memory_settings(10, 'def2-SVP', 2, 8);
      const configLarge = engine.suggest_memory_settings(100, 'def2-SVP', 2, 8);

      expect(configLarge.total_ram_gb_recommendation!).toBeGreaterThan(configSmall.total_ram_gb_recommendation!);
    });

    it('should handle different basis set naming conventions', () => {
      const basisSets = ['minimal', 'STO-3G', '3-21G', 'def2-SVP', 'def2-TZVP', 'def2-QZVP', 'aug-cc-pVQZ'];
      
      basisSets.forEach(basis => {
        const config = engine.suggest_memory_settings(20, basis, 2, 8);
        expect(config.max_core_mb).toBeGreaterThan(0);
        expect(config.total_ram_gb_recommendation).toBeGreaterThan(0);
      });
    });
  });
});