### **ORCA 6 CHANGES** **0.1 ORCA 6.0 Highlights**

**0.1.1 SCF and Single Reference**

  - LeanSCF: reduced memory, more robust convergence

  - Electric field optimizations

  - General ROHF implementation (SCF/Gradient) with all approximations

  - General CSF ROHF

  - New density functionals

  - Delta-SCF

  - UHF STEOM-CCSD

  - UHF-IP-EOM-CCSD

  - UHF-EA-EOM-CCSD

  - Regularized MP2

  - Regularized OOMP2

  - Solvation in OOMP2

  - Improved stability analysis featuring all approximations, solvation etc

  - MixGuess to converge to biradicaloid open shell singlet type broken symmetry solutions

  - Approximate Spin Projection Method for broken symmetry calculations (SCF/Gradient)

**0.1.2 Multi Reference**

  - TRAH, AVAS, MCRPA

  - Linear response CASSCF

  - Vastly improved Recursive CI coupling coefficient generation

**0.1.3 Automatic Code generation**

  - MPn

  - CCSD(T) gradients

  - CCSDT

**iii**

**ORCA Manual** **,** **Release 6.0.1**

**0.1.4 Relativity**

  - X2C

  - New and consistent DKH infrastructure

**0.1.5 Solvation & Embedding**

  - DLPNO-CCSD(T) PTES Approach

  - SMD analytical Hessian

  - Dynamically adjusted radii: DRACO

  - Improved surface grids

  - Interface to openCOSMO-RS

  - Explicit Solvator

  - Molecule Docker

  - FMM implementation for embedding

  - CIM implementation works with DLPNO-CC, DLPNO-MP2

**0.1.6 Optimization**

  - More robust optimizer (fewer cycles, fewer cases with negative frequencies)

  - GOAT global optimizer and conformer generator

  - Basis set limit extrapolated optimizations through compound scripts

  - Extrapolation with counterpoise correction through compound scripts

**0.1.7 Hessian**

  - Group parallelization

  - Performance improvements

**0.1.8 Excited States**

  - Analytical gradient for meta-GGA functionals

**0.1.9 New Spectroscopic Properties**

  - VCD implementation at the SCF level

  - MCD with vibronic structure

  - General spin ROCIS

  - Higher order moments and exact field matter coupling

  - Spin rotation constants

**iv** **Chapter 0. ORCA 6 Changes**

**ORCA Manual** **,** **Release 6.0.1**

**0.1.10 Misc Properties**

  - Local dipole moments and polarizabilities

  - Frequency dependent electric properties

  - VPT2 enhancements

  - Restructured NMR simulation program `orca_nmrspectrum`

  - MBIS charges

**0.1.11 Workflow & Interfacing**

  - Property file: Machine readable, Human readable summary of ORCA run

  - Compound: vastly improved Syntax, features, optimizations, ...

   - `orca_2json` : generate integrals, property file, run backwards to get MOs into ORCA

  - Citation tool for helping find the right references

For a detailed change log of ORCA 6.0, please see the *detailed change log*

**0.1. ORCA 6.0 Highlights** **v**

**ORCA Manual** **,** **Release 6.0.1**

**vi** **Chapter 0. ORCA 6 Changes**
