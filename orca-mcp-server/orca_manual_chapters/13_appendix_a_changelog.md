### **A** **DETAILED CHANGE LOG** **A.1 Changes ORCA 6.0.1**

**A.1.1 Fixed**

**DFT**

  - Crash when XCFun functional was overwritten with LibXC.

  - Hessian fixed for DFT GGA, NoRI, RKS.

  - VV10 Hessian is blocked even if invoked with `CALC_HESS=TRUE` and similar.

  - Wrong orbitals for non-self-consistent DFT-NL calculations (wB97M-V, wB97X-V, B97M-V).

   - `X_WR2SCAN` :

**–** Exchange can now be specified individually in the `%method` block.

**–**
Fixed crashes when second derivatives are requested.

**–** TRAH is now disabled per default when using `X_WR2SCAN` .

**–**
If second derivatives are requested, will now automatically switch to numerical second derivatives.

**–**
Added appropriate warnings for the above changes.

  - Fixed PBEh-3c gCP parameters for Krypton and Lithium to be consistent with Grimme’s stand-alone.

  - gCP is now fixed (and extended) for r2SCAN-3c up to Z=103.

  - Remove restriction to COSX for wB97X-3c .

**TD-DFT**

  - Ground state gradient for TDDFT calculations with `sgradlist` was wrong.

   - `DCORR` 2/3 with `DoSCS` giving wrong results in parallel.

  - (D)-Correction not available for full TDDFT.

  - Fix for memory estimates for Hessian/TDDFT when running without COSX.

   - `FollowIRoot` was not supposed to do anything if the overlap was to small, was still updating.

  - Fixed interface to `BHP22` solver in CIS.

**1243**

**ORCA Manual** **,** **Release 6.0.1**

**MP2**

  - Crash in conventional U-MP2.

  - Parallel crash in RI-MP2 density.

  - Crash in (RI-)MP2 gradient with SMD.

  - Crash in (RI-)MP2 density with PGC and RIJK.

  - MP2+CPCM gradient was wrong.

  - Crash in NearIR + B2PLYP.

  - Bug with MP2 gradient in property file.

**MDCI**

  - SemiCore was not applied correctly if ECP is present.

  - ECP-related crashes.

  - Fixed redundant integral generation for specific problems.

  - Restored old CITrafos to address reported performance issues.

  - Added missing 4th-order doubles term in (T) for RKS reference (already present in UKS-(T), RKS-DLPNO(T), and UKS-DLPNO-(T) and zero for RHF/UHF reference).

  - UHF CIS/STEOM calculation with `UseCISUpdate` is set to `false` .

  - RHF STEOM: TD-DFT initial guess.

**AutoCI**

  - Fixed large stack allocation, e.g., in MRCC.

  - Fixed runtime behavior for `!Moread Noiter` (falsely reporting “not converged”).

  - Fixed `!UseSym` falsely aborting.

  - AutoCI gradients: abort at start of a calculation when RI is requested instead of after coupled cluster itera
tions.

**CASSCF/NEVPT2/QD-NEVPT2**

  - Issue running LR over SA-CASSCF solution.

  - Incorrect setting of gauge origin in CASSCF QDPT led to misleading output and in some cases complained
about not being able to find densities for the origin evaluation.

  - Canonicalize the inactive and virtual spaces of AVAS guesses, to avoid spurious warnings about core orbitals
in the following CASSCF calculation.

  - AVAS: fixed wrong number of occupied orbitals in case no occupied orbitals should have been selected.

  - TRAH-CASSCF: compute generalized Fock matrix which is needed for the CASSCF nuclear gradient.

  - Fixed redundant generation of coupling coefficients in the CI guess.

  - Fixed ABS/CD spectra in calculation with !UseSym and QD-NEVPT2: The wrong densities were picked
for the CASSCF transition moments.

  - Fixed ABS/CD when the NEVPT/QD-NEVPT2 ground state differs from CASSCF. Respecitve transition
were missing.

**1244** **Appendix A. Detailed change log**

**ORCA Manual** **,** **Release 6.0.1**

  - Fixed MCD spectra not using transition densities from QD-NEVPT2 for the flag
`DoFullSemiclassical=true` .

  - Updated manual: Reported `D4TPre` are updated to the new default value 1e-12. ORCA 5 used

`D4TPre=1e-10` .

  - Fixed closed-shell case, e.g. CAS(6,3), crashing in NEVPT2.

  - Fixed NEVPT2/FIC-NEVPT2 wrong energies or crashing for the Vija class to wrong addressing.

  - Fixed ICE densities not stored in density container.

**ANISO**

  - Fixed T and L matrices passed to the single-aniso.

  - Fixed wrong number of non-relativistic states passed to single-aniso.

**QDPT**

  - Corrected QDPT transition density for excitations beyond “none”.

  - Information added to QDPT AMatrix.

  - Issues in QDPT properties in `orca_lft` have been addressed.

**QM/MM**

  - Speed issue for QMMM optimizations.

  - Crystal-QMMM and compound crashed.

  - Removed leftover files from QMMM-IRC amd QMMM-NEB.

**Relativity**

  - Crash for F12 + X2C/ZORA/DKH.

  - Unnecessary abort in AutoCI gradients with X2C/DKH/ZORA.

  - Disabled X2C+GIAO+FiniteNuc (not yet implemented).

  - 2nd-order PC correction to DKH gDSO now skipped when `fpFWtrafo==false` due to numerical instability.

**Solvation**

  - Disabled analytical gradient and Hessian for XTB calculations requesting CPCMX (not implemented).

  - FINAL SINGLE POINT ENERGY for calculations requesting CPCMX was wrong.

  - Crash for calculations requesting Freq + CPCM + dummy atoms.

  - Crash for QM/QM2 calculations with CPCM requesting excited states.

  - Crash for multiple XYZ File Scans for DRACO.

  - Crash with CPCM + NoIter + Pal + open-shell.

  - Fix for GC and CPCM.

**A.1. Changes ORCA 6.0.1** **1245**

**ORCA Manual** **,** **Release 6.0.1**

**Optimization**

  - Multi-XYZ optimization crash.

  - Random possible break when using GFN-xTB Hessian.

  - Random crashes for `RECALC_HESS=TRUE` .

  - COPT was saving wrong Cartesian Hessian under certain conditions, would break.

  - Maximum number of angles that can be included is fixed + better error message.

  - Analytic Hessian as initial Hessian option crashed with IRC.

  - Crash in NEB-TS with subsequent Hessian, caused by change of number of parallel processes for NEB (max
32).

  - NEB parallelization (will - again - automatically start in parallel, if enough processes are available).

**GOAT**

  - GOAT/DOCKER/SOLVATOR now running on Windows.

  - WorkerRandomStart fixed and working as intended.

   - `-REACT` and `-EXPLORE` were (by mistake) not included sqrt(NFrag) to number of opts.

  - Missing timings for GOAT.

**DOCKER**

  - Abort if all final optimizations fail, was ending normally.

  - Do not switch to COPT if constraints are given.

**Stability analysis**

  - Stability analysis + closed-shell systems + post-processing (Hirshfeld, NBO, ...).

   - `SkipSecondSTAB` was still checking for energy differences between steps. Now will move on regardless.
```
orca_2json

```
  - Exported relativistic integrals were wrong in, HMO and angular momentum were missing.

  - Choice of origin corrected.

  - Empty `[]` and `[""]` are no longer crashing but disabling the options.

  - Invalid property JSON syntax in the following cases:

**–**
multiple geometries (e.g. optimizations);

**–**
some jobs with multiple properties of the same kind;

**–**
CIPSI energies;

**–**
MDCI EOM energies;

**–**
XTB jobs;

**–**
energy extrapolation.

**1246** **Appendix A. Detailed change log**

**ORCA Manual** **,** **Release 6.0.1**
```
orca_mapspc

```
  - XAS/XES broadening functions satisfy FWHM.

  - Adjusted .stk files normalization to report band integrals.

**Compound**

  - MORead with same type and number of atoms but different arrangement.

  - Bugs in statistical functions.

**Miscellaneous**

  - SOMF(1X) parallel bug in semi-numeric Coulomb.

  - Dummy/ghost atoms lead to crash in Hessian (partial fix).

  - Fixed bug of Fermi smearing calculations of two-electron systems.

  - Hangup in `leanscf_aftermath` when using F12 and ECPs.

  - Issues in RIXSSOC, XESSOC spectra in ROCIS have been addressed.

  - Issues in computing RI-SSC Integrals have been addressed. This property is now turned on in CASSCF,
LFT and MRCI modules.

  - Fixed a crash in MD and L-OPT when the input file name was “orca”.

  - Default COSX algorithm is set to AUTO everywhere, as originally intended.

  - Disable frozen-core approximation when no frozen-core electrons are present.

   - `orca_vib` was not able to read hess file from AnFreq run.

  - For very small systems restart Hessian could crash.

  - Small deviations between the Guess CI Matrix and the Sigma Vector in GS-ROCIS.

  - DCD-CAS: Removed left-over files.

  - Uncontracted MRCI: Fixed partial general contraction calls in the MRCI integral transformation (crashed
before).

  - Crash for geometry optimization followed by a vibrational frequency calculation with fixed point group Ci.

  - Removal of `posix_memalign`, due to glibc/kernel bug.

  - NBO communication fixed.

  - Fixes a crash in the integral transformation.

  - Crash in `orca_vpot` due to missing prescreening matrix.

**A.1.2 Improvements**

**Output**

  - Print all orbital energies for `!PrintMOs` and `!LargePrint` .

  - Removed redundant warning when using gCP for elements Z > 36 (Kr).

  - Added citations for wr2SCAN and DFT-D4 extension.

  - Better printing of the spin coupling situation of the states resulting from GS-ROCIS calculations.

  - Prepended a counter to irrep labels when printing vibrational frequencies.

**A.1. Changes ORCA 6.0.1** **1247**

**ORCA Manual** **,** **Release 6.0.1**
```
orca_2json

```
  - Citations added to json output file.

  - Absolute path in basename possible.
```
orca_mapspc

```
  - Added support for VCD, XASSOCV and XESSOCV spectrum processing.

**Symmetry**

  - Ensured correctness of gradient cleanup, geometry optimizations with fixed point groups and calculations
of vibrational frequencies (for point groups with real irreps using pure Hartree-Fock).

  - Ensured correctness of the petite-list algorithm for SCF energy and gradient.

**Compound**

  - Implemented automatic knowledge of basenames.

  - Added GOAT interface.

**Miscellaneous**

  - Added ASCII checker to input file.

  - Add the possibility to read multi-XYZ files with no ‘>’.

  - QDPT in CASSCF now uses the magnetic origin as defined in `%eprnmr` (if not set, defaults to CenterOfNucCharge for backwards compatibility).

  - Reduced disk usage and optimized performance for CASSCF (transition) densities in density container.

  - Keep topology in initial IDPP path generation.

  - Add CIS Gradient in property file.
### **A.2 Changes ORCA 6.0.0**

**A.2.1 SCF and Infrastructure**

  - Significant improvements to the SOSCF solver to make it more robust, preventing huge steps that break the
SCF. Overall improvements on the DIIS solvers.

  - Due to the SCF updates, the AutoTRAH is now not so often needed and will start now only from above 50
cycles ( `AutoTRAHIter` ).

  - Improvements to the memory handling of TD-DFT, CP-SCF and the Hessian

**1248** **Appendix A. Detailed change log**

**ORCA Manual** **,** **Release 6.0.1**

**A.2.2 Basis sets**

  - def-TZVP and ma-def-TZVP pseudo-potential basis sets for the actinides (Z = 89, Ac - 103, Lr)

  - Lehtola’s hydrogenic gaussian basis set family (HGBS) including polarized (HGBSP) and augmented
(AHGBS, AHGBSP) variants for all elements up to Oganesson (Z = 118)

  - def2-SVPD, def2-TZVPD, def2-TZVPPD, def2-QZVPD, def2-QZVPPD basis sets for lanthanoids

  - vDZP Grimme’s double-zeta valence basis set

   - `!MINIX` now correctly activates the corresponding ECP

  - Added user-specified L-limit to AutoAux `AutoAuxLLimit`

  - Fixed segfault in dhf-ECP

  - Fix for `DelECP` in `%coords`

  - Added `ReadFragBasis` keywords read fragment-specific basis sets from a file

**A.2.3 Solvation**

  - New charge correction / compensation algorithm (corrected charges printed in an additional file)

  - C-PCM/B scheme for QM/MM calculations

  - DDCOSMO and CPCM/X available for XTB calculations and QM/MM calculations

  - Generalization of names within all solvation models (C-PCM/SMD/ALPB/DDCOSMO/CPCM-X)

  - New discretization scheme for the cavity (C-PCM) based on a constant number of charges per unit of area

**A.2.4 DFT**

  - Allow LibXC functional customization via external parameters

  - Simple input keywords added for some LibXC functionals

  - Added wB97M(2) functional parameters: must be used with wB97M-V orbitals in a two-step job (compound
script available)

  - D4 for elements 87 (Fr) - 103 (Lr)

  - r2SCAN-3c extension to elements 87 (Fr) - 103 (Lr)

  - Simple input keyword for functionals with revised D4 parameters by Grimme (wB97X-D4rev, wB97MD4rev)

  - New hybrid functionals: r2SCANh, r2SCAN0, r2SCAN50, wr2SCAN, wB97X-3c

  - New double-hybrid functionals: Pr2SCAN50, Pr2SCAN69, wPr2SCAN50, kPr2SCAN50

  - Simple input keywords for 2021 variants of revDSD-PBEP86-D4 and revDOD-PBEP86-D4

  - Bugfixes for LibXC combined `*_xc_*` functionals

  - Fixed crash for D4 + ghost atoms

**A.2. Changes ORCA 6.0.0** **1249**

**ORCA Manual** **,** **Release 6.0.1**

**A.2.5 Excited states**

  - Analytical gradient for meta-GGA functionals

  - Small bugfix to spin-adapted triplets and NACMEs.

  - The FolllowIRoot for excited state optimization uses now a much more robust algorithm.

**A.2.6 Relativity**

  - Enabled `NumGrad` with relativistic methods

  - Second order DKH picture-change correction of contact density

  - Minor fixes in DKH picture-change corrections of magnetic properties

  - Picture change corrections are activated automatically

**A.2.7 Multiscale**

  - Reading PDB files for 10k+ atoms with HETATMs now possible

  - Enabled correct FlipSpin behavior with QMMM

  - More efficient MM Module

  - Implemented wall potential

**A.2.8 Coupled cluster / DLPNO**

  - Implemented energy ordering for PNO generation

  - Added semicore treatment for DLPNO

  - Enable DLPNO-CCSD(T) calculations to run DLPNO-CCSD unrelaxed densities

**A.2.9 MP2**

  - Corrected memory estimates and batching in response and gradient

  - Removed the slow and limited analytic (RI-)MP2 Hessian code

  - Removed non-default Gamma-in-core option for RI-MP2 response

  - Disabled single-precision calculations

  - Disabled SemiDirect option in AO-MP2

  - Enabled range-separated DHDFT gradients with RIJDX

**A.2.10 NEB**

  - Improved IDPP initial path

  - More efficient GFN-xTB runs for NEB

**1250** **Appendix A. Detailed change log**

**ORCA Manual** **,** **Release 6.0.1**

**A.2.11 COSX**

  - Improvements to numerical integration grids, both for DFT and COSX

  - Faster grid step

  - Improved performance and accuracy in COSX, also for the gradient and Hessian

**A.2.12 Properties**

  - NMR spin-spin coupling:

**–** Added `SpinSpinElemPairs` and `SpinSpinAtomPairs` keywords to limit which couplings are computed

**–**
Reduced the number of CP-SCF perturbations necessary via a stochastic selection

**–**
DSO term was transposed.

**–**
Off-diagonal PSO elements had the wrong sign

**–**
Efficiency improvement: solve SD/FC CP-SCF equations in restricted mode for RHF, instead of always
using UHF

  - Optimized numeric integration for HFC gauge correction

  - Removed `RITRAFO` option for CP-SCF

  - Switched to `tau=Dobson` as default handling of the kinetic energy density in meta-GGA magnetic properties
with GIAOs

**A.2.13 Hessian**

  - Improvements to the Hessian to avoid accumulation on numerical noise and reduce the number of spurious
negative frequencies.

**A.2.14 Geometry Optimization**

  - Several improvements to the geometry optimization, making is much more stable. Complete redesign of the
Cartesian optimizer (!COPT), making it quick enough to be used together with faster methods.

  - Fallbacks in the geometry optimization in case something fails, e.g. if the internal coordinates are unacceptable.

  - Arbitrary spherical, ellipsoidal or box-like wall potentials can be added, which will reflect on the energy and
gradients and can be used during geometry optimization.

**A.2.15 Miscellaneous**

  - CHELPG charges that reproduce the ESP together with the molecular dipole moment

  - Fixed issues with constraints in multi-step jobs

  - Molden output: store ECP info in `[Pseudo]` block, set point charge atomic number to 0, handling of ghost

atoms

  - Made the `ExtOpt` interface easier to use

  - Store energy from NEB and IRC in the XYZ file

**A.2. Changes ORCA 6.0.0** **1251**

**ORCA Manual** **,** **Release 6.0.1**

**1252** **Appendix A. Detailed change log**

**APPENDIX**