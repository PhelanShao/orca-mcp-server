### **PREFACE**

**ORCA 6.0 Foreword** **i**

**ORCA 6 Changes** **iii**
0.1 ORCA 6.0 Highlights . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . iii

**FAQ – frequently asked questions** **vii**
0.2 Why do some of my calculations give slightly different results with ORCA-5? . . . . . . . . . . . vii
0.3 Why is ORCA called ORCA? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . vii
0.4 How do I install ORCA on Linux / MacOS / Windows? . . . . . . . . . . . . . . . . . . . . . . . vii

0.5 How do I install the xtb module? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . viii

0.6 I’ve installed ORCA, how do I start it? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . viii

0.7 How do I cite ORCA? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . viii

0.8 Are there recommended programmes to use alongside ORCA? . . . . . . . . . . . . . . . . . . . viii
0.9 My old inputs don’t work with the new ORCA version! Why? . . . . . . . . . . . . . . . . . . . ix
0.10 My SCF calculations suddenly die with ‘Please increase MaxCore’! Why? . . . . . . . . . . . . ix
0.11 When dealing with array structures, when does ORCA count starting from zero and in which cases
does counting start from one? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ix
0.12 How can I check that my SCF calculation converges to a correct electronic structure? . . . . . . . ix
0.13 I can’t locate the transition state (TS) for a reaction expected to feature a low/very low barrier,
what should I do? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ix

0.14 During the geometry optimisation some atoms merge into each other and the optimisation fails.
How can this problem be solved? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . x
0.15 While using `MOREAD` feature in ORCA, why am I getting an error saying, “no orbitals found in the
.gbw file”? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . x
0.16 With all the GRID and RI and associated basis set settings I’m getting slightly confused. Can you
provide a brief overview? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . x
0.17 There are a lot of basis sets! Which basis should I use when? . . . . . . . . . . . . . . . . . . . . xi

**1** **General Information** **1**

1.1 Program Components . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1
1.2 Units and Conversion Factors . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 2

**2** **The Architecture of ORCA** **3**

2.1 The structure of the ORCA source code . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3

2.2 The shell structure of ORCA . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3

2.3 The master/slave concept and the calling sequence . . . . . . . . . . . . . . . . . . . . . . . . . 5
2.4 The calculation of molecular properties . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5

**3** **Calling the Program (Serial and Parallel)** **9**
3.1 Calling the Program . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
3.2 Calling the Program with Multiple Processes . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10

**4** **General Structure of the Input File** **15**
4.1 Input Blocks . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 15
4.2 Keyword Lines . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17

**i**

4.3 Basis Sets . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 36

4.4 Numerical Integration in ORCA . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 47
4.5 Input priority and processing order . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 48
4.6 ORCA and Symmetry . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 49
4.7 Jobs with Multiple Steps . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 55

**5** **Input of Coordinates** **57**
5.1 Reading coordinates from the input file . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 57
5.2 Reading coordinates from external files . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 59
5.3 Special definitions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 59

**6** **Running Typical Calculations** **61**
6.1 Single Point Energies and Gradients . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 61
6.2 SCF Stability Analysis . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 164
6.3 Geometry Optimizations, Surface Scans, Transition States, MECPs, Conical Intersections, IRC,
NEB . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 165

6.4 GOAT: global geometry optimization and ensemble generator . . . . . . . . . . . . . . . . . . . 191
6.5 Vibrational Frequencies . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 206
6.6 Excited States Calculations . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 209
6.7 Multireference Configuration Interaction and Pertubation Theory . . . . . . . . . . . . . . . . . 236
6.8 MR-EOM-CC: Multireference Equation of Motion Coupled-Cluster . . . . . . . . . . . . . . . . 270
6.9 Solvation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 276

6.10 ORCA SOLVATOR: Automatic Placement of Explicit Solvent Molecules . . . . . . . . . . . . . 277
6.11 Relativistic Calculations . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 285

6.12 Calculation of Properties . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 287
6.13 Local Energy Decomposition . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 350
6.14 The Hartree-Fock plus London Dispersion (HFLD) method for the study of Noncovalent Interactions360
6.15 ORCA MM Module . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 362

6.16 ORCA Multiscale Implementation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 369
6.17 QM/MM via Interfaces to ORCA . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 391
6.18 Excited State Dynamics . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 395
6.19 The ORCA DOCKER: An Automated Docking Algorithm . . . . . . . . . . . . . . . . . . . . . 427
6.20 Compound Methods . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 434

**7** **Detailed Documentation** **443**

7.1 The SHARK Integral Package and Task Driver . . . . . . . . . . . . . . . . . . . . . . . . . . . 443
7.2 More on Coordinate Input . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 447
7.3 Details on the numerical integration grids . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 452
7.4 Choice of Computational Model . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 456
7.5 Choice of Basis Set . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 491

7.6 Choice of Initial Guess and Restart of SCF Calculations . . . . . . . . . . . . . . . . . . . . . . 511

7.7 SCF Convergence . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 514
7.8 Choice of Wavefunction and Integral Handling . . . . . . . . . . . . . . . . . . . . . . . . . . . 526
7.9 DeltaSCF: Converging to Arbitrary Single-Reference Wavefunctions . . . . . . . . . . . . . . . 531
7.10 CP-SCF Options . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 538
7.11 SCF Stability Analysis . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 539
7.12 Frozen Core Options . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 540
7.13 The Second Order Many Body Pertubation Theory Module (MP2) . . . . . . . . . . . . . . . . . 542
7.14 The Single Reference Correlation Module . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 561
7.15 The Complete Active Space Self-Consistent Field (CASSCF) Module . . . . . . . . . . . . . . . 582
7.16 CASSCF Linear Response . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 625
7.17 Interface to SINGLE_ANISO module . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 628
7.18 Interface to POLY_ANISO module . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 645
7.19 N-Electron Valence State Pertubation Theory . . . . . . . . . . . . . . . . . . . . . . . . . . . . 656
7.20 Complete Active Space Peturbation Theory : CASPT2 and CASPT2-K . . . . . . . . . . . . . . 669
7.21 Dynamic Correlation Dressed CAS . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 670
7.22 Density Matrix Renormalization Group . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 673
7.23 Relativistic Options . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 680
7.24 Approximate Full CI Calculations in Subspace: ICE-CI . . . . . . . . . . . . . . . . . . . . . . 689

**ii**

7.25 CI methods using generated code . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 707
7.26 Geometry Optimization . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 714
7.27 Frequency calculations - numerical and analytical . . . . . . . . . . . . . . . . . . . . . . . . . . 728
7.28 Intrinsic Reaction Coordinate . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 730

7.29 Nudged Elastic Band Method . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 732
7.30 Excited States via RPA, CIS, TD-DFT and SF-TDA . . . . . . . . . . . . . . . . . . . . . . . . 748

7.31 Excited States via ROCIS and DFT/ROCIS . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 778

7.32 Excited States via MC-RPA . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 803

7.33 Excited States via EOM-CCSD . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 811

7.34 Excited States via STEOM-CCSD . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 817

7.35 Excited States via IH-FSMR-CCSD . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 825

7.36 Excited States using PNO-based coupled cluster . . . . . . . . . . . . . . . . . . . . . . . . . . 828
7.37 Excited States via DLPNO-STEOM-CCSD . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 830

7.38 Core-level spectroscopy with coupled cluster methods . . . . . . . . . . . . . . . . . . . . . . . 831
7.39 The Multireference Correlation Module . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 843

7.40 Multireference Equation of Motion Coupled-Cluster (MR-EOM-CC) Theory . . . . . . . . . . . 869
7.41 Simulation and Fit of Vibronic Structure in Electronic Spectra, Resonance Raman Excitation Profiles and Spectra with the orca_asa Program . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 890
7.42 One Photon Spectroscopy . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 936
7.43 Magnetic properties through Quasi Degenerate Perturbation Theory . . . . . . . . . . . . . . . . 944
7.44 Simulation of (Magnetic) Circular Dichroism and Absorption Spectra . . . . . . . . . . . . . . . 950
7.45 More on the Excited State Dynamics module . . . . . . . . . . . . . . . . . . . . . . . . . . . . 954
7.46 More details on the ORCA DOCKER . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 968

7.47 More on the ORCA SOLVATOR . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 972

7.48 *Ab initio* Molecular Dynamics Simulations . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 976
7.49 Fast Multipole Method . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1004
7.50 Implicit Solvation Models . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1009
7.51 Calculation of Properties . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1032
7.52 Natural Bond Orbital (NBO) Analysis . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1051
7.53 Population Analyses and Control of Output . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1062
7.54 Orbital and Density Plots . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1077
7.55 Utility Programs . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1085
7.56 Compound Methods . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1128
7.57 Compound Examples . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1192
7.58 orca_2json . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1214
7.59 Property File . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1233

**8** **Some Tips and Tricks** **1237**
8.1 Input . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1237
8.2 Cost versus Accuracy . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1237
8.3 Converging SCF Calculations . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1239
8.4 Choice of Theoretical Method . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1241

**A Detailed change log** **1243**
A.1 Changes ORCA 6.0.1 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1243
A.2 Changes ORCA 6.0.0 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1248

**B** **Publications Related to ORCA** **1253**

B.1 Method development . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1253
B.2 Relevant applications, benchmarks and reviews . . . . . . . . . . . . . . . . . . . . . . . . . . . 1258
B.3 Classification by topic . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1263
B.4 Applications that make use of include the following . . . . . . . . . . . . . . . . . . . . . . . . 1278
B.5 Reviews of interest . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1286

**C Bibliography** **1289**

**Bibliography** **1291**

**iii**

**iv**

**ORCA Manual** **,** **Release 6.0.1**

**- An** ***ab initio*** **, DFT and semiempirical SCF-MO package -**

**Version 6.0.1**

*Design and Scientific Directorship:* **Frank Neese**
*Technical Directorship:* **Frank Wennmohs**

Max-Planck-Institut für Kohlenforschung
Kaiser-Wilhelm-Platz 1, 45470 Mülheim a. d. Ruhr, Germany
```
department-mts@kofo.mpg.de

```
*With contributions from:* \

*MPI für Kohlenforschung:*
Daniel Aravena, Michael Atanasov, Alexander A. Auer, Ute Becker, Giovanni Bistoni, Markus Bursch,
Dmytro Bykov, Marcos Casanova, Vijay G. Chilkuri, Pauline Colinet, Dipayan Datta, Achintya Kumar Dutta,
Nicolas Foglia, Dmitry Ganyushin, Miquel Garcia-Rates, Tiago L. C. Gouveia, Yang Guo, Andreas Hansen, Ingolf Harden, Benjamin Helmich-Paris, Lee Huntington, Róbert Izsák, Riya Kayal, Emily Kempfer, Christian Kollmar, Axel Koslowski, Simone Kossmann, Lucas Lang, Marvin Lechner, Spencer Leger, Dagmar Lenk, Dimitrios G. Liakos, Dimitrios Manganas, Dimitrios A. Pantazis, Anastasios Papadopoulos, Taras Petrenko, Peter Pinski, Christoph Reimann, Marius Retegan, Christoph Riplinger, Michael Roemelt, Masaaki Saitow, Barbara Sandhöfer, Kantharuban Sivalingam, Bernardo de Souza, Georgi L. Stoychev, Van Anh Tran, Willem Van den Heuvel,
Zikuan Wang, Hang Xu

*FACCTs GmbH:*

Markus Bursch, Miquel Garcia-Rates, Christoph Riplinger, Bernardo de Souza, Georgi L. Stoychev

*Other institutions:*
Vilhjálmur Åsgeirsson, Christoph Bannwarth, Martin Brehm, Garnet Chan, Sebastian Ehlert, Marvin Friede,
Lars Goerigk, Stefan Grimme, Waldemar Hujo, Mihály Kállay, Holger Kruse, Jiri Pittner, Philipp Pracht, Marcel Müller, Liviu Ungur, Edward Valeev, Lukas Wittmann

*Additional contributions to the manual from:*
Wolfgang Schneider

**PREFACE** **1**

**ORCA Manual** **,** **Release 6.0.1**

**2** **PREFACE**
