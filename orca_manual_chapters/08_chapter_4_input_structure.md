### **FOUR** **GENERAL STRUCTURE OF THE INPUT FILE**

In general, the input file is a free format ASCII file and can contain one or more keyword lines that start with a
“ `!` ” sign, one or more input blocks enclosed between an “ `%` ” sign and “ `end` ” that provide finer control over specific
aspects of the calculation, and finally the specification of the coordinates for the system along with the charge and
multiplicity provided either with a `%coords` block, or more usually enclosed within two “ `*` ” symbols. Here is an
example of a simple input file that contains all three input elements:



Comments in the file start by a “#”. For example:
```
# This is a comment. Continues until the end of the line

```
Comments can also be closed by a second “#”, as the example below where `TolE` and `TolMaxP` are two variables
that can be user specified:
```
TolE=1e-5; #Energy conv.# TolMaxP=1e-6; #Density conv.#

```
The input may contain several blocks, which consist of logically related data that can be user controlled. The
program tries to choose sensible default values for all of these variables. However, it is impossible to give defaults
that are equally sensible for all systems. In general the defaults are slightly on the conservative side and more
aggressive cutoffs etc. can be chosen by the user and may help to speed things up for actual systems or give higher
accuracy if desired.
### **4.1 Input Blocks**

The following blocks exist:

continues on next page

**15**

**ORCA Manual** **,** **Release 6.0.1**

Table 4.1 – continued from p revious p a g e

Blocks start with “ `%` ” and end with “ `end` ”. Note that input is **not** case sensitive. For example:



No blocks *need* to be present in an input file but they *can* be present if detailed control over the behavior of the
program is desired. Otherwise all normal jobs can be defined via the keywords described in the next section.
Variable assignments have the following general structure:
```
VariableName Value

```
Some variables are actually arrays. In this case several possible assignments are useful:



**Note:** Arrays always start with index 0 in ORCA (this is because ORCA is a C++ program). The first line in
the example gives the value “ `Value1` ” to `Array[1]`, which is the *second* member of this array. The second line
assigns `Value1` to `Array[1]`, `Value2` to `Array[2]` and `Value3` to `Array[3]` . The third line assigns `Value1` to
`Array[0]` and `Value2` to `Array[1]` .

Strings (for examples filenames) must be enclosed in quotes. For example:
```
MOInp "Myfile.gbw"

```
**16** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**

In general the input is not case sensitive. However, inside strings the input is case sensitive. This is because on unix
systems `MYFILE.GBW` and `MyFile.gbw` are different files. Under Windows the file names are not case sensitive.
### **4.2 Keyword Lines**

It is possible to give a line of keywords that assign certain variables that normally belong to different input blocks.
The syntax for this “simple input” is line-oriented. A keyword line starts with the “ `!` ” sign.
```
! Keywords

```
**4.2.1 Main Methods and Options**

Table 4.2 provides a list of keywords that can be used within the “simple input” keyword line to request specific
methods and/or algorithmic options. Most of them are self-explanatory. The others are explained in detail in the
section of the manual that deals with the indicated input block.

Table 4.2: Main keywords that can be used in the simple input of ORCA.

**Runtypes**






**4.2. Keyword Lines** **17**

**ORCA Manual** **,** **Release 6.0.1**

**Atomic mass/weight handling**

**Symmetry handling**

**Second order many body perturbation theory**

**18** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**

**High-level single reference methods**

These are implemented in the MDCI module. They can be run in a number of technical variants.

Other coupled-pair methods are available and are documented later in the manual in detail (section 7.8) In general
you can augment the method with RI-METHOD in order to make the density fitting approximation operative; RI34METHOD does the same but only for the 3- and 4-external integrals). MO-METHOD performs a full four index
transformation and AO-METHOD computes the 3- and 4-external contributions on the fly. With AOX-METHOD
this is is done from stored AO integrals.

**AUTOCI single reference methods**

These single reference correlation methods are available in the AUTOCI.

**4.2. Keyword Lines** **19**

**ORCA Manual** **,** **Release 6.0.1**












**Local correlation methods**

These are local, pair natural orbital based correlation methods. They must be used together with auxiliary correlation fitting basis sets. Open-shell variants are available for some of the methods, for full list please see section
*Coupled-Cluster and Coupled-Pair Methods* .

**20** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**












**Accuracy control for local correlation methods**

These keywords select predefined sensible sets of thresholds to control the accuracy of DLPNO calculations. See
the corresponding sections on local correlation methods for more details.

**4.2. Keyword Lines** **21**

**ORCA Manual** **,** **Release 6.0.1**

**Automatic basis set extrapolation**






**High-level methods for excited states as implemented in the MDCI module**

An additional block input to define the number of roots is required. The EOM family of methods feature IP and
EA extensions. The list below is incomplete as some methods need more refined settings such as the Hilbert space
MRCC approaches (MkCCSD/BWCCSD). Note that excited states can also be computed with CIS, RPA, ROCIS
and TD-DFT. Please check the excited states section of the manual for details.

**22** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**

**CASSCF related options**

All of them require the CASSCF block as minimal input.

**(internally contracted) Multireference methods beyond NEVPT2/CASPT2**

If specified in a single keyword all information about reference spaces, number of roots etc. is taken from the
CASSCF module that is assumed to be run in advance. These methods reside in the autoci module. More refined
settings require the autoci block in the input.

**(uncontracted) Multireference methods**

If specified in a single keyword all information about reference spaces, number of roots etc. is taken from the
CASSCF module that is assumed to be run in advance. In general, these calculations are of the individually
selecting type and are very time consuming. Very many flags can be set and modified for these methods and in
general using these methods requires expert users! In general see the variables `Tsel`, `Tpre` and `Tnat` that define the
individual selection process. All of these methods can be used with RI integrals by using RI-MRCI etc. However,
then the calculations become even more time consuming since integrals are made one- by one on the fly. Non-RI
calculations will be pretty much limited to about 200-300 orbitals that are included in the CI.

**4.2. Keyword Lines** **23**

**ORCA Manual** **,** **Release 6.0.1**

**Frozen core features**

**Note:** This deviates from previous versions of ORCA! We are now counting core electrons rather than using
an energy window. If you do want to use an orbital energy window use `%method FrozenCore FC_EWIN end` .
Otherwise the EWin commands will be ignored! (alternatives are `FC_ELECTRONS` (default) and `FC_NONE` ).









**Semiempirical methods**

**24** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**


**Algorithmic variations, options, add-ons, modifiers, ...**








**Initial guess options**

In most cases the default PMODEL guess will be adequate. In some special situations you may want to switch to
a different choice.

**4.2. Keyword Lines** **25**

**ORCA Manual** **,** **Release 6.0.1**

**Basis-set related keywords**

**Relativistic options**

There are several variants of scalar relativistic Hamiltonians to use in all electron calculations. See *Relativistic*

*Options* for details.




**Grid options**

**Convergence thresholds**

These keywords control how tightly the SCF and geometry optimizations will be converged. The program makes
an effort to set the convergence thresholds for correlation modules consistently with that of the SCF.

**26** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**





**Convergence acceleration**

The default is DIIS which is robust. For most closed-shell organic molecules SOSCF converges somewhat better and might be a good idea to use. For “trailing convergence”, KDIIS or the trust-region augmented Hessian
procedures TRAH-SCF might be good choices.

**4.2. Keyword Lines** **27**

**ORCA Manual** **,** **Release 6.0.1**

**Convergence strategies**

(does not modify the convergence criteria)

**Spin-orbit coupling**






**28** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**


**Miscellaneous options**
























**4.2. Keyword Lines** **29**

**ORCA Manual** **,** **Release 6.0.1**

**Output control**





**Nudged Elastic Band methods**

**30** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**

**Compression and storage**

The data compression and storage options deserve some comment: in a number of modules including RI-MP2,
MDCI, CIS, (D) correction to CIS, etc. the program uses so called “Matrix Containers”. This means that the data
to be processed is stored in terms of matrices in files and is accessed by a double label. A typical example is the
exchange operator **K** **[ij]** with matrix elements *𝐾* *[𝑖𝑗]* ( *𝑎, 𝑏* ) = ( *𝑖𝑎|𝑗𝑏* ). Here the indices *𝑖* and *𝑗* refer to occupied orbitals
of the reference state and *𝑎* and *𝑏* are empty orbitals of the reference state. Data of this kind may become quite large
(formally *𝑁* [4] scaling). To store the numbers in single precision cuts down the memory requirements by a factor of
two with (usually very) slight loss in precision. For larger systems one may also gain advantages by also compressing the data (e.g. use a “packed” storage format on disk). This option leads to additional packing/unpacking work
and adds some overhead. For small molecules UCDOUBLE is probably the best option, while for larger molecules
UCFLOAT or particularly CFLOAT may be the best choice. Compression does not necessarily slow the calculation
down for larger systems since the total I/O load may be substantially reduced and thus (since CPU is much faster
than disk) the work of packing and unpacking takes less time than to read much larger files (the packing may reduce
disk requirements for larger systems by approximately a factor of 4 but it has not been extensively tested so far).
There are many factors contributing to the overall wall clock time in such cases including the total system load. It
may thus require some experimentation to find out with which set of options the program runs fastest with.

**Caution:**

   - It is possible that FLOAT may lead to unacceptable errors. Thus it is not the recommended option when
MP2 or RI-MP2 gradients or relaxed densities are computed. For this reason the default is DOUBLE.

   - If you have convinced yourself that FLOAT is OK, it may save you a factor of two in both storage and
CPU.

**Global memory use**

Some ORCA modules (in particular those that perform some kind of wavefunction based correlation calculations)
require large scratch arrays. Each module has an independent variable to control the size of these dominant scratch
arrays. However, since these modules are never running simultaneously, we provide a global variable `MaxCore`
that assigns a certain amount of scratch memory to all of these modules. Thus:
```
%MaxCore 4000

```
sets 4000 MB (= 4 GB) as the limit for these scratch arrays. **This limit applies per processing core** . Do not be
surprised if the program takes more than that – this size only refers to the dominant work areas. Thus, you are
well advised to provide a number that is significantly less than your physical memory. Note also that the memory
use of the SCF program cannot be controlled: it dynamically allocates all memory that it needs and if it runs out
of physical memory you are out of luck. This, however, rarely happens unless you run on a really small memory
computer or you are running a gigantic job.

**4.2. Keyword Lines** **31**

**ORCA Manual** **,** **Release 6.0.1**

**4.2.2 Density Functional Methods**

For density functional calculations a number of standard functionals can be selected via the “simple input” feature.
Since any of these keywords will select a DFT method, the keyword “DFT” is not needed in the input. Further functionals are available via the `%method` block. References are given in Section *[sec:model.dft.functionals.detailed]*

**Local and gradient corrected functionals**

**Hybrid functionals**

**32** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**

**Meta-GGA and hybrid meta-GGA functionals**

**Range-separated hybrid functionals**

**Perturbatively corrected double-hybrid functionals**

Add the prefix RI- or DLPNO- to use the respective approximation for the MP2 part.

**4.2. Keyword Lines** **33**

**ORCA Manual** **,** **Release 6.0.1**





**Range-separated double-hybrid functionals**

Add the prefix RI- or DLPNO- to use the respective approximation for the MP2 part.

**34** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**

**Global and range-separated double-hybrid functionals with spin-component and spin-opposite**
**scaling**

Add the prefix RI- or DLPNO- to use the respective approximation for the MP2 part.

**Composite Methods**

**4.2. Keyword Lines** **35**

**ORCA Manual** **,** **Release 6.0.1**

**Dispersion corrections**

See *DFT Calculations with Atom-pairwise Dispersion Correction* and *Treatment of Dispersion Interactions with*
*DFT-D3* for details.

**Non-local correlation**

See *DFT Calculations with the Non-Local, Density Dependent Dispersion Correction (VV10): DFT-NL* for details.
### **4.3 Basis Sets**

**4.3.1 Standard basis set library**

There are standard basis sets that can be specified via the “simple input” feature in the keyword line. However, any
basis set that is not already included in the ORCA library can be provided either directly in the input or through an
external file. See the BASIS input block for a full list of internal basis sets and various advanced aspects (section
*Choice of Basis Set* ). Effective core potentials and their use are described in section *Effective Core Potentials* .

**Pople-style basis sets**

*Polarization functions for the 6-31G basis set:*

*Polarization functions for the 6-311G basis set:* All of the above plus (3df) and (3df,3pd)

*Diffuse functions for the 6-31G and 6-311G basis sets:*





**36** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**

**The def2 basis sets of the Karlsruhe group**

These basis sets are all-electron for elements **H-Kr**, and automatically load Stuttgart-Dresden effective core potentials for elements **Rb-Rn** .

**Older (“def”) Ahlrichs basis sets**

ECP basis sets for elements **Fr-Lr** . This basis set automatically employs the original def-ECP.

*All-electron basis sets for elements* ***H-Kr*** :

**Note:** Past versions of ORCA used to load all-electron basis sets also for elements Rb-I with the above keywords
for double- and triple-zeta basis sets. The Rb-I basis sets originated from non-relativistic all-electron basis sets
of the Turbomole library (such as “TZVPAlls”). **This automatic substitution is now deprecated** . However, we
offer temporarily the ability to reproduce that behavior by adding the prefix “old-” to the above keywords, e.g.
`old-TZVP` .

**4.3. Basis Sets** **37**

**ORCA Manual** **,** **Release 6.0.1**

**Diffuse def2 basis sets**






**Karlsruhe basis sets with Dirac–Fock ECPs**

These basis sets are derived from the def2-XVP ones with small modifications for 5s, 6s, 4d, and 5d elements and
iodine.[884] They are optimized for the revised Dirac-Fock ECPs (dhf-ECP) as opposed to the Wood–Boring ones
(def2-ECP). Versions for two-component methods are also available, e.g. `dhf-TZVP-2c`, **however, such methods**
**are currently not implemented in ORCA** .

**Relativistically recontracted Karlsruhe basis sets**

For use in DKH or ZORA calculations we provide adapted versions of the def2 basis sets for the elements **H-Kr**
(i.e., for the all-electron def2 basis sets). These basis sets retain the original def2 exponents but have only one
contracted function per angular momentum (and hence are somewhat larger), with contraction coefficients suitable
for the respective scalar relativistic Hamiltonian. These basis sets can be called with the prefix DKH- or ZORA-,
and can be combined with the SARC basis sets for the heavier elements.

*Minimally augmented versions:*

**38** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**

The same functionality is offered for the “def” basis sets, e.g. “ZORA-TZVP”. In this case too, the relativistically
recontracted versions refer to the elements **H-Kr** . To replicate the behavior of past ORCA versions for elements
Rb-I, the prefix “old-” can be used with these keywords as in the non-relativistic case.

**Warning:** Previous verions of ORCA made extensive use of automatic basis set substitution and aliasing when
the use of the DKH or ZORA Hamiltonians was detected. This is no longer the case! Relativistic versions of
Karlsruhe basis sets now have to be requested explicitly with the appropriate prefix. SARC basis sets also have
to be requested explicitly

All-electron Karlsruhe basis sets up to Rn for the exact two-component (X2C) Hamiltonian.[690] The “-s” variants,
e.g. “def2-TZVPall-s”, are augmented with additional tight functions for NMR shielding calculations.[275] The
“-2c” variants, e.g. “def2-TZVPall-2c”, are intended for two-component calculations including spin-orbit coupling
( **Note that two-component calculations are not implemented in** ***ORCA*** ).

**SARC basis sets**

[62, 641, 642, 643, 644, 729]

Segmented all-electron relativistically contracted basis sets for use with the DKH2 and ZORA Hamiltonians. Available for elements beyond Krypton.

**Note:** *SARC/J is the general-purpose Coulomb-fitting auxiliary for all SARC orbital basis sets.*

**4.3. Basis Sets** **39**

**ORCA Manual** **,** **Release 6.0.1**

**SARC2 basis sets for the lanthanides**

[52]

SARC basis sets of valence quadruple-zeta quality for lanthanides, with NEVPT2-optimized (3g2h) polarization
functions. Suitable for accurate calculations using correlated wavefunction methods.

**Note:** Can be called without the polarization functions using ...-QZV. Each basis set has a large dedicated /JK
auxiliary basis set for simultaneous Coulomb and exchange fitting.

**Jensen basis sets**

**Lehtolas hydrogenic Gaussian basis sets**

[505]

*Augmented versions:*

**Sapporo basis sets**

**40** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**

**Correlation-consistent basis sets**

**Partially augmented correlation-consistent basis sets**

[646]

**DKH versions of correlation-consistent basis sets**

**ECP-based versions of correlation-consistent basis sets**

**4.3. Basis Sets** **41**

**ORCA Manual** **,** **Release 6.0.1**

**F12 and F12-CABS basis sets**

**Atomic Natural Orbital basis sets**

*Relativistic contracted ANO-RCC basis sets:*

**42** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**

**Miscellaneous and specialized basis sets**

**4.3.2 Auxiliary basis sets**

Auxiliary basis sets for the RI-J and RI-MP2 approximations can also be specified directly in the simple input:

**Auxiliary basis sets for Coulomb fitting**

**Auxiliary basis sets for simultaneously fitting Coulomb and exchange**

Fitting basis sets developed by Weigend for fitting simultaneously Coulomb and exchange energies. They are quite
large and accurate. They fit SCF energies very well but even if they are large they do not fit correlation as well as
the dedicated “/C” auxiliary basis sets.

**4.3. Basis Sets** **43**

**ORCA Manual** **,** **Release 6.0.1**

**Auxiliary basis sets for correlation calculations**

**Note:** ORCA versions before 4.0 allowed the use of multiple keywords to invoke the same def2 Coulomb or
Coulomb+exchange fitting basis set of Weigend. To avoid confusion all these keywords are now deprecated and
the auxiliary basis sets are simply called using “ `def2/J` ” and “ `def2/JK` ”.

**Note:** Starting from version 4.1 ORCA internally stores up to five basis sets for each calculation: the obligatory
orbital basis set; an `AuxJ` Coulomb-fitting basis for the RI-J, RIJDX/RIJONX, and RIJCOSX approximations; an
`AuxJK` Coulomb- and exchange-fitting basis used for RIJK; an `AuxC` auxiliary basis for the RI approximation in
dynamical electron correlation treatments (such as RI-MP2, RI-CCSD, and DLPNO methods); and a complementary auxiliary basis set ( `CABS` ) for F12 methods. “/J” basis sets given in the simple input are assigned to `AuxJ`
and likewise for the other types. Non-standard assignments like `AuxJ="def2/JK"` are possible only through the
`%basis` block input (see section *Built-in Basis Sets* ).

**4.3.3 Use of scalar relativistic basis sets**

For DKH and ZORA calculations ORCA provides relativistically recontracted versions of the Karlsruhe basis
sets for elements up to Kr. These can be requested by adding the prefix DKH- or ZORA- to the normal basis
set name. Note that for other non-relativistic basis sets (for example Pople-style bases) no recontraction has been
performed and consequently such calculations are inconsistent! The basis set and the scalar relativistic Hamiltonian
are specified in the keyword line, for example:
```
! B3LYP ZORA ZORA-TZVP ...

```
If an auxiliary basis set is required for these recontracted Karlsruhe basis sets, we recommend the use of the
decontracted def2/J. This can be obtained simply by using the keyword “ `! SARC/J` ” (instead of the equivalent “ `!`
`def2/J DecontractAuxJ` ”) and is the recommended option as it simultaneously covers the use of SARC basis
sets for elements beyond Krypton.

**44** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**
```
! TPSS ZORA ZORA-def2-TZVP SARC/J ...

```
For all-electron calculations with elements heavier than Krypton we offer the SARC (segmented all-electron relativistically contracted) basis sets [62, 641, 642, 643, 644, 729]. These were specifically developed for scalar
relativistic calculations and are individually adapted to the DKH2 and ZORA Hamiltonians. In this case the
Coulomb-fitting auxiliary basis set *must* be specified as SARC/J, or alternatively the `AutoAux` keyword ( *Auto-*
*matic generation of auxiliary basis sets* ) can be employed to create auxiliary basis sets.
```
! PBE DKH SARC-DKH-TZVP SARC/J ...

```
Specifically for wavefunction-based calculations of lanthanide systems we recommend the more heavily polarized
SARC2 basis sets [52].

Other basis sets suitable for scalar relativistic calculations are various versions of the all-electron correlationconsistent basis sets that are optimized for the DKH2 Hamiltonian and can be called with the suffix “-DK”. The
relativistically contracted atomic natural orbital (ANO-RCC) basis sets of Roos and coworkers were also developed
for the DKH2 Hamiltonian and have almost complete coverage of the periodic table (up to Cm).

For calculations with the X2C Hamiltonian, all-electron basis sets with the prefix “x2c-” (e.g. x2c-TZVPall)
developed by Weigend and coworkers are available.[275, 690] The matching AuxJ basis set is “x2c/J” and AutoAux
can be used as well.

**4.3.4 Effective Core Potentials**

Starting from version 2.8.0, ORCA features effective core potentials (ECPs). They are a good alternative to scalar
relativistic all-electron calculations if heavy elements are involved. This pertains to geometry optimizations and
energy calculations but may not be true for property calculations.

In order to reduce the computational effort, the usually highly contracted and chemically inert core basis functions
can be eliminated by employing ECPs. ECP calculations comprise a “valence-only” basis and thus are subject to
the frozen core approximation. Contributions due to the core orbitals are accounted for by an effective one-electron
operator *𝑈* [core] which replaces the interactions between core and valence electrons and accounts for the indistinguishability of the electrons. Its radial parts *𝑈* *𝑙* ( *𝑟* ) are generally expressed as a linear combination of Gaussian
functions, while the angular dependence is included through angular momentum projectors *|𝑆* *𝑚* *[𝑙]* *[⟩]* [.]


*𝑙*
∑︁

*𝑚* = *−𝑙*


*𝑈* [core] = *𝑈* *𝐿* ( *𝑟* ) +


*𝐿−* 1
∑︁

*𝑙* =0


⃒⃒ *𝑆* *𝑚𝑙* *[⟩]* [[] *[𝑈]* *[𝑙]* [(] *[𝑟]* [)] *[ −]* *[𝑈]* *[𝐿]* [(] *[𝑟]* [)]] *[ ⟨][𝑆]* *𝑚* *[𝑙]* ⃒⃒


*𝑈* *𝑙* = ∑︁ *𝑑* *𝑘𝑙* *𝑟* *[𝑛]* *[𝑘𝑙]* exp( *−𝛼* *𝑘𝑙* *𝑟* [2] )

*𝑘*


The maximum angular momentum *𝐿* is generally defined as *𝑙* max [atom] [+ 1][. The parameters] *[ 𝑛]* *[𝑘𝑙]* [,] *[ 𝛼]* *[𝑘𝑙]* [and] *[ 𝑑]* *[𝑘𝑙]* [that are]
necessary to evaluate the ECP integrals have been published by various authors, among them the well-known Los
Alamos (LANL) [367] and Stuttgart–Dresden (SD) [41, 94, 137, 138, 217, 218, 219, 220, 221, 222, 223, 261, 262,
279, 280, 281, 347, 348, 409, 432, 433, 437, 507, 508, 509, 523, 524, 561, 580, 581, 594, 595, 633, 671, 672, 673,
674, 675, 759, 774, 824, 825, 873, 880, 881, 901] parameter sets. Depending on the specific parametrization of
the ECP, relativistic effects can be included in a semiempirical fashion in an otherwise nonrelativistic calculation.
Introducing *𝑈* [core] into the electronic Hamiltonian yields two types of ECP integrals, the local (or type-1) integrals
that arise because of the maximum angular momentum potential *𝑈* *𝐿* and the semi-local (or type-2) integrals that
result from the projected potential terms. The evaluation of these integrals in ORCA proceeds according to the
scheme published by Flores-Moreno et al.[266].

A selection of ECP parameters and associated basis sets is directly accessible in ORCA through the internal ECP
library (see Table 4.3 for a listing of keywords).

**4.3. Basis Sets** **45**

**ORCA Manual** **,** **Release 6.0.1**

Table 4.3: Overview of library keywords for ECPs and associated basis sets available in ORCA.









continues on next page

**46** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**

Table 4.3 – continued from p revious p a g e

**Note:** Some basis sets assign an ECP by default when requested through the simple input (but not through the
`%basis` block): for example, “def2” basis sets use the def2-ECP. For others, see the footnotes under Table 7.10.

The simplest way to assign ECPs is by using the ECP keyword within the keyword line, although input through
the `%basis` block is also possible ( *Advanced Specification of Effective Core Potentials* ). The ECP keyword itself
assigns *only* the effective core potential, not a valence basis set! As an example for an explicitly named ECP you
could use
```
! def2-TZVP def2-SD

```
This would assign the def2-SD ECP according to the definition given in the table above. Without the def2-SD
keyword ORCA would default to def2-ECP.
### **4.4 Numerical Integration in ORCA**

Starting from its version 5.0, ORCA has a new scheme for the quadratures used in numerical integration. It is
based on the same general ideas which were used for the old grids, except that we used machine learning methods,
together with some final hands-on optimization, to find the optimal parameters for all atoms up to the 6th row of
the periodic table, with the 7th row being extrapolated from that. For further details look at Ref. [383]. We also
realized that the COSX and DFT grids have overall different requirements, and these were optimized separately.

The big advantage of this new scheme is that it is significantly more accurate and robust than the old one, even
if having the same number of grid points. We tested energies, geometries, frequencies, excitation energies and
properties to develop three new grid schemes named: DEFGRID1, DEFGRID2 and DEFGRID3, that will automatically fix all grids that are used in the calculations. DEFGRID1 behaves essentially like the old defaults, but

1 Where applicable, reference method and data are given (S: single-valence-electron ion; M: neutral atom; HF: Hartree-Fock; WB: quasirelativistic; DF: relativistic).
2 Corresponds to LANL2 and to LANL1 where LANL2 is unavailable.
3 I: OLD-SD(28,MDF) for compatibility with TURBOMOLE.
4 Au, Hg: OLD-SD(60,MDF) for compatibility with TURBOMOLE.

**4.4. Numerical Integration in ORCA** **47**

**ORCA Manual** **,** **Release 6.0.1**

it is more robust. The second is the new default, and is expected to yield sufficiently small errors for all kinds of
applications (see Section *Details on the numerical integration grids* for details). The last is a heavier, higher-quality
grid, that is close to the limit if one considers an enormous grid as a reference.

In order to change from the default DEFGRID2, one just needs to add !DEFGRID1 or !DEFGRID3 to the main
input.

It is also important to note that the COSX approximation is now the default for DFT, whenever HFexchange is
neede. This can always be turned off by using !NOCOSX.
### **4.5 Input priority and processing order**

In more complicated calculations, the input can get quite involved. Therefore it is worth knowing how it is internally
processed by the program:

  - First, all the simple input lines (starting with “ `!` ”) are collected into a single string.

  - The program looks for all known keywords in a predefined order, regardless of the order in the input file.

  - An exception are basis sets: if two different orbital basis sets (e.g. `! def2-SVP def2-TZVP` ) are given, the
latter takes priority. The same applies to auxiliary basis sets of the same type (e.g. `! def2/J SARC/J` ).

  - Some simple input keywords set multiple internal variables. Therefore, it is possible for one keyword to
overwrite an option, set by another keyword. We have tried to resolve most such cases in a reasonable way
(e.g. the more “specific” keyword should take precedence over a more “general” one) but it is difficult to
forsee every combination of options.

  - Next, the block input is parsed in the order it is given in the input file.

  - Most block input keywords control a single variable (although there are exceptions). If a keyword is duplicated, the latter value is used.

Consider the following (bad) example:



Using the rules above, one can figure out why it is equivalent to this one:



**48** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**
### **4.6 ORCA and Symmetry**

For most of its life, ORCA did not take advantage of molecular symmetry. Starting from version 2.8 (released in
September 2010), there has been at least limited use. On request (using the simple keyword `UseSym` for instance,
see below), the program detects the point group, orients the molecule, cleans up the coordinates and produces
symmetry-adapted molecular orbitals.

Only for geometry cleanup the full point group is taken into account. For all other purposes such as the construction
of symmetry-adapted molecular orbitals and or to describe electronic states, only *𝐷* 2 *ℎ* and subgroups are currently
supported. Here the use of symmetry helps to control the calculation and the interpretation of the results.

**4.6.1 Getting started**

Utilization of symmetry is turned on by the simple keyword `UseSymmetry` (which may be abbreviated by `UseSym` ),
or if a `%Symmetry` (or `%Sym` ) input block is present in the input. ORCA will then automatically determine the point
group, reorient and center the molecule to align its symmetry elements with the coordinate system, and replace the
input structure by a geometry that corresponds exactly to this point group and which minimizes the sum of square
distances between the atoms of both structures.

Any program that attempts to find the point group of an arbitrary atom cluster must be prepared to cope with some
amount of numerical noise in the atom coordinates. ORCA by default allows each atom to deviate at most 10 *[−]* [4]

atomic units from the ideal position that is consistent with the point group being examined. The rationale behind
this value is the rounding error that occurs when the user feeds Cartesian coordinates with five significant digits
after the decimal point into the program which otherwise represent an exact (symmetry-adapted) geometry. A
threshold that is about one order of magnitude higher than the numerical noise in the coordinates is usually very
safe.

If the maximum error in the Cartesian coordinates exceeds these 10 *[−]* [4] atomic units, the symmetry module in ORCA
will fail to recognize the expected point group. The user is strongly advised to always make sure that the detected
point group meets their expectations. If the point group reported by the symmetry module appears to be too low,
the user may try to increase the detection threshold to 10 *[−]* [3] or 10 *[−]* [2] Bohr radii using option `SymThresh` in the
`%Symmetry` input block:
```
%Sym SymThresh 0.01 End

```
A great method to obtain a structure with perfect symmetry avoiding any expensive calculation is to use the simple
keywords `! NoIter XYZFile` with an appropriate threshold. The structure in the resulting file with the extension
`.xyz` may then be used as input for the actual calculation.

To give an illustrative example, coordinates for staggered ethane have been obtained by geometry optimization
*without* using symmetry. If symmetry is turned on, point group *𝐶* *𝑖* is recognized instead of the expected point
group *𝐷* 3 *𝑑* due to the remaining numerical noise. To counter this, the detection threshold is increased to 10 *[−]* [2] a.
u. and a coordinate file with perfect symmetry is produced by the following input:



If ORCA fails to find the expected point group even though a value of 10 *[−]* [2] atomic units has been selected for
`SymThresh`, the user is strongly advised to take a careful look at the structure by means of their favorite visualization
tool before increasing this value any further. Look for any obvious distortions or even missing atoms. An especially

**4.6. ORCA and Symmetry** **49**

**ORCA Manual** **,** **Release 6.0.1**

tricky point may be the orientation of methyl groups or the conformation of floppy side chains. A small rotation
about a single bond may be enough to push some atom positions above the limit. If the conformational deviations
cannot be fixed using a molecular editor or modelling program, a possible alternative may be to pre-optimize
the structure without symmetry using a less expensive method like `PB86` and a small basis set like `def2-SVP` .
Even several passes of pre-optimization and structure editing may be considered until all symmetry-equivalent
side chains are locked in the same conformation so that ORCA finally detects the correct point group.

It is not recommended to run calculations using a value of `SymThresh` which is much too high or much too small
since this may result in some really strange behavior of the symmetry module. Consider for instance the following
input file which contains a perfectly octahedral geometry of a sulfur hexafluoride molecule. Its coordinates may be
easily created by hand by placing the sulfur atom into the origin and two fluorine atoms on each coordinate axis at
equal distances *𝑟* from the origin ( *𝑟* = 1 *.* 56 Å or approximately 2 *.* 95 atomic units). Using a value for `SymThresh`
as large as 0 *.* 1 Bohr radii works fine in this case, resulting in the correct point group O *ℎ* .



However, if `SymThresh` is increased further to *𝑡* = 0 *.* 5 atomic units, the point group detection algorithm breaks
down (strange warnings are printed as a consequence) and the reported point group decreases to C *𝑖* (in which the
center of inversion is the only non-trivial symmetry element). This is because the center of inversion is easy to
detect and this is done by one of the early checks. The breakdown of the point group recognition may be explained
as follows. During the process of point group detection the symmetry module is of course unaware that the given
input geometry is exact. Hence it will be treated as any other input structure. A value of *𝑡* = 0 *.* 5 Bohr radii for
`SymThresh` means that the unknown exact atom position is located within a sphere of radius *𝑡* = 0 *.* 5 atomic units
around the input atom position. The input distance *𝑎* = *√* 2 *𝑟* between two adjacent fluorine atoms is approximately

*𝑎* *≈* 2 *.* 21 Å *≈* 4 *.* 17 a. u., so their unknown exact distance *𝑑* may vary in the following interval (see the diagram in
Fig. 4.1):

*𝑑* min = *𝑎* *−* 2 *𝑡* = 3 *.* 17 a *.* u *. ≤* *𝑑* *≤* *𝑑* max = *𝑎* + 2 *𝑡* = 5 *.* 17 a *.* u *.*

Analogously, the unknown exact distance *𝑑* *[′]* between two opposite fluorine atoms with the input distance *𝑎* *[′]* =
2 *𝑟* = 5 *.* 90 a. u. is:

*𝑑* *[′]* min [=] *[ 𝑎]* *[′]* *[ −]* [2] *[𝑡]* [= 4] *[.]* [90 a] *[.]* [u] *[.][ ≤]* *[𝑑]* *[′]* *[ ≤]* *[𝑑]* *[′]* max [=] *[ 𝑎]* *[′]* [ + 2] *[𝑡]* [= 6] *[.]* [90 a] *[.]* [u] *[.]*

Since the possible intervals of *𝑑* and *𝑑* *[′]* overlap (due to *𝑑* max *> 𝑑* *[′]* min [),] *[ all]* [ fifteen F–F distances are considered]
equal. Since there is no solid with six vertices and fifteen equal inter-vertex distances in three dimensions, the
point group detection algorithm fails.

**50** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 4.1: The relation between the value *𝑡* of `SymThresh`, the distance *𝑎* of some input atom pair, and the allowed
interval [ *𝑑* min *, 𝑑* max ] for the distance *𝑑* between the exact atom positions. This interval has the width *𝑑* max *−𝑑* min =
4 *𝑡* .

**4.6.2 Geometry optimizations using symmetry**

If a geometry optimization is performed with symmetry turned on, ORCA will first determine the point group
of the starting structure and replace the geometry that is presumed to contain numerical noise with one that has
perfect symmetry. Starting with ORCA 6, the optimizer will clean up the gradient at every step of the optimization
if requested by setting option `CleanUpGradient true` in the `%Symmetry` input block. The gradient cleanup is
done by projecting out all components that are not totally symmetric. This way the symmetry of the molecule
cannot decrease during the optimization.

By default, the point group is determined from scratch again after the geometry has been updated at every step of
the optimization. This behaviour may be switched off by setting option `SymRelaxOpt false` in the `%Symmetry`
input block. In this case the point group of the molecule is actually frozen during the entire optimization.

The following table summarizes the behaviour of the optimizer depending on the options `SymRelaxOpt` and
`CleanUpGradient` :

Setting both switches `false` would allow the point group to change during the optimization but at the same time,
a change would be impossible to detect. Therefore this setting is strongly discouraged.

**4.6. ORCA and Symmetry** **51**

**ORCA Manual** **,** **Release 6.0.1**

**4.6.3 Default alignment of the symmetry elements with the coordinate system**

If ORCA determines the point group of a molecule and the user has not selected any special options, the following principles apply to the manner in which the symmetry elements of the full point group are aligned with the
coordinate system:

1. The center of mass of the molecule will be shifted into the origin by default. [5] If the point group leaves one
*unique* vertex invariant to all symmetry operations, the center of mass agrees with this vertex. This is the
case for all point groups except *𝐶* *𝑠*, *𝐶* *𝑛* ( *𝑛* *≥* 1), *𝐶* *𝑛𝑣* ( *𝑛* *≥* 2), and *𝐶* *∞𝑣* .

2. If the molecule exhibits a unique axis of symmetry with the highest number of positions, this axis will become
the *𝑧* axis. This applies to all point groups except *𝐶* 1, *𝐶* *𝑖*, *𝐶* *𝑠*, *𝐷* 2, *𝐷* 2 *ℎ*, the cubic point groups, and *𝐾* *ℎ* .

3. For point group *𝐶* *𝑠*, the mirror plane will become the *𝑥𝑦* plane.

4. For point groups *𝐶* *𝑛𝑣* ( *𝑛* *≥* 2), one of the vertical mirror planes will become the *𝑥𝑧* plane.

5. For point groups *𝐷* *𝑛* ( *𝑛* *≥* 3), *𝐷* *𝑛ℎ* ( *𝑛* *≥* 3), and *𝐷* *𝑛𝑑* ( *𝑛* *≥* 2), one of the two-fold rotation axes perpendicular to the axis with the highest number of positions will become the *𝑥* axis.

6. For point groups *𝐷* 2, *𝐷* 2 *ℎ*, *𝑇*, and *𝑇* *ℎ*, the three mutually orthogonal *𝐶* 2 axes will become the coordinate

axes.

7. For point groups *𝑇* *𝑑*, *𝑂*, and *𝑂* *ℎ*, the three mutually orthogonal four-fold rotation or rotation-reflection axes
will become the coordinate axes.

8. Finally, for point groups *𝐼* and *𝐼* *ℎ*, one of the five sets of three mutually orthogonal *𝐶* 2 axes will become the
coordinate axes. The pair of *𝐶* 5 or *𝑆* 10 axes closest to the *𝑧* axis will be located in the *𝑦𝑧* plane.

9. In general the orientation of the molecule will be changed as little as possible to meet the criteria above. If
the input geometry meets these criteria already, the molecule will not be moved or rotated at all.

If the point group of the system is *𝐷* *𝑛𝑑* with *𝑛* *≥* 2 or *𝑇* *𝑑* and the user has selected subgroup *𝐶* 2 *𝑣* using option
`PreferC2v`, the following rules apply instead:

  - For point group *𝐷* *𝑛𝑑* with *𝑛* *≥* 2, one of the diagonal mirror planes will become the *𝑥𝑧* plane.

  - For point group *𝑇* *𝑑*, one of the diagonal mirror planes containing the *𝑧* axis will become the *𝑥𝑧* plane, i. e.
the molecule will be rotated by 45 degrees about the *𝑧* axis compared to the default orientation.

Table 4.4 gives an overview over all point groups and the way in which the symmetry elements of the reduced point
group (the largest common subgroup of *𝐷* 2 *ℎ* ) are aligned with the coordinate system.

Table 4.4: Point groups and corresponding subgroups suitable for electronic-structure calculations.

continues on next page

5 In the very special case that the Z matrix contains no atoms with mass, the geometric center will be used instead.

**52** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**

Table 4.4 – continued from p revious p a g e

**4.6.4 Irreducible representations of** *𝐷* 2 *ℎ* **and subgroups**

Table 4.5, Table 4.6, and Table 4.7 contain lists of the irreducible representations (also called species) and the
corresponding characters of the point groups supported for electronic structure calculations in ORCA, and the
product tables of these irreducible representations. Where the data depends on the alignment of the symmetry
elements with the coordinate system, Mulliken’s recommendations [600] are followed. This approach is in line
with the recommendations by the IUPAC [771].

Table 4.5: Species and species product table of point group *𝐶* 2 *𝑣* . The species table for *𝐶* 2 *𝑣* corresponds to Table
III in [600]. The directions of the two-fold axis and the mirror planes in each column are related to each other by
cyclic permutations.



|Col1|𝐶<br>2𝑣|𝐶 (𝑧) 𝜎 (𝑥𝑧) 𝜎 (𝑦𝑧)<br>2 𝑣 𝑣<br>𝐸 𝐶 (𝑥) 𝜎 (𝑥𝑦) 𝜎 (𝑥𝑧)<br>2 𝑣 𝑣<br>𝐶 (𝑦) 𝜎 (𝑦𝑧) 𝜎 (𝑥𝑦)<br>2 𝑣 𝑣|× 𝐴 𝐴 𝐵 𝐵<br>1 2 1 2<br>𝐴 𝐴 𝐴 𝐵 𝐵<br>1 1 2 1 2<br>𝐴 𝐴 𝐴 𝐵 𝐵<br>2 2 1 2 1<br>𝐵 𝐵 𝐵 𝐴 𝐴<br>1 1 2 1 2<br>𝐵 𝐵 𝐵 𝐴 𝐴<br>2 2 1 2 1|
|---|---|---|---|
||𝐴<br>1<br>𝐴<br>2<br>𝐵<br>1<br>𝐵<br>2|+1 +1 +1 +1<br>+1 +1 −1 −1<br>+1 −1 +1 −1<br>+1 −1 −1 +1|+1 +1 +1 +1<br>+1 +1 −1 −1<br>+1 −1 +1 −1<br>+1 −1 −1 +1|

|×|𝐴 𝐴 𝐵 𝐵<br>1 2 1 2|
|---|---|
|𝐴<br>1<br>𝐴<br>2<br>𝐵<br>1<br>𝐵<br>2|𝐴 𝐴 𝐵 𝐵<br>1 2 1 2<br>𝐴 𝐴 𝐵 𝐵<br>2 1 2 1<br>𝐵 𝐵 𝐴 𝐴<br>1 2 1 2<br>𝐵 𝐵 𝐴 𝐴<br>2 1 2 1|


Table 4.6: Species and species product table of point group *𝐷* 2 . The species table for *𝐷* 2 has been obtained by
dropping the center of inversion and the mirror planes from the species table for *𝐷* 2 *ℎ* (see Table 4.7).



|Col1|𝐷<br>2|𝐸 𝐶 (𝑧) 𝐶 (𝑦) 𝐶 (𝑥)<br>2 2 2|Col4|×|𝐴 𝐵 𝐵 𝐵<br>1 2 3|Col7|
|---|---|---|---|---|---|---|
||𝐴<br>𝐵<br>1<br>𝐵<br>2<br>𝐵<br>3|+1 +1 +1 +1<br>+1 +1 −1 −1<br>+1 −1 +1 −1<br>+1 −1 −1 +1|+1 +1 +1 +1<br>+1 +1 −1 −1<br>+1 −1 +1 −1<br>+1 −1 −1 +1|𝐴<br>𝐵<br>1<br>𝐵<br>2<br>𝐵<br>3|𝐴 𝐵 𝐵 𝐵<br>1 2 3<br>𝐵 𝐴 𝐵 𝐵<br>1 3 2<br>𝐵 𝐵 𝐴 𝐵<br>2 3 1<br>𝐵 𝐵 𝐵 𝐴<br>3 2 1|𝐴 𝐵 𝐵 𝐵<br>1 2 3<br>𝐵 𝐴 𝐵 𝐵<br>1 3 2<br>𝐵 𝐵 𝐴 𝐵<br>2 3 1<br>𝐵 𝐵 𝐵 𝐴<br>3 2 1|


6 A center of inversion is denoted *𝑖* . “yes” indicates the existence of a *unique* vertex that remains invariant to all symmetry operations of
the point group.
7 This column indicates whether the given point group may be the *full* point group of a planar molecule.
8 This column contains the elements (axes or planes) of the coordinate system that coincide with the symmetry elements of the reduced
point group (the largest common subgroup of the full point group and *𝐷* 2 *ℎ* ) by *default* . If the full point group contains a unique principle axis
of symmetry (with the highest number of positions), this axis is presumed to coincide with the *𝑧* axis.

**4.6. ORCA and Symmetry** **53**

**ORCA Manual** **,** **Release 6.0.1**

Table 4.7: Species and species product table of point group *𝐷* 2 *ℎ* . The species table for *𝐷* 2 *ℎ* corresponds to Table
IV in [600].


|𝐷<br>2ℎ|𝐸 𝐶 (𝑧) 𝐶 (𝑦) 𝐶 (𝑥) 𝑖 𝜎(𝑥𝑦) 𝜎(𝑥𝑧) 𝜎(𝑦𝑧)<br>2 2 2|
|---|---|
|𝐴<br>𝑔<br>𝐵<br>1𝑔<br>𝐵<br>2𝑔<br>𝐵<br>3𝑔<br>𝐴<br>𝑢<br>𝐵<br>1𝑢<br>𝐵<br>2𝑢<br>𝐵<br>3𝑢|+1 +1 +1 +1 +1 +1 +1 +1<br>+1 +1 −1 −1 +1 +1 −1 −1<br>+1 −1 +1 −1 +1 −1 +1 −1<br>+1 −1 −1 +1 +1 −1 −1 +1<br>+1 +1 +1 +1 −1 −1 −1 −1<br>+1 +1 −1 −1 −1 −1 +1 +1<br>+1 −1 +1 −1 −1 +1 −1 +1<br>+1 −1 −1 +1 −1 +1 +1 −1|

|×|𝐴 𝐵 𝐵 𝐵 𝐴 𝐵 𝐵 𝐵<br>𝑔 1𝑔 2𝑔 3𝑔 𝑢 1𝑢 2𝑢 3𝑢|
|---|---|
|𝐴<br>𝑔<br>𝐵<br>1𝑔<br>𝐵<br>2𝑔<br>𝐵<br>3𝑔<br>𝐴<br>𝑢<br>𝐵<br>1𝑢<br>𝐵<br>2𝑢<br>𝐵<br>3𝑢|𝐴 𝐵 𝐵 𝐵 𝐴 𝐵 𝐵 𝐵<br>𝑔 1𝑔 2𝑔 3𝑔 𝑢 1𝑢 2𝑢 3𝑢<br>𝐵 𝐴 𝐵 𝐵 𝐵 𝐴 𝐵 𝐵<br>1𝑔 𝑔 3𝑔 2𝑔 1𝑢 𝑢 3𝑢 2𝑢<br>𝐵 𝐵 𝐴 𝐵 𝐵 𝐵 𝐴 𝐵<br>2𝑔 3𝑔 𝑔 1𝑔 2𝑢 3𝑢 𝑢 1𝑢<br>𝐵 𝐵 𝐵 𝐴 𝐵 𝐵 𝐵 𝐴<br>3𝑔 2𝑔 1𝑔 𝑔 3𝑢 2𝑢 1𝑢 𝑢<br>𝐴 𝐵 𝐵 𝐵 𝐴 𝐵 𝐵 𝐵<br>𝑢 1𝑢 2𝑢 3𝑢 𝑔 1𝑔 2𝑔 3𝑔<br>𝐵 𝐴 𝐵 𝐵 𝐵 𝐴 𝐵 𝐵<br>1𝑢 𝑢 3𝑢 2𝑢 1𝑔 𝑔 3𝑔 2𝑢<br>𝐵 𝐵 𝐴 𝐵 𝐵 𝐵 𝐴 𝐵<br>2𝑢 3𝑢 𝑢 1𝑢 2𝑔 3𝑔 𝑔 1𝑢<br>𝐵 𝐵 𝐵 𝐴 𝐵 𝐵 𝐵 𝐴<br>3𝑢 2𝑢 1𝑢 𝑢 3𝑔 2𝑔 1𝑔 𝑔|


**4.6.5 Options available in the** `%Symmetry` **input block**

Table 4.8 contains a list of the options available in the `%Symmetry` (or `%Sym` ) input block. Options `SymThresh`
and `SymRelax` (same as `SymRelaxSCF` below) can also be accessed in the `%Method` input block for backward
compatibility. This use is deprecated and not recommended in new input files, however.

Table 4.8: List of options in the `%Symmetry` ( `%Sym` ) input block

continues on next page

**54** **Chapter 4. General Structure of the Input File**

**ORCA Manual** **,** **Release 6.0.1**

Table 4.8 – continued from p revious p a g e
### **4.7 Jobs with Multiple Steps**

ORCA supports input files with multiple jobs. This feature is designed to simplify series of closely related calculations on the same molecule or calculations on different molecules. The objectives for implementing this feature
include:

  - Calculate of a molecular property using different theoretical methods and/or basis sets for one molecule.

  - Calculations on a series of molecules with identical settings.

  - Geometry optimization followed by more accurate single points and perhaps property calculations.

  - Crude calculations to provide good starting orbitals that may then be used for subsequent calculations with
larger basis sets.

For example consider the following job that in the first step computes the g-tensor of BO at the LDA level, and in
the second step using the BP86 functional.

(continues on next page)

**4.7. Jobs with Multiple Steps** **55**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



What happens if you use the `$new_job` feature is that all calculation flags for the actual job are transferred from
the previous job and that only the changes in the settings must be input by the user. Thus if you turn on some flags
for one calculation that you do not want for the next, you have to turn them off again yourself (for example the use
of the RI approximation)! In addition, the default is that the new job takes the orbitals from the old job as input. If
you do not want this you have to overwrite this default by specifying your desired guess explicitly.

**4.7.1 Changing the default BaseName**

Normally the output files for `MyJob.inp` are returned in `MyJob.xxx` (any xxx, for example xxx=out). Sometimes,
and in particular in multistep jobs, you will want to change this behavior. To this end there is the variable `%base` that
can be user controlled. All filenames (also scratch files) will then be based on this default name. For example, using
the following setting, the output files for the current job would be `job1.xxx` (e.g. `job1.gbw`, `job1.densities`,
etc.).
```
%base "job1"

```
**56** **Chapter 4. General Structure of the Input File**

**CHAPTER**