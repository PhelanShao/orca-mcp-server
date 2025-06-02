### **SIX** **RUNNING TYPICAL CALCULATIONS**

Before entering the detailed documentation of the various features of ORCA it is instructive to provide a chapter that
shows how “typical” tasks may be performed. This should make it easier for the user to get started on the program
and not get lost in the details of how-to-do-this or how-to-do-that. We hope that the examples are reasonably

intuitive.
### **6.1 Single Point Energies and Gradients**

**6.1.1 Hartree-Fock**

**Standard Single Points**

In general single point calculations are fairly easy to run. What is required is the input of a method, a basis set
and a geometry. For example, in order run a single point Hartree-Fock calculation on the CO molecule with the
DEF2-SVP basis set type:



As an example consider this simple calculation on the cyclohexane molecule that may serve as a prototype for this
type of calculation.



(continues on next page)

**61**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

**Basis Set Options**

There is extensive flexibility in the specification of basis sets in ORCA. First of all, you are not only restricted to the
basis sets that are built in ORCA, but can also read basis set definitions from files. In addition there is a convenient
way to change basis sets on certain types of atoms or on individual atoms. Consider the following example:



In this example the basis set is initialized as the Ahlrichs split valence basis. Then the basis set on all atoms of type
Cl is changed to `SVP` and finally the basis set for only the copper atom is changed to the more accurate `TZVPP` set.
In this way you could treat different atom types or even individual groups in a molecule according to the desired
accuracy. Similar functionality regarding per-element or per-atom assignments exists for effective core potentials.
More details are provided in section *Choice of Basis Set* .

Sometimes you will like to change the ordering of the starting orbitals to obtain a different electronic state in the
SCF calculation. For example, if we take the last input and want to converge to a ligand field excited state this can
be achieved by:



In the present case, MO 48 is the spin-down HOMO and MO49 the spin-down LUMO. Since we do a calculation
on a Cu(II) complex (d [9] electron configuration) the beta LUMO corresponds with the “SOMO”. Thus, by changing
the SOMO we proceed to a different electronic state (in this case the one with the “hole” in the “d *𝑥𝑦* ” orbital instead
of the “d *𝑥* 2 *−𝑦* 2 ” orbital). The interchange of the initial guess MOs is achieved by the command `rotate {48, 49,`
`90, 1, 1}` end. What this does is the following: take the initial guess MOs 48 and 49 and rotate them by an angle
of 90 degree (this just interchanges them). The two last numbers mean that both orbitals are from the spin-down
set. For RHF or ROHF calculations the operator would be 0. In general you would probably first take a look at the
initial guess orbitals before changing them.

**62** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**SCF and Symmetry**

Upon request, the SCF program produces symmetry adapted orbitals. This can help to converge the SCF on specific
excited states of a given symmetry. Take for example the cation H 2 O [+] : We first run the simple job:


The program will recognize the C 2 *𝑣* symmetry and adapt the orbitals to this:




(continues on next page)

**6.1. Single Point Energies and Gradients** **63**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



The initial guess in the SCF program will then recognize and freeze the occupation numbers in each irreducible
representation of the C 2 *𝑣* point group.



The calculation converges smoothly to
```
Total Energy : -75.56349710 Eh -2056.18729 eV

```
With the final orbitals being:



Suppose now that we want to converge on an excited state formed by flipping the spin-beta HOMO and LUMO
that have different symmetries.

**64** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**



The program now finds:



And converges smoothly to
```
Total Energy : -75.48231924 Eh -2053.97833 eV

```
Which is obviously an excited state of the H 2 O [+] molecule. In this situation (and in many others) it is an advantage
to have symmetry adapted orbitals.

**SymRelax.** Sometimes, one may want to obtain the ground state of a system but due to a particularly bad initial
guess, the calculation converges to an excited state. In such cases, the following option can be used:



This will allow the occupation numbers in each irreducible representation to change if and only if a virtual orbital
has a lower energy than an occupied one. Hence, nothing will change for the excited state of H 2 O [+] discussed
above. However, the following calculation



which converges to a high-lying excited state:



(continues on next page)

**6.1. Single Point Energies and Gradients** **65**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



would revert to the ground state with the `SymRelax` option.

**SCF and Memory**

As the SCF module cannot restrict its use of memory to MaxCore we introduced an estimation of the expected
memory consumption. If the memory needed is larger than MaxCore ORCA will abort.

To check, if a certain job can be run with a given amount of MaxCore, you can ask for the estimation of memory
requirements by



ORCA will finish execution after having printed the estimated amount of memory needed.

If you want to run the calculation (if doable), and only are interested in the estimated memory consumption, you
can ask for the printing via



**Note:** The estimation is given per process. If you want to run a parallel job, you will need the estimated memory
*×* number of parallel processes.

**6.1.2 MP2**

**MP2 and RI-MP2 Energies**

You can do conventional or integral direct MP2 calculations for RHF, UHF or high-spin ROHF reference wavefunctions. MP3 functionality is not implemented as part of the MP2 module, but can be accessed through the
MDCI module. Analytic gradients are available for RHF and UHF. The analytic MP2-Hessians have been deprecated with ORCA-6.0. The frozen core approximation is used by default. For RI-MP2 the *⟨𝑆* [ˆ] [2] *⟩* expectation value
is computed in the unrestricted case according to [531]. An extensive coverage of MP2 exists in the literature.[96,
187, 258, 359, 370, 450, 473, 495, 576, 694, 737, 840, 882, 883]



(continues on next page)

**66** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

**Note:** There are two algorithms for MP2 calculations without the RI approximation. The first one uses main
memory as much as possible. The second one uses more disk space and is usually faster (in particular, if you run
the calculations in single precision using `! FLOAT, UCFLOAT or CFLOAT` ). The memory algorithm is used by
specifying `Q1Opt >0` in the `%mp2` block whereas the disk based algorithm is the default or specified by `Q1Opt =`
`-1` . Gradients are presently only available for the memory based algorithm.

The RI approximation to MP2[96, 258, 882, 883] is fairly easy to use, too. It results in a tremendous speedup of
the calculation, while errors in energy differences are very small. For example, consider the same calculation as
before:



Generally, the RI approximation can be switched on by setting `RI true` in the `%mp2` block. Specification of an
appropriate auxiliary basis set (“/C”) for correlated calculations is required. Note that if the RIJCOSX method
(section *Hartree–Fock and Hybrid DFT Calculations with RIJCOSX* ) or the RI-JK method (section *Hartree–Fock*
*and Hybrid DFT Calculations with RI-JK* ) is used to accelerate the SCF calculation, then two basis sets should be
specified: firstly the appropriate Coulomb (“/J”) or exchange fitting set (“/JK”), and secondly the correlation fitting
set (“/C”), as shown in the example below.

The MP2 module can also do Grimme’s spin-component scaled MP2 [318]. It is a semi-empirical modification
of MP2 which applies different scaling factors to same-spin and opposite-spin components of the MP2 energy.
Typically it gives fairly bit better results than MP2 itself.



(continues on next page)

**6.1. Single Point Energies and Gradients** **67**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

Energy differences with SCS-MP2 appear to be much better than with MP2 itself according to Grimme’s detailed evaluation study. For the sake of efficiency, it is beneficial to make use of the RI approximation using the
`RI-SCS-MP2` keyword. The opposite-spin and same-spin scaling factors can be modified using `PS` and `PT` in the
`%mp2` block, respectively. By default, `PS` = 6 */* 5 and `PT` = 1 */* 3.

NOTE

  - In very large RI-MP2 runs you can cut down the amount of main memory used by a factor of two if you use
the keyword `! FLOAT` . This is more important in gradient runs than in single point runs. Deviations from
double precision values for energies and gradients should be in the *𝜇* Eh and sub- *𝜇* Eh range. However, we
have met cases where this option introduced a large and unacceptable error, in particular in transition metal
calculations. You are therefore advised to be careful and check things out beforehand.

A word of caution is due regarding MP2 calculations with a linearly dependent basis. This can happen, for example,
with very diffuse basis sets (see *Linear Dependence* for more information). If some vectors were removed from
the basis in the SCF procedure, those redundant vectors are still present as “virtual” functions with a zero orbital
energy in the MP2 calculation. When the number of redundant vectors is small, this is often not critical (and when
their number is large, one should probably use a different basis). However, it is better to avoid linearly dependent
basis sets in MP2 calculations whenever possible. Moreover, in such a situation the orbitals should not be read
with the `MORead` and `NoIter` keywords, as that is going to produce wrong results!

**Frozen Core Options**

In MP2 energy and gradient runs the Frozen Core (FC) approximation is applied by default. This implies that the
core electrons are not included in the perturbation treatment, since the inclusion of dynamic correlation in the core
electrons usually effects relative energies or geometry parameters insignificantly.

The frozen core option can be switched on or off with `FrozenCore` or `NoFrozenCore` in the simple input line.
Furthermore, frozen orbitals can be selected by means of an energy window:



More information and the different options can be found in section *Frozen Core Options*

**Orbital Optimized MP2 Methods**

By making the Hylleraas functional stationary with respect to the orbital rotations one obtains the orbital-optimized
MP2 method that is implemented in ORCA in combination with the RI approximation (OO-RI-MP2). One obtains
from these calculations orbitals that are adjusted to the dynamic correlation field at the level of second order manybody perturbation theory. Also, the total energy of the OO-RI-MP2 method is lower than that of the RI-MP2
method itself. One might think of this method as a special form of multiconfigurational SCF theory except for the
fact that the Hamiltonian is divided into a 0 [th] order term and a perturbation.

The main benefit of the OO-RI-MP2 method is that it “repairs” the poor Hartree–Fock orbitals to some extent
which should be particularly beneficial for systems which suffer from the imbalance in the Hartree-Fock treatment
of the Coulomb and the Exchange hole. Based on the experience gained so far, the OO-RI-MP2 method is no better
than RI-MP2 itself for the thermochemistry of organic molecules. However, for reactions barriers and radicals the

**68** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

benefits of OO-MP2 over MP2 are substantial. This is particularly true with respect to the spin-component scaled
variant of OO-RI-MP2 that is OO-RI-SCS-MP2. Furthermore, the OO-RI-MP2 method substantially reduces the
spin contamination in UHF calculations on radicals.

Since every iteration of the OO-MP2 method is as expensive as a RI-MP2 relaxed density calculation, the computational cost is much higher than for RI-MP2 itself. One should estimate about a factor of 10 increase in computational time with respect to the RI-MP2 time of a normal calculation. This may still be feasible for calculations in
the range of 1000–2000 basis functions (the upper limit, however, implies very significant computational costs). A
full assessment of the orbital optimized MP2 method has been published.[621]

OO-RI-MP2 is triggered either with `! OO-RI-MP2` or `! OO-RI-SCS-MP2` (with spin component scaling) in the
simple input line or by `OrbOpt true` in the `%mp2` block. The method comes with the following new variables:



The solver is a simple DIIS type scheme with additional level shifting. We have found that it is not really beneficial
to first converge the Hartree-Fock equations. Thus it is sensible to additionally use the keyword `! noiter` in order
to turn off the standard Hartree-Fock SCF process before entering the orbital optimizations.

The OO-RI-MP2 method is implemented for RHF and UHF reference wavefunctions. Analytic gradients are available.

The density does not need to be requested separately in OO-RI-MP2 calculations because it is automatically calculated. Also, there is no distinction between relaxed and unrelaxed densities because the OO-RI-MP2 energy is fully
stationary with respect to all wavefunction parameters and hence the unrelaxed and relaxed densities coincide.

**MP2 and RI-MP2 Gradients**

Geometry optimization with MP2, RI-MP2, SCS-MP2 and RI-SCS-MP2 proceeds just as with any SCF method.
With frozen core orbitals, second derivatives of any kind are currently only available numerically. The RIJCOSX
approximation (section *Hartree–Fock and Hybrid DFT Calculations with RIJCOSX* ) is supported in RI-MP2 and
hence also in double-hybrid DFT gradient runs (it is in fact the default for double-hybrid DFT since ORCA 5.0).
This leads to large speedups in larger calculations, particularly if the basis sets are accurate.



This job results in:



(continues on next page)

**6.1. Single Point Energies and Gradients** **69**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

Just to demonstrate the accuracy of RI-MP2, here is the result with RI-SCS-MP2 instead of SCS-MP2, with the
addition of def2-TZVP/C:

You see that *nothing* is lost in the optimized geometry through the RI approximation thanks to the efficient and
accurate RI-auxiliary basis sets of the Karlsruhe group (in general the deviations in the geometries between standard
MP2 and RI-MP2 are very small). Thus, RI-MP2 really is a substantial improvement in efficiency over standard
MP2.

Geometric gradients can be calculated with RI-MP2 in conjunction with the RIJCOSX method. They are called the
same way as with a conventional SCF wave function, for example to perform a geometry optimization with tight
convergence parameters: (Please note that you have to switch on NumFreq for the MP2-Hessian, as the analytical
(RI-)MP2-Hessians are no longer available).



**MP2 Properties, Densities and Natural Orbitals**

The MP2 method can be used to calculate electric and magnetic properties such as dipole moments, polarizabilities,
hyperfine couplings, g-tensors or NMR chemical shielding tensors. For this purpose, the appropriate MP2 density
needs to be requested - otherwise the properties are calculated using the SCF density!

Two types of densities can be constructed - an “unrelaxed” density (which basically corresponds to the MP2 expectation value density) and a “relaxed” density which incorporates orbital relaxation. For both sets of densities a
population analysis is printed if the SCF calculation also requested this population analysis. These two densities
are stored as `JobName.pmp2ur.tmp` and `JobName.pmp2re.tmp`, respectively. For the open shell case case the
corresponding spin densities are also constructed and stored as `JobName.rmp2ur.tmp` and `JobName.rmp2re.`

`tmp` .

In addition to the density options, the user has the ability to construct MP2 natural orbitals. If relaxed densities are
available, the program uses the relaxed densities and otherwise the unrelaxed ones. The natural orbitals are stored
as `JobName.mp2nat` which is a GBW type file that can be read as input for other jobs (for example, it is sensible
to start CASSCF calculations from MP2 natural orbitals). The density construction can be controlled separately in
the input file (even without running a gradient or optimization) by:

**70** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**



Below is a calculation of the dipole and quadrupole moments of a water molecule:



Another example is a simple g-tensor calculation with MP2:



NMR chemical shielding as well as g-tensor calculations with GIAOs are only available for RI-MP2. The input for
NMR chemical shielding looks as follows:



Note that by default core electrons are not correlated unless the `NoFrozenCore` keyword is present.

For details, see sections *The Second Order Many Body Pertubation Theory Module (MP2)* and *MP2 level magnetic*
*properties* .

**6.1. Single Point Energies and Gradients** **71**

**ORCA Manual** **,** **Release 6.0.1**

**Explicitly correlated MP2 calculations**

ORCA features an efficient explicit correlation module that is available for MP2 and coupled-cluster calculations
(section *Explicitly Correlated MP2 and CCSD(T) Calculations* ). It is described below in the context of coupledcluster calculations.

**Local MP2 calculations**

Purely domain-based local MP2 methodology dates back to Pulay and has been developed further by Werner,
Schütz and co-workers. ORCA features a local MP2 method (DLPNO-MP2) that combines the ideas of domains
and local pair natural orbitals, so that RI-MP2 energies are reproduced efficiently to within chemical accuracy.
Due to the intricate connections with other DLPNO methods, reading of the sections *Local Coupled Pair and*
*Coupled-Cluster Calculations* and and *Local correlation* is recommended. A full description of the method for
RHF reference wave functions has been published.[685]

Since DLPNO-MP2 employs an auxiliary basis set to evaluate integrals, its energies converge systematically to
RI-MP2 as thresholds are tightened. The computational effort of DLPNO-MP2 with default settings is usually
comparable with or less than that of a Hartree-Fock calculation. However, for small and medium-sized molecules,
RI-MP2 is even faster than DLPNO-MP2.

Calculations on open-shell systems are supported through a UHF treatment. While most approximations are consistent between the RHF and UHF versions, this is not true for the PNO spaces. **DLPNO-MP2 gives different**
**energies for closed-shell molecules in the RHF and UHF formalisms. When calculating reaction energies or**
**other energy differences involving open-shell species, energies of closed-shell species must also be calculated**
**with UHF-DLPNO-MP2, and not with RHF-DLPNO-MP2.** As for canonical MP2, ROHF reference wave functions are subject to an ROMP2 treatment through the UHF machinery. It is not consistent with the RHF version of
DLPNO-MP2, unlike in the case of RHF-/ROHF-DLPNO-CCSD.

Input for DLPNO-MP2 requires little specification from the user:



Noteworthy aspects of the DLPNO-MP2 method:

  - Both DLPNO-CCSD(T) and DLPNO-MP2 are linear-scaling methods (albeit the former has a larger prefactor). This means that if a DLPNO-MP2 calculation can be performed, DLPNO-CCSD(T) is often going
to be within reach, too. However, CCSD(T) is generally much more accurate than MP2 and thus should be
given preference.

  - A correlation fitting set must be provided, as the method makes use of the RI approximation.

  - Canonical RI-MP2 energy differences are typically reproduced to within a fraction of 1 kcal/mol. The default
thresholds have been chosen so as to reproduce about 99 *.* 9 % of the total RI-MP2 correlation energy.

  - The preferred way to control the accuracy of the method is by means of specifying “LoosePNO”, “NormalPNO” and “TightPNO” keywords. “NormalPNO” corresponds to default settings and does not need to
be given explicitly. More details and an exhaustive list of input parameters are provided in section *Local*
*MP2* . Note that the thresholds differ from DLPNO coupled cluster.

**72** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

  - Results obtained from RI-MP2 and DLPNO-MP2, or from DLPNO-MP2 with different accuracy settings,
must never be mixed, such as when computing energy differences. In calculations involving open-shell
species, even the closed-shell molecules need to be subject to a UHF treatment.

  - Spin-component scaled DLPNO-MP2 calculations are invoked by using the `! DLPNO-SCS-MP2` keyword
instead of `! DLPNO-MP2` in the simple input line. Weights for same-spin and opposite-spin contributions
can be adjusted as described for the canonical SCS-MP2 method. Likewise, there is a `DLPNO-SOS-MP2`
keyword to set the parameters defined by the SOS-MP2 method (but there is no Laplace transformation
involved).

  - The frozen core approximation is used by default. If core orbitals are involved in the calculation, they are
subject to the treatment described in section *Local MP2* .

  - Calculations can be performed in parallel.

  - It may be beneficial to accelerate the Hartree-Fock calculation by means of the RIJCOSX method (requiring
specification of a second auxiliary set).

Explicit correlation has been implemented in the DLPNO-MP2-F12 methodology for RHF reference wave functions.[654] The available approaches are C (keyword `! DLPNO-MP2-F12` ) and the somewhat more approximate
D (keyword `! DLPNO-MP2-F12/D` ). Approach D is generally recommended as it results in a significant speedup
while leading only to small errors relative to approach C. In addition to the MO and correlation fitting sets, a CABS
basis set is also required for both F12 approaches as shown below.


**Local MP2 derivatives**

Analytical gradients and the response density are available for the RHF variant of the DLPNO-MP2 method.[686,
687] Usage is as simple as that of RI-MP2. For example, the following input calculates the gradient and the natural
orbitals:



The implementation supports spin-component scaling and can be used together with double-hybrid density functionals. The latter are invoked with the name of the functional preceded by “ `DLPNO-` ”. A simple geometry optimization with a double-hybrid density functional is illustrated in the example below:



**6.1. Single Point Energies and Gradients** **73**

**ORCA Manual** **,** **Release 6.0.1**

For smaller systems, the performance difference between DLPNO-MP2 and RI-MP2 is not particularly large, but
very substantial savings in computational time over RI-MP2 can be achieved for systems containing more than
approximately 70-80 atoms.

Since MP2 is an expensive method for geometry optimizations, it is generally a good idea to use well-optimized
starting structures (calculated, for example, with a dispersion-corrected DFT functional). Moreover, it is highly
advisable to employ accurate Grids for RIJCOSX or the exchange-correlation functional (if applicable), as the SCF
iterations account only for a fraction of the overall computational cost. If calculating calculating properties without
requesting the gradient, `Density Relaxed` needs to be specified in the `%MP2-block` .

Only the Foster-Boys localization scheme is presently supported by the derivatives implementation. The default localizer in DLPNO-MP2 is `AHFB`, and changing this setting is strongly discouraged, since tightly converged localized
orbitals are necessary to calculate the gradient.

**Analytical second derivatives** for closed-shell DLPNO-MP2 are available for the calculation of NMR shielding
and static polarizability tensors.[827] The implementation supports spin-component scaling and double-hybrid
functionals. Errors in the calculated properties are well below 0.5% when `NormalPNO` thresholds are used. Refer to section *Local MP2 Response Properties* for more information about the DLPNO-MP2 second derivatives
implementation, as well as to the sections on electric ( *Electric Properties* ) and magnetic ( *EPR and NMR proper-*
*ties* ) properties and CP-SCF settings ( *CP-SCF Options* ). Below is an example for a simple DLPNO-MP2 NMR
shielding calculation:



**6.1.3 Coupled-Cluster and Coupled-Pair Methods**

**Basics**

The coupled-cluster method is presently available for RHF and UHF references. The implementation is fairly
efficient and suitable for large-scale calculations. The most elementary use of this module is fairly simple.



(continues on next page)

**74** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



**Note:**

  - The same FrozenCore options as for MP2 are applied in the MDCI module.

  - Since ORCA 4.2, an additional term, called “4th-order doubles-triples correction” is considered in open-shell
CCSD(T). To reproduce previous results, one should use a keyword,



The computational effort for these methods is high — O(N [6] ) for all methods and O(N [7] ) if the triples correction
is to be computed (calculations based on an unrestricted determinant are roughly 3 times more expensive than
closed-shell calculations and approximately six times more expensive if triple excitations are to be calculated).
This restricts the calculations somewhat: on presently available PCs 300–400 basis functions are feasible and if
you are patient and stretch it to the limit it may be possible to go up to 500–600; if not too many electrons are
correlated maybe even up to 800–900 basis functions (when using AO-direct methods).

**Tip:**

  - For calculations on small molecules and large basis sets the MO-METHOD option is usually the most efficient; say perhaps up to about 300 basis functions. For integral conventional runs, the AO-METHOD may
even more efficient.

  - For large calculations (>300 basis functions) the AO-METHOD option is a good choice. If, however, you use
very deeply contracted basis sets such as ANOs these calculations should be run in the integral conventional
mode.

  - AOX-METHOD is usually slightly less efficient than MO-METHOD or AO-METHOD.

  - RI-METHOD is seldom the most efficient choice. If the integral transformation time is an issue than you
can select `%mdci trafotype trafo_ri` or choose RI-METHOD and then `%mdci kcopt kc_ao` .

  - Regarding the singles Fock keywords (RCSinglesFock, etc.), the program usually decides which method to
use to evaluate the singles Fock term. For more details on the nature of this term, and options related to its
evaluation, see *The singles Fock term* .

To put this into perspective, consider a calculation on serine with the cc-pVDZ basis set — a basis on the lower end
of what is suitable for a highly correlated calculation. The time required to solve the equations is listed in Table
6.1. We can draw the following conclusions:

  - As long as one can store the integrals and the I/O system of the computer is not the bottleneck, the most
efficient way to do coupled-cluster type calculations is usually to go via the full transformation (it scales as
O(N [5] ) whereas the later steps scale as O(N [6] ) and O(N [7] ) respectively).

**6.1. Single Point Energies and Gradients** **75**

**ORCA Manual** **,** **Release 6.0.1**

  - AO-based coupled-cluster calculations are not much inferior. For larger basis sets (i.e. when the ratio of
virtual to occupied orbitals is larger), the computation times will be even more favorable for the AO based
implementation. The AO direct method uses much less disk space. However, when you use a very expensive
basis set the overhead will be larger than what is observed in this example. Hence, conventionally stored
integrals — if affordable — are a good choice.

  - AOX-based calculations run at essentially the same speed as AO-based calculations. Since AOX-based calculations take four times as much disk space, they are pretty much outdated and the AOX implementation is
only kept for historical reasons.

  - RI-based coupled-cluster methods are significantly slower. There are some disk space savings, but the computationally dominant steps are executed less efficiently.

  - CCSD is at most 10% more expensive than QCISD. With the latest AO implementation the awkward coupledcluster terms are handled efficiently.

  - CEPA is not much more than 20% faster than CCSD. In many cases CEPA results will be better than CCSD
and then it is a real saving compared to CCSD(T), which is the most rigorous.

  - If triples are included practically the same comments apply for MO versus AO based implementations as in
the case of CCSD.

ORCA is quite efficient in this type of calculation, but it is also clear that the range of application of these rigorous methods is limited as long as one uses canonical MOs. ORCA implements novel variants of the so-called
local coupled-cluster method which can calculate large, real-life molecules in a linear scaling time. This will be
addressed in Sec. *Local Coupled Pair and Coupled-Cluster Calculations* .

Table 6.1: Computer times (minutes) for solving the coupled-cluster/coupled-pair equations for Serine (cc-pVDZ
basis set)

All of these methods are designed to cover dynamic correlation in systems where the Hartree-Fock determinant
dominates the wavefunctions. The least attractive of these methods is CISD which is not size-consistent and there
fore practically useless. The most rigorous are CCSD(T) and QCISD(T). The former is perhaps to be preferred,
since it is more stable in difficult situations. [1] One can get highly accurate results from such calculations. However,
one only gets this accuracy in conjunction with large basis sets. It is perhaps not very meaningful to perform a
CCSD(T) calculation with a double-zeta basis set (see Table 6.2). The very least basis set quality required for
meaningful results would perhaps be something like def2-TZVP(-f) or preferably def2-TZVPP (cc-pVTZ, anopVTZ). For accurate results quadruple-zeta and even larger basis sets are required and at this stage the method is
restricted to rather small systems.

Let us look at the case of the potential energy surface of the N 2 molecule. We study it with three different basis
sets: TZVP, TZVPP and QZVP. The input is the following:



(continues on next page)

1 The exponential of the T1 operator serves to essentially fully relax the orbitals of the reference wavefunction. This is not included in the
QCISD model that only features at most a linear T1T2 term in the singles residuum. Hence, if the Hartree-Fock wavefunction is a poor starting
point but static correlation is not the main problem, CCSD is much preferred over QCISD. This is not uncommon in transition metal complexes.

**76** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

For even higher accuracy we would need to introduce relativistic effects and - in particular - turn the core correlation
on. [2]

Table 6.2: Computed spectroscopic constants of N2 with coupled-cluster methods.

One can see from Table 6.2 that for high accuracy - in particular for the vibrational frequency - one needs both - the
connected triple-excitations and large basis sets (the TZVP result is fortuitously good). While this is an isolated
example, the conclusion holds more generally. If one pushes it, CCSD(T) has an accuracy (for reasonably wellbehaved systems) of approximately 0.2 pm in distances, <10 cm *[−]* [1] for harmonic frequencies and a few kcal/mol
for atomization energies. [3] It is also astonishing how well the Ahlrichs basis sets do in these calculations — even
slightly better than the much more elaborate ANO bases.

**Note:** The quality of a given calculation is not always high because it carries the label “coupled-cluster”. Accurate
results are only obtained in conjunction with large basis sets and for systems where the HF approximation is a good
0 *[𝑡ℎ]* order starting point.

**Coupled-Cluster Densities**

If one is mainly accustomed to Hartree-Fock or DFT calculations, the calculation of the density matrix is more or
less a triviality and is automatically done together with the solution of the self-consistent field equations. Unfortunately, this is not the case in coupled-cluster theory (and also not in MP2 theory). The underlying reason is that in
coupled-cluster theory, the expansion of the exponential *𝑒* *[𝑇]* [^] in the expectation value

*𝐷* = *[⟨]* [Ψ] *[|][𝐸]* *𝑝* *[𝑞]* *[|]* [Ψ] *[⟩]* = *[⟨][𝑒]* *[𝑇]* [^] [Ψ] [0] *[|][𝐸]* *𝑝* *[𝑞]* *[|][𝑒]* *[𝑇]* [^] [Ψ] [0] *[⟩]*
*𝑝𝑞* *⟨* Ψ *|* Ψ *⟩* *⟨𝑒* *[𝑇]* [^] Ψ 0 *|𝑒* *[𝑇]* [^] Ψ 0 *⟩*

only terminates if all possible excitation levels are exhausted, i.e., if all electrons in the reference determinant Ψ 0
(typically the HF determinant) are excited from the space of occupied to the space of virtual orbitals (here *𝐷* *𝑝𝑞*
denotes the first order density matrix, *𝑇* ˆ is the cluster operator). Hence, the straightforward application of these equations is far too expensive. It is, *𝐸* *𝑝* *[𝑞]* [are the spin traced second quantized orbital replacement operators, and]
however, possible to expand the exponentials and only keep the linear term. This then defines a linearized density
which coincides with the density that one would calculate from linearized coupled-cluster theory (CEPA/0). The
difference to the CEPA/0 density is that converged coupled-cluster amplitudes are used for its evaluation. This

2 Note that core correlation is not simply introduced by including the core orbitals in the correlation problem. In addition, special correlation
core-polarization functions are needed. They have been standardized for a few elements in the cc-pCVxZ (X=D,T,Q,5,6) basis sets.
3 However, in recent years it became more evident that even CCSD(T) achieves its high apparent accuracy through error cancellations. The
full CCSDT method (triples fully included) usually performs worse than CCSD(T). The reason is that the (T) correction undershoots the effects
of the triples to some extent and thereby compensates for the neglect of connected quadruple excitations. For very high accuracy quantum
chemistry, even these must be considered. The prospects for treating chemically more relevant molecules with such methods is not particularly
bright for the foreseeable future...

**6.1. Single Point Energies and Gradients** **77**

**ORCA Manual** **,** **Release 6.0.1**

density is straightforward to compute and the computational effort for the evaluation is very low. Hence, this is a
density that can be easily produced in a coupled-cluster run. It is not, however, what coupled-cluster aficionados
would accept as a density.

The subject of a density in coupled-cluster theory is approached from the viewpoint of response theory. Imagine
one adds a perturbation of the form

*𝐻* [(] *[𝜆]* [)] = *𝜆*
∑︁ *𝑝𝑞* *[ℎ]* *𝑝𝑞* *[𝜆]* *[𝐸]* *𝑝* *[𝑞]*

to the Hamiltonian. Then it is always possible to cast the first derivative of the total energy in the form:


*𝑑𝐸*


*𝐷* [(response)] *ℎ* *[𝜆]*
*𝑝𝑞* *𝑝𝑞*

*𝑝𝑞*


*𝑑𝜆* [=] ∑︁


This is a nice result. The quantity *𝐷* *𝑝𝑞* [(response)] is the so-called response density. In the case of CC theory where
the energy is not obtained by variational optimization of an energy functional, the energy has to be replaced by a
Lagrangian reading as follows:


*𝐿* *𝐶𝐶* = *⟨* Φ 0 *|𝐻* [¯] *|* Φ 0 *⟩* + ∑︁


*𝜆* *𝜂* *⟨* Φ *𝜂* *|𝐻* [¯] *|* Φ 0 *⟩* + ∑︁
*𝜂* *𝑎𝑖*


*𝑓* *𝑎𝑖* *𝑧* *𝑎𝑖*

*𝑎𝑖*


Here *⟨* Φ *𝜂* *|* denotes any excited determinant (singly, doubly, triply, ....). There are two sets of Lagrange multipliers:
the quantities *𝑧* *𝑎𝑖* that guarantee that the perturbed wavefunction fulfills the Hartree-Fock conditions by making
the off-diagonal Fock matrix blocks zero and the quantities *𝜆* *𝜂* that guarantee that the coupled-cluster projection
equations for the amplitudes are fulfilled. If both sets of conditions are fulfilled then the coupled-cluster Lagrangian
simply evaluates to the coupled-cluster energy. The coupled-cluster Lagrangian can be made stationary with respect
to the Lagrangian multipliers *𝑧* *𝑎𝑖* and *𝜆* *𝜂* . The response density is then defined through:


*𝑑𝐿* *𝐶𝐶*


*𝐷* [(response)] *ℎ* *[𝜆]*
*𝑝𝑞* *𝑝𝑞*

*𝑝𝑞*


*𝐶𝐶*

=
*𝑑𝜆* ∑︁


The density *𝐷* *𝑝𝑞* appearing in this equation does not have the same properties as the density that would arise from
an expectation value. For example, the response density can have eigenvalues lower than 0 or larger than 2. In
practice, the response density is, however, the best “density” there is for coupled-cluster theory.

Unfortunately, the calculation of the coupled-cluster response density is quite involved because additional sets of
equations need to be solved in order to determine the *𝑧* *𝑎𝑖* and *𝜆* *𝜂* . If only the equations for *𝜆* *𝜂* are solved one speaks
of an “unrelaxed” coupled-cluster density. If both sets of equations are solved, one speaks of a “relaxed” coupledcluster density. For most intents and purposes, the orbital relaxation effects incorporated into the relaxed density
are small for a coupled-cluster density. This is so, because the coupled-cluster equations contain the exponential
of the single excitation operator *𝑒* *[𝑇]* [^] [1] = exp( [∑︀] *𝑎𝑖* *[𝑡]* *𝑎* *[𝑖]* *[𝐸]* *𝑖* *[𝑎]* [)][. This brings in most of the effects of orbital relaxation. In]


of the single excitation operator *𝑒* *[𝑇]* [1] = exp( [∑︀] *𝑎𝑖* *[𝑡]* *𝑎* *[𝑖]* *[𝐸]* *𝑖* *[𝑎]* [)][. This brings in most of the effects of orbital relaxation. In]

fact, replacing the *𝑇* [ˆ] 1 operator by the operator ˆ *𝜅* = [∑︀] *𝑎𝑖* *[𝜅]* *𝑎* *[𝑖]* [(] *[𝐸]* *𝑖* *[𝑎]* *[−]* *[𝐸]* *𝑎* *[𝑖]* [)][ would provide all of the orbital relaxation]


fact, replacing the *𝑇* 1 operator by the operator ˆ *𝜅* = [∑︀] *𝑎𝑖* *[𝜅]* *𝑎* *[𝑖]* [(] *[𝐸]* *𝑖* *[𝑎]* *[−]* *[𝐸]* *𝑎* *[𝑖]* [)][ would provide all of the orbital relaxation]

thus leading to “orbital optimized coupled-cluster theory” (OOCC).

Not surprisingly, the equations that determine the coefficients *𝜆* *𝜂* (the Lambda equations) are as complicated as the
coupled-cluster amplitude equations themselves. Hence, the calculation of the unrelaxed coupled-cluster density
matrix is about twice as expensive as the calculation of the coupled-cluster energy (but not quite as with proper
program organization terms can be reused and the Lambda equations are linear equations that converge somewhat
better than the non-linear amplitude equations).

ORCA features the calculation of the unrelaxed coupled-cluster density on the basis of the Lambda equations
for closed- and open-shell systems. If a fully relaxed coupled-cluster density is desired then ORCA still features
the orbital-optimized coupled-cluster doubles method (OOCCD). This is not exactly equivalent to the fully relaxed
CCSD density matrix because of the operator ˆ *𝜅* instead of *𝑇* [ˆ] 1 . However, results are very close and orbital optimized
coupled-cluster doubles is the method of choice if orbital relaxation effects are presumed to be large.

In terms of ORCA keywords, the coupled-cluster density is obtained through the following keywords:



(continues on next page)

**78** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

which will work together with CCSD or QCISD (QCISD and CCSD are identical in the case of OOCCD because
of the absence of single excitations). Note, that an unrelaxed density for CCSD(T) is NOT available.

Instead of using the density option “orbopt” in the mdci-block, OOCCD can also be invoked by using the keyword:
```
! OOCCD

```
**Static versus Dynamic Correlation**

Having said that, let us look at an “abuse” of the single reference correlation methods by studying (very superfi
As can be seen in Fig. 6.1, there is a steep rise in energy as one approaches a 90 *[∘]* twist angle. The HF curve is
actually discontinuous and has a cusp at 90 *[∘]* . This is immediately fixed by a simple CASSCF(2,2) calculation
which gives a smooth potential energy surface. Dynamic correlation is treated on top of the CASSCF(2,2) method
with the MRACPF approach as follows:



(continues on next page)

**6.1. Single Point Energies and Gradients** **79**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

This is the reference calculation for this problem. One can see that the RHF curve is far from the MRACPF reference
but the CASSCF calculation is very close. Thus, dynamic correlation is not important for this problem! It only
appears to be important since the RHF determinant is such a poor choice. The MP2 correlation energy is insufficient
in order to repair the RHF result. The CCSD method is better but still falls short of quantitative accuracy. Finally,
the CCSD(T) curve is very close the MRACPF. This even holds for the total energy (inset of Fig. 6.2) which does
not deviate by more than 2–3 mEh from each other. Thus, in this case one uses the powerful CCSD(T) method in
an inappropriate way in order to describe a system that has multireference character. Nevertheless, the success of
CCSD(T) shows how stable this method is even in tricky situations. The “alarm” bell for CCSD and CCSD(T) is
the so-called “T 1 -diagnostic” [4] that is also shown in Fig. 6.2. A rule of thumb says, that for a value of the diagnostic
of larger than 0.02 the results are not to be trusted. In this calculation we have not quite reached this critical point
although the T 1 diagnostic blows up around the 90 *[∘]* twist.

4 It is defined as *‖𝑇* 1 *‖ /𝑁* 1 */* 2 where T 1 are the singles amplitudes and N the number of correlated electrons. The original reference is [504]

**80** **Chapter 6. Running Typical Calculations**

The computational cost (disregarding the triples) is such that the CCSD method is the most expensive followed

*∼*
by QCISD ( 10% cheaper) and all other methods (about 50% to a factor of two cheaper than CCSD). The most
accurate method is generally CCSD(T). However, this is not so clear if the triples are omitted and in this regime
the coupled pair methods (in particular CPF/1 and NCPF/1 [5] ) can compete with CCSD.

Let us look at the same type of situation from a slightly different perspective and dissociate the single bond of F 2 .
As is well known, the RHF approximation fails completely for this molecule and predicts it to be unbound. Again
we use a much too small basis set for quantitative results but it is enough to illustrate the principle.

We first generate a “reference” PES with the MRACPF method:



Note that we scan from outward to inward. This helps the program to find the correct potential energy surface
since at large distances the *𝜎* and *𝜎* *[*]* orbitals are close in energy and fall within the desired 2 *×* 2 window for the

5 The “N” methods have been suggested by [886] and are exclusive to ORCA. Please note that our NCPF/1 is different from the MCPF
method in the literature [173]. The original CPF method — which we prefer — is from [16]; see also [15] for a nice review about the coupled
pair approaches and the underlying philosophy.

**6.1. Single Point Energies and Gradients** **81**

**ORCA Manual** **,** **Release 6.0.1**

CASSCF calculation (see section *Complete Active Space Self-Consistent Field Method* ). Comparing the MRACPF
and CASSCF curves it becomes evident that the dynamic correlation brought in by the MRACPF procedure is very
important and changes the asymptote (loosely speaking the binding energy) by almost a factor of two (see Fig.
6.3). Around the minimum (roughly up to 2.0 Å) the CCSD(T) and MRACPF curves agree beautifully and are
almost indistinguishable. Beyond this distance the CCSD(T) calculation begins to diverge and shows an unphysical
behavior while the multireference method is able to describe the entire PES up to the dissociation limit. The CCSD
curve is qualitatively OK but has pronounced quantitative shortcomings: it predicts a minimum that is much too
short and a dissociation energy that is much too high. Thus, already for this rather “simple” molecule, the effect
of the connected triple excitations is very important. Given this (rather unpleasant) situation, the behavior of the

**Basis Sets for Correlated Calculations. The case of ANOs.**

In HF and DFT calculations the generation and digestion of the two-electron repulsion integrals is usually the most
expensive step of the entire calculation. Therefore, the most efficient approach is to use loosely contracted basis
sets with as few primitives as possible — the Ahlrichs basis sets (SVP, TZVP, TZVPP, QZVP, def2-TZVPP, def2QZVPP) are probably the best in this respect. Alternatively, the polarization-consistent basis sets pc-1 through
pc-4 could be used, but they are only available for H-Ar. For large molecules such basis sets also lead to efficient
prescreening and consequently efficient calculations.

This situation is different in highly correlated calculations such as CCSD and CCSD(T) where the effort scales
steeply with the number of basis functions. In addition, the calculations are usually only feasible for a limited
number of basis functions and are often run in the integral conventional mode, since high angular momentum basis
functions are present and these are expensive to recompute all the time. Hence, a different strategy concerning the

**82** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

basis set design seems logical. It would be good to use as few basis functions as possible but make them as accurate
as possible. This is compatible with the philosophy of atomic natural orbital (ANO) basis sets. Such basis sets are
generated from correlated atomic calculations and replicate the primitives of a given angular momentum for each
basis function. Therefore, these basis sets are deeply contracted and expensive but the natural atomic orbitals form
a beautiful basis for molecular calculations. In ORCA an accurate and systematic set of ANOs (ano-pV *𝑛* Z, *𝑛* = D,
T, Q, 5 is incorporated). A related strategy underlies the design of the correlation-consistent basis sets (cc-pV *𝑛* Z,
*𝑛* = D, T, Q, 5, 6,...) that are also generally contracted except for the outermost primitives of the “principal”
orbitals and the polarization functions that are left uncontracted.

Let us study this subject in some detail using the H 2 CO molecule at a standard geometry and compute the SCF
and correlation energies with various basis sets. In judging the results one should view the total energy in conjunction with the number of basis functions and the total time elapsed. Looking at the data in the Table below,
it is obvious that the by far lowest SCF energies for a given cardinal number (2 for double-zeta, 3 for triple zeta
and 4 for quadruple-zeta) are provided by the ANO basis sets. Using specially optimized ANO integrals that are
available since ORCA 2.7.0, the calculations are not even much more expensive than those with standard basis sets.
Obviously, the correlation energies delivered by the ANO bases are also the best of all 12 basis sets tested. Hence,
ANO basis sets are a very good choice for highly correlated calculations. The advantages are particularly large for
the early members (DZ/TZ).

Table 6.3: Comparison of various basis sets for highly correlated calculations

Fig. 6.4: Error in Eh for various basis sets for highly correlated calculations relative to the ano-pVQZ basis set.

Let us look at one more example in Table 6.4: the optimized structure of the N 2 molecule as a function of basis set

**6.1. Single Point Energies and Gradients** **83**

**ORCA Manual** **,** **Release 6.0.1**

using the MP2 method *(these calculations are a bit older from the time when the ano-pVnZ basis sets did not yet*
*exist. Today, the ano-pVnZ would be preferred)* .

The highest quality basis set here is QZVP and it also gives the lowest total energy. However, this basis set contains
up to g-functions and is very expensive. Not using g-functions and a set of f-functions (as in TZVPP) has a
noticeable effect on the outcome of the calculations and leads to an overestimation of the bond distance of 0.2
pm — a small change but for benchmark calculations of this kind still significant. The error made by the TZVP
basis set that lacks the second set of d-functions on the bond distance, binding energy and ionization potential is
surprisingly small even though the deletion of the second d-set “costs” more than 20 mEh in the total energy as
compared to TZV(2d,2p), and even more compared to the larger TZVPP.

A significant error on the order of 1 – 2 pm in the calculated distances is produced by smaller DZP type basis sets,
which underlines once more that such basis sets are really too small for correlated molecular calculations — the
ANO-DZP basis sets are too strongly biased towards the atom, while the “usual” molecule targeted DZP basis sets
like SVP have the d-set designed to cover polarization but not correlation (the correlating d-functions are steeper
than the polarizing ones). The performance of the very economical SVP basis set should be considered as very
good, and (a bit surprisingly) slightly better than cc-pVDZ despite that it gives a higher absolute energy.

Essentially the same picture is obtained by looking at the (uncorrected for ZPE) binding energy calculated at the
MP2 level – the largest basis set, QZVP, gives the largest binding energy while the smaller basis sets underestimate
it. The error of the DZP type basis sets is fairly large ( *≈* 2 eV) and therefore caution is advisable when using such
bases.

Table 6.4: Comparison of various basis sets for correlated calculations.

**Automatic extrapolation to the basis set limit**

**Note:**

  - This functionality is deprecated - it may still be usable but we will not actively maintain this part of code
anymore. For basis set extrapolation please use the respective compound scripts (Table *Protocols, known to*
*the simple input line, with short explanation* ).

As eluded to in the previous section, one of the biggest problems with correlation calculations is the slow convergence to the basis set limit. One possibility to overcome this problem is the use of explicitly correlated methods.
The other possibility is to use basis set extrapolation techniques. Since this involves some fairly repetitive work,
some procedures were hardwired into the ORCA program. So far, only energies are supported. For extrapolation, a systematic series of basis sets is required. This is, for example, provided by the cc-pV *𝑛* Z, aug-cc-pV *𝑛* Z or
the corresponding ANO basis sets. Here *𝑛* is the “cardinal number” that is 2 for the double-zeta basis sets, 3 for
triple-zeta, etc.

The convergence of the HF energy to the basis set limit is assumed to be given by:


*𝐸* SCF [(] *[𝑋]* [)] [=] *[ 𝐸]* SCF [(] *[∞]* [)] [+] *[ 𝐴]* [exp] *−𝛼√*
(︁


*𝑋* (6.1)
)︁


Here, *𝐸* SCF [(] *[𝑋]* [)] [is the SCF energy calculated with the basis set with cardinal number] *[ 𝑋]* [,] *[ 𝐸]* SCF [(] *[∞]* [)] [is the basis set limit]
SCF energy and *𝐴* and *𝛼* are constants. The approach taken in ORCA is to do a two-point extrapolation. This
means that either *𝐴* or *𝛼* have to be known. Here, we take *𝐴* as to be determined and *𝛼* as a basis set specific

constant.

**84** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

The correlation energy is supposed to converge as:

*𝐸* corr [(] *[∞]* [)] [=] *[𝑋]* *[𝛽]* *[𝐸]* *𝑋* corr [(] *[𝑋][𝛽]* [)] *−* *[−]* *𝑌* *[𝑌]* *[𝛽][𝛽]* *[𝐸]* corr [(] *[𝑌]* [)] (6.2)

The theoretical value for *𝛽* is 3.0. However, it was found by Truhlar and confirmed by us, that for 2/3 extrapolations
*𝛽* = 2 *.* 4 performs considerably better.

For a number of basis sets, we have determined the optimum values for *𝛼* and *𝛽* [607]:

Since the *𝛽* values for 2/3 are close to 2.4, we always take this value. Likewise, all 3/4 and higher extrapolations
are done with *𝛽* = 3. However, the optimized values for *𝛼* are taken throughout.

Using the keyword `! Extrapolate(X/Y,basis)`, where `X` and `Y` are the corresponding successive cardinal numbers and `basis` is the type of basis set requested (= `cc`, `aug-cc`, `cc-core`, `ano`, `saug-ano`, `aug-ano`, `def2` ) ORCA
will calculate the SCF and optionally the MP2 or MDCI energies with two basis sets and separately extrapolate.

The keyword works also in the following way: `! Extrapolate(n,basis)` where `n` is the is the number of energies
to be used. In this way the program will start from a double-zeta basis and perform calculations with `n` cardinal
numbers and then extrapolate the different pairs of basis sets. Thus for example the keyword `! Extrapolate(3,`
`CC)` will perform calculations with cc-pVDZ, cc-pVTZ and cc-pVQZ basis sets and then estimate the extrapolation
results of both cc-pVDZ/cc-pVTZ and cc-pVTZ/cc-pVQZ combinations.

Let us take the example of the H2O molecule at the B3LYP/TZVP optimized geometry. The reference values have
been determined from a HF calculation with the decontracted aug-cc-pV6Z basis set and the correlation energy
was obtained from the cc-pV5Z/cc-pV6Z extrapolation. This gives:



Now we can see what extrapolation can bring in:



NOTE:

  - The RI-JK and RIJCOSX approximations work well together with this option and RI-MP2 is also possible.
Auxiliary basis sets are automatically chosen and can not be changed.

  - All other basis set choices, externally defined bases etc. will be ignored — the automatic procedure only
works with the default basis sets!

  - The basis sets with the “core” postfix contain core correlation functions. By default it is assumed that this
means that the core electrons are also to be correlated and the frozen core approximation is turned off. However, this can be overridden in the method block by choosing, e.g. `%method frozencore fc_electrons`
`end` !

**6.1. Single Point Energies and Gradients** **85**

**ORCA Manual** **,** **Release 6.0.1**

  - So far, the extrapolation is only implemented for single points and not for gradients. Hence, geometry optimizations cannot be done in this way.

  - The extrapolation method should only be used with very tight SCF convergence criteria. For open shell
methods, additional caution is advised.

This gives:



Thus, the error in the total energy is indeed strongly reduced. Let us look at the more rigorous 3/4 extrapolation:




In our experience, the ANO basis sets extrapolate similarly to the cc-basis sets. Hence, repeating the entire calculation with `Extrapolate(3,ANO)` gives:



Which is within 1 mEh of the estimated CCSD(T) basis set limit energy in the case of the 3/4 extrapolation and
within 2 mEh for the 2/3 extrapolation.

For larger molecules, the bottleneck of the calculation will be the CCSD(T) calculation with the larger basis set.
In order to avoid this expensive (or prohibitive) calculation, it is possible to estimate the CCSD(T) energy at the
basis set limit as:

*𝐸* corr [(CCSD(T);] *[𝑌]* [)] *≈* *𝐸* corr [(CCSD(T);] *[𝑋]* [)] + *𝐸* corr [(MP2;] *[∞]* [)] *−* *𝐸* corr [(MP2;] *[𝑋]* [)] (6.3)

This assumes that the basis set dependence of MP2 and CCSD(T) is similar. One can then extrapolate as before.
Alternatively, the standard way — as extensively exercised by Hobza and co-workers — is to simply use:

*𝐸* total [(CCSD(T);CBS)] *≈* *𝐸* SCF [(] *[𝑌]* [)] [+] *[ 𝐸]* corr [(CCSD(T);] *[𝑋]* [)] + *𝐸* corr [(MP2;] *[∞]* [)] *−* *𝐸* corr [(MP2;] *[𝑋]* [)] (6.4)

The appropriate keyword is:



**86** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

This creates the following output:



The estimated correlation energy is not really bad — within 3 mEh from the basis set limit.

Using the `ExtrapolateEP2(n/m,bas,[method, method-details])` keyword one can use a generalization
of the above method where instead of MP2 any available correlation method can be used as described in Ref. [519].
`method` is optional and can be either MP2 or DLPNO-CCSD(T), the latter being the default. In case the method
is DLPNO-CCSD(T) in the `method-details` option one can ask for LoosePNO, NormalPNO or TightPNO.

*𝐸* corr [(CCSD(T);] *[𝐶𝐵𝑆]* [)] *≈* *𝐸* corr [(CCSD(T);] *[𝑋]* [)] + *𝐸* corr [(M;] *[𝐶𝐵𝑆]* [)] ( *𝑋, 𝑋* + 1) *−* *𝐸* corr [(M;] *[𝑋]* [)] (6.5)

Here M represents any correlation method one would like to use. For the previous water molecule the input of a
calculation that uses DLPNO-CCSD(T) (which is the default now) instead of MP2 would look like:



and it would produce the following output:




which is less than 2 mEh from the basis set limit. Finally it was shown [519] that instead of extrapolating the cheap
method, M, using cardinal numbers *𝑋* and *𝑋* + 1 it is better to use cardinal numbers *𝑋* + 1 and *𝑋* + 2.

*𝐸* corr [(CCSD(T);] *[𝐶𝐵𝑆]* [)] *≈* *𝐸* corr [(CCSD(T);] *[𝑋]* [)] + *𝐸* corr [(M;] *[𝐶𝐵𝑆]* [)] ( *𝑋* + 1 *, 𝑋* + 2) *−* *𝐸* corr [(M;] *[𝑋]* [)] (6.6)

This can be done using the `ExtrapolateEP3(bas,[method,method-details])` keyword:

**6.1. Single Point Energies and Gradients** **87**

**ORCA Manual** **,** **Release 6.0.1**
```
! ExtrapolateEP3(CC) TightSCF Conv Bohrs

```
and the corresponding output would be:



For the ExtrapolateEP2, and ExtrapolateEP3 keywords the default cheap method is the DLPNO-CCSD(T) with
the NormalPNO thresholds. There also available options with MP2, and DLPNO-CCSD(T) with LoosePNO and
TightPNO settings.

**Explicitly Correlated MP2 and CCSD(T) Calculations**

A physically perhaps somewhat more satisfying alternative to basis set extrapolation is the theory of explicit correlation. In this method terms are added to the wavefunction Ansatz that contain the interelectronic coordinates

explicitly (hence the name “explicit correlation”). Initially these terms were linear in the interelectronic distances
(“R12-methods”). However, it has later been found that better results can be obtained by using other functions,
such as an exponential, of the interelectronic distance (“F12-methods”). These methods are known to yield near
basis set limit results for correlation energies in conjunction with much smaller orbital basis sets.

In applying these methods several points are important:

  - Special orbital basis sets are at least advantageous. The development of such basis sets is still in its infancy.
For a restricted range of elements the basis sets cc-pV *𝑛* Z-F12 are available (where *𝑛* = D, T, Q) and are
recommended. Note, that other than their names suggest, these are a fair bit larger than regular double, triple
or quadruple-zeta basis sets

  - In addition to an orbital basis set, a near-complete auxiliary basis set must be specified. This is the so-called
“CABS” basis. For the three basis sets mentioned above these are called cc-pV *𝑛* Z-F12-CABS. If you have
elements that are not covered you are on your own to supply a CABS basis set. CABS basis sets can be read
into ORCA in a way analogous to RI auxiliary basis sets (replace “AUX” by “CABS” in the input). There
are automatic tools for building a CABS basis from an arbitrary orbital basis, e.g. AutoCABS[781]

  - if the RI approximation is used in conjunction with F12, a third basis set is required - this can be the regular
auxiliary “/C” basis, but we recommend to step one level up in the auxiliary basis set (e.g. use a cc-pVTZ/C
fitting basis in conjunction with cc-pVDZ-F12)

  - It is perfectly feasible to use RIJCOSX or RI-JK at the same time. In this case, you should provide a fourth
basis set for the Coulomb fitting

  - RHF and UHF are available, ROHF not. (Although, one can do a ROHF like calculation by using QROs)

  - Gradients are not available

Doing explicitly correlated MP2 calculations is straightforward. For example look at the following calculation on
the water molecule at a given geometry:

**88** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**


and similarly in conjunction with the RI approximation:



The output is relatively easy to interpret:




It consists of several parts. The first is the regular (RI-)MP2 correlation energy in the orbitals basis followed by
the additive MP2 correction which are combined to provide an MP2 correlation energy basis set limit estimate.
The second part consists of an estimate in the error in the underlying SCF energy. This is the “(2)_S CABS”
correction. The combination of the SCF energy with this correction yields an estimate of the SCF basis set limit.
The correction will typically undershoot somewhat, but the error is very smooth. Finally, the corrected correlation
energy and the corrected SCF energy are added to yield the F12 total energy estimate at the basis set limit.

Let’s look at some results and compare to extrapolation:



(continues on next page)

**6.1. Single Point Energies and Gradients** **89**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

It is obvious that extrapolated and F12 correlation energies converge to the same number (in this case around 300
mEh). The best extrapolated result is still below the F12 result (this would primarily be meaningful in a variational
calculation). However, first of all this was an expensive extrapolation and second, the small residual F12 error is
very smooth and cancels in energy differences. In any case, already the F12-double-zeta (where “double zeta”
is to be interpreted rather loosely) brings one into within 5 mEh of the basis set limit correlation energy and the
F12-triple-zeta calculation to within 1 mEh, which is impressive.

The additional effort for the F12 calculation is rather high, since five types of additional two-electron integrals
need to be calculated. Both integrals in CABS space and in the original orbital (OBS) space must be calculated
and mixed Fock matrices are also required. Hence, one may wonder, whether a double-zeta F12 calculation actually
saves any time over, say, a quadruple-zeta regular calculation. The actual answer to this question is: “NO”. Given
all possibilities of obtained approximate MP2 and SCF energies, we have investigated the question of how to obtain
MP2 basis set limit energies most efficiently in some detail. The results show that in terms of timings, basis set
extrapolation in combination with RI-JK is the method of choice for MP2.[521] However, energy differences are
more reliable with F12-MP2. In combination with RI-JK or RIJCOSX F12-MP2 becomes also competitive in
terms of computational efficiency.

This situation is different in the case of coupled-cluster methods, where F12 methods outperform extrapolation and
are the method of choice.

For coupled-cluster theory, everything works in a very similar fashion:



A special feature of ORCA that can save large amounts of time, is to use the RI approximation only for the F12-part.
The keyword here is:



Everything else works as described for F12-MP2.

**Frozen Core Options**

In coupled-cluster calculations the Frozen Core (FC) approximation is applied by default. This implies that the
core electrons are not included in the correlation treatment, since the inclusion of dynamic correlation in the core
electrons usually affects relative energies insignificantly.

The frozen core option can be switched on or off with `! FrozenCore` or `! NoFrozenCore` in the simple input.
More information and further options are given in section *Frozen Core Options* and in section *Including (semi)core*
*orbitals in the correlation treatment* .

**90** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**Local Coupled Pair and Coupled-Cluster Calculations**

ORCA features a special set of local correlation methods. The prevalent local coupled-cluster approaches date back
to ideas of Pulay and have been extensively developed by Werner, Schütz and co-workers. They use the concept
of correlation domains in order to achieve linear scaling with respect to CPU, disk and main memory. While the
central concept of electron pairs is very similar in both approaches, the local correlation methods in ORCA follow
a completely different and original philosophy.

In ORCA rather than trying to use sparsity, we exploit data compression. To this end two concepts are used:
(a) localization of internal orbitals, which reduces the number of electron pairs to be correlated since the pair
correlation energies are known to fall off sharply with distance; (b) use of a truncated pair specific natural orbital
basis to span the significant part of the virtual space for each electron pair. This guarantees the fastest convergence
of the pair wavefunction and a nearly optimal convergence of the pair correlation energy while not introducing any
real space cut-offs or geometrically defined domains. These PNOs have been used previously by the pioneers of
correlation theory. However, as discussed in the original papers, the way in which they have been implemented
into ORCA is very different. For a full description of technical details and numerical tests see:

  - F. Neese, A. Hansen, D. G. Liakos: Efficient and accurate local approximations to the coupled-cluster singles
and doubles method using a truncated pair natural orbital basis.[617]

  - F. Neese, A. Hansen, F. Wennmohs, S. Grimme: Accurate Theoretical Chemistry with Coupled Electron
Pair Models.[618]

  - F. Neese, F. Wennmohs, A. Hansen: Efficient and accurate local approximations to coupled electron pair
approaches. An attempt to revive the pair-natural orbital method.[623]

  - D. G. Liakos, A. Hansen, F. Neese: Weak molecular interactions studied with parallel implementations of
the local pair natural orbital coupled pair and coupled-cluster methods.[520]

  - A. Hansen, D. G. Liakos, F. Neese: Efficient and accurate local single reference correlation methods for
high-spin open-shell molecules using pair natural orbitals.[361]

  - C. Riplinger, F. Neese: An efficient and near linear scaling pair natural orbital based local coupled-cluster
method.[721]

  - C. Riplinger, B. Sandhoefer, A. Hansen, F. Neese: Natural triple excitations in local coupled-cluster calculations with pair natural orbitals.[723]

  - C. Riplinger, P. Pinski, U. Becker, E. F. Valeev, F. Neese: Sparse maps - A systematic infrastructure for
reduced-scaling electronic structure methods. II. Linear scaling domain based pair natural orbital coupled
cluster theory.[722]

  - D. Datta, S. Kossmann, F. Neese: Analytic energy derivatives for the calculation of the first-order molecular
properties using the domain-based local pair-natural orbital coupled-cluster theory[191]

  - M. Saitow, U. Becker, C. Riplinger, E. F. Valeev, F. Neese: A new linear scaling, efficient and accurate,
open-shell domain based pair natural orbital coupled cluster singles and doubles theory.[740]

In 2013, the so-called DLPNO-CCSD method (“domain based local pair natural orbital”) was introduced.[721] This
method is near linear scaling with system size and allows for giant calculations to be performed. In 2016, significant
changes to the algorithm were implemented leading to linear scaling with system size concerning computing time,
hard disk and memory consumption.[722] The principal idea behind DLPNO is the following: it became clear
early on that the PNO space for a given electron pair (ij) is local and located in the same region of space as the
electron pair (ij). In LPNO-CCSD this locality was partially used in the local fitting to the PNOs (controlled by the
parameter TCutMKN). However, the PNOs were expanded in canonical virtual orbitals which led to some higher
order scaling steps. In DLPNO, the PNOs are expanded in the set of projected atomic orbitals:

*|𝜇* ˜ *⟩* = (︁1 *−* ∑︁ *𝑖* *[|][𝑖][⟩⟨][𝑖][|]* )︁ *|𝜇⟩*

where *|𝜇⟩* is an atomic orbital and *|𝑖⟩* refers to an occupied molecular orbital. Such projected orbitals are an
overcomplete representation of the virtual space. The projected orbital *|𝜇* ˜ *⟩* is located in the same region of space
as *|𝜇⟩* and hence can be assigned to atomic centers. This has first been invented and used by Pulay and Saebo [705]
in their pioneering work on local correlation methods and widely exploited by Werner, Schütz and co-workers in

**6.1. Single Point Energies and Gradients** **91**

**ORCA Manual** **,** **Release 6.0.1**

their local correlation approaches. [755, 756] DLPNO-CCSD goes one step further in expanding the PNOs ⃒⃒ *𝑎* ˜ *𝑖𝑗* ⟩︀

of a given pair ( *𝑖𝑗* ) as:

⃒⃒ *𝑎* ˜ *𝑖𝑗* ⟩︀ = ∑︁ *𝑑* *[𝑖𝑗]* *𝜇* ˜ *𝑎* ˜ *[|][𝜇]* [˜] *[⟩]*

*𝜇* ˜ *∈{𝑖𝑗}*

where ˜ *𝜇* *∈{𝑖𝑗}* is the domain of atoms (range of ˜ *𝜇* ) that is associated with the electron pair ij. The advantage of the
PNO method is, that these domains can be chosen to be large (>15-20 atoms) without compromising the efficiency
of the method.

The comparison between LPNO-CCSD and DLPNO-CCSD is shown in Fig. 6.5. It is obvious that DLPNO-CCSD
is (almost) never slower than LPNO-CCSD. However, its true advantages do become most apparent for molecules
with more than approximately 60 atoms. The triples correction, that was added with our second paper from 2013,
shows a perfect linear scaling, as is shown in part (a) of Fig. 6.5. For large systems it adds about 10%–20% to
the DLPNO-CCSD computation time, hence its addition is possible for all systems for which the latter can still be
obtained. Since 2016, the entire DLPNO-CCSD(T) algorithm is linear scaling. The improvements of the linearscaling algorithm, compared to DLPNO2013-CCSD(T), start to become significant at system sizes of about 300
atoms, as becomes evident in part (b) of Fig. 6.5.

(b) (b) DLPNO Scaling

(a) (a) DLPNO2013 Scaling

Fig. 6.5: a) Scaling behavior of the canonical CCSD, LPNO-CCSD and DLPNO2013-CCSD(T) methods. It is
obvious that only DLPNO2013-CCSD and DLPNO2013-CCSD(T) can be applied to large molecules. The advantages of DLPNO2013-CCSD over LPNO-CCSD do not show before the system has reached a size of about 60
atoms. b) Scaling behavior of DLPNO2013-CCSD(T), DLPNO-CCSD(T) and RHF using RIJCOSX. It is obvious
that only DLPNO-CCSD(T) can be applied to truly large molecules, is faster than the DLPNO2013 version, and
even has a crossover with RHF at about 400 atoms.

Using the DLPNO-CCSD(T) approach it was possible for the first time (in 2013) to perform a CCSD(T) level
calculation on an entire protein (Crambin with more than 650 atoms, Fig. 6.6). While the calculation using a
double-zeta basis took about 4 weeks on one CPU with DLPNO2013-CCSD(T), it takes only about 4 days to
complete with DLPNO-CCSD(T). With DLPNO-CCSD(T) even the triple-zeta basis calculation can be completed
within reasonable time, taking 2 weeks on 4 CPUs.

**92** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.6: Structure of the Crambin protein - the first protein to be treated with a CCSD(T) level ab initio method

The use of the LPNO (and DLPNO) methods is simple and requires little special attention from the user:



Using the well tested default settings, the LPNO-CEPA (LPNO-CPF, LPNO-VCEPA), LPNO-QCISD and LPNOCCSD (LPNO-pCCSD) methods [6] can be run in strict analogy to canonical calculations and should approximate

6 As a technical detail: The closed-shell LPNO QCISD and CCSD come in two technical variants - LPNO1-CEPA/QCISD/CCSD and
LPNO2-CEPA/CCSD/QCISD. The “2” variants consume less disk space but are also slightly less accurate than the “1” variants. This is
discussed in the original paper in the case of QCISD and CCSD. For the sake of accuracy, the “1” variants are the default. In those cases,
where “1” can still be performed, the computational efficiency of both approaches is not grossly different. For LPNO CCSD there is also a
third variant (LPNO3-CCSD, also in the open-shell version) which avoids neglecting the dressing of the external exchange operator. However,
the results do not differ significantly from variant 1 but the calculations will become more expensive. Thus it is not recommend to use variant
3. Variant 2 is not available in the open-shell version.

**6.1. Single Point Energies and Gradients** **93**

**ORCA Manual** **,** **Release 6.0.1**

the canonical result very closely. In fact, one should not view the LPNO methods as new model chemistry - they
are designed to reproduce the canonical results, including BSSE. This is different from the domain based local
correlation methods that do constitute a new model chemistry with properties that are different from the original
methods.

In some situations, it may be appropriate to adapt the accuracy of the calculation. Sensible defaults have been
determined from extensive benchmark calculations and are accessible via LoosePNO, NormalPNO and TightPNO
keywords in the simple input line.[522]

These keywords represent the recommended way to control the accuracy of DLPNO calculations as follows. Manual changing of thresholds beyond these specifying these keywords is usually discouraged.



Since ORCA 4.0, the linear-scaling DLPNO implementation described in reference [722] is the default DLPNO
algorithm. However, for comparison, the first DLPNO implementation from references [721] and [723] can still
be called by using the DLPNO2013 prefix instead of the DLPNO- prefix.




Until ORCA 4.0, the “semi-canonical” approximation is used in the perturbative triples correction for DLPNOCCSD. It was found that the “semi-canonical” approximation is a very good approximation for most systems. However, the “semi-canonical” approximation can introduce large errors in rare cases (particularly when the HOMOLUMO gap is small), whereas the DLPNO-CCSD is still very accurate. To improve the accuracy of perturbative
triples correction, since 4.1, an improved perturbative triples correction for DLPNO-CCSD is available, DLPNOCCSD(T1)[341]. In DLPNO-CCSD(T1), the triples amplitudes are computed iteratively, which can reproduce
more accurately the canonical (T) energies.

It is necessary to clarify the nomenclature used in ORCA input files. The keyword to invoke “semi-canonical”
perturbative triples correction approximation is DLPNO-CCSD(T). While, the keyword of improved iterative approximation is DLPNO-CCSD(T1). However, in our recent paper[341], the “semi-canonical” perturbative triples
correction approximation is named DLPNO-CCSD(T0), whereas the improved iterative one is called DLPNOCCSD(T). Thus, the names used in our paper are different from those in ORCA input files. An example input file
to perform improved iterative perturbative triples correction for DLPNO-CCSD is given below,



(continues on next page)

**94** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

Since ORCA 4.2, the improved iterative perturbative triples correction for open-shell DLPNO-CCSD is available
as well. The keyword of open-shell DLPNO-CCSD(T) is the same as that of the closed-shell case.

Since ORCA 4.0, the high-spin open-shell version of the DLPNO-CISD/QCISD/CCSD implementations have been
made available on top of the same machinery as the 2016 version of the RHF-DLPNO-CCSD code. The present
UHF-DLPNO-CCSD is designed to be an heir to the UHF-LPNO-CCSD and serves as a natural extension to the
RHF-DLPNO-CCSD. A striking difference between UHF-LPNO and newly developed UHF-DLPNO methods is
that the UHF-DLPNO approach gives identical results to that of the RHF variant when applied to closed-shell
species while UHF-LPNO does not. Usage of this program is quite straightforward and shown below:



**Note:** DLPNO-CISD/QCISD/CCSD methods are dedicated to closed-shell and high-spin open-shell species, but
not spin-polarized systems (e.g. open shell singlets or antiferromagnetically coupled transition metal clusters).
Performing DLPNO-CISD/QCISD/CCSD calculations upon open shell singlet UHF/UKS wavefunctions will give
results resembling the corresponding closed shell singlet calculations, because the DLPNO calculations will be
done on the closed-shell determinant composed of the QRO orbitals. Similarly, calculations of spin-polarized
systems other than open shell singlets may give qualitatively wrong results. For spin-polarized systems, the UHFLPNO-CCSD or Mk-LPNO-CCSD methods are available, in addition to DLPNO-NEVPT2.

The same set of truncation parameters as closed-shell DLPNO-CCSD is used also in case of open-shell DLPNO.
The open-shell DLPNO-CCSD produces more than 99.9 % of the canonical CCSD correlation energy as in case
of the closed-shell variant. This feature is certainly different from the UHF-LPNO methods because the open-shell
DLPNO-CCSD is re-designed from scratch on the basis of a new PNO ansatz which makes use of the high-spin
open-shell NEVPT framework. The computational timings of the UHF-DLPNO-CCSD and RIJCOSX-UHF for
linear alkane chains in triplet state are shown in Fig. 6.7.

**6.1. Single Point Energies and Gradients** **95**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.7: Computational times of RIJCOSX-UHF and UHF-DLPNO-CCSD for the linear alkane chains ( *𝐶* *𝑛* *𝐻* 2n + 2 )
in triplet state with def2-TZVPP basis and default frozen core settings. 4 CPU cores and 128 GB of memory were
used on a single cluster node.

Although those systems are somewhat idealized for the DLPNO method to best perform, it is clear that the preceding
RIJCOSX-UHF is the rate-determining step in the total computational time for large examples. In the open-shell
DLPNO implementations, SOMOs are included not only in the occupied space but also in the PNO space in the
preceding integral transformation step. This means the presence of more SOMOs may lead to more demanding
PNO integral transformation and DLPNO-CCSD iterations. The illustrative examples include active site model
of the [NiFe] Hydrogenase in triplet state and the oxygen evolving complex (OEC) in the high-spin state, which
are shown in Figures *7* and *8*, respectively. With def2-TZVPP basis set and NormalPNO settings, a single point
calculation on [NiFe] Hydrogenase (Fig. 6.8) took approximately 45 hours on a single cluster node by using 4 CPU
cores of Xeon E5-2670. A single point calculation on the OEC compound (Fig. 6.9) with the same computational
settings finished in 44 hours even though the number of AOs in this system is even fewer than the Hydrogenase:
the Hydrogenase active site model and OEC involve 4007 and 2606 AO basis functions, respectively. Special care
should be taken if the system possesses more than ten SOMOs, since inclusion of more SOMOs may drastically
increase the prefactor of the calculations. In addition, if the SOMOs are distributed over the entire molecular
skeleton, each pair domain may not be truncated at all; in this case speedup attributed to the domain truncation
will not be achieved at all.

**96** **Chapter 6. Running Typical Calculations**

**6.1. Single Point Energies and Gradients** **97**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.9: A model compound for the OEC in the S 2 state of photosystem II which is composed of 238 atoms. In
its high-spin state, the OEC possesses 13 SOMOs in total.

Calculation of the orbital-unrelaxed density has been implemented for closed-shell DLPNO-CCSD. This permits
analytical computation of first-order properties, such as multipole moments or electric field gradients. In order to
reproduce conventional unrelaxed CCSD properties to a high degree of accuracy, tighter thresholds may be needed
than given by the default settings. Reading of the reference[191] is recommended. Calculation of the unrelaxed
density is requested as usual:
```
%MDCI Density Unrelaxed End

```
There are a few things to be noticed about (D)LPNO methods:

  - The LPNO methods obligatorily make use of the RI approximation. Hence, a correlation fit set must be
provided.

  - The DLPNO-CCSD(T) method is applicable to closed-shell or high-spin open-shell species. When performing DLPNO calculations on open-shell species, it is always better to have UCO option: If preceding
SCF converges to broken-symmetry solutions, it is not guaranteed that the DLPNO-CCSD gives physically
meaningful results.

**98** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

  - Besides the closed-shell version which uses a RHF or RKS reference determinant there is an open-shell
version of the LPNO-CCSD for high-spin open-shell molecules (see original paper) using an UHF or UKS
reference determinant built from quasi-restricted orbitals (QROs, see section *Open-Shell Equations* ). Since
the results of the current open-shell version are slightly less accurate than that of the closed-shell version it is
mandatory to specify if you want to use the closed-shell or open-shell version for calculations of closed-shell
systems, i.e. always put the “RHF” (“RKS”) or “UHF” (“UKS”) keyword in the simple keyword line. Openshell systems can be of course only treated by the open-shell version. **Do not mix results of the closed-**
**and open-shell versions of LPNO methods** (e.g. if you calculate reaction energies of a reaction in which
both closed- and open-shell molecules take part, you should use the open-shell version throughout). This is
because the open-shell LPNO results for the closed-shell species certainly differ from those of closed-shell
implementations. This drawback of the open-shell LPNO methods has led to the development of a brand new
open-shell DLPNO approach which converges to the RHF-DLPNO in the closed-shell limit. **Importantly,**
**one can mix the results of closed- and open-shell versions of DLPNO approaches.**

  - The open-shell version of the DLPNO approach uses a different strategy to the LPNO variant to define the
open-shell PNOs. This ensures that, unlike the open-shell LPNO, the PNO space converges to the closedshell counterpart in the closed-shell limit. Therefore, in the closed-shell limit, the open-shell DLPNO gives
identical correlation energy to the RHF variant up to at least the third decimal place. The perturbative triples
correction referred to as, (T), is also available for the open-shell species.

  - When performing a calculation on the open-shell species with either of canonical/LPNO/DLPNO methods
on top of the Slater determinant constructed from the QROs, special attention should be paid on the orbitals
energies of those QROs. In some cases, the orbitals energy of the highest SOMO appear to be higher than
that of the lowest VMO. Similarly to this, the orbital energy of the highest DOMO may appear to higher
than that of the lowest SOMOs. In such cases, the CEPA/QCISD/CCSD iteration may show difficulty in
convergence. In the worst case, it just diverges. Most likely, in such cases, one has to suspect the charge and
multiplicity might be wrong. If they are correct, you may need much prettier starting orbitals and a bit of
good luck! Apart from a careful choice of starting orbitals (in particular, DFT orbitals can be used in place
of the default HF orbitals if the latter have qualitative deficiencies, including but not limited to severe spin
contamination), changing the maximum DIIS expansion space size ( `MaxDIIS` ) and the level shift ( `LShift` )
in the `%mdci` block may alleviate the convergence problems to some extent.

  - DLPNO-CCSD(T)-F12 and DLPNO-CCSD(T1)-F12 (iterative triples) are available for both closed- and
open-shell cases. These methods employ a perturbative F12 correction on top of the DLPNO-CCSD(T)
correlation energy calculation. The F12 part of the code uses the RI approximation in the same spirit as the
canonical RI-F12 methods (refer to section *Explicitly Correlated MP2 and CCSD(T) Calculations* ). Hence,
they should be compared with methods using the RI approximation for both CC and F12 parts. The F12
correction takes only a fraction (usually 10-30%) of the total time (excluding SCF) required to calculate
the DLPNO-CCSD(T)-F12 correlation energy. Thus, the F12 correction scales the same (linear or nearlinear) as the parent DLPNO method. Furthermore, no new truncation parameters are introduced for the
F12 procedure, preserving the black-box nature of the DLPNO method. The F12D approximation is highly
recommended as it is computationally cheaper than the F12 approach which involves a double RI summation. Keywords: DLPNO-CCSD(T)-F12D, DLPNO-CCSD(T)-F12, DLPNO-CCSD(T1)-F12D, DLPNOCCSD(T1)-F12, DLPNO-CCSD-F12D, DLPNO-CCSD-F12.

  - Parallelization is done.

  - There are three thresholds that can be user controlled that can all be adjusted in the %mdci block: (a) *𝑇* CutPNO
controls the number of PNOs per electron pair. This is the most critical parameter and has a default value of
3 *.* 33 *×* 10 *[−]* [7] . (b) *𝑇* CutPairs controls a perturbative selection of significant pairs and has a default value of 10 *[−]* [4] .
(c) *𝑇* CutMKN is a technical parameter and controls the size of the fit set for each electron pair. It has a default
value of 10 *[−]* [3] . All of these default values are conservative. Hence, no adjustment of these parameters is
necessary. All DLPNO-CCSD truncations are bound to these three truncation parameters and should almost
not be touched (Hence they are also not documented :) ).

  - The preferred way to adjust accuracy when needed is to use the “LoosePNO/NormalPNO/TightPNO” keywords. In addition, “TightPNO” triggers the full iterative (DLPNO-MP2) treatment in the MP2 guess,
whereas the other options use a semicanonical MP2 calculation. Table 6.5 and Table 6.6 contain the thresholds used by the current (2016) and old (2013) implementations, respectively.

  - LPNO-VCEPA/n (n=1,2,3) methods are only available in the open-shell version yet.

**6.1. Single Point Energies and Gradients** **99**

**ORCA Manual** **,** **Release 6.0.1**

  - LPNO variants of the parameterized coupled-cluster methods (pCCSD, see section *Theory* ) are also available
(e.g. LPNO-pCCSD/1a and LPNO-pC/2a).

  - The LPNO methods reproduce the canonical energy differences to typically better than 1 kcal/mol. This
accuracy exists over large parts of the potential energy surface. Tightening TCutPairs to 1e-5 gives more
accurate results but also leads to significantly longer computation times.

  - Potential energy surfaces are virtually but not perfectly smooth (like any method that involves cut-offs).
Numerical gradient calculations have been attempted and reported to have been successful.

  - The LPNO methods do work together with RIJCOSX, RI-JK and also with ANO basis sets and basis set
extrapolation. They also work for conventional integral handling.

  - The methods behave excellently with large basis sets. Thus, they stay efficient even when large basis sets
are used that are necessary to obtain accurate results with wavefunction based *ab initio* methods. This is a
prerequisite for efficient computational chemistry applications.

  - For LPNO-CCSD, calculations with about 1000 basis functions are routine, calculations with about 1500 basis functions are possible and calculations with 2000-2500 basis functions are the limit on powerful computers. For DLPNO-CCSD much larger calculations are possible. There is virtually no crossover and DLPNOCCSD is essentially always more efficient than LPNO-CCSD. Starting from about 50 atoms the differences
become large. The largest DLPNO-CCSD calculation to date featured *>* 1000 atoms and more than 20000
basis functions!

  - Using large main memory is not mandatory but advantageous since it speeds up the initial integral transformation significantly (controlled by “MaxCore” in the %mdci block, see section *Local correlation* ).

  - The open-shell versions are about twice as expensive as the corresponding closed-shell versions.

  - Analytic gradients are not available.

  - An unrelaxed density implementation is available for closed-shell DLPNO-CCSD, permitting calculation of
first-order properties.

Table 6.5: Accuracy settings for DLPNO coupled cluster (current version).

The calculations are typical in the sense that: (a) the LPNO methods provide answers that are within 1 kcal/mol
of the canonical results, (b) CEPA approximates CCSD(T) more closely than CCSD. The speedups of a factor of
2 – 5 are moderate in this case. However, this is also a fairly small calculation. For larger systems, speedups of the
LPNO methods compared to their canonical counterparts are on the order of a factor *>* 100–1000.

**Cluster in molecules (CIM)**

Cluster in molecules (CIM) approach is a linear scaling local correlation method developed by Li and the coworkers
in 2002.[514] It was further improved by Li, Piecuch, Kállay and other groups recently.[337, 340, 515, 516, 730]
The CIM is inspired by the early local correlation method developed by Förner and coworkers.[250] The total
correlation energy of a closed-shell molecule can be considered as a summation of correlation energies of each
occupied LMOs.


*𝑜𝑐𝑐*
∑︁

*𝑖*


∑︁ *⟨𝑖𝑗||𝑎𝑏⟩𝑇* *𝑎𝑏* *[𝑖𝑗]* (6.7)

*𝑗,𝑎𝑏*


*𝐸* corr =


*𝑜𝑐𝑐*
∑︁ *𝐸* *𝑖* =

*𝑖*


1

4


For each occupied LMO, it only correlates with its nearby occupied LMOs and virtual MOs. To reproduce the
correlation energy of each occupied LMO, only a subset of occupied and virtual LMOs are needed in the correlation
calculation. Instead of doing the correlation calculation of the whole molecule, the correlation energies of all LMOs
can be obtained within various subsystems.

The CIM approach implemented in ORCA is following an algorithm proposed by Guo and coworkers with a few
improvements.[337, 340]

1. To avoid the real space cutoff, the differential overlap integral (DOI) is used instead of distance threshold.
There is only one parameter ‘CIMTHRESH’ in CIM approach, controlling the construction of CIM subsystems. If the DOI between LMO *i* and LMO *j* is larger than CIMTHRESH, LMO *j* will be included into the
MO domain of *i* . By including all nearby LMO of *i*, one can construct a subsystem for MO *i* . The default
value of CIMTHRESH is 0.001. If accurate results are needed, a tighter CIMTHRESH must be used.

2. Since ORCA 4.1, the neglected correlations between LMO *i* and LMOs outside the MO domain of *i* are
considered as well. These weak correlations are approximately evaluated by dipole moment integrals. With
this correction, the CIM results of 3 dimensional proteins are significantly improved. About 99.8% of the
correlation energies are recovered.

**6.1. Single Point Energies and Gradients** **101**

**ORCA Manual** **,** **Release 6.0.1**

The CIM can invoke different single reference correlation methods for the subsystem calculations. In ORCA
the CIM-RI-MP2, CIM-CCSD(T), CIM-DLPNO-MP2 and CIM-DLPNO-CCSD(T) methods are available. The
CIM-RI-MP2 and CIM-DLPNO-CCSD(T) have been proved to be very efficient and accurate methods to compute
correlation energies of very big molecules, containing a few thousand atoms.[340]
The usage of CIM in ORCA is simple. For CIM-RI-MP2,

For CIM-DLPNO-CCSD(T),



The parallel efficiency of CIM has been significantly improved.[340] Except for a few domain construction substeps, the CIM algorithm can achieve very high parallel efficiency. Since ORCA 4.1, the parallel version does not
support Windows platform anymore due to the parallelization strategy. The generalization of CIM from closedshell to open-shell (multi-reference) will also be implemented in the near future.

**Arbitrary Order Coupled-Cluster Calculations**

ORCA features an interface to Kallay’s powerful MRCC program. This program must be obtained separately. The
interface is restricted to single point energies but can be used for rigid scan calculations or numerical frequencies.

The use of the interface is simple:




The Method string can be any of:



(continues on next page)

**102** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

It is not a good idea, of course, to use this code for CCSD or CCSD(T) or CISD. Its real power lies in performing
the higher order calculations. Open-shell calculations can presently not be done with the interface.

Note also that certain high-order configuration interaction or coupled cluster methods, such as CISDT, CISDTQ,
CC3 and CCSDT etc., have now been implemented natively in ORCA in the AUTOCI module. For details please
consult section *CI methods using generated code* .

**6.1.4 Density Functional Theory**

**Standard Density Functional Calculations**

Density functional calculations are as simple to run as HF calculations. In this case, the RI-J approximation will
be the default for LDA, GGA or meta-GGA non-hybrid functionals, and the RIJCOSX for the hybrids. The RI-JK
approximation might also offer large speedups for smaller systems.

For example, consider this B3LYP calculation on the cyclohexane molecule.



If you want an accurate single point energy then it is wise to choose “ `TightSCF` ” and select a basis set of at least
valence triple-zeta plus polarization quality (e.g. `def2-TZVP` ).

**DFT Calculations with RI**

DFT calculations that do not require the HF exchange to be calculated (non-hybrid DFT) can be *very* efficiently
executed with the RI-J approximation. It leads to very large speedups at essentially no loss of accuracy. The use
of the RI-J approximation may be illustrated for a medium sized organic molecule - Penicillin:

(continues on next page)

**6.1. Single Point Energies and Gradients** **103**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

The job has 42 atoms and 430 contracted basis functions. Yet, it executes in just a few minutes elapsed time on
any reasonable personal computer.

NOTES:

  - The RI-J approximation requires an “auxiliary basis set” in addition to a normal orbital basis set. For the
Karlsruhe basis sets there is the universal auxiliary basis set of Weigend that is called with the name `def2/J`
(all-electron up to Kr). When scalar relativistic Hamiltonians are used (DKH or ZORA) along with allelectron basis sets, then a general-purpose auxiliary basis set is the `SARC/J` that covers most of the periodic
table. Other choices are documented in sections *Basis Sets* and *Choice of Basis Set* .

  - For “pure” functionals the use of RI-J with the `def2/J` auxiliary basis set is the default.

Since DFT is frequently applied to open-shell transition metals we also show one (more or less trivial) example of
a Cu(II) complex treated with DFT.



(continues on next page)

**104** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

Although it would not have been necessary for this example, it shows a possible strategy how to converge such
calculations. First a less accurate but fast job is performed using the RI approximation, a GGA functional and a
small basis set without polarization functions. Note that a larger damping factor has been used in order to guide the
calculation ( `SlowConv` ). The second job takes the orbitals of the first as input and performs a more accurate hybrid
DFT calculation. A subtle point in this calculation on a dianion in the gas phase is the command `GuessMode`
`CMatrix` that causes the corresponding orbital transformation to be used in order to match the orbitals of the
small and the large basis set calculation. This is always required when the orbital energies of the small basis set
calculation are positive as will be the case for anions.

**Hartree–Fock and Hybrid DFT Calculations with RIJCOSX**

Frustrated by the large difference in execution times between pure and hybrid functionals, we have been motivated
to study approximations to the Hartree-Fock exchange term. The method that we have finally come up with is called
the “chain of spheres” COSX approximation and may be thought of as a variant of the pseudo-spectral philosophy.
Essentially, in performing two electron integrals, the first integration is done numerically on a grid and the second
(involving the Coulomb singularity) is done analytically. For algorithmic and theoretical details see Refs. [624] and

[383]. Upon combining this treatment with the Split-RI-J method for the Coulomb term (thus, a Coulomb fitting
basis is needed!), we have designed the RIJCOSX approximation that can be used to accelerate Hartree-Fock and
hybrid DFT calculations. Note that this introduces another grid on top of the DFT integration grid which is usually
significantly smaller.

OBS.: Since ORCA 5, RIJCOSX is the default option for hybrid DFT (can be turned off by using !NOCOSX).
However, it is by default NOT turned on for HF.

In particular for large and accurate basis sets, the speedups obtained in this way are very large - we have observed
up to a factor of sixty! The procedure is essentially linear scaling such that large and accurate calculations become
possible with high efficiency. The RIJCOSX approximation is basically available throughout the program. The
default errors are on the order of 0.05 *±* 0.1 kcal mol *[−]* [1] or less in the total energies as well as in energy differences and can be made smaller with larger than the default grids or by running the final SCF cycle without this
approximation. The impact on bond distances is a fraction of a pm, angles are better than a few tenth of a degree
and soft dihedral angles are good to about 1 degree. To the limited extent to which it has been tested, vibrational
frequencies are roughly good to 0.1 wavenumbers with the default settings.

The use of RIJCOSX is very simple:



One thing to be mentioned in correlation calculations with RIJCOSX is that the requirements for the SCF and
correlation fitting bases are quite different. We therefore support two different auxiliary basis sets in the same run:

**6.1. Single Point Energies and Gradients** **105**

**ORCA Manual** **,** **Release 6.0.1**



**Hartree–Fock and Hybrid DFT Calculations with RI-JK**

An alternative algorithm for accelerating the HF exchange in hybrid DFT or HF calculations is to use the RI
approximation for both Coulomb and exchange. This is implemented in ORCA for SCF single point energies but
not for gradients.



The speedups for small molecules are better than for RIJCOSX, for medium sized molecules (e.g. (gly) 4 ) similar,
and for larger molecules RI-JK is less efficient than RIJCOSX. The errors of RI-JK are usually below 1 mEh and
the error is very smooth (smoother than for RIJCOSX). Hence, for small calculations with large basis sets, RI-JK
is a good idea, for large calculations on large molecules RIJCOSX is better.

**Note:**

  - For RI-JK you will need a larger auxiliary basis set. For the Karlsruhe basis set, the universal def2/JK and
def2/JKsmall basis sets are available. They are large and accurate.

  - For UHF RI-JK is roughly twice as expensive as for RHF. This is not true for RIJCOSX.

  - RI-JK is available for conventional and direct runs and also for ANO bases. There the conventional mode is

recommended.

A comparison of the RIJCOSX and RI-JK methods (taken from Ref. [465]) for the (gly) 2, (gly) 4 and (gly) 8 is
shown below (wall clock times in second for performing the entire SCF):

It is obvious from the data that for small molecules the RI-JK approximation is the most efficient choice. For (gly) 4
this is already no longer obvious. For up to the def2-TZVPP basis set, RI-JK and RIJCOSX are almost identical
and for def2-QZVPP RIJCOSX is already a factor of two faster than RI-JK. For large molecules like (gly) 8 with
small basis sets RI-JK is not a big improvement but for large basis set it still beats the normal 4-index calculation.
RIJCOSX on the other hand is consistently faster. It leads to speedups of around 10 for def2-TZVPP and up to
50-60 for def2-QZVPP. Here it outperforms RI-JK by, again, a factor of two.

**106** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**DFT Calculations with Second Order Perturbative Correction (Double-Hybrid Functionals)**

There is a family of functionals which came up in 2006 and were proposed by Grimme [320]. They consist of a
semi-empirical mixture of DFT components and the MP2 correlation energy calculated with the DFT orbitals and
their energies. Grimme referred to his functional as B2PLYP (B88 exchange, 2 parameters that were fitted and
perturbative mixture of MP2 and LYP) – a version with improved performance (in particular for weak interactions)
is mPW2PLYP [773] and is also implemented. From the extensive calibration work, the new functionals appear
to give better energetics and a narrower error distribution than B3LYP. Thus, the additional cost of the calculation
of the MP2 energy may be well invested (and is quite limited in conjunction with density fitting in the RI part).
Martin has reported reparameterizations of B2PLYP (B2GP-PLYP, B2K-PLYP and B2T-PLYP) that are optimized
for “general-purpose”, “kinetic” and “thermochemistry” applications.[436, 844] In 2011, Goerigk and Grimme
published the PWPB95 functional with spin-opposite-scaling and relatively low amounts of Fock exchange, which
make it promising for both main-group and transition-metal chemistry. [308]

Among the best performing density functionals[312] are Martin’s “DSD”-double-hybrids, which use different combinations of exchange and correlation potentials and spin-component-scaled MP2 mixing. Three of these doublehybrids (DSD-BLYP, DSD-PBEP86 and DSD-PBEB95)[467, 468, 469] are available via simple input keywords.
Different sets of parameters for the DSD-double-hybrids are published, e.g. for the use with and without D3.
The keywords `DSD-BLYP`, `DSD-PBEP86` and `DSD-PBEB95` request parameters consistent with the GMTKN55[312]
benchmark set results. The keywords `DSD-BLYP/2013` and `DSD-PBEP86/2013` request the slightly different parameter sets used in the 2013 paper by Kozuch and Martin.[469] To avoid confusion, the different parameters are
presented in Table 6.7.

Table 6.7: DSD-DFT parameters defined in ORCA

Note that D3A1 is always 0 for these functionals.

Three different variants of MP2 can be used in conjunction with these functionals. Just specifying the functional
name leads to the use of RI-MP2 by default. In this case, an appropriate auxiliary basis set for correlation fitting
needs to be specified. It is very strongly recommended to use the RI variants instead of conventional MP2, as their
performance is vastly better. Indeed, there is hardly ever any reason to use conventional MP2. To turn this option
off just use !NORI in the simple input (which also turns off the RIJCOSX approximation) or `%mp2 RI false`
`end` . More information can be found in the relevant sections regarding RI-MP2.

Finally, DLPNO-MP2 can be used as a component of double-hybrid density functionals. In that case, a “ `DLPNO-` ”
prefix needs to be added to the functional name, for example `DLPNO-B2GP-PLYP` or `DLPNO-DSD-PBEP86` . Please
refer to the relevant manual sections for more information on the DLPNO-MP2 method.

For each functional, parameters can be specified explicitly in the input file, e.g. for RI-DSD-PBEB95 with D3BJ:



(continues on next page)

**6.1. Single Point Energies and Gradients** **107**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

In this version of ORCA, double-hybrid DFT is available for single points, geometry optimizations [620], dipole
moments and other first order properties, magnetic second order properties (chemical shifts, g-tensors), as well as
for numerical polarizabilities and frequencies.

There are also double-hybrid functionals, such as XYG3 and *𝜔* B97M(2), which must be applied to orbitals converged with a different functional. This can be accomplished with a two-step calculation using `MORead` and
`MaxIter=1` . Note that because the orbitals are not obtained self-consistently, only single point energies can be
computed in this way, i.e. no density, gradient, or properties! For example, the *𝜔* B97M(2) functional must be used
with *𝜔* B97M-V orbitals,[558] which can be done with the following input:



**108** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**DFT Calculations with Atom-pairwise Dispersion Correction**

It is well known that many DFT functionals do not include dispersion forces. It is possible to use a simple atompairwise correction to account for the major parts of this contribution to the energy [131, 321, 324, 326]. We have
adopted the code and method developed by Stefan Grimme in this ORCA version. The method is parameterized for
many established functionals (e.g. BLYP, BP86, PBE, TPSS, B3LYP, B2PLYP). [7] For the 2010 model the BeckeJohnson damping version ( `! D3BJ` ) is the default and will automatically be invoked by the simple keyword `! D3` .
The charge dependent atom-pairwise dispersion correction (keyword `! D4` ) is using the D4(EEQ)-ATM dispersion
model[132], other D4 versions, using tight-binding partial charges, are currently only available with the standalone
DFT-D4 program.



In this example, a BLYP calculation without dispersion correction will show a repulsive potential between the argon
atom and the methane molecule. Using the D3 dispersion correction as shown above, the potential curve shows
a minimum at about 3.1 *−* 3.2 Å. The atom-pairwise correction is quite successful and Grimme’s work suggests
that this is more generally true. For many systems like stacked DNA base pairs, hydrogen bond complexes and
other weak interactions the atom-pairwise dispersion correction will improve substantially the results of standard
functionals at essentially no extra cost.

**Note:**

  - Dispersion corrections do not only affect non-covalent complexes, but also affect conformational energies
(and conformer structures) which are heavily influenced by intramolecular dispersion. Therefore, for large
and/or flexible molecules, including the dispersion correction is almost always recommended or even required (except for a handful of cases where it cannot, should not or need not be used, see below). For
small systems, the dipersion correction may result in basically no improvement of the results, but is usually
harmless anyway.

  - DFT calculations with small basis sets (such as double zeta basis sets) often yield attractive potential energy
surfaces even without the dispersion correction. However, this is due to basis set superposition error (BSSE),
and the interaction energy brought about by the BSSE frequently does not match the true interaction energy
due to dispersion (because they have completely different origins). Therefore, although a DFT double zeta
calculation without the dispersion correction may appear to give qualitatively correct results, or occasionally
even better results than a double zeta calculation with dispersion corrections (because in the latter case one
typically overestimates the total attraction), it is still highly recommended to “get the right answer for the
right reason” by reducing the BSSE and turning on the dispersion correction. The BSSE can be corrected
by a variety of means, for example (1) by using a larger basis set; (2) by using the counterpoise correction

7 For expert users: The keyword `D2`, `D3ZERO`, `D3BJ` and `D4` select the empirical 2006, the atom-pairwise 2010 model, respectively, with
either zero-damping or Becke-Johnson damping, or the partial charge dependent atom-pairwise 2018 model. The default is the most accurate
`D3BJ` model. The outdated model from 2004 [319] is no longer supported and can only be invoked by setting `DFTDOPT = 1` . The C6-scaling
coefficient can be user defined using e.g. “ `%method DFTDScaleC6 1.2 end` ”

**6.1. Single Point Energies and Gradients** **109**

**ORCA Manual** **,** **Release 6.0.1**

( *Counterpoise Correction* ); or (3) by using the geometrical counterpoise correction (section *DFT and HF*
*Calculations with the Geometrical Counterpoise Correction: gCP* ). Of these, (3) is available at almost no
cost (including analytic gradient contributions), and is especially suitable for geometry optimization of large
molecules. Otherwise (1) (or its combination with (2)) may be more appropriate due to its higher accuracy.

  - Functionals that contain VV10-type non-local dispersion (in general, these are the functionals whose names
end with “-V”) do not need (and cannot be used together with) dispersion corrections. The same holds for
post-HF and multireference methods, like MP2, CCSD(T), CASSCF and NEVPT2. However, one can add
a dispersion correction on top of HF.

  - Certain functionals, especially the Minnesota family of functionals (e.g. M06-2X), describe medium-range
dispersion but miss long-range dispersion. They give reasonable dispersion energies for small to medium
systems but may slightly underestimate the dispersion energies for large systems. For them, dispersion corrections are only available in the zero-damping variant, and one should use the `D3ZERO` keyword instead
of the `D3` keyword. As the uncorrected functional already accounts for the bulk of the dispersion in this
case, the dispersion correction is much less important than e.g. the case of B3LYP, and should in general be
considered as beneficial but not mandatory.

  - Some density functional developers reparameterize the functional itself while parameterizing the dispersion
correction. A famous example is the *𝜔* B97X family of functionals, to be detailed in the next section. For
these functionals, the `D3`, `D3BJ` or `D4` keywords should be hyphenated with the name of the functional itself, and some quantities that normally would not change when adding dispersion corrections (e.g. orbitals,
excitation energies, dipole moments) may change slightly when adding or removing the dispersion correction. Likewise, for these functionals the structural changes that one observe upon adding or removing the
dispersion correction cannot be completely attributed to the dispersion correction itself, but may contain
contributions due to the change of the functional.

**DFT Calculations with Range-Separated Hybrid Functionals**

All range-separated functionals in ORCA use the error function based approach according to Hirao and coworkers.[410] This allows the definition of DFT functionals that dominate the short-range part by an adapted exchange
functional of LDA, GGA or meta-GGA level and the long-range part by Hartree-Fock exchange.

CAM-B3LYP,[900] LC-BLYP[846], LC-PBE[410, 602] and members of the *𝜔* B97-family of functionals have
been implemented into ORCA, namely *𝜔* B97, *𝜔* B97X[151], *𝜔* B97X-D3[525], *𝜔* B97X-V[555], *𝜔* B97M-V[557],
*𝜔* B97X-D3BJ and *𝜔* B97M-D3BJ.[603] (For more information on *𝜔* B97X-V[555] and *𝜔* B97M-V[557] see section
*DFT Calculations with the Non-Local, Density Dependent Dispersion Correction (VV10): DFT-NL* .) Some of
them incorporate fixed amounts of Hartree-Fock exchange (EXX) and/or DFT exchange and they differ in the RSparameter *𝜇* . In the case of *𝜔* B97X-D3, the proper D3 correction (employing the zero-damping scheme) should
be calculated automatically. The D3BJ correction is used automatically for *𝜔* B97X-D3BJ and *𝜔* B97M-D3BJ (as
well as for the meta-GGA B97M-D3BJ). The same is true for the D4-based variants *𝜔* B97M-D4 and *𝜔* B97X-D4.
The D3BJ and D4 variants have also been shown to perform well for geometry optimizations [604].

Several restrictions apply to these functionals at the moment. They have only been implemented and tested for use
with the `libint` integral package and for RHF and UHF single-point, ground state nuclear gradient, ground state
nuclear Hessian, TDDFT, and TDDFT nuclear gradient calculations. Only the standard integral handling (NORI),
RIJONX, and RIJCOSX are supported. **Do not use these functionals with any other options** .

**110** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**DFT Calculations with Range-Separated Double Hybrid Functionals**

For the specifics of the range-separated double-hybrid functionals the user is referred to sections *DFT Calcula-*
*tions with Second Order Perturbative Correction (Double-Hybrid Functionals)*, *DFT Calculations with Range-*
*Separated Hybrid Functionals* and *Doubles Correction* . The first range-separated double hybrids available in
ORCA were *𝜔* B2PLYP and *𝜔* B2GP-PLYP[146]. Both were optimized for the calculation of excitation energies,
but they have recently also been tested for ground-state properties[602].

A large variety of range-separated double hybrids with and without spin-component/opposite scaling have become
available in ORCA 5. Some have been developed with ground-state properties in mind, most for excitation energies.
See Section *Choice of Functional* for more details and citations.

**6.1.5 Quadratic Convergence**

The standard SCF implementation in ORCA uses the DIIS algorithm[703, 704] for initial and an approximate
second-order converger for final convergence[264, 608]. This approach converges quickly for most chemical systems. However, there are many interesting systems with a more complicated electronic structure for which the
standard SCF protocol converges either **slowly** (“creeping”), converges to an **excited state**, or **diverges** . In those
cases, a newly developed trust-region augmented Hessian ( `TRAH` ) SCF approach[64, 349, 381, 735] should be used.
The TRAH-SCF method always converges to a local minimum and converges quadratically near the solution.

You can run `TRAH` from the beginning by adding
```
! TRAH

```
to the simple input line if you expect convergence difficulties. Open-shell molecules notoriously have SCF convergence issues, in particular, if they are composed of many open-shell atoms. In Fig. 6.10, the convergence of a
TRAH-SCF calculation is shown for a high-spin Rh cluster for which the standard SCF diverges. The errors of the
electronic gradient or residual vector converge almost steadily below the default `TRAH` accuracy of 10 *[−]* [6] .

Rh 12 [+] cluster (M s = 36)

Fig. 6.10: TRAH-SCF gradient norm of a PBE/def2-TZVP calculation for a Rh [+] 12 [cluster in high-spin configuration]
(M s = 36). The structure was taken from Ref. [362].

Alternatively, `TRAH` is launched automatically if standard SCF (DIIS/SOSCF) shows converge problems (default),
an approach which is called `AutoTRAH` .



You can switch off the automatic start of `TRAH` by adding

**6.1. Single Point Energies and Gradients** **111**

**ORCA Manual** **,** **Release 6.0.1**
```
! NOTRAH

```
to the simple input line or



Convergence problems are detected by comparing the norm of the electronic gradient at multiple iterations which
is explained in more detail in Sec. *Trust-Region Augmented Hessian (TRAH) SCF* .

TRAH-SCF is currently implemented for restricted closed-shell ( `RHF` and `RKS` ) and unrestricted open-shell determinants ( `UHF` and `UKS` ) and can be accelerated with `RIJ`, `RIJONX`, `RIJK`, or `RIJCOSX` . Solvation effects can also be
accounted for with the `C-PCM` and `SMD` models. Restricted open-shell calculations are not possible yet.

TRAH-SCF can also be applied to large molecules as it is parallelized and works with AO Fock matrices. However,
for systems with large HOMO-LUMO gaps that converge well, the default SCF converger is usually faster because
the screening in `TRAH` is less effective and more iterations are required.

For a more detailed documentation we refer to Sec. *Trust-Region Augmented Hessian (TRAH) SCF* .

**Note:**

  - TRAH is mathematically guaranteed to converge with a sufficient number of iterations, provided that there
is no numerical noise (e.g. round-off error, truncation error) in the calculation. Therefore, if TRAH fails to
converge, this means that either the default number of iterations is not large enough, or certain numerical
thresholds are not tight enough. One can verify whether the former possibility is operative by checking
whether the error still decreases steadily towards zero in the last SCF iterations. If yes, one can increase
the number of iterations; otherwise it may be worthwhile to try increasing the integration grid, tighten the
integral thresholds, etc.

  - For some functionals (e.g. `PWPB95` ), the native ORCA implementation supports only their XC energies and
potentials, but not their XC kernels. In this case one should switch to the LibXC implementation instead, e.g.
replace `PWPB95` by `LIBXC(PWPB95)` . Otherwise the calculation aborts upon entering the TRAH procedure.

**6.1.6 Counterpoise Correction**

In calculating weak molecular interactions the nasty subject of the basis set superposition error (BSSE) arises. It
consists of the fact that if one describes a dimer, the basis functions on A help to lower the energy of fragment B and
vice versa. Thus, one obtains an energy that is biased towards the dimer formation due to basis set effects. Since this
is unwanted, the Boys and Bernardi procedure aims to correct for this deficiency by estimating what the energies
of the monomers would be if they had been calculated with the dimer basis set. This will stabilize the monomers
relative to the dimers. The effect can be a quite sizable fraction of the interaction energy and should therefore be
taken into account. The original Boys and Bernardi formula for the interaction energy between fragments A and B

is:

∆ *𝐸* = *𝐸* *𝐴𝐵* *[𝐴𝐵]* [(] *[𝐴𝐵]* [)] *[ −]* *[𝐸]* *𝐴* *[𝐴]* [(] *[𝐴]* [)] *[ −]* *[𝐸]* *𝐵* *[𝐵]* [(] *[𝐵]* [)] *[ −]* [︀ *𝐸* *𝐴* *[𝐴𝐵]* [(] *[𝐴𝐵]* [)] *[ −]* *[𝐸]* *𝐴* *[𝐴𝐵]* [(] *[𝐴]* [) +] *[ 𝐸]* *𝐵* *[𝐴𝐵]* [(] *[𝐴𝐵]* [)] *[ −]* *[𝐸]* *𝐵* *[𝐴𝐵]* [(] *[𝐵]* [)] ]︀ (6.8)

Here *𝐸* *𝑋* *[𝑌]* [(] *[𝑍]* [)][ is the energy of fragment X calculated at the optimized geometry of fragment Y with the basis set of]
fragment Z. Thus, you need to do a total the following series of calculations:

1. optimize the geometry of the dimer and the monomers with some basis set Z. This gives you *𝐸* *𝐴𝐵* *[𝐴𝐵]* [(] *[𝐴𝐵]* [)][,]
*𝐸* *𝐴* *[𝐴]* [(] *[𝐴]* [)][ and] *[ 𝐸]* *𝐵* *[𝐵]* [(] *[𝐵]* [)]

2. delete fragment A (B) from the optimized structure of the dimer and re-run the single point calculation with
basis set Z. This gives you *𝐸* *𝐵* *[𝐴𝐵]* ( *𝐵* ) and *𝐸* *𝐴* *[𝐴𝐵]* ( *𝐴* ).

3. Now, the final calculation consists of calculating the energies of A and B at the dimer geometry but with the
dimer basis set. This gives you *𝐸* *𝐴* *[𝐴𝐵]* ( *𝐴𝐵* ) and *𝐸* *𝐵* *[𝐴𝐵]* ( *𝐴𝐵* ).

**112** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

In order to achieve the last step efficiently, a special notation was put into ORCA which allows you to delete the
electrons and nuclear charges that come with certain atoms but retain the assigned basis set. This trick consists of
putting a “:” after the symbol of the atom. Here is an example of how to run such a calculation of the water dimer
at the MP2 level (with frozen core):



(continues on next page)

**6.1. Single Point Energies and Gradients** **113**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

You obtain the energies:




It is also possible to set entire fragments as ghost atoms using the `GhostFrags` keyword as shown below. See
section *Fragment Specification* for different ways of defining fragments.



(continues on next page)

**114** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

Starting from ORCA 6.0, we support geometry optimizations with the counterpoise correction, using analytic gradients. This opens up the way of obtaining accurate non-covalent complex geometries (instead of just interaction energies) using modest basis sets. To use this functionality, one should NOT simply add `!Opt` to the above input files, but should instead use the dedicated compound script `BSSEOptimization.cmp` available in the ORCA Compound Script repository
(https://github.com/ORCAQuantumChemistry/CompoundScripts/blob/main/GeometryOptimization/BSSEOptimization.cmp).
Detailed usage are described in the comments of the compound script.

**6.1.7 Complete Active Space Self-Consistent Field Method**

**Introduction**

There are several situations where a complete-active space self-consistent field (CASSCF) treatment is a good idea:

  - Wavefunctions with significant multireference character arising from several nearly degenerate configurations (static correlation)

  - Wavefunctions which require a multideterminantal treatment (for example multiplets of atoms, ions, transition metal complexes, )

  - Situations in which bonds are broken or partially broken.

  - Generation of orbitals which are a compromise between the requirements for several states.

  - Generation of start orbitals for multireference methods covering dynamic correlation (NEVPT2, MRCI,
MREOM, ...)

  - Generation of genuine spin eigenfunctions for multideterminantal/multireference wavefunctions.

In all of these cases the single-determinantal Hartree-Fock method fails badly and in most of these cases DFT
methods will also fail. In these cases a CASSCF method is a good starting point. CASSCF is a special case of
multiconfigurational SCF (MCSCF) methods which specialize to the situation where the orbitals are divided into
three-subspaces: (a) the internal orbitals which are doubly occupied in all configuration state functions (CSFs) (b)
partially occupied (active) orbitals (c) virtual (external) orbitals which are empty in all CSFs.

A fixed number of electrons is assigned to the internal subspace and the active subspace. If N-electrons are “active”
in M orbitals one speaks of a CASSCF(N,M) wavefunctions. All spin-eigenfunctions for N-electrons in M orbitals
are included in the configuration interaction step and the energy is made stationary with respect to variations in the
MO and the CI coefficients. Any number of roots of any number of different multiplicities can be calculated and
the CASSCF energy may be optimized with respect to a user defined average of these states.

The CASSCF method has the nice advantage that it is fully variational which renders the calculation of analytical
gradients relatively easy. Thus, the CASSCF method may be used for geometry optimizations and numerical
frequency calculations.

The price to pay for this strongly enhanced flexibility relative to the single-determinantal HF method is that the
CASSCF method requires more computational resources and also more insight and planning from the user side.
The technical details are explained in section *The Complete Active Space Self-Consistent Field (CASSCF) Module* .
Here we explain the use of the CASSCF method by examples. In addition to the description in the manual, there
is a separate tutorial for CASSCF with many more examples in the field of coordination chemistry. The tutorial
covers the design of the calculation, practical tips on convergence as well as the computation of properties.

A number of properties are available in ORCA (g-tensor, ZFS splitting, CD, MCD, susceptibility, dipoles, ...). The
majority of CASSCF properties such as EPR parameters are computed in the framework of the quasi-degenerate
perturbation theory. Some properties such as ZFS splittings can also be computed via perturbation theory or
rigorously extracted from an effective Hamiltonian. For a detailed description of the available properties and
options see section *CASSCF Properties* . All the aforementioned properties are computed within the CASSCF
module. An exception are Mössbauer parameters, which are computed with the usual keywords using the EPRNMR
module ( *Mössbauer Parameters* ).

**6.1. Single Point Energies and Gradients** **115**

**ORCA Manual** **,** **Release 6.0.1**

**A simple Example**

One standard example of a multireference system is the Be atom. Let us run two calculations, a standard closedshell calculation (1s [2] 2s [2] ) and a CASSCF(2,4) calculation which also includes the (1s [2] 2s [1] 2p [1] ) and (1s [2] 2s [0] 2p [2] )
configurations.



This standard closed-shell calculation yields the energy `-14.56213241 Eh` . The CASSCF calculation



yields the energy `-14.605381525 Eh` . Thus, the inclusion of the 2p shell results in an energy lowering of 43 mEh
which is considerable. The CASSCF program also prints the composition of the wavefunction:

This information is to be read as follows: The lowest state is composed of 90% of the configuration which has the
active space occupation pattern 2000 which means that the first active orbital is doubly occupied in this configuration while the other three are empty. The MO vector composition tells us what these orbitals are (ORCA uses
natural orbitals to canonicalize the active space).



Thus, the first active space orbital has occupation number 1.80121 and is the Be-2s orbital. The other three orbitals
are 2p in character and all have the same occupation number 0.06626. Since they are degenerate in occupation
number space, they are arbitrary mixtures of the three 2p orbitals. It is then clear that the other components of the
wavefunction (each with 3.31%) are those in which one of the 2p orbitals is doubly occupied.

How did we know how to put the 2s and 2p orbitals in the active space? The answer is – WE DID NOT KNOW! In
this case it was “good luck” that the initial guess produced the orbitals in such an order that we had the 2s and 2p
orbitals active. **IN GENERAL IT IS YOUR RESPONSIBILITY THAT THE ORBITALS ARE ORDERED**

**SUCH THAT THE ORBITALS THAT YOU WANT IN THE ACTIVE SPACE COME IN THE DESIRED**

**ORDER** . In many cases this will require re-ordering and **CAREFUL INSPECTION** of the starting orbitals.

**116** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**Attention:** If you include orbitals in the active space that are nearly empty or nearly doubly occupied, convegence problems are likely. The SuperCI(PT) [459] and Newton-Raphson method are less prone to these
problems.

**Starting Orbitals**

**Tip:** In many cases natural orbitals of a simple correlated calculation of some kind provide a good starting point
for CASSCF.

Let us illustrate this principle with a calculation on the Benzene molecule where we want to include all six *𝜋* -orbitals
in the active space. After doing a RHF calculation:


We can look at the orbitals around the HOMO/LUMO gap:



(continues on next page)

**6.1. Single Point Energies and Gradients** **117**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)
```
 2 C dxy 0.0 0.1 0.5 0.0 0.0 0.0
 3 C s 2.9 0.0 0.3 0.1 0.0 0.0
 3 C pz 0.0 0.0 0.0 0.0 16.5 0.0
 3 C px 1.4 12.4 5.9 0.3 0.0 11.2
 3 C py 4.2 4.1 10.1 5.9 0.0 0.1
 3 C dyz 0.0 0.0 0.0 0.0 0.1 0.0
 3 C dx2y2 0.1 0.1 0.2 0.2 0.0 0.5
 3 C dxy 0.4 0.0 0.0 0.2 0.0 0.0
 4 C s 2.9 0.0 0.3 0.1 0.0 0.0
 4 C pz 0.0 0.0 0.0 0.0 16.5 0.0
 4 C px 1.4 12.4 5.9 0.3 0.0 11.2
 4 C py 4.2 4.1 10.1 5.9 0.0 0.1
 4 C dyz 0.0 0.0 0.0 0.0 0.1 0.0
 4 C dx2y2 0.1 0.1 0.2 0.2 0.0 0.5
 4 C dxy 0.4 0.0 0.0 0.2 0.0 0.0
 5 C s 2.9 0.0 0.0 0.4 0.0 0.1
 5 C pz 0.0 0.0 0.0 0.0 16.5 0.0
 5 C px 5.7 0.0 0.0 20.9 0.0 10.1
 5 C py 0.0 16.5 1.3 0.0 0.0 0.0
 5 C dxz 0.0 0.0 0.0 0.0 0.1 0.0
 5 C dx2y2 0.6 0.0 0.0 0.2 0.0 1.2
 5 C dxy 0.0 0.1 0.5 0.0 0.0 0.0
 6 H s 7.5 0.0 7.5 2.5 0.0 2.5
 7 H s 7.5 0.0 7.5 2.5 0.0 2.5
 8 H s 7.5 0.0 0.0 10.0 0.0 9.9
 9 H s 7.5 0.0 7.5 2.5 0.0 2.5
10 H s 7.5 0.0 7.5 2.5 0.0 2.5
11 H s 7.5 0.0 0.0 10.0 0.0 9.9
           18 19 20 21 22 23
         -0.49833 -0.33937 -0.33937 0.13472 0.13472 0.18198
          2.00000 2.00000 2.00000 0.00000 0.00000 0.00000
         -------- -------- -------- -------- -------- ------- 0 C s 0.1 0.0 0.0 0.0 0.0 2.2
 0 C pz 0.0 8.1 24.4 7.8 23.4 0.0
 0 C px 0.1 0.0 0.0 0.0 0.0 0.6
 0 C py 10.4 0.0 0.0 0.0 0.0 1.7
 0 C dxz 0.0 0.4 0.2 0.7 0.7 0.0
 0 C dyz 0.0 0.2 0.0 0.7 0.0 0.0
 0 C dx2y2 0.0 0.0 0.0 0.0 0.0 0.2
 0 C dxy 1.0 0.0 0.0 0.0 0.0 0.5
 1 C s 0.1 0.0 0.0 0.0 0.0 2.2
 1 C pz 0.0 8.1 24.4 7.8 23.4 0.0
 1 C px 0.1 0.0 0.0 0.0 0.0 0.6
 1 C py 10.4 0.0 0.0 0.0 0.0 1.7
 1 C dxz 0.0 0.4 0.2 0.7 0.7 0.0
 1 C dyz 0.0 0.2 0.0 0.7 0.0 0.0
 1 C dx2y2 0.0 0.0 0.0 0.0 0.0 0.2
 1 C dxy 1.0 0.0 0.0 0.0 0.0 0.5
 2 C s 0.0 0.0 0.0 0.0 0.0 2.2
 2 C pz 0.0 32.5 0.0 31.2 0.0 0.0
 2 C px 0.0 0.0 0.0 0.0 0.0 2.2
 2 C py 11.6 0.0 0.0 0.0 0.0 0.0
 2 C dxz 0.0 0.1 0.0 0.3 0.0 0.0
 2 C dyz 0.0 0.0 0.8 0.0 1.8 0.0
 2 C dx2y2 0.0 0.0 0.0 0.0 0.0 0.7
 2 C dxy 0.4 0.0 0.0 0.0 0.0 0.0
 3 C s 0.1 0.0 0.0 0.0 0.0 2.2
 3 C pz 0.0 8.1 24.4 7.8 23.4 0.0
 3 C px 0.1 0.0 0.0 0.0 0.0 0.6
 3 C py 10.4 0.0 0.0 0.0 0.0 1.7

```
(continues on next page)

**118** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

We see that the occupied *𝜋* -orbitals number 16, 19, 20 and the unoccupied ones start with 21 and 22. However, the
sixth high-lying *𝜋* *[*]* -orbital cannot easily be found. Thus, let us run a simple selected CEPA/2 calculation and look
at the natural orbitals.


The calculation prints the occupation numbers:



(continues on next page)

**6.1. Single Point Energies and Gradients** **119**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

From these occupation number it becomes evident that there are several natural orbitals which are not quite doubly
occupied MOs. Those with an occupation number of 1.95 and less should certainly be taken as active. In addition
the rather strongly occupied virtual MOs 21-23 should also be active leading to CASSCF(6,6). Let us see what
these orbitals are before starting CASSCF:



Leading to:



This shows us that these six orbitals are precisely the *𝜋* / *𝜋* *[*]* orbitals that we wanted to have active (you can also plot
them to get even more insight).

Now we know that the desired orbitals are in the correct order, we can do CASSCF:

**120** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

To highlight the feature `SwitchStep` of the CASSCF program, we employ the Newton-Raphson method (NR)
after a certain convergence has been reached ( `SwitchStep NR` statement). In general, it is not recommended to
change the default convergence settings! The output of the CASSCF program is:



(continues on next page)

**6.1. Single Point Energies and Gradients** **121**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



First of all you can see how the program cycles between CI-vector optimization and orbital optimization steps
(so-called unfolded two-step procedure). After 3 iterations, the program switches to the Newton-Raphson solver
which then converges very rapidly. Orbital optimization with the Newton-Raphson solver is limited to smaller sized
molecules, as the program produces lengthy integrals and Hessian files. In the majority of situations the default
converger (SuperCI(PT)) is the preferred choice.[459]

**122** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**Atomic Valence Active Space**

Very good starting orbitals that are targeted to a specific user-given active space can be generated with the Atomic
Valence Active Space (AVAS) procedure. [752, 753] The general idea is that the user provides a set of atomic
orbitals (AO) of a minimal basis set that are sufficient to qualitatively represent the final CASSCF active orbitals.
Typical examples are

  - p z orbitals of a *𝜋* system chromophore in a molecule

  - five valence (or 10 double-shell) d orbitals of a transition-metal (TM) atom in a molecule

  - seven valence (or 14 double-shell) f orbitals of a lanthanide or actinide atom in a molecule

Then, by the help of linear algebra (singular-value decomposition) AVAS rotates the starting molecular orbitals
(MOs) such that they have maximum overlap with the target AOs. With those rotated MOs that have a sufficiently
large singular value (> 0.4 (default)) are considered as active orbitals. In that manner, AVAS can automatically
determine an active space, i.e. the number of active orbitals and electrons, that is now specified by the target AOs.

As a first example, we now consider CuCl *[−]* 4 [in a minimal active space]



The keyword `! AVAS(Valence-D)` seeks for all transition-metal atoms in the molecule and inserts a single minimal d basis function for each TM atom. All five component *𝑀* *𝐿* of the basis function are then considered. The
AVAS procedure prints singular / eigen values for the occupied and virtual orbital space and easily finds the desired
minimal active space CAS(9,5).




(continues on next page)

**6.1. Single Point Energies and Gradients** **123**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

The five initial active orbitals after being processed by AVAS indeed look like the desired Cu d-orbitals.

(a) σ *[𝑜]* 1 [= 0.977] (b) σ *[𝑜]* 3 [= 0.975] (c) σ *[𝑜]* 0 [= 0.985]

(d) σ *[𝑜]* 4 [= 0.967] (e) σ *[𝑜]* 2 [= 0.977]

Fig. 6.11: Initial Minimal AS orbitals of CuCl *[−]* 4 [generated by AVAS.]

The same calculation can be started also by using the `%scf avas ... end end` block.



Here, it is also possible to use target basis functions at different atoms ( `center` ) and to select only a subset of
functions in a shell ( *𝑚* l ). Note that if not all functions of a shell (3p, 5d, 7f) are selected, the molecule should be
oriented manually to accomplish the desired basis function overlap.

AVAS can be also used very conveniently in the same fashion for double-d shell calculations with transition-metal
complexes ( `! AVAS(Double-D)` ). For each 3d transition-metal center in a molecule all 3d and 4d target functions
are considered. Similarly, double-shell active spaces can be also set up for 4d and 5d transition-metal complexes.

There is also a similar keyword for lanthanides and actinides. `!` `AVAS( Valence-F )` attempts to set up an
active space with 7 f functions for each lanthanide or actinide atom in a molecule. There is also the possibility to

**124** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

run double-f shell calculations using the `! AVAS( Double-F )` keyword.

To avoid this issue for *𝜋* active space calculation, all three 2p target AOs are considered first but they are weighted
by the three component of the principle axis of inertia with the largest moment. [752] For those inertia moment
calculations, masses are ignored and only the centers of the desired target p AO are considered.

For a CAS(10,9) *𝜋* -active space calculation on tryptophan, the AVAS input read



and leads to the following output



(continues on next page)

**6.1. Single Point Energies and Gradients** **125**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



and initial active orbitals.

**126** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(a) σ *[𝑜]* 4 [= 0.978] (b) σ *[𝑜]* 3 [= 0.987] (c) σ *[𝑜]* 2 [= 0.993]

(d) σ *[𝑜]* 1 [= 0.994] (e) σ *[𝑜]* 0 [= 0.996] (f) σ *[𝑣]* 0 [= 1.000]

(g) σ *[𝑣]* 1 [= 1.000] (h) σ *[𝑣]* 2 [= 1.000] (i) σ *[𝑣]* 3 [= 0.960]

Fig. 6.12: Initial *𝜋* AS orbitals of tryptophan generated by AVAS.

It is also possible to specify the number of active electrons `nel` and orbitals `norb` directly. For such a calculation, the
AVAS singular value decomposition threshold `tol` is ignored. In the following calculation, the strongly occupied
orbital from the previous CAS(10,9) ( *𝜎* 4 [o] [in][ Fig. 6.12][) calculation is omitted.]



It is also possible to do the AVAS start MO generation for several `system` s independently and then reorthonormalize all MOs at the end similar to [752]. This becomes interesting for generating starting orbitals for
multiple *𝜋* chromophores like the bridged bithiophene biradical



(continues on next page)

**6.1. Single Point Energies and Gradients** **127**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

or the FeTPP molecule.



(continues on next page)

**128** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

For those systems, all AVAS starting MOs have the desired *𝜋* or *𝑑* character as illustrated for the “active frontier
orbitals” in Fig. 6.13.

(a) AVAS HOMO

(b) AVAS LUMO

(c) AVAS HOMO (d) AVAS LUMO

Fig. 6.13: Initial HOMO and LUMO AVAS orbitals of a bridged bithiophene biradical and FeTPP.

**6.1. Single Point Energies and Gradients** **129**

**ORCA Manual** **,** **Release 6.0.1**

**CASSCF and Symmetry**

The CASSCF program can make some use of symmetry. Thus, it is possible to do the CI calculations separated by
irreducible representations. This allows one to calculate electronic states in a more controlled fashion.

Let us look at a simple example: C 2 H 4 . We first generate symmetry adapted MP2 natural orbitals. Since we opt
for initial guess orbitals, the computationally cheaper unrelaxed density suffices:



The program does the following. It first identifies the group correctly as D 2 *ℎ* and sets up its irreducible representations. The process detects symmetry within `SymThresh` (10 *[−]* [4] ) and purifies the geometry thereafter:



(continues on next page)

**130** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



It then performs the SCF calculation and keeps the symmetry in the molecular orbitals.



The MP2 module does not take any advantage of this information but produces natural orbitals that are symmetry
adapted:



(continues on next page)

**6.1. Single Point Energies and Gradients** **131**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

From this information and visual inspection you will know what orbitals you will have in the active space:

These natural orbitals can then be fed into the CASSCF calculation. We perform a simple calculation in which we
keep the ground state singlet (A 1 *𝑔* symmetry, irrep=0) and the first excited triplet state (B 3 *𝑢* symmetry, irrep=7).
In general the ordering of irreps follows standard conventions and in case of doubt you will find the relevant number
for each irrep in the output.

For example, here (using LargePrint):

We use the following input for CASSCF, where we tightened the integral cut-offs and the convergence criteria using
`!VeryTightSCF` .



(continues on next page)

**132** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



And gives:



And further in the CASSCF program:



(continues on next page)

**6.1. Single Point Energies and Gradients** **133**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



Note that the irrep occupations and active space irreps will be frozen to what they are upon entering the CASSCF
program. This helps to setup the CI problem.

After which it smoothly converges to give:



As well as:



**RI, RIJCOSX and RIJK approximations for CASSCF**

A significant speedup of CASSCF calculations on larger molecules can be achieved with the RI, RI-JK and RIJCOSX approximations. [459] There are two independent integral generation and transformation steps in a CASSCF
procedure. In addition to the usual Fock matrix construction, that is central to HF and DFT approaches, more integrals appear in the construction of the orbital gradient and Hessian. The latter are approximated using the keyword
`trafostep RI`, where an auxiliary basis (/C or the more accurate /JK auxiliary basis) is required. Note that auxiliary basis sets of the type /J are not sufficient to fit these integrals. If no suitable auxiliary basis set is available, the
`AutoAux` feature might be useful (see comment in the input below). [828] We note passing, that there are in principle three distinguished auxiliary basis slots, that can be individually assigned in the `%basis` block (section *Choice*
*of Basis Set* ). As an example, we recompute the benzene ground state example from Section *Starting Orbitals* with
a CAS(6,6).



(continues on next page)

**134** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



The energy of this calculation is `-230.590328 Eh` compared to the previous result `-230.590271 Eh` . Thus, the
RI error is only 0.06 mEh which is certainly negligible for all intents and purposes. With the larger `/JK` auxiliary
basis the error is typically much smaller (0.02 mEh in this example). Even if more accurate results are necessary,
it is a good idea to pre-converge the CASSCF with RI. The resulting orbitals should be a much better guess for the
subsequent calculation without RI and thus save computation time.

The `TrafoStep RI` only affects the integral transformation in CASSCF calculations while the Fock operators
are still calculated in the standard way using four index integrals. In order to fully avoid any four-index integral
evaluation, you can significantly speed up the time needed in each iteration by specifying `!RIJCOSX` . The keyword
implies `TrafoStep RI` . The COSX approximation is used for the construction of the Fock matrices. In this case,
an additional auxiliary basis ( **/J** auxiliary basis) is mandatory.



The speedup and accuracy is similar to what is observed in RHF and UHF calculations. In this example the `RIJCOSX`
leads to an error of 1 mEh. The methodology performs better for the computation of energy differences, where it
profits from error cancellation. The RIJCOSX is ideally suited to converge large-scale systems. Note that for large
calculations the integral cut-offs and numerical grids should be tightened. See section *Using the RI Approximation*
*for Hartree-Fock and Hybrid DFT (RIJCOSX)* for details. With a floppy numerical grid setting the accuracy as
well as the convergence behavior of CASSCF deteriorate. The RIJK approximation offers an alternative ansatz.
The latter is set with `!RIJK` and can also be run in conventional mode ( `conv` ) for additional speed-up. With `conv`,
a **single auxiliary basis must be provided** that is sufficiently larger to approximate the Fock matrices as well the
gradient/Hessian integrals. In direct mode an additional auxiliary basis set can be set for the `AuxC` slot.



The RIJK methodology is more accurate and robust for CASSCF e.g. here the error is just 0.5 mEH.

**6.1. Single Point Energies and Gradients** **135**

**ORCA Manual** **,** **Release 6.0.1**

Organic molecules with nearly double occupied orbitals can be challenge for the orbital optimization process. We
compare calculations done with/without the NR solver:


The NR variant takes 5 cycles to converge, whereas the default ( `SuperCI_PT` ) requires 8 cycles. In general, first
order methods, take more iterations compared to the NR method. However, first order methods are much cheaper
than the NR and therefore it may pay off to do a few iterations more rather than switching to the expensive second
order methods. Moreover, second order methods are less robust and may diverge in certain circumstances (too far
from convergence). When playing with the convergence settings, there is always a trade-off between speed versus
robustness. The default settings are chosen carefully.[459] Facing convergence problems, it can be useful to use
an alternative scheme ( `orbstep SuperCI` and `switchstep DIIS` ) in conjunction with a level-shifts ( `ShiftUp`,
`ShiftDn` ). Alternatively, changing the guess orbitals may avoid convergence problems as well.

**Robust Convergence with TRAH-CASSCF**

The restricted-step second-order converger TRAH *Quadratic Convergence* is now also available for both statespecific and state-averaged CASSCF calculations.[382] To activate TRAH for your CASSCF calculation, you just
need to add `!TRAH` in one of the simple input lines and add an auxiliary basis.




In most cases, there is no need to play with any input parameters. The only exception is the choice of active molecular orbital representations that can have a significant impact on the convergence rate for spin-coupled systems. As
can be seen from Fig. Fig. 6.14, for such calculations localized active orbitals perform best. In any other case, the
natural orbitals (default) should be employed.

**136** **Chapter 6. Running Typical Calculations**

10 [+1]

10 [+0]

10 [-1]

10 [-2]

10 [-3]

10 [-4]

10 [-5]

10 [-6]

10 [-7]

10 [-8]


**ORCA Manual** **,** **Release 6.0.1**

|Col1|Col2|SXPT<br>Macro, loc<br>Micro, loc<br>Macro, nat|Col4|
|---|---|---|---|
|||||
||Macro, can|Macro, can|Macro, can|
|||||
|||||
|||||
|||||
|||||


0 10 20 30 40 50 60 70 80 90

Iteration

Fig. 6.14: SXPT and TRAH error convergence using different choices for the active-orbital basis.

Possible input options for the active-orbital basis are



Note that, in contrast to the SCF program, there is **no** `AutoTRAH` feature for CASSCF yet. The TRAH feature has
to be requested explicitly in the input.

**6.1. Single Point Energies and Gradients** **137**

**ORCA Manual** **,** **Release 6.0.1**

**Breaking Chemical Bonds**

Let us turn to the breaking of chemical bonds. As a first example we study the dissociation of the H 2 molecule.
Scanning a bond, we have two potential setups for the calculation: a) scan from the inside to the outside or b) from
the outside to inside. Of course both setups yield identical results, but they differ in practical aspects i.e. convergence properties. In general, **scanning from the outside to the inside is the recommended procedure** . Using the
default guess (PModel), starting orbitals are much easier identified than at shorter distances, where the antibonding
orbitals are probably ‘impure’ and hence would require some additional preparation. To ensure a smooth potential
energy surface, in all subsequent geometry steps, ORCA reads the converged CASSCF orbitals from the previous
geometry step. In the following, `TightSCF` is used to tighten the convergence settings of CASSCF.



The resulting potential energy surface (PES) is depicted in Fig. 6.15 together with PESs obtained from RHF and
broken-symmetry UHF calculations (input below).



And




**Note:** The `FlipSpin` option does not work together with the parameter scan. Only the first structure will undergo
a spin flip. Therefore, at the current status, a separate input file (including the coordinates or with a corresponding
coordinate file) has to be provided for each structure that is scanned along the PES.

**138** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.15: Potential Energy Surface of the H 2 molecule from RHF, UHF and CASSCF(2,2) calculations (Def2-SVP
basis).

It is obvious, that the CASSCF surface is concise and yields the correct dissociation behavior. The RHF surface
is roughly parallel to the CASSCF surface in the vicinity of the minimum but then starts to fail badly as the H-H
bond starts to break. The broken-symmetry UHF solution is identical to RHF in the vicinity of the minimum and
dissociates correctly. It is, however, of rather mediocre quality in the intermediate region where it follows the RHF
surface.

A more challenging case is to dissociate the N-N bond of the N 2 molecule correctly. Using CASSCF with the
six p-orbitals we get a nice potential energy curve (The depth of the minimum is still too shallow compared to
experiment by some 1 eV or so. A good dissociation energy requires a dynamic correlation treatment on top of
CASSCF and a larger basis set).

**6.1. Single Point Energies and Gradients** **139**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.16: Potential Energy Surface of the N 2 molecule from CASSCF(6,6) calculations (Def2-SVP basis).

One can use the H 2 example to illustrate the state-averaging feature. Since we have two active electrons we have two
singlets and one triplet. Let us average the orbitals over these three states (we take equal weights for all multiplicity
blocks):



which gives:

**140** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.17: State averaged CASSCF(2,2) calculations on H 2 (two singlets, one triplet; Def2-SVP basis). The grey
curve is the ground state CASSCF(2,2) curve

One observes, that the singlet and triplet ground states become degenerate for large distances (as required) while
the second singlet becomes the ionic singlet state which is high in energy. If one compares the lowest root of the
state-averaged calculation (in green) with the dedicated ground state calculation (in gray) one gets an idea of the
energetic penalty that is associated with averaged as opposed to dedicated orbitals.

A more involved example is the rotation around the double bond in C 2 H 4 . Here, the *𝜋* -bond is broken as one twists
the molecule. The means the proper active space consists of two active electron in two orbitals.

The input is (for fun, we average over the lowest two singlets and the triplet):



**6.1. Single Point Energies and Gradients** **141**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.18: State averaged CASSCF(2,2) calculations on C 2 H 4 (two singlets, one triplet; SV(P) basis). The grey
curve is the state averaged energy.

We can see from this plot, that the CASSCF method produces a nice ground state surface with the correct periodicity
and degeneracy at the end points, which represent the planar ethylene molecule. At 90 *[∘]* one has a weakly coupled
diradical and the singlet and triplet states become nearly degenerate, again as expected. Calculations with larger
basis sets and inclusion of dynamic correlation would give nice quantitative results.

**Excited States**

As a final example, we do a state-average calculation on H 2 CO in order to illustrate excited state treatments. We
expect from the ground state (basically closed-shell) a n *→* *𝜋* *[*]* and a *𝜋* *→* *𝜋* *[*]* excited state which we want to
describe. For the n *→* *𝜋* *[*]* we also want to calculate the triplet since it is well known experimentally. First we take
DFT orbitals as starting guess.

In this example the DFT calculation produces the desired active space (n, *𝜋* and *𝜋* *[*]* orbitals) without further modification (e.g. swapping orbitals). In general it is advised to verify the final converged orbitals.




(continues on next page)

**142** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



We get:



The triplet n *→* *𝜋* *[*]* states is spot on with the experiment excitation energy of 3.5 eV.[726] Similarly, the singlet
n *→* *𝜋* *[*]* excited state is well reproduced compared to 3.79 eV and 4.07 eV reported in the literature.[726, 879]
Only the singlet *𝜋* *→* *𝜋* *[*]* excited state stands out compared to the theoretical estimate of 9.84 eV computed with
MR-AQCC.[543]. The good results are very fortuitous given the small basis set, the minimal active space and the
complete neglect of dynamical correlation.

The state-average procedure might not do justice to the different nature of the states (n *→* *𝜋* *[*]* versus *𝜋* *→* *𝜋* *[*]* ).
The agreement should be better with the orbitals optimized for each state. In ORCA, state-specific optimization
are realized adjusting the weights i.e. for the second singlet excited root:



Note, that state-specific orbital optimization are challenging to converge and often prone to root-flipping.[511]

To analyze electronic transitions, natural transition orbitals (NTO) are available for state-averaged CASSCF (and
also CASCI) calculations. NTOs are switched on for every ground- to excited-state transition by just adding `DoNTO`
`true` to the `%casscf ... end` input block, i.e.



For each excitation, the most dominant natural occupation numbers (singular values >1.e-4) are printed for each
transition. A set of donor orbitals and a set of acceptor orbitals, each of dimension Nbf x (Nocc + Nact), are created

**6.1. Single Point Energies and Gradients** **143**

**ORCA Manual** **,** **Release 6.0.1**

and stored in files with unique names. We obtain for the previous formamide example the following CASSCF NTO

output



For each transition, plots of the NTO pairs can be generated with the `orca_plot` program (see Sec. *Orbital and*
*Density Plots* for details), e.g. acceptor orbitals of the 2 1A1 state in interactive mode:
```
orca_plot Test-CASSCF.H2CO-1.casscf.2-1A_nto-acceptor.gbw -i

```
Fig. 6.19: Most dominant natural transition orbital (NTO) pair for the 2 1A1 (S2) transition in formaldehyde.

Alternatively, NTOs can also be computed directly in `orca_plot` from the CASSCF transition density matrices.
Those need to be stored and kept in the density container by invoking
```
! KeepTransDensity

```
**144** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**CASSCF Natural Orbitals as Input for Coupled-Cluster Calculations**

Consider the possibility that you are not sure about the orbital occupancy of your system. Hence you carry out
some CASSCF calculation for various states of the system in an effort to decide on the ground state. You can of
course follow the CASSCF by MR-MP2 or MR-ACPF or SORCI calculations to get a true multireference result for
the state ordering. Yet, in some cases you may also want to obtain a coupled-cluster estimate for the state energy
difference. Converging coupled-cluster calculation on alternative states in a controlled manner is anything but
trivial. Here a feature of ORCA might be helpful. The best single configuration that resembles a given CASSCF
state is built from the natural orbitals of this state. These orbitals are also ordered in the right way to be input into
the MDCI program. The convergence to excited states is, of course, not without pitfalls and limitations as will
become evident in the two examples below.

As an example, consider some ionized states of the water cation:

First, we generate the natural orbitals for each state with the help of the MRCI module. To this end we run a state
average CASSCF for the lowest three doublet states and pass that information on to the MRCI module that does a
CASCI calculation and produces the natural orbitals:



This produces the files `Basename.bm_sn.nat` where “m” is the number of the block (m = 0 correspond to the
doublet in this case) and “n” stands of the relevant state (n = 0,1,2).

These natural orbitals are then fed into unrestricted QCISD(T) calculations:




As a reference we also perform a SORCI on the same system

**6.1. Single Point Energies and Gradients** **145**

**ORCA Manual** **,** **Release 6.0.1**

we obtain the transition energies:



Thus, in this example the agreement between single- and multireference methods is good and the unrestricted
QCISD(T) method is able to describe these excited doublet states. The natural orbitals have been a reliable way to
guide the CC equations into the desired solutions. This will work in many cases.

**Large Scale CAS-SCF calculations using ICE-CI**

The CASSCF procedure can be used for the calculation of spin-state energetics of molecules showing a multireference character via the state-averaged CASSCF protocol as described in the CASSCF section *The Complete*
*Active Space Self-Consistent Field (CASSCF) Module* . The main obstacle in getting qualitatively accurate spinstate energetics for molecules with many transition metal centers is the proper treatment of the static-correlation
effects between the large number of open-shell electrons. In this section, we describe how one can effectively
perform CASSCF calculations on such systems containing a large number of high-spin open-shell transition metal

atoms.

As an example, consider the Iron-Sulfur dimer [Fe(III) 2 SR 2 ] [2] *−* molecule. In this system, the Fe(III) centers can
be seen as being made up mostly of S=5/2 local spin states (lower spin states such as 3/2 and 1/2 will have small
contributions due to Hunds’ rule.) The main hurdle while using the CASSCF protocol on such systems (with
increasing number of metal atoms) is the exponential growth of the Hilbert space although the physics can be
effectively seen as occurring in a very small set of configuration state functions (CSFs). Therefore, in order to
obtain qualitatively correct spin-state energetics, one need not perform a Full-CI on such molecules but rather a
CIPSI like procedure using the ICE-CI solver should give chemically accurate results. In the case of the Fe(III)
dimer, one can imagine that the ground singlet state is composed almost entirely of the CSF where the two Fe(III)
centers are coupled antiferromagnetically. Such a CSF is represented as follows:

⃒⃒Ψ *𝑆* 0 =0 ⟩︀ = [1 *,* 1 *,* 1 *,* 1 *,* 1 *, −* 1 *, −* 1 *, −* 1 *, −* 1 *, −* 1]

In order to make sense of this CSF representation, one needs to clarify a few points which are as follows:

  - First, in the above basis the 10 orbitals are localized to 5 on each Fe center (following a high-spin UHF/UKS
calculation.)

  - Second, the orbitals are ordered (as automatically done in ORCA_LOC) such that the first five orbitals lie
on one Fe(III) center and the last five orbitals on the second Fe(III) center.

Using this ordering, one can read the CSF shown above in the following way: The first five *1* represent the five
electrons on the first Fe(III) coupled in a parallel fashion to give a S=5/2 spin. The next five *-1* represent two points:

  - First, the five consecutive *-1* signify the presence of five ferromagnetically coupled electrons on the second
Fe(III) center resulting in a local S=5/2 spin state.

**146** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

  - Second, the second set of spins are coupled to the first *1* via anti-parallel coupling as signified by the sign of
the last five *-1* entries.

Therefore, we can see that using the CSF representation, one can obtain an extremely compact representation of
the wavefunction for molecules consisting of open-shell transition metal atoms. This protocol of using localized
orbitals in a specified order to form compact CSF representations for transition metal systems can be systematically
extended for large molecules.

We will use the example of the Iron-Sulfur dimer [Fe(III) 2 SR 2 ] [2] *−* to demonstrate how to prepare a reference CSF
and perform spin-state energetics using the state-averaged CASSCF protocol. In such systems, often one can obtain
an estimate of the energy gap between the singlet-state and the high-spin states from experiment. Ab initio values
for this gap be obtained using the state-averaged CASSCF protocol using the input shown below.



The main keyword that needs to be used here (unlike in other CAS-SCF calculations) is the *actorbs* keyword.

**6.1. Single Point Energies and Gradients** **147**

**ORCA Manual** **,** **Release 6.0.1**

Since we are using a local basis with a specific ordering of the orbitals, in order to represent our wavefunction
it is imperative to preserve the local nature of the orbitals as well as the orbital ordering. Therefore, we do not
calculate natural orbitals at the end of the CASSCF calculation (as is traditionally done) instead we impose the
orbitals to be as similar to the input orbitals as possible. This is automatically enabled for intermediate CASSCF
macro iterations. The resulting CASSCF calculation provides a chemically intuitive and simple wavefunction and
transition energy as shown below:



As we can see from the output above, 98% of the wavefunction for the singlet-state is given by a single CSF which
we gave as a reference CSF. This CSF has a very simple chemical interpretation representing the anti-parallel
coupling between the two high-spin Fe(III) centers. Since Iron-Sulfur molecules show a strong anti-ferromagnetic
coupling, we expect the singlet state to be lower in energy than the high-spin (S=5) state. The CASSCF transition
energies show essentially this fact. The transition energy is about 2000cm *[−]* [1] which is what one expects from a
CASSCF calculation on such sulfide bridged transition-metal molecules.

**6.1.8 N-Electron Valence State Perturbation Theory (NEVPT2)**

NEVPT2 is an internally contracted multireference perturbation theory, which applies to CASSCF type wavefunctions. The NEVPT2 method, as described in the original papers of Angeli et al, comes in two flavor the strongly
contracted NEVPT2 (SC-NEVPT2) and the so called partially contracted NEVPT2 (PC-NEVPT2).[44, 45, 46]
In fact, the latter employs a fully internally contracted wavefunction and should more appropriately called FICNEVPT2. Both methods produces energies of similar quality as the CASPT2 approach.[366, 757] The strongly
and fully internally contracted NEVPT2 are implemented in ORCA together with a number of approximations
that makes the methodology very attractive for large scale applications. In conjunction with the RI approximation systems with active space of to 16 active orbitals and 2000 basis functions can be computed. With the newly
developed DLPNO version of the FIC-NEVPT2 the size of the molecules does not matter anymore.[344] For a
more complete list of keywords and features, we refer to detailed documentation section *N-Electron Valence State*
*Pertubation Theory* .

Besides corrections to the correlation energy, ORCA features UV, IR, CD and MCD spectra as well as EPR parameters for NEVPT2. These properties are computed using the “quasi-degenerate perturbation theory” that is
described in section *CASSCF Properties* . The NEVPT2 corrections enter as “improved diagonal energies” in this
formalism. ORCA also features the multi-state extension (QD-NEVPT2) for the strongly contracted NEVPT2 variant.[48, 493] Here, the reference wavefunction is revised in the presence of dynamical correlation. For systems,

**148** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

where such reference relaxation is important, the computed spectroscopic properties will improve.

As a simple example for NEVPT2, consider the ground state of the nitrogen molecule N 2 . After defining the
computational details of our CASSCF calculation, we insert “ `!SC-NEVPT2` ” as simple input or specify “ `PTMethod`
`SC_NEVPT2` ” in the `%casscf` block. Please note the difference in the two keywords’ spelling: Simple input uses
hyphen, block input uses underscore for technical reasons. There are more optional settings, which are described
in section *N-Electron Valence State Pertubation Theory* of this manual.

For better control of the program flow it is advised to split the calculation into two parts. First converge the CASSCF
wave function and then in a second step read the converged orbitals and execute the actual NEVPT2.




Introducing dynamic correlation with the SC-NEVPT2 approach lowers the energy by 150 mEh. ORCA also

**6.1. Single Point Energies and Gradients** **149**

**ORCA Manual** **,** **Release 6.0.1**

prints the contribution of each “excitation class V” to the first order wave function. We note that in the case of
a single reference wavefunction corresponding to a CAS(0,0) the `V0_ij,ab` excitation class produces the exact
MP2 correlation energy. Unlike older versions of ORCA (pre version 4.0), NEVPT2 calculations employ the
frozen core approximation by default. Results from previous versions can be obtained with the added keyword

`!NoFrozenCore` .

In chapter *Breaking Chemical Bonds* the dissociation of the N 2 molecule has been investigated with the CASSCF
method. Inserting `PTMethod SC_NEVPT2` into the `%casscf` block we obtain the NEVPT2 correction as additional
information.



Fig. 6.20: Potential Energy Surface of the N 2 molecule from CASSCF(6,6) and NEVPT2 calculations (def2-SVP).

All of the options available in CASSCF can in principle be applied to NEVPT2. Since NEVPT2 is implemented

**150** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

as a submodule of CASSCF, it will inherit all settings from CASSCF ( `!tightscf, !UseSym, !RIJCOSX,` ...).

**NOTE**

  - NEVPT2 analytic gradients are not available, but numerical gradients are!

**6.1.9 Complete Active Space Perturbation Theory: CASPT2 and CASPT2-K**

The fully internally contracted CASPT2 (FIC-CASPT2) approach shares its wave function ansatz with the FICNEVPT2 approach mentioned in the previous section.[40] The two methods differ in the definition of the zeroth
order Hamiltonian. The CASPT2 approach employs the generalized Fock-operator, which may result in intruder
states problems (singularities in the perturbation expression). Real and imaginary level shifting techniques are
introduced to avoid intruder states.[270, 732] Note that both level shifts are mutually exclusive. Since level shifts
in general affect the total energies, they should be avoided or chosen as small as possible. As argued by Roos and
coworkers, CASPT2 systematically underestimates open-shell energies, since the Fock operator itself is not suited
to describe excitations into and out of partially occupied orbitals. The deficiency can be adjusted with the inclusion
of IPEA shifts - an empirical parameter.[295] While the implementation of the canonical CASPT2 with real and
imaginary shifts is validated against OpenMOLCAS.[253], the ORCA version differs in the implementation of the
IPEA shifts and yields slightly different results. The IPEA shift, *𝜆*, is added to the matrix elements of the internally
contracted CSFs Φ *[𝑝𝑟]* *𝑞𝑠* [=] *[ 𝐸]* *𝑞* *[𝑝]* *[𝐸]* *𝑠* *[𝑟]* *[|]* [Ψ] [0] *[ >]* [ with the generalized Fock operator]


*<* Φ *[𝑝]* *[′][′]* *[𝑟]* *[′][′]*



*[𝑝]* *𝑞* *[′][′]* *𝑠* *[𝑟]* *[′][′]* *[|][𝐹]* [ ˆ] *[|]* [Φ] *[𝑝𝑟]* *𝑞𝑠* *[>]* [ + =] *[<]* [ Φ] *[𝑝]* *𝑞* *[′][′]* *𝑠* *[𝑟]* *[′][′]*



*[𝑝]* *𝑞* *[′][′]* *𝑠* *[𝑟]* *[′][′]* *[|]* [Φ] *[𝑝𝑟]* *𝑞𝑠* *[>][ ·]* *[𝜆]*


*𝑝* *[−]* *[𝛾]* *𝑞* *[𝑞]* [+] *[ 𝛾]* *𝑟* *[𝑟]* *[−]* *[𝛾]* *𝑠* *[𝑠]* [)] *[,]*
2 *[·]* [ (4 +] *[ 𝛾]* *[𝑝]*


where *𝛾* *𝑞* *[𝑝]* [=] *[<]* [ Ψ] [0] *[|][𝐸]* *𝑞* *[𝑝]* *[|]* [Ψ] [0] *[ >]* [ is the expectation value of the spin-traced excitation operator.[][441][] The labels p,q,r,s]
refer to general molecular orbitals (inactive, active and virtual). Irrespective of the ORCA implementation, the
validity of the IPEA shift in general remains questionable and is thus by default disabled.[922]

ORCA features an alternative approach, denoted as **CASPT2-K**, that reformulates the zeroth order Hamiltonian
itself.[460] Here, two additional Fock matrices are introduced for excitation classes that add or remove electrons
from the active space. The new Fock matrices are derived from the generalized Koopmans’ matrices corresponding
to electron ionization and attachment processes. The resulting method is less prone to intruder states and the same
time more accurate compared to the canonical CASPT2 approach. For a more detailed discussion, we refer to the
paper by Kollmar et al.[460]

The CASPT2 and CASPT2-K methodologies are called in complete analogy to the NEVPT2 branch in ORCA and
can be combined with the resolution of identity (RI) approximation.

The RI approximated results are comparable to the CD-CASPT2 approach presented elsewhere.[50] For a general
discussion of the RI and CD approximations, we refer to the literature.[885] Many of the input parameter are shared
with the FIC-NEVPT2 approach. A list with the available options is presented in section *Complete Active Space*
*Peturbation Theory : CASPT2 and CASPT2-K* .

In this short section, we add the CASPT2 results to the previously computed NEVPT2 potential energy surface of
the N 2 molecule.



(continues on next page)

**6.1. Single Point Energies and Gradients** **151**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

The CASPT2 output lists the settings prior to the computation. The printed reference weights should be checked.
Small **reference weights** indicate intruder states. Along the lines, the program also prints the **smallest denomi-**
**nators** in the perturbation expression (highlighted in the snippet below). Small denominator may lead to intruder

states.




(continues on next page)

**152** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



Note that the program prints CASPT2-D results prior entering the CASPT2 iterations.[40] In case of intruder states,
the residual equation may not converge. The program will not abort. Hence, it is important to check convergence
for every CASPT2 run. In this particular example with the small basis sets, there are no intruder states.

**6.1. Single Point Energies and Gradients** **153**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.21: Potential Energy Surface of the N 2 molecule from CASSCF(6,6) and CASPT2 calculations (def2-SVP).

The potential energy surface in Fig. 6.21 is indeed very similar to the FIC-NEVPT2 approach, which is more
efficient (no iterations) and robust (absence of intruder states). The figure also shows the CASPT2-K results,
which is typically a compromise between the two methods. As expected, the largest deviation from CASPT2 is
observed at the dissociation limit, where the open shell character dominates the reference wave function. In this
example, the discrepancy between the three methods is rather subtle. However, the results may differ substantially
on some challenging systems, such as Chromium dimer studied in the CASPT2-K publication. [460]. Despite its
flaws, the CASPT2 method is of historical importance and remains a popular methodology. In the future we might
consider further extension such as the (X)MS-CASPT2.[793]

**6.1.10 2nd order Dynamic Correlation Dressed Complete Active Space method**
**(DCD-CAS(2))**

Non-degenerate multireference perturbation theory (MRPT) methods, such as NEVPT2 or CASPT2, have the
0th order part of the wave function fixed by a preceding CASSCF calculation. The latter can be a problem if
the CASSCF states are biased towards a wrong state composition in terms of electron configurations. In these
instances, a quasi-degenerate or multi-state formulation is necessary, for example the QD-NEVPT2 described in
Section *Quasi-Degenerate SC-NEVPT2* . A drawback of these approaches is that the results depend on the number
of included states. The DCD-CAS(2) offers an alternative uncontracted approach, where a dressed CASCI matrix
is constructed. Its diagonalization yields correlated energies and 0th order states that are remixed in the CASCI
space under the effect of dynamic correlation.[653]

The basic usage is very simple: One just needs a `%casscf` block and the simple input keyword `!DCD-CAS(2)` .
The following example is a calculation on the LiF molecule. It possesses two singlet states that can be qualitatively
described as ionic (Li^+^ and F *[−]* ) and covalent (neutral Li with electron in 2s orbital and neutral F with hole in
2 *𝑝* *𝑧* orbital). At distances close to the equilibrium geometry, the ground state is ionic, while in the dissociation
limit the ground state is neutral. Somewhere in between, there is an avoided crossing of the adiabatic potential

**154** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

energy curves where the character of the two states quickly changes (see figure Fig. 7.7 for potential energy curves
for this system at the (QD)NEVPT2 level). At the CASSCF level, the neutral state is described better than the ionic
state, with the result that the latter is too high in energy and the avoided crossing occurs at a too small interatomic
distance. In the region where the avoided crossing actually takes place, the CASSCF states are then purely neutral
or purely ionic. DCD-CAS(2) allows for a remixing of the states in the CASCI space under the effect of dynamic
correlation, which will lower the ionic state more in energy than the neutral one. The input file is as follows:



Since none of the standard guesses ( `!PAtom`, `!PModel`, etc.) produces the correct active orbitals (Li 2s and F
2p~z~), we read them from the file casorbs.gbw. We also use the `actorbs locorbs` option to preserve the atomic
character of the active orbitals and interpret the states in terms of neutral and ionic components easier. The following
is the state composition of LiF at an interatomic distance of 5.5 angstrom at the CASSCF and DCD-CAS(2) levels.




One can clearly see that while the CASSCF states are purely neutral (dominated by CFG `11` ) or purely ionic
(dominated by CFG `02` ), the DCD-CAS(2) states are mixtures of neutral and ionic contributions. The calculation
indicates that the interatomic distance of 5.5 is in the avoided crossing region. Note that the energies that are
printed together with the DCD-CAS(2) state composition are the ones that are obtained from diagonalization of
the DCD-CAS(2) dressed Hamiltonian. For excited states, these energies suffer from what we call *ground state*
*bias* (see the original paper for a discussion [653]). A perturbative correction has been devised to overcome this
problem. Our standard choice is first-order bias correction. The corrected energies are also printed in the output
file and those energies should be used in production use of the DCD-CAS(2) method:

**6.1. Single Point Energies and Gradients** **155**

**ORCA Manual** **,** **Release 6.0.1**



Last but not least, spin orbit coupling (SOC) and spin spin coupling (SSC) are implemented in conjunction with the
DCD-CAS(2) method in a QDPT-like procedure and a variety of different magnetic and spectroscopic properties
can be also calculated. We refer to the detailed documentation (Section *Dynamic Correlation Dressed CAS* ) for
further information.

**Warning:** Note that the computational cost of a DCD-CAS(2) calculation scales as roughly the 3rd power of
the size of the CASCI space. This makes calculations with active spaces containing more than a few hundred
CSFs very expensive!

**6.1.11 Full Configuration Interaction Energies**

ORCA provides several exact and approximate approaches to tackle the full configuration interaction (FCI) problem. These methods are accessible via the CASSCF module (see Section *General Description* ) or the ICE module
(described in Section *Approximate Full CI Calculations in Subspace: ICE-CI* ).

In the following, we compute the FCI energy of the lithium hydride molecule using the CASSCF module, where
a typical input requires the declaration of an active space. The latter defines the number of active electron and
orbitals, which are evaluated with the FCI ansatz. In the special case that all electrons and orbitals are treated
with the FCI ansatz, we can use the keyword `DoFCI` in the `%CASSCF` block and let the program set the active space
accordingly. In this example, we focus on the singlet ground state. Note that excited states for arbitrary multiplicities
can be computed with the keywords `Mult` and `NRoots` . The FCI approach is invariant to orbital rotations and thus
orbital optimization is skipped in the CASSCF module. Nevertheless, it is important to employ a set of meaningful
orbitals, e.g. from a converged Hartree-Fock calculation, to reduce the number of FCI iterations.

The output of the Hartree-Fock calculation also reports on the total number of electrons and orbitals in your system
(see snippet below).



In the given example, there are 4 electrons in 20 orbitals, which is a “CAS(4,20)”. Reading the converged RHF
orbitals, we can start the FCI calculation.




(continues on next page)

**156** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



The output reports on the detailed CI settings, the number of configuration state functions (CSFs) and the CI
convergence thresholds.

The program then prints the actual CI iterations, the final energy, and the composition of the wave function in terms
of configurations (CFGs).



(continues on next page)

**6.1. Single Point Energies and Gradients** **157**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

Aside from energies, the CASSCF module offers a number of properties (g-tensors, ZFS, ...), which are described
in Section *CASSCF Properties* .

The exact solution of the FCI problem has very steep scaling and is thus limited to smaller problems (at most active
spaces of 16 electrons in 16 orbitals). Larger systems are accessible with approximate solutions, e.g. with the
density matrix renormalization group approach (DMRG), described in Section *Density Matrix Renormalization*
*Group*, or the iterative configuration expansion (ICE) reported in Section *Approximate Full CI Calculations in*
*Subspace: ICE-CI* . For fun, we repeat the calculation with the ICE-CI ansatz, which offers a more traditional
approach to get an approximate full CI result.




The single most important parameter to control the accuracy is `TGen` . It is printed with the more refined settings in
the output. We note passing that the wave function expansion and its truncation can be carried out in the basis of
CSFs, configurations, or determinants. The different strategies are discussed in detail by Chilkuri *et al.* [171, 172].




(continues on next page)

**158** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)
```
Building coupling coefficients ... (CI/Run=3,2)Calling BuildCouplings_RI UseCCLib=0␣

```
*˓→* `DoRISX=0`
```
CI_BuildCouplings NCFG= 2808 NORB=20 NEL=4 UseCCLib=0 MaxCore=2000
PASS 1 completed. NCFG= 2808 NCFGK= 8416 MaxNSOMOI=4 MaxNSOMOK=4
PASS 2 completed.
PASS 3 completed.
Memory used for RI tree = 2.99 MB (av. dim= 35)
Memory used for ONE tree = 1.32 MB (av. dim= 46)
Memory used for coupling coefficients= 0.01 MB
done ( 0 sec)
Now calling CI solver (4095 CSFs)
****Iteration 0****
Maximum residual norm : 0.000293130557
****Iteration 1****
Maximum residual norm : 0.000000565920
****Iteration 2****
Maximum residual norm : 0.000001755176
****Iteration 3****
Maximum residual norm : 0.000000435942
Rebuilding the expansion space
****Iteration 4****
*** CONVERGENCE OF ENERGIES REACHED ***
CI problem solved in 0.4 sec
CI SOLUTION :
STATE 0 MULT= 1: E= -8.0481340246 Eh W= 1.0000 DE= 0.000 eV 0.0 cm**-1
0.97249 : 22000000000000000000
Selecting new configurations ... (CI/Run=3,2)done ( 0.0 sec)
# of selected configurations ... 2747
# of generator configurations ... 43 (NEW=1 (CREF=43))
Performing single and double excitations relative to generators ... done ( 0.0 sec)
# of configurations after S+D ... 7038
Selecting from the generated configurations ... done ( 0.1 sec)
# of configurations after Selection ... 2808
Root 0: -8.048134025 -0.000000023 -8.048134048
==>>> CI space seems to have converged. No new configurations
maximum energy change ... 1.727e-05 Eh
           ********* ICECI IS CONVERGED *********
    Initializing the CI ... (CI/Run=3,3 UseCC=0)done ( 0.0 sec)
    Building coupling coefficients ... (CI/Run=3,3)Calling BuildCouplings_RI␣

```
*˓→* `UseCCLib=0 DoRISX=`
```
    CI_BuildCouplings NCFG= 2808 NORB=20 NEL=4 UseCCLib=0 MaxCore=2000
    PASS 1 completed. NCFG= 2808 NCFGK= 8416 MaxNSOMOI=4 MaxNSOMOK=4
    PASS 2 completed.
    PASS 3 completed.
    Memory used for RI tree = 2.99 MB (av. dim= 35)
    Memory used for ONE tree = 1.32 MB (av. dim= 46)
    Memory used for coupling coefficients= 0.01 MB
    done ( 0 sec)
    Now calling CI solver (4095 CSFs)
    ****Iteration 0****
    Maximum residual norm : 0.000000471011

```
(continues on next page)

**6.1. Single Point Energies and Gradients** **159**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

With Hartree-Fock orbitals and the default settings, the ICE converges in 3 macro iterations to an energy of
*−* 8 *.* 048134047513 *𝐸* h . The deviation from the exact solution is just 3 *.* 8 *×* 10 *[−]* [6] *𝐸* h in this example.

**6.1.12 Efficient Calculations with Atomic Natural Orbitals**

Atomic natural orbitals are a special class of basis sets. They are represented by the orthonormal set of orbitals that
diagonalizes a spherically symmetric, correlated atomic density. The idea is to put as much information as possible
into each basis functions such that one obtains the best possible result with the given number of basis functions.
This is particularly important for correlated calculations where the number of primitives is less an issue than the
number of basis functions.

Usually, ANO basis sets are “generally contracted” which means that for any given angular momentum all primitives contribute to all basis functions. Since the concept of ANOs only makes sense if the underlying set of
primitives is large, the calculations readily become very expensive unless special precaution is taken in the integral
evaluation algorithms. ORCA features special algorithms for ANO basis sets together with accurate ANO basis
sets for non-relativistic calculations. However, even then the integral evaluation is so expensive that efficiency can
only be realized if all integrals are stored on disk and are re-used as needed.

In the first implementation, the use of ANOs is restricted to the built-in ANO basis sets (ano-pV *𝑛* Z, saug-anopV *𝑛* Z, aug-ano-pV *𝑛* Z, *𝑛* = D, T, Q, 5). These are built upon the cc-pV6Z primitives and hence, the calculations
take significant time.

**Note:**

  - Geometry optimizations with ANOs are discouraged; they will be *very* inefficient.

The use of ANOs is recommended in the following way:



This yields:



Compare to the cc-pVTZ value of:



**160** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Thus, the ANO-based SCF energy is ca. 8–9 mEh lower and the correlation energy almost 2 mEh lower than with
the cc-basis set of the same size. Usually, the ANO results are much closer to the basis set limit than the cc-results.
Also, ANO values extrapolate very well (see section *Automatic extrapolation to the basis set limit* )

Importantly, the integrals are all stored in this job. Depending on your system and your patience, this may be
possible up to 300–500 basis functions. The ORCA correlation modules have been rewritten such that they deal
efficiently with these stored integrals. Thus, we might as well have used `! MO-CCSD(T)` or `! AO-CCSD(T)`,
both of which would perform well.

Yet, the burden of generating and storing all four-index integrals quickly becomes rather heavy. Hence, the combination of ANO basis sets with the RI-JK technique is particularly powerful and efficient. For example:
```
! ano-pVTZ cc-pVTZ/JK RI-JK Conv TightSCF RI-CCSD(T)

```
For the SCF, this works very well and allows for much larger ANO based calculations to be done efficiently. Also,
RI-MP2 can be done very efficiently in this way. However, for higher order correlation methods such as CCSD(T)
the logical choice would be RI-CCSD(T) which is distinctly less efficient than the AO or MO based CCSD(T)
(roughly a factor of two slower). Hence, ORCA implements a hybrid method where the RI approximation is used
to generate all four index integrals. This is done via the “RI-AO” keyword:
```
! ano-pVTZ cc-pVTZ/JK RI-AO Conv TightSCF AO-CCSD(T)

```
In this case either AO-CCSD(T) or MO-CCSD(T) would both work well. This does not solve the storage bottleneck
with respect to the four index integrals of course. If this becomes a real issue, then RI-CCSD(T) is mandatory. The
error in the total energy is less than 0.1 mEh in the present example.

**Note:**

   - **With conventional RI calculations the use of a second fit basis set is not possible and inconsistent results**
**will be obtained. Hence, stick to one auxiliary basis!**

**6.1.13 Local-SCF Method**

The Local-SCF (LSCF) method developed by X. Assfeld and J.-L. Rivail ([55]) allows to optimize a single determinant wave function under the constraint of keeping frozen (i.e. unmodified) a subset of orbitals. Also, optimized orbitals fulfill the condition of orthogonality with the frozen ones. The LSCF method can be applied to
restricted/unrestricted Hartree-Fock or DFT Kohn-Sham wavefunctions.

To use the LSCF method, one chooses the spin-up and spin-down frozen orbitals with the “LSCFalpha” and “LSCFbeta” keywords, respectively. Frozen orbitals are specified using **intervals** of orbital indexes. In the following
example, the selection “0,4,5,6,10,10” for the alpha frozen orbitals means that the orbitals ranging from 0 to 4
( **0,4**,5,6,10,10), 5 and 6 (0,4, **5,6**,10,10) and the orbital 10 (0,4,5,6, **10,10** ) will be frozen. In the case of the beta
orbitals, the orbitals with indexes 0, 1, 2, 3 and 5 will be frozen. Up to 5 intervals (2*5 numbers) are allowed.



For the sake of user-friendliness, two other keywords are available within the LSCF method. They can be used to
modify the orbital first guess, as read from the gbw file with the same name or another gbw file with the “MOInp”
keyword.

The “LSCFCopyOrbs” keyword allows to copy one orbital into another one. The input works by intervals like the
LSCFalpha/LSCFbeta selections. However, be aware that spin-up orbital indexes range from 0 to M-1 (where M

**6.1. Single Point Energies and Gradients** **161**

**ORCA Manual** **,** **Release 6.0.1**

is the size of the basis set), while spin-down orbital indexes range from M to 2M-1. In the following example, with
M=11, the user copies the fifth spin-up orbital in the fifth spin-down orbital.



The second keyword is “LSCFSwapOrbs” and allows to swap the indexes of subsets made of two orbitals. In the
following example, still with M=11, the user swaps the fifth spin-up orbital with the fifth spin-down orbital.



**Caution: During the LSCF procedure, frozen occupied orbitals energies are fixed at -1000 Hartrees and**
**frozen virtual orbitals energies at 1000 Hartrees. This means that the frozen occupied orbitals and the**
**frozen virtual orbitals are placed respectively at the beginning and at the end of the indexation.**

**6.1.14 Adding finite electric field**

Electric fields can have significant influences on the electronic structure of molecules. In general, when an electric field is applied to a molecule, the electron cloud of the molecule will polarize along the direction of the
field. The redistribution of charges across the molecule will then influence the wavefunction of the molecule.
Even when polarization effects are not significant, the electric field still exerts a drag on the negatively and positively charged atoms of the molecule in opposite directions, and therefore affect the orientation and structure of
the molecule. The combination of electrostatic and polarization effects make electric fields a useful degree of
freedom in tuning e.g. reactivities, molecular structures and spectra [786]. Meanwhile, the energy/dipole moment/quadrupole moment changes of the system in the presence of small dipolar or quadrupolar electric fields are
useful for calculating many electric properties of the system via numerical differentiation, including the dipole
moment, quadrupole moment, dipole-dipole polarizability, quadrupole-quadrupole polarizability, etc. Such finite
difference property calculations can be conveniently done using compound scripts in the ORCA Compound Scripts
Repository (https://github.com/ORCAQuantumChemistry/CompoundScripts/tree/main/Polarizabilities).

In ORCA, a uniform (or equivalently speaking, dipolar) electric field can be added to a calculation via the following
keyword:



Although the keyword is in the %scf block, it applies the electric field to all other methods (post-HF methods,
multireference methods, TDDFT, etc.) as well, except XTB and force field methods (as well as any method that
involves XTB or force fields, e.g. QM/XTB and QM/MM) for which the electric field contributions are not implemented and will result in an abort. Analytic gradient contributions of the electric field are available for all methods
(except XTB and MM) that already support analytic gradients, but analytic Hessian contributions are not.

The sign convention of the electric field is chosen in the following way: suppose that the electric field is generated by
a positive charge in the negative z direction, and a negative charge in the positive z direction, then the z component
of the electric field is positive. This convention is consistent with most but not all other programs [786], so care
must be taken when comparing the results of ORCA with other programs.

Another important aspect is the gauge origin of the electric field. The gauge origin of the electric field is the
point (or more accurately speaking, one of the points - as there are infinitely many such points) where the electric
potential due to the electric field is zero. Different choices of the gauge origin do not affect the geometry and
wavefunction of the molecule, as they do not change the electric field felt by the molecule, but they do change the

**162** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

energy of the molecule. The default gauge origin is the (0,0,0) point of the Cartesian coordinate system, but it is
possible to choose other gauge origins:



Note the default gauge origin of the electric field is different from the default gauge origin of the ELPROP module, which is the center of mass. If the user chooses the center of mass/nuclear charge as the gauge origin of the
electric field, the gauge origin will move as the molecule translates; this has important consequences. For example, in an MD simulation of a charged molecule in an electric field, the molecule will not accelerate, unlike
when `EFieldOrigin` is fixed at a given set of coordinates, where the molecule will accelerate forever. In general, `CenterOfMass` and `CenterOfNucCharge` are mostly suited for the finite difference calculation of electric
properties, where one frequently wants to choose the center of mass or nuclear charge as the gauge origin of the
resulting multipole moment or polarizability tensor. Instead, a fixed origin is expected to be more useful for simulating the changes of wavefunction, geometry, reactivity, spectra etc. under an externally applied electric field, as
experimentally the electric field is usually applied in the lab frame, rather than the comoving frame of the molecule.

Similar to `EField`, one can also add a quadrupolar field:



The gauge origin of the quadrupolar field is the same as that of the dipolar electric field. Moreover, the `QField`
can be used together with the `EField` keyword. This allows one to simulate a gradually varying electric field, for
example the following input specifies an electric field that has a strength of 0.01 au at the gauge origin ((0,0,0) by
default), pointing to the positive z direction, and increases by 0.001 au for every Bohr as one goes in the positive z
direction:



As a second example, one can also simulate an ion trap:



Under this quadrupolar field setting, a particle will feel an electric field that points towards the gauge origin, whose
strength (in au) is 0.01 times the distance to the gauge origin (in Bohr). This will keep cations close to the origin,
but pushes anions away from the origin. Unfortunately, there is no analytic gradient available for quadrupolar
fields.

NOTE

  - An au (atomic unit) is a fairly large unit for electric fields: 1 au = 51.4 V/Angstrom. By comparison, charged
residues in proteins, as well as scanning tunneling microscope (STM) tips, typically generate electric fields
within about 1 V/Angstrom; electrode surfaces usually generate electric fields within 0.1 V/Angstrom under
typical electrolysis conditions [786]. If the molecule is not close to the source of the electric field, it is even
harder to generate strong electric fields: for example, a 100 V voltage across two metal plates that are 1 mm
apart generates an electric field of merely 10 *[−]* [5] V/Angstrom. Therefore, if experimentally a certain strength
of homogeneous electric field seems to promote a reaction, but no such effect is found in calculation, please
consider the possibility that the experimentally observed reactivity is due to a strong local electric field near
the electrode surface (that is much higher than the average field strength in the system), or due to other
effects such as electrolysis. Conversely, if you predict a certain molecular property change at an electric

**6.1. Single Point Energies and Gradients** **163**

**ORCA Manual** **,** **Release 6.0.1**

field strength of, e.g. *>* 0.1 au, it may be a non-trivial question whether such an electric field can be easily
realized experimentally.

  - The electric field breaks the rotational symmetry of the molecule, in the sense that rotating the molecule
can change its energy. Therefore, geometry optimizations in electric fields cannot be done with internal
coordinates. When the user requests geometry optimization, the program automatically switches to Cartesian coordinates if it detects an electric field. While Cartesian coordinates allow the correct treatment of
molecular rotation, they generally lead to poor convergence, so a large number of iterations is frequently

necessary.

  - Similarly, when the molecule is charged, its energy is not invariant with respect to translations. However,
when there is only a dipolar electric field but no other translational symmetry-breaking forces (quadrupolar
field, point charges, wall potentials), a charged molecule will accelerate forever in the field, and its position
will never converge. Therefore, for geometry optimizations within a purely dipolar electric field and no wall
potentials, we do not allow global translations of the molecule, even when translation can reduce its energy.
For MD simulations we however do allow the global translations of the molecule by default. If this is not
desired, one can fix the center of mass in the MD run using the `CenterCOM` keyword (section *Run* ).

  - For frequency calculations in electric fields, we do not project out the translational and rotational contributions of the Hessian (equivalent to setting `ProjectTR false` in `%freq` ; see *Frequency calculations -*
*numerical and analytical* for details). Therefore, the frequencies of translational and rotational modes can
be different from zero, and can mix with the vibrational modes. When the electric field is extremely small
but not zero, the “true” translational/rotational symmetry breaking of the Hessian may be smaller than the
symmetry breaking due to numerical error; this must be kept in mind when comparing the frequency results under small electric fields versus under zero electric field (in the latter case `ProjectTR` is by default
true). Besides, when the translational and rotational frequencies exceed CutOffFreq (which is 1 cm *[−]* [1] by
default; see section *Frequency calculations - numerical and analytical* ), their thermochemical contributions
are calculated as if they are vibrations.

  - While the program allows the combination of electric fields with an implicit solvation model, the results
must be interpreted with caution, because the solvent medium does not feel the electric field. The results
may therefore differ substantially from those given by experimental setups where both the solute and the
solvent are subjected to the electric field. If the solvent’s response to the electric field is important, one
should use an explicit solvation model instead. Alternatively, one can also simulate the electric field in the
implicit solvent by adding inert ions (e.g. Na [+], Cl *[−]* ) to the system. Similarly, implicit solvation models
cannot describe the formation of electrical double layers in the electric field and their influence on solute
properties, so in case electrical double layers are important, MD simulations with explicit treatment of the
ions must be carried out.

  - The electric field not only contributes to the core Hamiltonian, but has extra contributions in GIAO calculations, due to the magnetic field derivatives of dipole integrals. In the case of a dipolar electric field, the
GIAO contributions have been implemented, making it possible to study e.g. the effect of electric fields on
NMR shieldings, and as a special case, nucleus independent chemical shieldings (NICSs), which are useful
tools for analyzing aromaticity. Quadrupolar fields cannot be used in GIAO calculations at the moment.
### **6.2 SCF Stability Analysis**

The SCF stability will give an indication whether the SCF solution is at a local minimum or a saddle point.[80, 780]
It is available for RHF/RKS and UHF/UKS. In the latter case, the SCF is restarted by default using new unrestricted
start orbitals if an instability was detected. For a demonstration, consider the following input:

(continues on next page)

**164** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



The HCORE guess leads to a symmetric/restricted guess, which does not yield the unrestricted solution. The same
is often true for other guess options. For more details on the stability analysis, see Section *SCF Stability Analysis* .
### **6.3 Geometry Optimizations, Surface Scans, Transition States,** **MECPs, Conical Intersections, IRC, NEB**

The usage of analytic gradients is necessary for efficient geometry optimization. In ORCA 5.0, the following
methods provide analytic first derivatives

  - Hartree-Fock (HF) and DFT (including the RI, RIJK and RIJCOSX approximations)

  - MP2, RI-MP2 and DLPNO-MP2

  - TD-DFT for excited states

  - CAS-SCF

When the analytic gradients are not available, it is possible to evaluate the first derivatives numerically by finite
displacements. This is available for all methods.

The coordinate system chosen for geometry optimization affects the convergence rate, with redundant internal
coordinates being usually the best choice.

Some methods for locating transition states (TS) require second derivative matrices (Hessian), implemented analytically for HF, DFT and MP2. Additionally, several approaches to construct an initial approximate Hessian for
TS optimization are available. A very useful feature for locating complicated TSs is the Nudged-Elastic Band
method in combination with the TS finding algorithm (NEB-TS, ZOOM-NEB-TS). An essential feature for chemical processes involving excited states is the conical intersection optimizer. Another interesting feature are MECP
(Minimum Energy Crossing Point) optimizations.

For very large systems ORCA provides a very efficient L-BFGS optimizer, which makes use of the orca_md module.
It can also be invoked via simple keywords described at the end of this section.

**6.3.1 Geometry Optimizations**

Optimizations are fairly easy as in the following example:



An optimization with the RI method (the BP functional is recommend) would simply look like:



(continues on next page)

**6.3. Geometry Optimizations, Surface Scans, Transition States, MECPs, Conical Intersections,165**
**IRC, NEB**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

An optimization of the first excited state of ethylene:

**6.3.2 Numerical Gradients**

If the analytic gradient is not available, the numerical gradient can simply be requested via:
```
! NumGrad

```
as in the following example:



NOTE

  - Be aware that the numerical gradient is quite expensive. The time for one gradient calculation is equal to 6
*×* (number of atoms) *×* (time for one single point calculation).

  - The numerical gradient can be calculated in a multi-process run, using a maximum of three times the number
of atoms (see section *Calling the Program with Multiple Processes* ).

More details on various options, geometry convergence criteria and the like are found in section *Geometry Opti-*
*mization* .

**6.3.3 Some Notes and Tricks**

**Note:**

   - `TightSCF` in the SCF part is set as default to avoid the buildup of too much numerical noise in the gradients.

  - Even if the optimization does not converge, the ORCA output may still end with “****ORCA TERMINATED NORMALLY****”. Therefore do not rely on the presence of this line as an indicator of whether
the geometry optimization is converged! Rather, one should instead rely on the fact that, an optimization
job that terminates because the maximum number of iterations has been reached, will generate the following

output message:

**166** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**




While a successfully converged job will generate the following message instead:



**Tip:**

  - In rare cases the redundant internal coordinate optimization fails. In this case, you may try to use `COPT`
(optimization in Cartesian coordinates). This will likely take many more steps to converge but should be
stable.

  - For optimizations in Cartesian coordinates the initial guess Hessian is constructed in internal coordinates
and thus these optimizations should converge only slightly slower than those in internal coordinates. Nevertheless, if you observe a slow convergence behaviour, it may be a good idea to compute a Hessian initially
(perhaps at a lower level of theory) and use `InHess read` in order to improve convergence.

  - At the beginning of a TS optimization more information on the curvature of the PES is needed than a model
Hessian can give. The best choice is analytic Hessian, available for HF, DFT and MP2. In other cases (e.g.
CAS-SCF), the numerical evaluation is necessary. Nevertheless you do not need to calculate the full Hessian
when starting such a calculation. With ORCA we have good experience with approximations to the exact
Hessian. Here it is recommended to either directly combine the TS optimization with the results of a relaxed
surface scan or to use the Hybrid Hessian as the initial Hessian, depending on the nature of the TS mode.
Note that these approximate Hessians do never replace the exact Hessian at the end of the optimization,
which is always needed to verify the minimum or first order saddle point nature of the obtained structure.

**6.3.4 Initial Hessian for Minimization**

The convergence of a geometry optimization crucially depends on the quality of the initial Hessian. In the simplest
case it is taken as a unit matrix (in redundant internal coordinates we use 0.5 for bonds, 0.2 for angles and 0.1 for
dihedrals and improper torsions). However, simple model force-fields like the ones proposed by Schlegel, Lindh,
Swart or Almlöf are available and lead to much better convergence. The different guess Hessians can be set via the
`InHess` option which can be either `unit`, `Almloef`, `Lindh`, `Swart` or `Schlegel` in redundant internal coordinates.
Since version 2.5.30, these model force-fields (built up in internal coordinates) can also be used in optimizations
in Cartesian coordinates.

For minimizations we recommend the `Almloef` Hessian, which is the default for minimizations. The `Lindh` and
`Schlegel` Hessian yield a similar convergence behaviour. From version 4.1?, there is also the option for the `Swart`
model Hessian, which is less parametrized and should improve for weakly interacting and/or unusual structures.
Of course the best Hessian is the exact one. `Read` may be used to input an exact Hessian or one that has been
calculated at a lower level of theory (or a “faster” level of theory). From version 2.5.30 on this option is also
available in redundant internal coordinates. But we have to point out that the use of the exact Hessian as initial
one is only of little help, since in these cases the convergence is usually only slightly faster, while at the same time
much more time is spent in the calculation of the initial Hessian.

To sum it up: we advise to use one of the simple model force-fields for minimizations.

**6.3. Geometry Optimizations, Surface Scans, Transition States, MECPs, Conical Intersections,167**
**IRC, NEB**

**ORCA Manual** **,** **Release 6.0.1**

**6.3.5 Coordinate Systems for Optimizations**

The coordinate system for the optimization can be chosen by the `coordsys` variable that can be set to `cartesian`
or `redundant` within the `%geom` block. The default is the redundant internal coordinate system. If the optimization
with `redundant` fails, you can still try `cartesian` . If the optimization is then carried out in Cartesian displacement
coordinates with a simple model force-field Hessian, the convergence will be only slightly slower. With a unit
matrix initial Hessian very slow convergence will result.

A compound job `two_step_opt.inp` that first computes a semi-empirical Hessian to start from is shown below:

**Tip:**

  - For transition metal complexes MNDO, AM1 or PM3 Hessians are not available. You can use ZINDO/1 or
NDDO/1 Hessians instead. They are of lower quality than MNDO, AM1 or PM3 for organic molecules but
they are still far better than the standard unit matrix choice.

  - If the quality of the initial semi-empirical Hessian is not sufficient you may use a “quick” RI-DFT job (e.g.
`BP def2-sv(p) defgrid1` )

  - In semi-empirical geometry optimizations on larger molecules or in general when the molecules become
larger the redundant internal space may become large and the relaxation step may take a significant fraction
of the total computing time.

For condensed molecular systems and folded molecules (e.g. a U-shaped carbon chain) atoms can get very close
in space, while they are distant in terms of number of bonds connecting them. As damping of optimization steps in
internal coordinates might not work well for these cases, convergence can slow down. ORCA’s automatic internal
coordinate generation takes care of this problem by assigning bonds to atom pairs that are close in real space, but
distant in terms of number of bonds connecting them.



(continues on next page)

**168** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

For solid systems modeled as embedded solids the automatically generated set of internal coordinates might become
very large, rendering the computing time spent in the optimization routine unnecessarily large. Usually, in such
calculations the cartesian positions of outer atoms, coreless ECPs and point charges are constrained during the
optimization - thus most of their internal coordinates are not needed. By requesting:



only the required needed internal coordinates (of the constrained atoms) are generated.

OBS: If the step in `redundant` fails badly and only Cartesian constrains are set (or no constrains), ORCA will
fallback to a `cartesian` step automatically. This can be turned off by setting CARTFALLBACK to FALSE.

**6.3.6 Constrained Optimizations**

You can perform constrained optimizations which can, at times, be extremely helpful. This works as shown in the
following example:



**Note:**

  - Like for normal optimizations you can use numerical gradients (see *Numerical Gradients* .) for constrained
optimizations. In this case the numerical gradient will be evaluated only for non-constrained coordinates,
saving a lot of computational effort, if a large part of the structure is constrained.

  - “value” in the constraint input is optional. If you do not give a value, the present value in the structure is
constrained. For cartesian constraints you can’t give a value, but always the initial position is constrained.

  - It is recommended to use a value not too far away from your initial structure.

  - It is possible to constrain whole sets of coordinates:



(continues on next page)

**6.3. Geometry Optimizations, Surface Scans, Transition States, MECPs, Conical Intersections,169**
**IRC, NEB**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

  - For Cartesian constraints lists of atoms can be defined:
```
a list of atoms (10 to 17) with Cartesian constraints : { C 10:17 C}

```
  - Coordinates along a single Cartesian direction can be frozen as described in section *Special definitions* .

  - If there are only a few coordinates that have to be optimized you can use the `invertConstraints` option:



- In some cases it is advantageous to optimize only the positions of the hydrogen atoms and let the remaining
molecule skeleton fixed:



**Note:**

  - In the special case of a fragment optimization (see next point) the `optimizehydrogens` keyword does not
fix the heteroatoms, but ensures that all hydrogen positions are relaxed.

  - In Cartesian optimization, only Cartesian constraints are allowed.

**6.3.7 Constrained Optimizations for Molecular Clusters (Fragment Optimization)**

If you want to study systems, which consist of several molecules (e.g. the active site of a protein) with constraints,
then you can either use cartesian constraints (see above) or use ORCA’s fragment constraint option. ORCA allows
the user to define fragments in the system. For each fragment one can then choose separately whether it should be
optimized or constrained. Furthermore, it is possible to choose fragment pairs whose distance and orientation with
respect to each other should be constrained. Here, the user can either define the atoms which make up the connection
between the fragments, or the program chooses the atom pair automatically via a closest distance criterion. ORCA
then chooses the respective constrained coordinates automatically. An example for this procedure is shown below.

**170** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

The coordinates are taken from a crystal structure [PDB-code 2FRJ]. In our gas phase model we choose only a
small part of the protein, which is important for its spectroscopic properties. Our selection consists of a hemegroup (fragment 1), important residues around the reaction site (lysine (fragment 2) and histidine (fragment 3)), an
important water molecule (fragment 4), the NO-ligand (fragment 5) and part of a histidine (fragment 6) coordinated
to the heme-iron. In this constrained optimization we want to maintain the position of the heteroatoms of the heme
group. Since the protein backbone is missing, we have to constrain the orientation of lysine and histidine (fragments
2 and 3) side chains to the heme group. All other fragments (the ones which are directly bound to the heme-iron
and the water molecule) are fully optimized internally and with respect to the other fragments. Since the crystal
structure does not reliably resolve the hydrogen positions, we relax also the hydrogen positions of the heme group.



(continues on next page)

**6.3. Geometry Optimizations, Surface Scans, Transition States, MECPs, Conical Intersections,171**
**IRC, NEB**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)
```
 N(5) -0.712253 -2.291076 0.352054 newgto "TZVP" end
 O(5) -0.521243 -3.342329 0.855804 newgto "TZVP" end
 N(6) -0.953604 -0.686422 -3.215231 newgto "TZVP" end
 N(3) -0.338154 -0.678533 3.030265 newgto "TZVP" end
 N(3) -0.868050 0.768738 4.605152 newgto "TZVP" end
 N(6) -1.770675 0.099480 -5.112455 newgto "TZVP" end
 N(1) -2.216029 -0.133298 -0.614782 newgto "TZVP" end
 N(1) -2.371465 -2.775999 -1.706931 newgto "TZVP" end
 N(1) 0.489683 -2.865714 -1.944343 newgto "TZVP" end
 N(1) 0.690468 -0.243375 -0.860813 newgto "TZVP" end
 N(2) 1.284320 3.558259 6.254287
 C(2) 5.049207 2.620412 6.377683
 C(2) 3.776069 3.471320 6.499073
 C(2) 2.526618 2.691959 6.084652
 C(3) -0.599599 -0.564699 6.760567
 C(3) -0.526122 -0.400630 5.274274
 C(3) -0.194880 -1.277967 4.253789
 C(3) -0.746348 0.566081 3.234394
 C(6) 0.292699 0.510431 -6.539061
 C(6) -0.388964 0.079551 -5.279555
 C(6) 0.092848 -0.416283 -4.078708
 C(6) -2.067764 -0.368729 -3.863111
 C(1) -0.663232 1.693332 -0.100834
 C(1) -4.293109 -1.414165 -0.956846
 C(1) -1.066190 -4.647587 -2.644424
 C(1) 2.597468 -1.667470 -1.451465
 C(1) -1.953033 1.169088 -0.235289
 C(1) -3.187993 1.886468 0.015415
 C(1) -4.209406 0.988964 -0.187584
 C(1) -3.589675 -0.259849 -0.590758
 C(1) -3.721903 -2.580894 -1.476315
 C(1) -4.480120 -3.742821 -1.900939
 C(1) -3.573258 -4.645939 -2.395341
 C(1) -2.264047 -4.035699 -2.263491
 C(1) 0.211734 -4.103525 -2.488426
 C(1) 1.439292 -4.787113 -2.850669
 C(1) 2.470808 -3.954284 -2.499593
 C(1) 1.869913 -2.761303 -1.932055
 C(1) 2.037681 -0.489452 -0.943105
 C(1) 2.779195 0.652885 -0.459645
 C(1) 1.856237 1.597800 -0.084165
 C(1) 0.535175 1.024425 -0.348298
 O(4) -1.208602 2.657534 6.962748
 H(3) -0.347830 -1.611062 7.033565
 H(3) -1.627274 -0.387020 7.166806
 H(3) 0.121698 0.079621 7.324626
 H(3) 0.134234 -2.323398 4.336203
 H(3) -1.286646 1.590976 5.066768
 H(3) -0.990234 1.312025 2.466155
 H(4) -2.043444 3.171674 7.047572
 H(2) 1.364935 4.120133 7.126900
 H(2) 0.354760 3.035674 6.348933
 H(2) 1.194590 4.240746 5.475280
 H(2) 2.545448 2.356268 5.027434
 H(2) 2.371622 1.797317 6.723020
 H(2) 3.874443 4.385720 5.867972
 H(2) 3.657837 3.815973 7.554224
 H(2) 5.217429 2.283681 5.331496
 H(2) 5.001815 1.718797 7.026903
 H(6) -3.086380 -0.461543 -3.469767
 H(6) -2.456569 0.406212 -5.813597

```
(continues on next page)

**172** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

**Note:**

  - You have to connect the fragments in such a way that the whole system is connected.

  - You can divide a molecule into several fragments.

  - Since the initial Hessian for the optimization is based upon the internal coordinates: Connect the fragments
in a way that their real interaction is reflected.

  - This option can be combined with the definition of constraints, scan coordinates and the
`optimizeHydrogens` option (but: its meaning in this context is different to its meaning in a normal
optimization run, relatively straightforward see section *Geometry Optimization* ).

  - Can be helpful in the location of complicated transition states (with relaxed surface scans).

**6.3.8 Adding Arbitrary Wall Potentials**

For some applications, it might be interesting to add arbitrary wall potentials during the geometry optimization. For
example, if you want to optimize an intermolecular complex and need that both structures stick together, without
one flying away during the optimization, or when using microsolvation.

In ORCA you can add three kinds of arbitrary “wall potentials”: an ellipsoid or spherical of the form


*𝑉* = *|* **R** *−* **O** *|*
(︂ *𝑟𝑎𝑑𝑖𝑢𝑠*

or a rectangular box potential with 6 walls of the form


)︂ 30


*𝑉* = *𝑒* [5(] **[R]** *[−][𝑤𝑎𝑙𝑙]* [)]

These can be given in two ways: by explicitly defining the origin of the potential and its limits, e.g:
```
%GEOM ELLIPSEPOT 0,0,0,5,3,4 # the last are the a,b and c radii

```
or:
```
%GEOM SPHEREPOT 0,0,0,5 # the last is the radius

```
or:

**6.3. Geometry Optimizations, Surface Scans, Transition States, MECPs, Conical Intersections,173**
**IRC, NEB**

**ORCA Manual** **,** **Release 6.0.1**
```
%GEOM BOXPOT 0,0,0,4,-4,3,-3,6,-6 # maxx, minx, maxy, miny, maxz and minz last

```
where the first three numbers are the center and the last is the radius for the sphere (or a,b and c for the ellipsoid)
and the max and min x,y and z dimensions of the box. All numbers should be given in Ångström.

In case a single number is given instead, the walls will be automatically centered around the centroid of the molecule
and that number will be added to the minimum sphere or box that is necessary to contain the molecule. For example:
```
%GEOM SPHEREPOT 2

```
or:
```
%GEOM BOXPOT 2

```
will build a minimum wall centered on the centroid that encloses the molecule and add 2 Ångström on top of it.
Still on the sphere case, a negative number like
```
%GEOM SPHEREPOT -2

```
will make the total radius of the sphere to be Ångström.

OBS: This will apply to regular geometry optimizations, as well as to the Global Optimizer (GOAT).

**6.3.9 Relaxed Surface Scans**

A final thing that comes in really handy are relaxed surface scans, i.e. you can scan through one coordinate while
all others are relaxed. It works as shown in the following example:


In the example above the value of the bond length between C and O will be changed in 12 equidistant steps from
1.35 down to 1.10 Ångströms and at each point a constrained geometry optimization will be carried out.

**Note:**

  - If you want to perform a geometry optimization at a series of values with non-equidistant steps you can give
this series in square brackets, [ ]. The general syntax is as follows:




- In addition to bond lengths you can also scan bond angles and dihedral angles:



**174** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**Tip:**

  - As in constrained geometry optimizations it is possible to start the relaxed surface scan with a different scan
parameter than the value present in your molecule. But keep in mind that this value should not be too far
away from your initial structure.

A more challenging example is shown below. Here, the H-atom abstraction step from CH 4 to OH-radical is computed with a relaxed surface scan ( *vide supra* ). The job was run as follows:



It is obvious that the reaction is exothermic and passes through an early transition state in which the hydrogen
jumps from the carbon to the oxygen. The structure at the maximum of the curve is probably a very good guess for
the true transition state that might be located by a transition state finder.

You will probably find that such relaxed surface scans are incredibly useful but also time consuming. Even the
simple job shown below required several hundred single point and gradient evaluations (convergence problems
appear for the SCF close to the transition state and for the geometry once the reaction partners actually dissociate
– this is to be expected). Yet, when you search for a transition state or you want to get insight into the shapes of
the potential energy surfaces involved in a reaction it might be a good idea to use this feature. One possibility to
ease the burden somewhat is to perform the relaxed surface scan with a “fast” method and a smaller basis set and
then do single point calculations on all optimized geometries with a larger basis set and/or higher level of theory.
At least you can hope that this should give a reasonable approximation to the desired surface at the higher level of
theory – this is the case if the geometries at the lower level are reasonable.

**6.3. Geometry Optimizations, Surface Scans, Transition States, MECPs, Conical Intersections,175**
**IRC, NEB**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.22: Relaxed surface scan for the H-atom abstraction from CH 4 by OH-radical (B3LYP/SV(P)).

**Multidimensional Scans**

After several requests from our users ORCA now allows up to three coordinates to be scanned within one calcula
tion.

**Note:**

  - For finding transition state structures of more complicated reaction paths ORCA now offers its very efficient
NEB-TS implementation (see section *Nudged Elastic Band Method* ).

  - 2-dimensional or even 3-dimensional relaxed surface scans can become very expensive - e.g. requesting 10
steps per scan, ORCA has to carry out 1000 constrained optimizations for a 3-D scan.

  - The results can depend on the direction of the individual scans and the ordering of the scans.

**176** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Simultaneous multidimensional scans, in which all scan coordinates are changed at the same time, can be requested
via the following keyword (which brings the cost of a multidimensional relaxed surface scan down to the cost of a
single relaxed surface scan):



**6.3.10 Multiple XYZ File Scans**

A different type of scan is implemented in ORCA in conjunction with relaxed surface scans. Such scans produce
a series of structures that are typically calculated using some ground state method. Afterwards one may want to
do additional or different calculations along the generated pathway such as excited state calculations or special
property calculations. In this instance, the “multiple XYZ scan” feature is useful. If you request reading from a
XYZ file via:
```
* xyzfile Charge Multiplicity FileName

```
this file could contain a number of structures. The format of the file is:



Thus, the structures are simply of the standard XYZ format and they are provided one after the other. There is no
need to add any extra character between them. This was the case for ORCA versions older than 6.0.0, where the
structures were separated by a “>” sign. The user can still use this format, if preferred, but is not needed anymore.
After processing the XYZ file, single point calculations are performed on each structure in sequence and the results
are collected at the end of the run in the same kind of trajectory `.dat` files as produced from trajectory calculations.

In order to aid in using this feature, the relaxed surface scans produce a file called `MyJob.allxyz` that is of the
correct format to be re-read in a subsequent run.

**6.3.11 Transition States**

**Introduction to Transition State Searches**

If you provide a good estimate for the structure of the transition state (TS) structure, then you can find the respective
transition state with the following keywords (in this example we take the structure with highest energy of the above
relaxed surface scan):

(continues on next page)

**6.3. Geometry Optimizations, Surface Scans, Transition States, MECPs, Conical Intersections,177**
**IRC, NEB**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



**Note:**

  - You need a good guess of the TS structure. Relaxed surface scans can help in almost all cases (see also
example above).

  - For TS optimization (in contrast to geometry optimization) an exact Hessian, a Hybrid Hessian or a modification of selected second derivatives is necessary.

  - Analytic Hessian evaluation is available for HF and SCF methods, including the RI and RIJCOSX approximations and canonical MP2.

  - Check the eigenmodes of the optimized structure for the eigenmode with a single imaginary frequency. You
can also visualize this eigenmode with `orca_pltvib` (section *Animation of Vibrational Modes* ) or any other
visualization program that reads ORCA output files.

  - If the Hessian is calculated during the TS optimization, it is stored as basename.001.hess, if it is recalculated several times, then the subsequently calculated Hessians are stored as basename.002.hess, basename.003.hess, ...

  - If you are using the Hybrid Hessian, then you have to check carefully at the beginning of the TS optimization
(after the first three to five cycles) whether the algorithm is following the correct mode (see TIP below). If
this is not the case you can use the same Hybrid Hessian again via the inhess read keyword and try to target
a different mode (via the `TS_Mode` keyword, see below).

In the example above the TS mode is of local nature. In such a case you can directly combine the relaxed surface
scan with the TS optimization with the
```
! ScanTS

```
command, as used in the following example:



**Note:**

**178** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

- The algorithm performs the relaxed surface scan, aborts the Scan after the maximum is surmounted, chooses
the optimized structure with highest energy, calculates the second derivative of the scanned coordinate and
finally performs a TS optimization.

- If you do not want the scan to be aborted after the highest point has been reached but be carried out up to
the last point, then you have to type:



As transition state finder we implemented the quasi-Newton like Hessian mode following algorithm.[67, 241, 365,
389, 399, 513, 763, 764, 765] This algorithm maximizes the energy with respect to one (usually the lowest) eigenmode and minimizes with respect to the remaining 3 *𝑁* *−* 7(6) eigenmodes of the Hessian.

**Tip:**

  - You can check at an early stage if the optimization will lead to the “correct” transition state. After the first
optimization step you find the following output for the redundant internal coordinates:



Every Hessian eigenmode can be represented by a linear combination of the redundant internal coordinates. In
the last column of this list the internal coordinates, that represent a big part of the mode which is followed uphill,
are labelled. The numbers reflect their magnitude in the TS eigenvector (fraction of this internal coordinate in the
linear combination of the eigenvector of the TS mode). Thus at this point you can already check whether your TS
optimization is following the right mode (which is the case in our example, since we are interested in the abstraction
of H1 from C0 by O5.

  - If you want the algorithm to follow a different mode than the one with lowest eigenvalue, you can either
choose the number of the mode:



**6.3. Geometry Optimizations, Surface Scans, Transition States, MECPs, Conical Intersections,179**
**IRC, NEB**

**ORCA Manual** **,** **Release 6.0.1**

or you can give an internal coordinate that should be strongly involved in this mode:



**Tip:**

  - If you look for a TS of a breaking bond the respective internal coordinate might not be included in the list of
redundant internal coordinates due to the bond distance being slightly too large, leading to slow or even no
convergence at all. In order to prevent that behavior a region of atoms that are active in the TS search can
be defined, consisting of e.g. the two atoms of the breaking bond. During the automatic generation of the
internal coordinates the bond radii of these atoms (and their neighbouring atoms) are increased, making it
more probable that breaking or forming bonds in the TS are detected as bonds.



**Hessians for Transition State Calculations**

For transition state (TS) optimization a simple initial Hessian, which is used for minimization, is not sufficient. In a
TS optimization we are looking for a first order saddle point, and thus for a point on the PES where the curvature is
negative in the direction of the TS mode (the TS mode is also called transition state vector, the only eigenvector of
the Hessian at the TS geometry with a negative eigenvalue). Starting from an initial guess structure the algorithm
used in the ORCA TS optimization has to climb uphill with respect to the TS mode, which means that the starting
structure has to be near the TS and the initial Hessian has to account for the negative curvature of the PES at that
point. The simple force-field Hessians cannot account for this, since they only know harmonic potentials and thus
positive curvature.

The most straightforward option in this case would be (after having looked for a promising initial guess structure
with the help of a relaxed surface scan) to calculate the exact Hessian before starting the TS optimization. With
this Hessian (depending on the quality of the initial guess structure) we know the TS eigenvector with its negative
eigenvalue and we have also calculated the exact force constants for all other eigenmodes (which should have
positive force constants). For the HF, DFT methods and MP2, the analytic Hessian evaluation is available and is
the best choice, for details see section Frequencies ( *Vibrational Frequencies* ).

When only the gradients are available (most notably the CASSCF), the numerical calculation of the exact Hessian
is very time consuming, and one could ask if it is really necessary to calculate the full exact Hessian since the only
special thing (compared to the simple force-field Hessians) that we need is the TS mode with a negative eigenvalue.

Here ORCA provides two different possibilities to speed up the Hessian calculation, depending on the nature of
the TS mode: the Hybrid Hessian and the calculation of the Hessian value of an internal coordinate. For both
possibilities the initial Hessian is based on a force-field Hessian and only parts of it are calculated exactly. If
the TS mode is of very local nature, which would be the case when e.g. cleaving or forming a bond, then the
exactly calculated part of the Hessian can be the second derivative of only one internal coordinate, the one which
is supposed to make up the TS mode (the formed or cleaved bond). If the TS mode is more complicated and more
delocalized, as e.g. in a concerted proton transfer reaction, then the hybrid Hessian, a Hessian matrix in which the
numerical second derivatives are calculated only for those atoms, which are involved in the TS mode (for more
details, see section *Geometry Optimization* ), should be sufficient. If you are dealing with more complicated cases
where these two approaches do not succeed, then you still have the possibility to start the TS optimization with a
full exact Hessian.

**180** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Numerical Frequency calculations are quite expensive. You can first calculate the Hessian at a lower level of theory
or with a smaller basis set and use this Hessian as input for a subsequent TS optimization:



Another possibility to save computational time is to calculate exact Hessian values only for those atoms which
are crucial for the TS optimization and to use approximate Hessian values for the rest. This option is very useful
for big systems, where only a small part of the molecule changes its geometry during the transition and hence the
information of the full exact Hessian is not necessary. With this option the coupling of the selected atoms are
calculated exactly and the remaining Hessian matrix is filled up with a model initial Hessian:



For some molecules the PES near the TS can be very far from ideal for a Newton-Raphson step. In such a case
ORCA can recalculate the Hessian after a number of steps:



Another solution in that case is to switch on the trust radius update, which reduces the step size if the NewtonRaphson steps behave unexpected and ensures bigger step size if the PES seems to be quite quadratic:



**Special Coordinates for Transition State Optimizations**

  - If you look for a TS of a breaking bond the respective internal coordinate might not be included in the
list of redundant internal coordinates (but this would accelerate the convergence). In such a case (and of
course in others) you can add coordinates to or remove them from the set of autogenerated redundant internal
coordinates (alternatively check the TS_Active_Atoms keyword):



**6.3. Geometry Optimizations, Surface Scans, Transition States, MECPs, Conical Intersections,181**
**IRC, NEB**

**ORCA Manual** **,** **Release 6.0.1**

**6.3.12 MECP Optimization**

There are reactions where the analysis of only one spin state of a system is not sufficient, but where the reactivity
is determined by two or more different spin states (Two- or Multi-state reactivity). The analysis of such reactions
reveals that the different PESs cross each other while moving from one stationary point to the other. In such a case
you might want to use the ORCA optimizer to locate the point of lowest energy of the crossing surfaces (called the
minimum energy crossing point, MECP).

As an example for such an analysis we show the MECP optimization of the quartet and sextet state of [FeO] [+] .




  - For further options for the MECP calculation, see section *Minimum Energy Crossing Points* .

**Tip:** You can often use a minimum or TS structure of one of the two spin states as initial guess for your MECPoptimization. If this doesn’t work, you might try a scan to get a better initial guess.

The results of the MECP optimization are given in the following output. The distance where both surfaces cross
is at 1.994 Å. In this simple example there is only one degree of freedom and we can also locate the MECP via a
parameter scan. The results of the scan are given in Fig. 6.23 for comparison. Here we see that the crossing occurs
at a Fe-O-distance of around 2 Å.

For systems with more than two atoms a scan is not sufficient any more and you have to use the MECP optimization.



**182** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.23: Parameter scan for the quartet and sextet state of [FeO] [+] (B3LYP/SV(P)).

A more realistic example with more than one degree of freedom is the MECP optimization of a structure along the
reaction path of the CH 3 O *↔* CH 2 OH isomerization.



**Note:**

  - To verify that a stationary point in a MECP optimization is a minimum, you have to use an adapted frequency
analysis, called by `SurfCrossNumFreq` (see section *Minimum Energy Crossing Points* ).

**6.3. Geometry Optimizations, Surface Scans, Transition States, MECPs, Conical Intersections,183**
**IRC, NEB**

**ORCA Manual** **,** **Release 6.0.1**

**6.3.13 Conical Intersection Optimization**

OBS.: It is currently only available using TD-DFT, will be expanded in future versions. More details about the
specific options on *Conical Intersections* .

A conical intersection (CI) is a complicated 3N-8 dimensional space, where two potential energy surfaces cross and
the energy difference between these two states is zero. Inside this so-called “seam-space” minima and transition
states can exist. Locating these minima is essential to understand photo-chemical processes, that are governed by
non-adiabatic events, as e.g. photoisomerization, photostability - similar to locating transition states for chemical

reactions.

As an example for such an analysis we show the conical intersection optimization of the ground and first excited
state of singlet ethylene.

**Note:** Even though locating the CI of a TD-DFT excited state and the reference state is supported, it is not the
recommended way of finding the ground state-excited state CI, because such CIs are not described properly by
TD-DFT (in particular, TD-DFT even predicts the wrong dimensionality for the intersection space). Instead, it is
advised to use SF-TD-DFT for this purpose, e.g. use the *𝑇* 1 state as the reference state, and calculate both the *𝑆* 0
and *𝑆* 1 states as excited states. ( *vide infra* )



**Tip:** You can often use a structure between the optimized structures of both states for your CI-optimization. If
this doesn’t work, you might try a scan to get a better initial guess.

The results of the CI-optimization are given in the following output. The energy difference between the ground and
excited state is printed as E diff. (CI), being reasonabley close for a conical intersection. For a description of the
calculation of the non-adiabatic couplings at this geometry, see section *Numerical non-adiabatic coupling matrix*
*elements* .

(continues on next page)

**184** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)


**CI minima between excited states** In an analogous way, the conical intersection minima between two excited
states can be requested by selection both an IROOT and a JROOT, shown below.



**6.3. Geometry Optimizations, Surface Scans, Transition States, MECPs, Conical Intersections,185**
**IRC, NEB**

**ORCA Manual** **,** **Release 6.0.1**

**6.3.14 Constant External Force - Mechanochemistry**

Constant external force can be applied on the molecule within the EFEI formalism[719] by pulling on the two
defined atoms. To apply the external force, use the POTENTIALS in the geom block. The potential type is C for
Constant force, indexes of two atoms (zero-based) and the value of force in nN.

The results are seen in the output of the SCF procedure, where the total energy already contains the force term.




**6.3.15 Intrinsic Reaction Coordinate**

The Intrinsic Reaction Coordinate (IRC) is a special form of a minimum energy path, connecting a transition state
(TS) with its downhill-nearest intermediates. A method determining the IRC is thus useful to determine whether
a transition state is directly connected to a given reactant and/or a product.

ORCA features its own implementation of Morokuma and coworkers’ popular method.[412] The IRC method can
be simply invoked by adding the IRC keyword as in the following example.



For more information and further options see section *Intrinsic Reaction Coordinate* .

**Note:**

  - The same method and basis set as used for optimization and frequency calculation should be used for the
IRC run.

**186** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

  - The IRC keyword can be requested without, but also together with OptTS, ScanTS, NEB-TS, AnFreq and
NumFreq keywords.

  - In its default settings the IRC code checks whether a Hessian was computed before the IRC run. If that is
not the case, and if no Hessian is defined via the %irc block, a new Hessian is computed at the beginning of
the IRC run.

  - A final trajectory (_IRC_Full_trj.xyz) is generated which contains both directions, forward and backward, by starting from one endpoint and going to the other endpoint, visualizing the entire IRC. Forward
(_IRC_F_trj.xyz and _IRC_F.xyz) and backward (_IRC_B_trj.xyz and _IRC_B.xyz) trajectories and xyz
files contain the IRC and the last geometry of that respective run.

**6.3.16 Printing Hessian in Internal Coordinates**

When a Hessian is available, it can be printed out in redundant internal coordinates as in the following example:



**Note:**

  - The Hessian in internal coordinates is (for the input `printHess.inp` ) stored in the file
`printHess_internal.hess` .

  - The corresponding lists of redundant internals is stored in `printHess.opt` .

  - Although the `!Opt` keyword is necessary, an optimization is not carried out. ORCA exits after storing the
Hessian in internal coordinates.

**6.3.17 Using model Hessian from previous calculations**

If you had a geometry optimization interrupted, or for some reason want to use the model Hessian updated from
a previous calculation, you can do that by passing a `basename.opt` file, a `basename.carthess` file or the initial
Hessian on a new calculation.



**6.3. Geometry Optimizations, Surface Scans, Transition States, MECPs, Conical Intersections,187**
**IRC, NEB**

**ORCA Manual** **,** **Release 6.0.1**

**6.3.18 Geometry Optimizations using the L-BFGS optimizer**

Optimizations using the L-BFGS optimizer are done in Cartesian coordinates. They can be invoked quite simple
as in the following example:



Using this optimizer systems with 100s of thousands of atoms can be optimized. Of course, the energy and gradient
calculations should not become the bottleneck for such calculations, thus MM or QM/MM methods should be used
for such large systems.

The default maximum number of iterations is 200, and can be increased as follows:



Only the hydrogen positions can be optimized with the following command:
```
! L-OptH

```
But also other elements can be exclusively optimized with the following command:



When fragments are defined for the system, each fragment can be optimized differently (similar to the fragment
optimization described above). The following options are available:

**FixFrags**

Freeze the coordinates of all atoms of the specified fragments.

**RelaxHFrags**

Relax the hydrogen atoms of the specified fragments. Default for all atoms if !L-OptH is defined.

**RelaxFrags**

Relax all atoms of the specified fragments. Default for all atoms if !L-Opt is defined.

**RigidFrags**

Treat each specified fragment as a rigid body, but relax the position and orientation of these rigid bodies.

**Note:**

  - The fragments have to be defined after the coordinate input.

A more complex example is depicted in the following:



(continues on next page)

**188** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

**6.3.19 Nudged Elastic Band Method**

The Nudged Elastic Band (NEB) method is used to find a minimum energy path (MEP) connecting given reactant
and product state minima on the energy surface. An initial path is generated and represented by a discrete set of
configurations of the atoms, referred to as images of the system. The number of images is specified by the user
and has to be large enough to obtain sufficient resolution of the path. The implementation in ORCA is described
in detail in the article by Ásgeirsson et. al.[4] and in section *Nudged Elastic Band Method* along with the input
options. The most common use of the NEB method is to find the highest energy saddle point on the potential
energy surface specifying the transition state for a given initial and final state. Rigorous convergence to a first
order saddle point can be obtained with the climbing image NEB (CI-NEB), where the highest energy image is
pushed uphill in energy along the tangent to the path while relaxing downhill in orthogonal directions. Another
method for finding a first order saddle point is the NEB-TS which uses the CI-NEB method with a loose tolerance
to begin with and then switches over to the OptTS method to converge on the saddle point. This combination can
be a good choice for calculations of complex reactions where the ScanTS method fails or where 2D relaxed surface
scans are necessary to find a good initial guess structure for the OptTS method. The zoomNEB variants are a good
choice in case of very complex transition states with long tails. For more and detailed information on the various
NEB variants implemented in ORCA please consult section *Nudged Elastic Band Method* .

In their simplest form NEB, NEB-CI and NEB-TS only require the reactant and product state configurations (one
via the xyz block, and the other one via the keyword neb_end_xyzfile):



Below is an example of an NEB-TS run involving an intramolecular proton transfer within acetic acid. The simplest
input is

Where the final.xyz structure contains the corresponding structure with the proton on the other oxygen.

The initial path is reasonable and the CI calculation can be switched on after five NEB iterations.

**6.3. Geometry Optimizations, Surface Scans, Transition States, MECPs, Conical Intersections,189**
**IRC, NEB**

**ORCA Manual** **,** **Release 6.0.1**



The CI run converges after another couple of iterations:



Subsequently a summary of the MEP is printed:




Additionally, detailed information on the highest energy image (or the CI) is printed:




(continues on next page)

**190** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



Finally, a TS optimization is started, after which the MEP information is updated by including the TS structure:




Note that here both TS and CI are printed for comparison.
### **6.4 GOAT: global geometry optimization and ensemble generator**

If instead of trying to optimize a single structure, starting from a given guess geometry, you want to find the **global**
minimum or the ensemble around it, ORCA features a Global Optimizer Algorithm (GOAT) inspired by Wales and
Doye’s basin-hopping [878], Goedecker’s minima hopping [306], Simulated Annealing and Taboo Search.

The idea is to start from somewhere on the potential energy surface (PES; red ball on Fig. 6.24), go first to the
nearest local minimum (blue ball), and from there start pushing “uphill” on a random direction until a barrier
is crossed. Then a new minimum is found and the process is restarted, with another uphill push followed by an
optimization. After several of these GOAT iterations (uphill + downhill), if no new global minimum was found
between the two last global iterations.

**6.4. GOAT: global geometry optimization and ensemble generator** **191**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.24: A simple depiction of the difference between a regular geometry optimization (above), and the GOAT
global optimizer (below). By using the latter, one finds not only one local minimum but the global one and the
conformational ensemble around it.

Since structures are collected along the way to the global minimum, we have in the end not only the global minimum,
but also the conformational ensemble for that molecule, meaning all the conformations it **can** have and their relative
energies. This is also useful later to compute Boltzmann-averaged spectra and properties.

The idea is similar to what is done with CREST from the group of Prof. Grimme [698], except that no metadynamics
is required and thus much less gradient runs are needed. It is thus suitable not only for super fast methods such as
XTB and force-fields, but can also be used directly using DFT or with any method available in ORCA.

Please note that there is no *ab initio* way to find global minima for arbitrary unknown functions, and stochastic
methods are the most efficient on finding these. The drawback is that it is based on random choices, so that many
geometry optimizations are needed - here in the order of 100 *×* the number of atoms. Good news is: these can be
efficiently parallelized (even multinode) and this number can be brought down to less than 3 *×* the number of atoms
(see below)!

**192** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**6.4.1 GOAT simple usage example - Histidine**

Let’s start with a simple example, the amino acid histidine:

Fig. 6.25: A histidine molecule.

By simply looking at its Lewis structure, it is not at all evident that there are actually at least 20 conformers in the
3 kcal/mol range from the global minimum on the XTB PES! In order to find them, one can run:



The command to call the global optimizer is simply `!GOAT`, like you would with `!OPT`, and its options can be given
under the `%GOAT` block as usual. You can give it together with any other method available in ORCA, but it needs
to be a fast one because a lot of geometry optimizations need to be done. Here we will just use `GFN2` (or `!XTB` ).
What will happen next is:

1. First a regular geometry optimization will be done to find the minimum closest to the input structure.

2. With that information in hand, the number of necessary GOAT iterations will be computed and divided
among `NWorkers` (8 by default).

3. Each `Worker` has its own parameters and will run a certain number of geometry optimizations.

4. After all workers in a global cycle are done, data will be collected and a new cycle will begin. There will be
at least a “Minimum global steps” number of global cycles like this.

5. Once the difference between two global steps is negligible, it stops, collects everything and prints the ensemble energies and a file with all structures.

**6.4. GOAT: global geometry optimization and ensemble generator** **193**

**ORCA Manual** **,** **Release 6.0.1**

**6.4.2 Understanding the output**

After the usual geometry optimization, the output looks like:



On the top there is some general information. Most important here is that we have 8 workers and 1 CPU, meaning
each worker will run only after the other is done. If you want to speed up, just add more CPUs via e.g., `!PAL8` and
workers will run in parallel making it 8x faster. GOAT can also run multinode, so feel free to use any number of
processors via `%PAL` . In the end the filtering criteria used to differentiate conformers and rotamers is printed.

The default filtering is precisely the same as that of CREST: RMSD of atomic positions together with the rotational
constant, considering its anisotropy. For `GOAT-EXPLORE` (see below), the default RMSD metric is based on the
eigenvalues of the distance matrix instead, since it is invariant to translations, rotations and the atom ordering,
which changes quite often in these cases.

After that, the algorithm starts:



(continues on next page)

**194** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



On the top header one can see what are the temperatures used, the maximum energy allowed during an uphill
step, the maximum coefficient for gradient reflection, the number of optimizations done per worker, the number of
processors used for each and the local output file name.

The names of the output files are chosen as `BaseName.goat.globaliteration.workernumber.out` . These
are deleted after the run by default, but can be kept by setting `KEEPWORKERDATA TRUE` under `%GOAT` .

During each global iteration, the minimum energy so far, the conformational entropy *𝑆* conf and the conformational
Gibbs free energy *𝐺* conf are printed. Since **there are no rotamers here**, the entropy is calculated only on the basis
of the conformer energies and its convergence hints to the completeness of the ensemble created.

**6.4. GOAT: global geometry optimization and ensemble generator** **195**

**ORCA Manual** **,** **Release 6.0.1**

**6.4.3 The final ensemble**

In this case, as you can see, it already found the global minimum after the first global cycle with E = -34.346656
Hartree, but it keeps running for at least 3 cycles, following the defaults. This happens because it is a small
molecule, but it is not necessarily so and more cycles will be done if needed.

The final relative energies of the ensemble are printed afterwards, together with a `BaseName.finalensemble.`
`xyz` file:



Just for the record, here is how the four lowest lying conformers look like:

**196** **Chapter 6. Running Typical Calculations**

Whenever using `GOAT`, the `EnforceStrictConvergence` policy from ORCA’s optimizer is set to `TRUE` . This is
recommended here the ensure equal criteria for different molecules in the ensemble. It can be turned off by setting
`%GEOM EnforceStrictConvergence FALSE END` .

The regular optimization thresholds are already good, but it might also be a good idea to use `!TIGHTOPT` to make
sure all your ensemble molecules are well converged, specially for the `GOAT-EXPLORE` !

**6.4.4 GOAT-ENTROPY: expanding ensemble completeness by maximizing en-**
**tropy**

If you want to be as complete as possible in terms of the ensemble, you can use the `!GOAT-ENTROPY` keyword
instead. This will not only try to find the global minimum until the energy is converged, but will actually only stop
when the ∆ *𝑆* conf also converges to less than 0.1 cal/(molK), which is equivalent to maximizing the conformational
entropy (the threshold can be altered – see keyword list below).

This will push the algorithm so that all conformers around the global minimum should be found together with it.
Both temperature and ∆ *𝑆* conf can be changed via specific keywords shown at the list below. A higher temperature
will make the ∆ *𝑆* conf more sensitive to changes in high energy conformational regions and should make the search
even more complete.

**6.4. GOAT: global geometry optimization and ensemble generator** **197**

**ORCA Manual** **,** **Release 6.0.1**

Being more explicit, the conformational entropy, enthalpy and Gibbs free energy are calculated according to:

︀

︀


︀ *′*
∑ *𝑔* *𝑖* [(] *[𝐸]* *[𝑖]* *[𝛽]* [)] *[𝑒]* *[−][𝐸]* *[𝑖]* *[𝛽]*
*𝑆* conf = *𝑅* ln ∑︁ *𝑔* *𝑖* *[′]* *[𝑒]* *[−][𝐸]* *[𝑖]* *[𝛽]* [+] *′*

[︂ ∑︀ *𝑔* *𝑖* [(] *[𝐸]* *[𝑖]* *[𝛽]* [)] *[𝑒]* *[−][𝐸]* *[𝑖]* *[𝛽]*

︀


︀ ]︂

︀


︀

∑ ︀ *𝑔* *𝑖* ( *𝐸* *𝑖* *𝛽* ) *𝑒* *−𝐸* *𝑖* *𝛽*

[︀ *𝐻* ( *𝑇* ) *−* *𝐻* (0)]︀ conf [=] *[ 𝑅𝑇]* ∑︀ *𝑔* *𝑖* ( *𝐸* *𝑖* *𝛽* ) *𝑒* *−𝐸* *𝑖* *𝛽*

where *𝛽* = *𝑘* *𝐵* 1 *𝑇* [and] *[ 𝑔]* *[𝑖]* [is the “degeneracy” of conformer] *[ 𝑖]* [, i.e. its number of rotamers. This is the correct approach]
to deal with degenerate states [700]. The only difference from the reference above is that *𝑔* *𝑖* *[′]* [is always one and we]
don’t discriminate any factor for “geometrical enantiomers”.

**6.4.5 More on the** Δ *𝑆* conf

It is important to say that, by default, the ∆ *𝑆* conf **is not the same as that found by a default CREST run** . There
it includes also the rotamer degeneracy on the calculation of the entropy, while here that is 1. The reasons for that

are:

1. There are formal arguments for using only one, assuming that rotamers are indistinguishable. Please check
Grimme’s reference [700] for details.

2. For systems with many rotamers, e.g. molecules with 3 *tert* -butyl groups which give rise to at least (27 [3] )
19683 rotamers per conformer, the algorithm will never find all of these anyway.

3. When calling `GOAT-ENTROPY`, it is the entropy of the **conformers** that will be maximized, not of the ensemble. That guarantees the maximal distribution of different conformers during these searches.

Once the final ensemble is found and if you know how many rotamers per conformer you have (assuming a constant
number, like the *tert* -butyl case), one can reset that number by using `READENSEMBLE "ensemble.xyz"` to read it
and `CONFDEGEN` to set a degeneracy. In the previous example that would be `CONFDEGEN 19683` and would give
you the desired ∆ *𝐺* conf for that given ensemble.

**Finding rotamers automatically**

It is always possible to switch on the automatic search for rotamers and their degeneracy by setting `CONFDEGEN`
`AUTO` if that is what you want. They will be added to the ensemble instead of being filtered out and the full ensemble
will be saved in files named `.confrot.xyz` .

Another approach would be to assume that, since the algorithm might find all rotamers for some conformers but
not for all, one might set the degeneracy of all equal to the maximum value found so far ( `CONFDEGEN AUTOMAX` ).
Let’s take as an example a system with a *tert* -butyl + a methyl group with 81 rotamers per conformer. GOAT will
hardly find 81 rotamers for every single conformer, but if it finds them for one conformer, all the others will also
have that same number.

Please be aware that there are cases where different conformers might have different numbers of rotamers (e.g.
decane or long alkyl chains), and these cases should be treated with care.

**6.4.6 GOAT-EXPLORE: global minima of atomic clusters or topology-free free**
**PES searches**

In case you want to find the lowest energy conformer for a cluster or don’t want to keep the initial topology at all,
you can use the `!GOAT-EXPLORE` option instead. This will possibly break all bonds and find the lowest energy
structure for that given set of atoms, be that a nanoparticle or an organic molecule.

For instance, let’s find the minimum of an Au 8 nanoparticle on the GFN1 PES, starting from just a random agglomeration of gold atoms:

**198** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**



Please note that there is a minimum number of optimizations per worker that must be respected in order for the
algorithm to make sense. Otherwise, on the limit, one optimization per worker would mean almost nothing happens.
This minimum number is `max(N, 15)` for the regular GOAT and `max(3N, 45)` for GOAT-EXPLORE and GOATREACT (see below), where N is the number of atoms. The searches using free topology are more demanding
because there are many more degrees of freedom.

When the minimum number of optimizations per worker is reached, the information is printed on the bottom of
the header as:



The global minimum found is a *𝐷* 4 *ℎ* planar structure, the same as found on the literature for the Au 8 cluster using
other DFT methods [54]:

**6.4. GOAT: global geometry optimization and ensemble generator** **199**

**200** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.28: What could be the products of the reaction between ethylene and singlet oxygen?

After running the following input:



the output looks more or less similar to the regular `GOAT-EXPLORE`, except for a few differences:

1. The maximum barriers GOAT is allowed to cross are higher.

2. The very initial geometry optimization is skipped by default.

3. `AUTOWALL` is set to `TRUE` which means that an ellipsoid wall potential is added using the maximum x,y,z
dimensions of the molecule + 5 Angs as radii.

Another important factor is the maximum topological difference ( `MAXTOPODIFF` ), which is set to 8 by default, as
printed on the output:



`MAXTOPODIFF` is a key concept here. If one simply looks for all possible topological permutations between reactants
and products, even simple systems such as this could lead to an enormous number of combinations.

We defined the topological difference simply as the sum of broken bonds + formed bonds from some reference
structure, which is taken from the structure obtained after the first geometry optimization inside the GOAT iterations
(before any uphill step).

There will be more files printed than usual, the most important ones are:

1. `Basename.products.xyz` – contains all *reactomers* and all their conformers for the reaction. It is usually
a very large file.

**6.4. GOAT: global geometry optimization and ensemble generator** **201**

**ORCA Manual** **,** **Release 6.0.1**

2. `Basename.products.topodiff2.xyz` – contains only those separated with topodiff 2 from the reference
# product 3 product 4 formaldehyde oxidized epoxy

Fig. 6.29: Some products automatically found by GOAT-REACT using the input given above.

**Note:** Please be aware that singlet oxygen is so reactive that even the first optimization leads to a cyclization
reaction and the reaction product is then taken as the reference structure.

**Important:** The use of force-fields like the GFN-FF is not recommended here, because it is not supposed to break
bonds.

**202** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**6.4.8 Some general observations**

**Default frozen coordinates during uphill step**

During the uphill phase only, by default GOAT will freeze:

1. all bonds,

2. all angles involving two sp2 atoms within the same ring,

3. all dihedrals around a strong bond (d(B,C) < [0.9 x (sum of covalent radii)]).

“sp2 atoms” are here loosely defined only for C, N and O with less than 4,3 and 2 bonds respectively.

The first freeze is to avoid change of topology by bond breaking. The second and third are to avoid going over
very high energy barriers on changing these angles, which in practice, unless under very special circumstances will
never flip anyway!

These constraints are automatically lifted for `GOAT-EXPLORE` and can also be set to `FALSE` with their specific
keywords.

**Parallelization of GOAT**

GOAT will profit from a large number of cores in a different way than most ORCA jobs, because it distributes the
necessary work along different workers. It can also work multidone and distribute these workers through different
nodes.

Since there is usually a regular first optimization step before starting GOAT, which will **not** profit from a large
number of cores, these are limited by the flag MAXCORESOPT and set to a maximum of 32. After that, GOAT
will switch back to use all cores provided. We do not recommend changing that maximum number, because it will
probably only make things slower, but it can be controlled inside the %GOAT block.

**Tips and extra details**

**Note:**

  - GOAT will work with any method in ORCA, all you need is the gradient. That includes using DFT, QM/MM,
ONIOM, broken-symmetry states, excited states etc.

  - Be aware that DFT is **much** costlier than XTB. It is perfectly possible to run GOAT with R2SCAN-3C, but
be prepared to use many cores or wait for a few days :D. We recommend at least `%PAL NPROCS 32 END`, to
have 8 workers with 4 cores each. Hybrid DFT is even heavier, so if you want to use B3LYP,go with at least
`NPROCS 64`   - and don’t hurry. The aim is to do a global search here, it does not come for free!

  - In many cases, it might be useful to use `GFNUPHILL GFNFF` to use the GFN-FF force-field PES during the
uphill steps. There, an exact potential is not really needed as the main objective is to take structures out
of their current minimum and GOAT will run much faster, only using the chosen method for the actual
optimizations. GFN2XTB, GFN1XTB or GFN0XTB are also valid options.

  - For methods that need bond breaking, such as `GOAT-EXPLORE` or `GOAT-REACT`, GFNUPHILL GFNFF cannot be used because the GFN-FF will not allow for bond breaking. Choose GFN2XTB, GFN1XTB or
GFN0XTB.

  - You can always check what the workers are doing by looking into the `Basename.goat.x.x.out` files. The
first number refers to the global iteration and the second to the specific worker. This is an ORCA output
(with some suppressed printing to save space) that can be opened in most GUIs.

  - GOAT will automatically detect fragments at the very beginning, even before the first geometry optimization.
It will also respect fragments given via the geometry blocks. You can turn this off by setting `AUTOFRAG` to
`FALSE` under `%GOAT` .

  - Amide bond chirality is **not** frozen by default, which means the input topology you gave for amides (cis or
trans) may change. If you want to freeze it, set `FREEZEAMIDES` to `TRUE` .

**6.4. GOAT: global geometry optimization and ensemble generator** **203**

**ORCA Manual** **,** **Release 6.0.1**

  - Similarly double bonds outside rings can also change their topology. Choose `FREEZECISTRANS TRUE` in
order to freeze those dihedrals.

  - For certain molecules, it might be interesting to limit the coordination number of certain atoms, in that case

use `MAXCOORDNUMBER` .

  - GOAT will respect the choices from the `%GEOM` block for the geometries so you can use all kinds of constraints
you need for other types of coordinate freeze. It can also be combined with all kinds of arbitrary wall
potentials available (see Section 6.3.8).

  - If you want to push only certain atoms uphill, you can give a list to `UPHILLATOMS` . In that case the uphill
force shown in Fig. 6.24 will be applied only to the coordinates involving those atoms and the rest of the
molecule will only react to that. This is useful for conformational searches on parts of a bigger system.

  - By default conformers up to 12.0 kcal/mol from the global minimum are included, this can be changed by
setting `MAXEN` .

**6.4.9 Basic keyword list**

Here we present a basic list of options to be given under `%GOAT` :



(continues on next page)

**204** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)
```
             # (might be a lot of data!).
  WORKERRANDOMSTART TRUE # after the first cycle, each worker starts with a random
              # structure from the previous set up to 3 kcal/mol
              # instead of the lowest energy only.
              # at least one starts from the lowest (default TRUE).
  #
  # uphill step
  #
  UPHILLATOMS {0:2 5 14:29} END # if given, only those atoms listed will be pushed,
                 # uphill others will just respond to it.
  GFNUPHILL GFNFF # use GFN-FF only during the uphill steps? GFN2XTB, GFN1XTB or
              # GFN0XTB are also valid options for the respective methods.
  #
  # filtering and screening
  #
  ALIGN FALSE # align all final conformers with respect to the
             # lowest energy one?
  ENDIFF 0.1 # minimum energy difference needed to differentiate
             # conformers, in kcal/mol.
  MAXEN 6.0 # the maximum relative energy of a conformer to
             # be taken, in kcal/mol. 6 kcal/mol by default.
  RMSD 0.125 # minimum RMSD to differentiate conformers, in Angstroem.
  ROTCONSTDIFF 0.01 # maximum difference for the rotational constant, in %.
  RMSDMETRIC EIGENVALUE # use eigenvalues of distance matrix for RMSD?
               # default is RMSD in general
               # and EIGENVALUE for GOAT-EXPLORE.
  #
  # entropy mode
  #
  MAXENTROPY FALSE # add delta Gconf as convergence criteria (default FALSE)?
  CONFTEMP 298.15 # temperature used to compute the free energy, in Kelvin.
  MINDELS 0.1 # the minimum entropy difference between two iterations
             # to signal convergence, in cal/(molK).
  CONFDEGEN 2 # set an arbitrary degeneracy per conformer?
         AUTO # find that automatically based on the RMSD.
         AUTOMAX # same as AUTO, but take the largest value as reference
              # for all conformers.
  #
  # free topology
  #
  FREEHETEROATOMS FALSE # free all atoms besides H and C.
  FREENONHATOMS FALSE # self explained.
  FREEFRAGMENTS FALSE # free interfragment topology, i.e., bonds between fragments
              might be formed or broken during the search but bonds
              within the same fragment will be kept.
  # we don't recommend changing these unless you really need to!
  FREEZEBONDS FALSE # freeze bonds uphill (default TRUE)?
  FREEZEANGLES FALSE # freeze sp2 angles and dihedrals uphill (default TRUE)?
  FREEZECISTRANS FALSE # freeze cis-trans isomers outside rings (default FALSE)?
  FREEZEAMIDES FALSE # freeze amide cis/trans chirality (default FALSE)?

```
(continues on next page)

**6.4. GOAT: global geometry optimization and ensemble generator** **205**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)


### **6.5 Vibrational Frequencies**

Vibrational frequency calculations are available through analytical differentiation of the SCF energy as well as oneor two-sided numerical differentiation of analytical gradients, i.e. for Hartree-Fock and DFT models. For methods without analytical gradient a numerically calculated gradient can be used (keyword `NumGrad` ) for numerical
frequencies. Please note, that this will be a very time consuming calculation.

The use of vibrational frequency calculations is fairly simple:




At the end of the frequency job you get an output like this:



(continues on next page)

**206** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



This output consists of the calculated vibrational frequencies, the vibrational modes and the thermochemical properties at 298.15 K. In the example above there are six frequencies which are identically zero. These frequencies
correspond to the rotations and translations of the molecule. They have been projected out of the Hessian before
the calculation of the frequencies and thus, the zero values do not tell you anything about the quality of the Hessian
that has been diagonalized. The projection can be turned off by `PROJECTTR FALSE` under %FREQ, so that the
frequencies of the translations and rotations can deviate from zero and the deviations represent a metric of the numerical error of the Hessian calculation. This is done automatically when there is e.g. an external electric field that
makes the exact translational and/or rotational modes have non-zero frequencies (see section *Adding finite electric*
*field* ). However, in normal cases where the molecule is expected to obey both translational and rotational invariance, it is **strongly discouraged** to turn off `PROJECTTR` when calculating thermochemical quantities (especially
entropies and Gibbs free energies). This is because when the frequencies of translational and rotational modes
exceed `CutOffFreq` (which is 1 cm *[−]* [1] by default), their contributions to the partition function will be calculated
using the formulas for vibrations. As a result, the calculated entropy is inaccurate (due to treating translations and
rotations as vibrations), is sensitive to numerical noise, and in particular exhibits a finite jump when the (theoretically zero) frequencies of the translational and rotational modes cross `CutOffFreq` . Therefore, the only case
where the user needs to turn off `PROJECTTR` manually is when the exact Hessian is expected to have zero translational and rotational frequencies, and one wants to check how much the translational and rotational eigenvalues of
the actually computed Hessian deviate from zero. The thermochemical quantities from such a calculation are less
reliable and should not be used; even if they differ considerably from the results with `PROJECTTR TRUE`, this does
not necessarily mean that the latter are unreliable.

Without `PROJECTTR FALSE`, the reliability of the calculated frequencies has to be judged by comparison of calculations with different convergence criteria, increments, integration grids etc. The numerical error in the frequencies
may reach 50 cm *[−]* [1] but should be considerably smaller in most cases. Significant negative frequencies indicate
saddle points of the energy hypersurface and prove that the optimization has not resulted in an energy minimum.

OBS: By default, the Hessian is made translation invariant by applying the “acoustic sum rule” ([788]), which
reduces the effect of noise from numerical integration coming from DFT or COSX, except for the Partial and
Hybrid Hessians where it does not make sense. It can be set to false by using TRANSINVAR FALSE under
%FREQ.

**6.5.1 Mass dependencies**

Of course the calculated frequencies depend on the masses used for each atom. While this can be influenced later
through the `orca_vib` routine (see Section *Isotope Shifts* for more detail) and individually for each atom in the
geometry input, one might prefer using a set of precise atomic masses rather than the set of atomic weights (which
are set as default). This can be achieved through the `!Mass2016` keyword, which triggers Orca to use those atomic
masses representing either the most abundant isotope or the most stable isotope (if all isotopes are unstable) of a
certain element (e.g. the mass of [35] *𝐶𝑙* for chlorine or the mass of [98] *𝑇𝑐* ).

**Note:** The calculation of numerical frequencies puts rather high demands on both computer time and accuracy.
In order to get reliable frequencies make sure that:

**6.5. Vibrational Frequencies** **207**

**ORCA Manual** **,** **Release 6.0.1**

  - Your SCF is tightly converged. A convergence accuracy of at least 10 *[−]* [7] Eh in the total energy and 10 *[−]* [6] in
the density is desirable.

  - Grids of at least `DEFGRID2` (default) are used.

  - The use of two-sided (i.e. central) differences increases the computation time by a factor of two but gives
more accurate and reliable results.

  - Small auxiliary basis sets like DGauss/J or DeMon/J may not result in fully converged frequencies (up to 40
cm *[−]* [1] difference compared to frequencies calculated without RI). The def2/J universal auxiliary basis sets
of Weigend that are now the default in ORCA (or the SARC/J for scalar relativistic calculations) are thought
to give sufficiently reliable results.

  - Possibly, the convergence criteria of the geometry optimization need to be tightened in order to get fully
converged results.

  - If you can afford it, decrease the numerical increment to 0.001 Bohr or so. This puts even higher demands on
the convergence characteristics of the SCF calculation but should also give more accurate numerical second
derivatives. If the increment is too small or too high inaccurate results are expected.

The calculation of analytical frequencies is memory consuming. To control memory consumption the `%maxcore`
parameter must be set. For example `%maxcore 8192` - use 8 Gb of memory per processor for the calculation.
The user should provide the value according to the computer available memory. The batching based on `%maxcore`
parameter will be introduced automatically to overcome probable memory shortage.

Numerical frequency calculations are restartable (but analytical frequency calculations are not). If the numerical
frequencies job died for one reason or another you can simply continue from where it stopped as in the following
example:



**Note:**

  - You must not change the level of theory, basis set or any other detail of the calculation. Any change will
produce an inconsistent, essentially meaningless Hessian.

  - The geometry at which the Hessian is calculated must be identical. If you followed a geometry optimization
by a frequency run then you must restart the numerical frequency calculation from the optimized geometry.

  - Numerical frequencies can be performed in multi-process mode. Please see section *Calling the Program*
*with Multiple Processes* (“Hints on the use of parallel ORCA”) for more information.

  - The restart of Numerical frequencies will take off from the result files produced during the preceding
run ( `BaseName.res.%5d.Type`, whith `Type` being `Dipoles`, `Gradients`    - and if requested `Ramans` or
`Nacmes` ). Please make sure that all these local result files get copied to your compute directory. If restart is
set and no local files to be found, ORCA will restart from scratch. If ORCA finds a Hessian file on disk, it
will only repeat the subsequent analysis.

  - The Hessian can be transformed to redundant internal coordinates. More information can be found in section

*Printing Hessian in Internal Coordinates* .

**208** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**
### **6.6 Excited States Calculations**

A plethora of methods to compute excited states exists in ORCA . In the following section, we illustrate typical
single-reference approaches. Multi-reference methods, such as NEVPT2 or MRCI, are described elsewhere in the
manual.

**6.6.1 Excited States with RPA, CIS, CIS(D), ROCIS and TD-DFT**

ORCA features a module to perform TD-DFT, single-excitation CI (CIS) and RPA. The module works with either
closed-shell (RHF or RKS) or unrestricted (UHF or UKS) reference wavefunctions. For DFT models the module
automatically chooses TD-DFT and for HF wavefunctions the CIS model. If the RI approximation is used in the
SCF part it will also be used in the excited states calculation. A detailed documentation is provided in section
*Excited States via RPA, CIS, TD-DFT and SF-TDA* .

**General Use**

In its simplest form it is only necessary to provide the number of roots sought:

The triplets parameter is only valid for closed-shell references. If chosen as true the program will also determine the
triplet excitation energies in addition to the singlets. We will discuss many more options in the following sections.

**Spin-Flip**

The collinear spin-flip version of CIS/TDA (always starting from an open-shell reference!) can be invoked in a
similar manner, using:



Please check Sec. *Collinear Spin-Flip TDA (SF-TD-DFT)* for more details on how to use it, and how to understand
its results.

**6.6. Excited States Calculations** **209**

**ORCA Manual** **,** **Release 6.0.1**

**Population analysis**

If you want to print excited-state charges and bond orders, you can use UPOP TRUE under %TDDFT to get the
analysis from the unrelaxed density and !ENGRAD if you want to use the relaxed density. Multiple states can be
indicated by the IROOTLIST and TROOTLIST keywords. For more details please check Sec. *Population Analysis*
*of Excited States* .

**Use of TD-DFT for the Calculation of X-ray Absorption Spectra**

In principle X-ray absorption spectra are “normal” absorption spectra that are just taken in a special high-energy
wavelength range. Due to the high energy of the radiation employed (several thousand eV), core-electrons rather
than valence electrons are excited. This has two consequences: a) the method becomes element specific because
the core-level energies divide rather cleanly into regions that are specific for a given element. b) the wavelength of
the radiation is so short that higher-order terms in the expansion of the light-matter interaction become important.
Most noticeably, quadrupole intensity becomes important.

X-ray absorption spectra can be generally divided into three regions: a) the pre-edge that corresponds to transitions
of core electrons into low lying virtual orbitals that lead to bound states. b) the rising edge that corresponds to
excitations to high-lying states that are barely bound, and c) the extended X-ray absorption fine structure region
(EXAFS) that corresponds to electrons being ejected from the absorber atom and scattered at neighbouring atoms.

With the simple TD-DFT calculations described here, one focuses the attention on the pre-edge region. Neither
the rising edge nor the EXAFS region are reasonably described with standard electronic structure methods and
no comparison should be attempted. In addition, these calculations are restricted to K-edges as the calculation of
L-edges is much more laborious and requires a detailed treatment of the core hole spin orbit coupling.

It is clearly hopeless to try to calculate enough states to cover all transitions from the valence to the pre-edge
region. Hence, instead one hand-selects the appropriate donor core orbitals and only allows excitations out of
these orbitals into the entire virtual space. This approximation has been shown to be justified.[200] One should
distinguish two situations: First, the core orbital in question may be well isolated and unambiguously defined. This
is usually the case for metal 1s orbitals if there is only one metal of the given type in the molecule. Secondly,
there may be several atoms of the same kind in the molecule and their core orbitals form the appropriate symmetry
adapted linear combinations dictated by group theory. In this latter case special treatment is necessary: The sudden
approximation dictates that the excitations occurs from a local core orbital. In previous versions of the program
you had to manually localize the core holes. In the present version there is an automatic procedure that is described
below.

A typical example is TiCl 4 . If we want to calculate the titanium K-edge, the following input is appropriate:



**Note:**

  - The absolute transition energies from such calculations are off by a few hundred electron volts due to the
shortcomings of DFT. The shift is constant and very systematic for a given element. Hence, calibration is
possible and has been done for a number of edges already. Calibration depends on the basis set!

**210** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

  - Electric quadrupole contributions and magnetic dipole contributions have been invoked with
`DoHigherMoments true` (check section *One Photon Spectroscopy* for more information), which is
essential for metal edges. For ligand edges, the contributions are much smaller.

   - `OrbWin` is used to select the single donor orbital (in this case the metal 1s). The LUMO (45) and last orbital
in the set (174) are selected automatically if “-1” is given. This is different from previous program versions
where the numbers had to be given manually.

The output contains standard TD-DFT output but also:



This section contains the relevant output since it combines electric dipole, electric quadrupole and magnetic dipole
transition intensities into the final spectrum. Importantly, there is a gauge issue with the quadrupole intensity: the
results depend on the where the origin is placed. We have proposed a minimization procedure that guarantees the
fastest possible convergence of the multipole expansion.[201]

The spectra are plotted by calling
```
orca_mapspc MyOutput.out ABSQ -eV -x04890 -x14915 -w1.3

```
Starting from ORCA version 4.1 one may obtain origin independent transition moments formulations which can
be combined with the multipole moments up to 2nd order to regenerate the electric dipole, electric quadrupole
and magnetic dipole contributions in either length or the velocity representations. This requires in addition to the
electric dipole (D), electric quadrupole (Q) and magnetic dipole (m) intensities the corresponding electric dipole magnetic quadrupole (DM) and the electric dipole - electric octupole (DO) intensities.[811][95]. See also section
*General Use* .

These spectra are requested by (check section *One Photon Spectroscopy* for more information)



Resulting in:



(continues on next page)

**6.6. Excited States Calculations** **211**

**ORCA Manual** **,** **Release 6.0.1**


(continued from previous page)



The Origin Independent transition moments spectra are plotted by calling:
```
orca_mapspc MyOutput.out ABSOI/ABSVOI -eV -x04890 -x14915 -w1.3

```
Although the multipole moments up to 2nd order:

  - Only approximate origin independence is achieved by using the length approximation for distances from the
excited atom up to about 5 Angstrom.

  - Can form negative intensities which can be partly cured by using larger basis sets.

Starting from ORCA version 6.0 the full semi-classical ligth-matter interaction[95][398][528] can be computed by
including the keyword:
```
DoFullSemiclassical true

```
Resulting in:



The full-semiclassical transition moments:

  - Behave like the multipole expansion in the velocity representation.

  - They are by definition origin independent they do not suffer from artificial negative values like the multipole
moments beyond 1st order.

Now, let us turn to the Cl K-edge. Looking at the output of the first calculation, we have:



(continues on next page)

**212** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

And looking at the energy range or the orbital composition, we find that orbitals 1 through 4 are Cl 1s-orbitals.
They all have the same energy since they are essentially non-interacting. Hence, we can localize them without
invalidating the calculation. To this end, you can invoke the automatic localization for XAS which modifies the
input to:




  - This localizes the orbitals 1 through 4 of operator 0 (the closed-shell) and then allows excitations (arbitrarily)
from core hole 1 only. You could choose any of the three other localized 1s orbitals instead without changing
the result. You could even do all four core holes simultaneously (they produce identical spectra) in which
case you have the entire ligand K-edge intensity and not just the one normalized to a single chlorine (this
would be achieved with `OrbWin[0] = 1,4,-1,-1` ).

  - If you have a spin unrestricted calculation, you need to give the same `XASLoc` and `OrbWin` information for
the spin-down orbitals as well.

Quite nice results have been obtained for a number of systems in this way.[713]

**Excited State Geometry Optimization**

For RPA, CIS, TDA and TD-DFT the program can calculate analytic gradients. With the help of the `IRoot` keyword, a given state can be selected for geometry optimization. Note however, that if two states cross during the
optimization it may fail to converge or fail to converge to the desired excited state (see section *Root Following*
*Scheme for Difficult Cases* below)! If you want to follow a triplet state instead of the singlet, please set IROOTMULT to TRIPLET.




**6.6. Excited States Calculations** **213**

**ORCA Manual** **,** **Release 6.0.1**

Note that this example converges to a saddle point as can be verified through a numerical frequency calculation
(which is also possible with the methods mentioned above). The excited state relaxed density matrix is available
from such gradient runs ( `MyJob.cisp` when using the `KeepDens` keyword) and can be used for various types of
analysis. Note that the frozen core option is available starting from version 2.8.0.

**Root Following Scheme for Difficult Cases**

In case there is a root flipping after a step during the geometry optimization, it might be impossible to converge an
excited state geometry using the regular methods. To help in those cases, the flag FOLLOWIROOT might be set
to TRUE. Then, excited state wavefunction will be analyzed and compared with the reference one (more below),
and the IROOT will be automatically adjusted to keep homing the target state.

One example of such a calculation is:



This will ask for an optimization of the third excited state of ammonia. At some point, there is a state crossing and
what was state 3 now becomes state 2. The algorithm will recognize this and automatically change the IROOT
flag, to keep following the same state. FOLLOWIROOT also works with spin-adapted triplets and spin-flip states.

In cases where you want to keep the comparison only with the density from **the very first** computed excited state,
e.g. the one you get on the first cycle of a geometry optimization, you can use FIRKEEPFIRSTREF, as in:



**Criteria to Follow IROOTs - starting from ORCA6**

Starting from ORCA6 we have a much more robust algorithm to follow these excited states, inspired by some of
the recent literature [820] [135]. The algorithm now works as follows, after each excited state calculation using
CIS/TDDFT:

1. Given a reference state, take all states within an energy difference of up to 1 eV to it. We don’t want to check
states that are too far apart in energy. Controlled by `%TDDFT FIRENTHRESH 1.0 END`, number in eV.

2. Now take all states with a difference of *𝑆* [ˆ] [2] not larger than 0.5. We don’t want to compare singlets to triplets.
Controlled by `%TDDFT FIRS2THRESH 0.5 END` .

3. Calculate the overlap between the transition densities of all states with the reference - this is the core part.

4. In case there is ambiguity - that is if two states have overlaps differing by only 0.05 - take the one with the
closer transition dipole angle. Controlled by `%TDDFT FIRSTHRESH 0.05 END` .

5. Update the IROOT to the state that went best on all these tests.

**214** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**Note:** These `FIR` keywords are specific to **F** ollow **IR** oot.

Now by default we might also update the reference state from time to time in case the separation of states is very
clear. The way it work is:

1. If the best overlap is larger than `FIRMINOVERLAP`, which is 0.5 by default and `FIRDYNOVERLAP` is `FALSE`, we
will assume that the overlap is good enough and we will always update the reference. However, the default
is `FIRDYNOVERLAP TRUE`, which means also have a second check for robustness.

2. If `FIRDYNOVERLAP TRUE` and the best overlap is larger than 0.5 (or `FIRMINOVERLAP` ), we will check for
the `ratio` between the best and the second best states. If this `ratio` is between 0.3 and 0.6 (controlled by
`%TDDFT FIRDYNOVERRATIO 0.3,0.6 END` ), it means that there is a clear separation between the best and
the second best and the reference can be updated safely. If the ratio is too close to 1, both states are too
similar and it would be dangerous to update the reference state. If it is too close to zero, they are easy to
distinguish and we don’t need to update the reference yet [820].

**Important:** It is important to stress that this will not necessarily solve all problems (root flipping can be particularly bad if the system is highly symmetric), for the excited states may change too much during the optimization. If
that happens, it is advisable to restart the calculation after some steps and check which IROOT you still want. This
can also be used when calculating numerical gradients and Hessians, in case you suspect of root flipping after the
displacements.

**Important:** This algorithm is completely general and should work for any excited state method, as long as there
are transition densities. We will include more methods in the future when possible.

**Doubles Correction**

For CIS (and also for perturbatively corrected time-dependent double-hybrid functionals) the program can calculate
a doubles correction to the singles-only excited states. The theory is due to Head-Gordon and co-workers [371].



Spin-component scaling versions of CIS(D) can be evoked in the %cis block by setting DOSCS TRUE and the
four scaling parameters, as defined by Head-Gordon and co-workers [718], in the following order: same-spin
indirect term (CTss), opposite-spin indirect term(CTos), same-spin direct term(CUss), and opposite-spin direct
term(CUos). Note that this implementation only works for the version with the parameter *𝜆* = 1 as defined in
Ref. [718]. The example below shows how to apply the SCS-CIS(D) version with *𝜆* = 1 whose usage has been
advocated in Ref. [311]. The user is able to specify other scaling parameters.



Note the use of commas to separate the parameters. These parameters do not communicate with the SCS/SOS
parameters set for ground-state SCS/SOS-MP2 in the %mp2 block.

**Note:**

  - CIS(D) is often a quite big improvement over CIS.

**6.6. Excited States Calculations** **215**

**ORCA Manual** **,** **Release 6.0.1**

  - The cost of the (D) correction is O(N [5] ) and therefore comparable to RI-MP2. Since there are quite a few
things more to be done for (D) compared to RI-MP2, expect the calculations to take longer. In the most
elementary implementation the cost is about two times the time for RI-MP2 for each root.

  - The (D) correction is compatible with the philosophy of the double-hybrid density functionals and should
be used if these functionals are combined with TD-DFT. The program takes this as the default but will not
enforce it. The (D) correction can be used both in a TD-DFT and TDA-DFT context.

  - In our implementation it is only implemented together with the RI approximation and therefore you need to
supply an appropriate (“/C”) fitting basis.

  - The program will automatically put the RI-MP2 module into operation together with the (D) correction. This
will result in the necessary integrals becoming available to the CIS module.

  - Singlet-triplet excitations can be calculated by setting TRIPLETS TRUE in the %cis or %tddft blocks, respectively. The implementation has been tested for double hybrids in Ref. [145].

  - For spin-adapted triplets (TRIPLETS TRUE), the only option available currently is DCORR 1.

  - Spin-component and spin-opposite scaling techniques for double-hybrids within the TD- and TDA-DFT
frameworks, as defined by Schwabe and Goerigk [772], can be evoked in the same way in the %tddft block
as described for SCS-CIS(D) above. While user-defined parameters can be entered in such a way, a series of
new functionals are available through normal keywords, which use the herein presented SCS/SOS-CIS(D)
implementation. [147] See Sec. *Choice of Functional* for a list of those functionals.

**Spin-orbit coupling**

It also possible to include spin-orbit coupling between singlets and triplets calculated from TD-DFT by using quasidegenerate perturbation theory (please refer to the relevant publication [198]), similarly to what is done in ROCIS.
In order to do that, the flag DOSOC must be set to TRUE. The reduced matrix elements are printed and the new
transition dipoles between all SOC coupled states are also printed after the regular ones. This option is currently
still not compatible with double hybrids, but works for all other cases including CPCM. All the options regarding
the SOC integrals can be altered in the %rel block, as usual.
```
%CIS DOSOC TRUE END

```
Please have in mind that, as it is, you can only calculate the SOC between excited singlets and the spin-adapted
triplets. There is no SOC starting from a UHF/UKS wavefunction. If you want more information printed such as
the full SOC matrix or triplet-triplet couplings, please set a higher PRINTLEVEL.

**SOC and ECPs**

ORCA currently does not have SOC integrals for ECPs, and these are by default ignored in the SOC module. If
you try to use ORCA together with ECPs, an abort message will be printed. If you absolutely need to use ECPs,
for instance for embedded potentials, please use:
```
%TDDFT FORCEECP TRUE END

```
OBS.: Do not use ECPs in atoms where SOC might be important. In that case, always use all-electron basis
functions or the results will not make sense.

**216** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**Geometry Optimization of SOC States**

If you want to compute geometries for the SOC states, just choose SOCGRAD TRUE and a given IROOT. The
weigthed “unrelaxed” gradient will then be calculated after selecting the CIS/TD-DFT states with contribution
larger than 0.01%. Each gradient will be calculated separately and, after that, the final SOC gradient will be
computed as a weighted sum. Setting IROOT 0 in this case corresponds to ask for the SOC ground state, which is
NOT necessarily equal to the ground state from HF/DFT.

**Transient spectra**

If one wants to compute transient spectra, or transition dipoles starting from a given excited state, the option
DOTRANS must be set to TRUE and an IROOT should be given for the initial state (the default is 1). If `DOTRANS`
`ALL` is requested instead, the transition dipoles between all states are computed. The transient transition dipoles
will then be printed after the normal spectra. This option is currently only available for CIS/TDA and is done usng
the expectation value formalism, as the other transition dipole moments in ORCA.



**Non-adiabatic coupling matrix elements**

The CIS module can compute the non-adiabatic coupling matrix elements (NACME) between ground and an
excited state given by an IROOT, *⟨* Ψ *𝐺𝑆* *|* *𝜕𝑅* *𝜕* *𝑥* *[|]* [Ψ] *[𝐼𝑅𝑂𝑂𝑇]* *[⟩]* [[][783][].] These can also include LR-CPCM effects if
!CPCM(solvent) is chosen in the main input, ZORA effects and will make use of RIJ and COSX, if they are
chosen for the SCF. The usage is simple, e.g.:



By choosing NACME TRUE under %TDDFT, a regular gradient calculation will be done, and the NACMEs will
be computed together with it. After the usual gradient output, the NACMEs will be printed as:



(continues on next page)

**6.6. Excited States Calculations** **217**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

**NACMEs with built-in electron-translation factor**

As you can see, the calculation above does not have full translation invariance! That is a feature of NACs calculated
from CI wavefunctions, due to the Born-Oppenheimer approximation. It can be somehow fixed by including the
so-called “electron-translation factors” (ETFs) [252], and those are added with ETF TRUE under %TDDFT. By
now using the input:



one gets the following output:



where the residual translation variance is due to the DFT and COSX grids only.

**Warning:** These are the recommended NACs to be used with any kind of dynamics or conical intersection
optimization, otherwise moving the center of mass of you system would already change the couplings!

**218** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**Numerical non-adiabatic coupling matrix elements**

The numerical non-adiabatic coupling matrix elements between ground and excited states from CIS/TD-DFT can
be calculated in a numerical fashion, by setting the NumNACME flag on the main input line:
```
! NumNACME

```
ORCA will then calculate both the NACMEs and the numerical gradient for a given IROOT at the same cost. Please
be careful with the SCF options and GRID sizes since there are displacements involved, for more information check
*Numerical Gradients* . All options regarding step size and so on can be changed from %NUMGRAD.

These are current implemented in both RHF/RKS and UHF/UKS, but only for CIS/TDA and RPA/TD-DFT, no
multireference methods yet. For the latter case, the overlap of the *|𝑋* *−* *𝑌* *⟩* vector is used [517].

**Restricted Open-shell CIS**

In addition to the CIS/TD-DFT description of excited states, ORCA features the `orca_rocis` module to perform
configuration interaction with single excitations calculations using a restricted open-shell Hartree–Fock (ROHF)
reference. It can be used to calculate excitation energies, absorption intensities and CD UHFintensities. In general,
ROCIS calculations work on restricted open-shell HF reference functions but in this implementation it is possible
to enter the calculations with RHF (only for closed-shell molecules) or UHF reference functions as well. If the
calculation starts with an UHF/UKS calculation, it will automatically produce the quasi-restricted orbitals which
will then be used for the subsequent ROCIS calculations. Note that if the reference function is a RHF/RKS function
the method produces the CIS results. The module is invoked by providing the number of roots sought in the `%rocis`
block of the input file:



In this example the `MaxDim` parameter is given in addition to the number of roots to be calculated. It controls the
maximum dimension of the expansion space in the Davidson procedure that is used to solve the CI problem.

The use of ROCIS is explained in greater detail in section *Excited States via ROCIS and DFT/ROCIS* .

Starting from ORCA 6.0, the General-Spin ROCIS ( `GS-ROCIS` ) implementation is available. This new implementation can handle arbitrary CSFs as references. For this, one would use the `CSF-ROHF` method to obtain the
reference wavefunction for which ROCIS will be performed. The `GS-ROCIS` calculation can be invoked as follows:




**6.6. Excited States Calculations** **219**

**ORCA Manual** **,** **Release 6.0.1**

Currently, there is no DFT/ROCIS implemented for the General-Spin procedure. Spin-Orbit coupling is also not
available in the present version.

**6.6.2 Excited States for Open-Shell Molecules with CASSCF Linear Response**
**(MC-RPA)**

ORCA has the possibility to calculate excitation energies, oscillator and rotatory strengths for CASSCF wave functions within the response theory (MC-RPA) formalism.[380, 417, 902] The main scope of MC-RPA is to simiulate
UV/Vis and ECD absorption spectra of open-shell molecules like transition metal complexes and organic radicals.
MC-RPA absorption spectra are usually more accurate than those obtained from the state-averaged CASSCF ansatz
as orbital relaxation effects for excited states are taken into account. The computational costs are ususally larger
than those of SA-CASSCF and should be comparable to a TD-DFT calculation for feasible active space sizes.

**General Use**

MC-RPA needs a converged state-specific CASSCF calculation of the electronic ground state. The only necessary
information that the user has to provide is the desired number of excited states (roots). All other keywords are
just needed to control the Davidson algorithm or post process the results. A minimal input for calculating the four
lowest singlet excited states of ethylene could like the following:



After the residual norm is below a user-given threshold `TolR` we get the following information




**220** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**


and the absorption and ECD spectrum



**Capabilities**

At the moment, we can simulate UV/Vis and ECD absorption spectra by computing excitation energies, oscillator
and rotatory strengths. The code is parallelized and the computational bottleneck is the integral direct AO-Fock
matrix construction. All intermediates that depend on the number of states are stored on disk, which makes the
MC-RPA implementation suitable for computing many low-lying electronic states of larger molecules. Abelian
point-group symmetry can be exploited in the calculation (up to D 2h ). But there are no calculations of spin-flip
excitations possible at the moment. That means all excited states will have the same spin as the reference state,
which is specified in the `%casscf` input block.

It is also possible to analyze and visualize the ground-to-excited-state transitions by means of natural transition
orbitals[562] (NTO), which is explained in more detail in section *Excited States via MC-RPA* .

For further details, please study our recent publications[379, 380].

**6.6. Excited States Calculations** **221**

**ORCA Manual** **,** **Release 6.0.1**

**6.6.3 Excited States with EOM-CCSD**

The methods described in the previous section are all based on the single excitation framework. For a more accurate
treatment, double excitations should also be considered. The equation of motion (EOM) CCSD method (and the
closely related family of linear response CC methods) provides an accurate way of describing excited, ionized
and electron attached states based on singles and doubles excitations within the coupled-cluster framework. In
this chapter, the typical usage of the EOM-CCSD routine will be described, along with a short list of its present
capabilities. A detailed description will be given in Section *Excited States via EOM-CCSD* .

**General Use**

The simplest way to perform an EOM calculation is via the usage of the `EOM-CCSD` keyword, together with the
specification of the desired number of roots:



The above input will call the EOM routine with default settings. The main output is a list of excitation energies,
augmented with some further state specific data. For the above input, the following output is obtained:




(continues on next page)

**222** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



The IP and EA versions can be called using the keywords `IP-EOM-CCSD` and `EA-EOM-CCSD` respectively. For
open-shell systems (UHF reference wavefunction), IP/EA-EOM-CCSD calculations require an additional keywords. Namely, an IP/EA calculation involving the removal/attachment of an *𝛼* electron is requested by setting
the `DoAlpha` keyword to true in the %mdci block, while setting the `DoBeta` keyword to true selects an IP/EA
calculation for the removal/attachment of a *𝛽* electron. Note that `DoAlpha` and `DoBeta` cannot simultaneously be
true and that the calculation defaults to one in which `DoAlpha` is true if no keyword is specified on input. A simple
example of the input for a UHF IP-EOM-CCSD calculation for the removal of an *𝛼* electron is given below.



**6.6. Excited States Calculations** **223**

**ORCA Manual** **,** **Release 6.0.1**

**Capabilities**

At present, the EOM routine is able to perform excited, ionized and electron attached state calculations, for both
closed- or open-shell systems, using RHF or UHF reference wavefunctions, respectively. It can be used for serial
and parallel calculations. The method is available in the back-transformed PNO and DLPNO framework enabling
the calculation of large molecules - see Section *Excited States with PNO based coupled cluster methods* and Section *Excited States with DLPNO based coupled cluster methods* . In the closed-shell case (RHF), a lower scaling
version can be invoked by setting the `CCSD2` keyword to true in the %mdci section. The latter is a second order
approximation to the conventional EOM-CCSD. For the time being, the most useful information provided is the list
of the excitation energies, the ionization potentials or the electron affinities. The ground to excited state transition
moments are also available for the closed-shell implementation of EE-EOM-CCSD.

**6.6.4 Excited States with ADC2**

Among the various approximate correlation methods available for excited states, one of the most popular one
is algebraic diagrammatic construction(ADC) method. The ADC has it origin in the Green’s function theory.
It expands the energy and wave-function in perturbation order and can directly calculate the excitation energy,
ionization potential and electron affinity, similar to that in the EOM-CCSD method. Because of the symmetric
eigenvalue problem in ADC, the calculation of properties are more straight forward to calculate than EOM-CCSD.
In ORCA, only the second-order approximation to ADC(ADC2) is implemented. It scales as O( *𝑁* [5] ) power of the
basis set.

**General Use**

The simplest way to perform an ADC2 calculation is via the usage of the `ADC2` keyword, together with the specification of the desired number of roots:



The above input will call the ADC2 routine with default settings. The main output is a list of excitation energies,
augmented with some further state specific data. The integral transformation in the ADC2 implementation of
ORCA is done using the density-fitting approximation. Therefore, one need to specify an auxiliary basis. For the
above input, the following output is obtained:



(continues on next page)

**224** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

The transition moment for ADC2 in ORCA is calculated using an EOM-like expectation value approach, unlike
the traditionally used intermediate state representation. However, the two approaches gives almost identical result.



(continues on next page)

**6.6. Excited States Calculations** **225**

**ORCA Manual** **,** **Release 6.0.1**


(continued from previous page)



The IP and EA versions can be called using the keywords IP-ADC2 and EA-ADC2, respectively.

**Capabilities**

At present, the ADC2 module is able to perform excited, ionized and electron attached state calculations, only for
closed-shell systems. No open-shell version of the ADC2 is currently available. Below are all the parameters that
influence the ADC2 module.



One can notice that features available in the ADC2 module is quite limited as compared to the EOM module and
the option to specifically target the core-orbitals are yet not available. A word of caution, **The ‘second order**
**black magic’ of ADC2 can fail in many of the cases.** The readers are encouraged to try the DLPNO based EOMCCSD methods( *Excited States with DLPNO based coupled cluster methods* ) which are much more accurate and
computationally efficient.

**6.6.5 Excited States with STEOM-CCSD**

The STEOM-CCSD method provides an efficient way to calculate excitation energies, with an accuracy comparable
to the EOM-CCSD approach, at a nominal cost. A detailed description will be given in Section *Excited States via*
*STEOM-CCSD* .

**General Use**

The simplest way to perform a STEOM calculation is using the `STEOM-CCSD` keyword, together with the specification of the desired number of roots ( `NRoots` ):




**226** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

The above input calls the STEOM routine with default settings, where, for instance, the doubly excited states are
eliminated ( `DoDbFilter true` ). The main output is a list of excitation energies, augmented with some further
state specific data. The STEOMCC approach in ORCA uses state-averaged CIS natural transition orbitals (NTO)
for the selection of the active space. For the above input, the following output is obtained:



(continues on next page)

**6.6. Excited States Calculations** **227**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



The first set of excitation amplitudes, printed for each root, have been calculated in the CIS NTO (Natural Transition
Orbitals) basis. The second set of amplitudes have been evaluated in the RHF canonical basis.

**Capabilities**

At present, the STEOM routine is able to calculate excitation energies, for both closed- or open-shell systems,
using an RHF or UHF reference function, respectively. It can be used for both serial and parallel calculations.
The method is available in the back-tranformed PNO and DLPNO framework allowing the calculation of large
molecules (Section *Capabilities* and *Excited States with DLPNO based coupled cluster methods* ). In the closedshell case (RHF), a lower scaling version can be invoked by setting the `CCSD2` keyword to true in the %mdci section,
which sets a second order approximation to the exact parent approach. The transition moments can also be obtained
for closed- and open-shell systems. For more details see Section *Excited States via STEOM-CCSD* .

**228** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**6.6.6 Excited States with IH-FSMR-CCSD**

The intermediate Hamiltonian Fock-space coupled cluster method (IH-FSMR-CCSD) provides an alternate way to
calculate excitation energies, with an accuracy comparable to the STEOM-CCSD approach. A detailed description
is given in Section *General Description* .

**General Use**

The IH-FSMR-CCSD calculation is called using the simple input keyword `IH-FSMR-CCSD` and specifying the
desired number of excited states ( `NRoots` ) in the %mdci block.:




The above input will call the IH-FSMR-CCSD routine with default settings. The main output is a list of excitation
energies, augmented with some further state specific data. The IH-FSMR-CCSD approach in ORCA uses stateaveraged CIS natural transition orbitals(NTO) for the selection of the active space - similar to STEOM-CCSD. For
the above input, the following output is obtained:




(continues on next page)

**6.6. Excited States Calculations** **229**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



The first set of excitation amplitudes, printed for each root, have been calculated in the CIS NTO (Natural Transition
Orbitals) basis. The second set of amplitudes have been evaluated in the RHF canonical basis.

**230** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**Capabilities**

At present, the IH-FSMR-CCSD routine is able to calculate excitation energies, for only closed shell systems using
an RHF reference. It can be used for both serial and parallel calculations. In the closed-shell case (RHF), a lower
scaling version can be invoked by using bt-PNO approximation. The transition moments and solvation correction
can be obtained using the CIS approximation.

**6.6.7 Excited States with PNO based coupled cluster methods**

The methods described in the previous section are performed over a canonical CCSD or MP2 ground state. The use
of canonical CCSD amplitudes restricts the use of EOM-CC and STEOM-CC methods to small molecules. The
use of MP2 amplitudes is possible (e.g. the EOM-CCSD(2) or STEOM-CCSD(2) approaches), but it seriously
compromises the accuracy of the method.

The bt-PNO-EOM-CCSD methods gives an economical compromise between accuracy and computational cost by
replacing the most expensive ground state CCSD calculation with a DLPNO based CCSD calculation. The typical
deviation of the results from the canonical EOM-CCSD results is around 0.01 eV. A detailed description will be
given in *Excited States using PNO-based coupled cluster* .

**General Use**

The simplest way to perform a PNO based EOM calculation is via the usage of the bt-PNO-EOM-CCSD keyword,
together with the specification of the desired number of roots. The specification of an auxilary basis set is also
required, just as for ground state DLPNO-CCSD calculations.



The output is similar to that from a canonical EOM-CCSD calculation:



(continues on next page)

**6.6. Excited States Calculations** **231**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

The IP and EA versions can be called by using the keywords bt-PNO-IP-EOM-CCSD and bt-PNO-EA-EOMCCSD, respectively. Furthermore, the STEOM version can be invoked by using the keywords bt-PNO-STEOMCCSD.

**232** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**Capabilities**

All of the features of canonical EOM-CC and STEOM-CC are available in the PNO based approaches for both
closed- and open-shell systems.

**6.6.8 Excited States with DLPNO based coupled cluster methods**

The DLPNO-STEOM-CCSD method uses the full potential of DLPNO to reduce the computational scaling while
keeping the accuracy of STEOM-CCSD.

**Important: DLPNO-STEOM-CCSD is currently only available for closed-shell systems!**

**General Use**

The simplest way to perform a DLPNO based STEOM calculation is via the usage of the `STEOM-DLPNO-CCSD`
keyword, together with the specification of the desired number of roots. The specification of an auxiliary basis set
is also required, just as for ground state DLPNO-CCSD calculations.

As any CCSD methods, it is important to allow ORCA to access a significant amount of memory. In term of scaling
the limiting factor of the method is the size of temporary files and thus the disk space. For molecules above 1500
basis functions it starts to increase exponentially up to several teraoctets.

Here is the standard input we would recommend for STEOM-DLPNO-CCSD calculations. More information on the
different keywords and other capabilities are available in the detailed part of the manual *Excited States via STEOM-*
*CCSD*, *Excited States via DLPNO-STEOM-CCSD* . The following publications referenced some applications for
this method either in organic molecules [100], [805] or for Semiconductors [213].




The output is similar to that from a canonical DLPNO-STEOM-CCSD calculation:

(continues on next page)

**6.6. Excited States Calculations** **233**

**ORCA Manual** **,** **Release 6.0.1**
```
Percentage Active Character 99.79
 Amplitude Excitation in Canonical Basis
 -0.134936 4 -> 8
 -0.955031 7 -> 8
  0.236745 7 -> 13
IROOT= 2: 0.308093 au 8.384 eV 67618.5 cm**-1
 Amplitude Excitation
 -0.971471 7 -> 9
 -0.214898 7 -> 10
 Ground state amplitude: -0.000000
Percentage Active Character 99.67
 Amplitude Excitation in Canonical Basis
 -0.956930 7 -> 9
  0.236567 7 -> 11
 -0.102574 7 -> 16
IROOT= 3: 0.331796 au 9.029 eV 72820.8 cm**-1
 Amplitude Excitation
  0.993677 5 -> 8
 Ground state amplitude: -0.000000
Percentage Active Character 98.87
 Amplitude Excitation in Canonical Basis
 -0.957218 5 -> 8
  0.250144 5 -> 13
  0.105963 5 -> 18
IROOT= 4: 0.346876 au 9.439 eV 76130.5 cm**-1
 Amplitude Excitation
 -0.104900 4 -> 10
  0.198181 7 -> 9
 -0.972571 7 -> 10
 Ground state amplitude: 0.000000
Percentage Active Character 99.65
 Amplitude Excitation in Canonical Basis
  0.100880 4 -> 11
  0.218876 7 -> 9
  0.956922 7 -> 11
 -0.113898 7 -> 19
IROOT= 5: 0.347460 au 9.455 eV 76258.7 cm**-1
 Amplitude Excitation
 -0.139550 4 -> 11
 -0.106648 4 -> 12
 -0.801181 6 -> 8
 -0.455618 7 -> 11
 -0.302466 7 -> 12
 Ground state amplitude: 0.027266
Percentage Active Character 87.08
Warning:: the state may have not converged with respect to active space
-------------------- Handle with Care -------------------
```

(continued from previous page)

(continues on next page)


**234** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)
```
 Amplitude Excitation in Canonical Basis
 -0.163789 4 -> 10
 -0.785695 6 -> 8
  0.159147 6 -> 13
 -0.527842 7 -> 10
  0.133087 7 -> 17
IROOT= 6: 0.379059 au 10.315 eV 83193.9 cm**-1
 Amplitude Excitation
 -0.983700 4 -> 8
  0.155238 7 -> 8
 Ground state amplitude: -0.000000
Percentage Active Character 99.48
 Amplitude Excitation in Canonical Basis
 -0.951092 4 -> 8
  0.235048 4 -> 13
  0.157713 7 -> 8
STEOM-CCSD done ( 2.4 sec)
Transforming integrals ... done
-------------------------------------------------------------------        UNRELAXED EXCITED STATE DIPOLE MOMENTS
-------------------------------------------------------------------        E(eV) DX(au) DY(au) DZ(au) |D|(D)
IROOT= 0: 0.000 -0.928848 -0.000000 -0.000000 2.360944
IROOT= 1: 3.926 -0.627710 -0.000000 -0.000002 1.595512
IROOT= 2: 8.384 1.034480 -0.000000 -0.000000 2.629438
IROOT= 3: 9.029 -0.401280 -0.000000 0.000000 1.019972
IROOT= 4: 9.439 -0.250433 0.000000 0.000002 0.636550
IROOT= 5: 9.455 0.304050 0.000000 -0.000000 0.772833
IROOT= 6: 10.315 -1.244475 0.000000 0.000000 3.163205
-------------------------------------------------------------------...
----------------------------------------------------------------------------------------------
```
*˓→* `-----`
```
           ABSORPTION SPECTRUM VIA TRANSITION ELECTRIC DIPOLE MOMENTS
----------------------------------------------------------------------------------------------
```
*˓→* `-----`
```
   Transition Energy Energy Wavelength fosc(D2) D2 DX DY ␣

```
*˓→* `DZ`
```
            (eV) (cm-1) (nm) (au**2) (au) (au) ␣

```
*˓→* `(au)`
```
----------------------------------------------------------------------------------------------
```
*˓→* `-----`
```
 0-1A -> 1-1A 3.925923 31664.7 315.8 0.000000000 0.00000 -0.00000 -0.00000 0.

```
*˓→* `00000`
```
 0-1A -> 2-1A 8.383625 67618.5 147.9 0.088173876 0.42929 -0.00000 0.65546 -0.

```
*˓→* `00000`
```
 0-1A -> 3-1A 9.028624 72820.8 137.3 0.000908615 0.00411 0.00000 -0.00000 -0.

```
*˓→* `06033`
```
 0-1A -> 4-1A 9.438972 76130.5 131.4 0.057997877 0.25080 0.00000 -0.49380 -0.

```
*˓→* `00000`
```
 0-1A -> 5-1A 9.454876 76258.7 131.1 0.029389253 0.12687 0.35160 -0.00000 -0.

```
*˓→* `00000`

(continues on next page)

**6.6. Excited States Calculations** **235**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



The IP and EA versions can be called by using the keywords IP-EOM-DLPNO-CCSD and EA-EOM-DLPNOCCSD, respectively. As in canonical STEOM-CCSD, the first set of excitation amplitudes, printed for each root,
are calculated in the CIS NTO (Natural Transition Orbitals) basis, while the second set is evaluated in the RHF
canonical basis.

**6.6.9 Excited States with DeltaSCF**

The `DeltaSCF` approach can converge the SCF directly to excited states. Since this method involves a few more
details, it is more thoroughly described on its specific section, please check *DeltaSCF: Converging to Arbitrary*
*Single-Reference Wavefunctions* .
### **6.7 Multireference Configuration Interaction and Pertubation The-** **ory**

**6.7.1 Introductory Remarks**

ORCA contains a multireference correlation module designed for traditional (uncontracted) approaches (configuration interaction, MR-CI, and perturbation theory, MR-PT). For clarification, these approaches have in common that
they consider excitations from each and every configuration state function (CSF) of the reference wavefunction.
Hence, the computational cost of such approaches grows rapidly with the size of the reference space (e.g. CASCI). Internally contracted on the other hand define excitations with respect to the entire reference wavefunction
and hence do not share the same bottlenecks. ORCA also features internally contracted approaches (perturbation
theory, *NEVPT2* and configuration interaction, *FIC-MRCI* ), which are described elsewhere in the manual.

**Note:** NEVPT2 is typically the method of choice as it is fast and easy to use. It is highly recommended to check
the respective section, when new to the field. The following chapter focuses on the traditional multi-reference
approaches as part of the `orca_mrci` module.

Although there has been quite a bit of experience with it, this part of the program is still somewhat hard to use
and requires patience and careful testing before the results should be accepted. While we try to make your life as
easy as possible, you have to be aware that ultimately any meaningful multireference *ab initio* calculation requires
more insight and planning from the user side than standard SCF or DFT calculation or single reference correlation
approaches like MP2 – so don’t be fainthearted! You should also be aware that with multireference methods it is
very easy to let a large computer run for a long time and still to not produce a meaningful result – your insight is
a key ingredient to a successful application! Below a few examples illustrate some basic uses of the `orca_mrci`
module.

**236** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**RI-approximation**

First of all, it is important to understand that the default mode of the MR-CI module in its present implementation
performs a full integral transformation from the AO to the MO basis. This becomes very laborious and extremely
memory intensive beyond approximately 200 MOs that are included in the CI. Alternatively, one can construct
molecular electron-electron repulsion integrals from the resolution of the identity (RI) approximation. *Thus a*
*meaningful auxiliary basis set must be provided if this option is chosen* . We recommend the fitting bases developed
by the TurboMole developers for MP2 calculations. These give accurate transition energies; however, the error in
the total energies is somewhat higher and may be on the order of 1 mEh or so. Check `IntMode` to change the default
mode for the integral transformation. Note that in either way, the individually selecting MRCI module requires to
have all integrals in memory which sets a limit on the size of the molecule that can be studied.

**Individual Selection**

Secondly, it is important to understand that the MR-CI module is of the *individually selecting* type. Thus, only those
excited configuration state functions (CSFs) which interact more strongly than a given threshold ( **T** **sel** ) with the
0 [th] order approximations to the target states will be included in the variational procedure. The effect of the rejected
CSFs is estimated using second order perturbation theory. The 0 [th] order approximations to the target states are
obtained from the diagonalization of the reference space configurations. A further approximation is to reduce the
size of this reference space through another selection – all initial references which contribute less than a second
threshold ( **T** **pre** ) to the 0 [th] order states are rejected from the reference space.

**Single excitations**

One important aspect concerns the single excitations. If the reference orbitals come from a CASSCF calculation
the matrix elements between the reference state and the single excitations vanishes and the singles will not be
selected. However, they contribute to fourth and higher orders in perturbation theory and may be important for
obtaining smooth potential energy surfaces and accurate molecular properties. Hence, the default mode of the
MRCI module requires to include all of the single excitations via the flag `AllSingles =true` . This may lead to
lengthy computations if the reference spaces becomes large!

**Reference Spaces**

Third, the reference spaces in the MR-CI module can be of the complete active space ( **CAS(n-electrons,m-**
**orbitals)** ) or restricted active space ( **RAS**, explained later) type. It is important to understand that the program
uses the orbitals around the HOMO-LUMO gap as provided by the user to build up the reference space! Thus, if
the orbitals that you want to put in the active space are not coming “naturally” from your SCF calculation in the
right place you have to reorder them using the “ `moread` ” and “ `rotate` ” features together with the `NoIter` directive. To select the most meaningful and economic reference space is the most important step in a multireference
calculation. It *always* requires insight from the user side and also care and, perhaps, a little trial and error.

**Size Consistency**

Fourth, it is important to understand that CI type methods are *not* size consistent. Practically speaking the energy
of the supermolecule A-B with noninteracting A and B fragments is not equal to the energies of isolated A and
isolated B. There are approximate ways to account for this ( **ACPF, AQCC** and **CEPA** methods) but the effect will
be present in the energies, the more so the more electrons are included in the treatment. The same is *not* true for
the perturbation theory based methods which are size consistent as long as the reference wavefunction is.

**6.7. Multireference Configuration Interaction and Pertubation Theory** **237**

**ORCA Manual** **,** **Release 6.0.1**

amplitudes — and this is not a large molecule or a large basis set! Despite the fact that the MDCI module makes
no approximation, it runs twice as fast as the *selected* MRCI module and an estimated 50 times faster than the
*unselected* MRCI module! This will become even more pronounced for the larger and more accurate basis sets
that one should use in such calculations anyways. The error of the selection is on the order of 3 mEh or 2 kcal/mol
in the total energy. One can hope that at least part of this error cancels upon taking energy differences. [1] The more
rigorous CCSD calculation takes about a factor of two longer than the ACPF calculation which seems reasonable.
The triples add another factor of roughly 2 in this example but this will increase for larger calculations since it has
a steeper scaling with the system size. The ACPF energy is intermediate between CCSD and CCSD(T) which is
typical — ACPF overshoots the effects of disconnected quadruples which partially compensates for the neglect of
triples.

These timings will strongly depend on the system that you run the calculation on. Nevertheless, what you should
take from this example are the message that if you can use the MDCI module, do it.

The MDCI module can avoid a full integral transformation for larger systems while the MRCI module can use
selection and the RI approximation for larger systems. Both types of calculation will become very expensive very
quickly! Approximate MDCI calculations are under development.

**Symmetry**

The MRCI program really takes advantage of symmetry adapted orbitals. In this case the MRCI matrix can be
blocked according to irreducible representations and be diagonalized irrep by irrep. This is a big computational
advantage and allows one to converge on specific excited states much more readily than if symmetry is not taken

into account.

The syntax is relatively easy. If you specify:



Then the “*” indicates that this is to be repeated in each irrep of the point group. Thus, in C 2 *𝑣* the program would
calculate 8 singlet roots in each of the four irreps of the C 2 *𝑣* point group thus leading to a total of 32 states.

Alternatively, you can calculate just a few roots in the desired irreps:



In this example, we would calculate 3 singlet roots in the irrep “0” (which is A 1 ), then five roots in irrep “2” (which
is B 1 ) and then 1 triplet root in irrep 1 (which is B 2 ).

Obviously, the results with and without symmetry will differ slightly. This is due to the fact that without symmetry
the reference space will contain references that belong to “wrong” symmetry but will carry with them excited
configurations of “right” symmetry. Hence, the calculation without use of symmetry will have more selected CSFs
and hence a slightly lower energy. This appears to be unavoidable. However, the effects should not be very large
for well designed reference spaces since the additional CSFs do not belong to the first order interacing space.

1 Depending on whether one wants to take a pessimistic or an optimistic view one could either say that this result shows what can be achieved
with a code that is dedicated to a single determinant reference. Alternatively one could (and perhaps should) complain about the high price one
pays for the generality of the MRCI approach. In any case, the name of the game would be to develop MR approaches that are equally efficient
to single reference approaches. See FIC-MRCI chapter for more information.

**6.7. Multireference Configuration Interaction and Pertubation Theory** **239**

**ORCA Manual** **,** **Release 6.0.1**

**6.7.2 A Tutorial Type Example of a MR Calculation**

Perhaps, the most important use of the MR-CI module is for the calculation of transition energies and optical
spectra. Let us first calculate the first excited singlet and triplet state of the formaldehyde molecule using the MRCI method together with the Davidson correction to approximately account for the effect of unlinked quadruple
substitutions. We deliberately choose a somewhat small basis set for this calculation which is already reasonable
since we only look at a valence excited state and want to demonstrate the principle.

Suppose that we already know from a ground state calculation that the HOMO of H 2 CO is an oxygen lone pair
orbitals and the LUMO the *𝜋* *[*]* MO. Thus, we want to calculate the singlet and triplet n *→* *𝜋* *[*]* transitions and nothing
else. Consequently, we only need to correlate two electrons in two orbitals suggesting a CAS(2,2) reference space.



This input – which is much more than what is really required - needs some explanations: First of all, we choose a
standard RHF calculation with the SVP basis set and we assign the SV/C fitting basis although it is not used in the
SCF procedure at all. In the `%mrci` block all details of the MR-CI procedure are specified. First, `EWin` ( `%method`
`frozencore fc_ewin` ) selects the MOs within the given orbital energy range to be included in the correlation
treatment. The `CIType` variable selects the type of multireference treatment. Numerous choices are possible and

**240** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

MRCI is just the one selected for this application.

**Note:** The CIType statement selects several default values for other variables. So it is a very good idea to place this
statement at the beginning of the MR-CI block and possibly overwrite the program selected defaults later. If you
place the `CIType` statement after one of the values which it selects by default your input will simply be overwritten!

The variables `EUnselOpt` and `DavidsonOpt` control the corrections to the MR-CI energies. `EUnselOpt` specifies
the way in which the MR-CI energies are extrapolated to zero threshold T Sel . Here we choose a full MR-MP2
calculation of the missing contributions to be done *after* the variational step, i.e. using the relaxed part of the
reference wavefunction as a 0 [th] order state for MR-PT. The `DavidsonOpt` controls the type of estimate made for the
effect of higher substitutions. Again, multiple choices are possible but the most commonly used one (despite some
real shortcomings) is certainly the choice `Davidson1` . The flag `UseIVOs` instructs the program to use “improved
virtual orbitals”. These are virtual orbitals obtained from a diagonalization of the Fock operator from which one
electron has been removed in an averaged way from the valence orbitals. Thus, these orbitals “see” only a *𝑁* *−* 1
electron potential (as required) and are not as diffuse as the standard virtual orbitals from Hartree-Fock calculations.
If you input DFT orbitals in the MR-CI moldule (which is perfectly admittable and also recommended in some
cases, for example for transition metal complexes) then it is recommended to turn that flag off since the DFT orbitals
are already o.k. in this respect. The two thresholds `Tsel` and `Tpre` are already explained above and represent the
selection criteria for the first order interacting space and the reference space respectively. `Tsel` is given in units
of Eh and refers to the second order MR-MP2 energy contribution from a given excited CSF. 10 *[−]* [6] Eh is a pretty
good value. Reliable results for transition energies start with *≈* 10 *[−]* [5] ; however, the total energy is converging
pretty slowly with this parameter and this is one of the greatest drawbacks of individually selecting CI procedures!
(see below). `Tpre` is dimensionless and refers to the *weight* of a given initial reference after diagonalization of
the given initial reference space (10 *[−]* [4] is a pretty good value and there is little need to go much lower. Aggressive
values such as 10 *[−]* [2] only select the truly leading configurations for a given target state which can be time saving.
Intermediate values are not really recommended). The parameters `MaxMemInt` and `MaxMemVec` tell the program
how much memory (in MB) it is allowed to allocate for integrals and for trial and sigma-vectors respectively.

The flag `IntMode` tells the program to perform a full integral transformation. This is possible for small cases with
less than, say, 100–200 MOs. In this case that it is possible it speeds up the calculations considerably. For larger
molecules you *have to* set this flag to `RITrafo` which means that integrals are recomputed on the fly using the RI
approximation which is more expensive but the only way to do the calculation. To switch between the possible
modes use:



For small molecules or if high accuracy in the total energies is required it is much better to use the exact four index
transformation. The limitations are that you will run out of disk space or main memory with more than ca. 200–300
MOs.

The variable `Solver` can be `diag` (for Davidson type diagonalization) or `DIIS` for multirrot DIIS type treatments.



For CI methods, the diag solver is usually preferable. For methods like ACPF that contain nonlinear terms, DIIS
is imperative.

Next in the input comes the definition of what CI matrices are to be constructed and diagonalized. Each multiplicity
defines a *block* of the CI matrix which is separately specified. Here we ask for two blocks – singlet and triplet. The
general syntax is:



Now that all input is understood let us look at the outcome of this calculation:

**6.7. Multireference Configuration Interaction and Pertubation Theory** **241**

**ORCA Manual** **,** **Release 6.0.1**

The first thing that happens after the SCF calculation is the preparation of the frozen core Fock matrix and the
improved virtual orbitals by the program `orca_ciprep` . From the output the energies of the IVOs can be seen.
In this case the LUMO comes down to –8.2 eV which is much more reasonable than the SCF value of +3.... eV.
Concomitantly, the shape of this MO will be much more realistic and this important since this orbital is in the
reference space!



(continues on next page)

**242** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



The next step is to transform the electron-electron repulsion integrals into the MO basis:



This will result in a few additional disk files required by `orca_mrci` . The program then tells you which multiplicities will be treated in this MRCI run:




(continues on next page)

**6.7. Multireference Configuration Interaction and Pertubation Theory** **243**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



Now that all the setup tasks have been accomplished the MRCI calculation itself begins.



(continues on next page)

**244** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

In the first step, the reference space is diagonalized. From this CI, the most important configurations are selected
with `Tpre` :




In this case, the CAS space only has 2 correctly symmetry adapted CSFs one of which (the closed-shell determinant)
is selected. In general, larger CAS spaces usually carry around a lot of unnecessary CSFs which are not needed for
anything and then the selection is important to reduce the computational effort. The result of the second reference
space CI is printed:

**6.7. Multireference Configuration Interaction and Pertubation Theory** **245**

**ORCA Manual** **,** **Release 6.0.1**



`Energy` is the total energy in Eh. In the present case we can compare to the SCF energy `-113.778810014 Eh` and
find that the reference space CI energy is identical, as it has to be since the lowest state coincides with the reference
space. `RefWeight` gives the weight of the reference configurations in a CI state. This is 1.0 in the present case
since there were only reference configurations. The number `1.000` is the weight of the following configuration in
the CI vector. The description of the configuration `h—h—[20]p—p—` is understood as follows: [2] The occupation
of the active orbitals is explicitly given in square brackets. Since the HOMO orbitals is number 7 from the SCF
procedure, this refers to MOs 7 and 8 in the present example since we have two active orbitals. The `2` means doubly
occupied, the `0` means empty. Any number (instead of `—` ) appearing after an `h` gives the index of an internal orbital
in which a hole is located. Simarly, any number after a `p` gives the index of an virtual (external) MO where a particle
is located. Thus `h—h—[20]` is a closed shell configuration and it coincides with the SCF configuration—this was
of course to be expected. The second root (in CI-Block 2) `h—h—[11]` by comparison refers to the configuration
in which one electron has been promoted from the HOMO to the LUMO and is therefore the desired state that we
wanted to calculate. Things are happy therefore and we can proceed to look at the output.

The next step is the generation of excited configurations and their selection based on `Tsel` :




(continues on next page)

2 Note that for printing we always sum over all linearly independent spin couplings of a given spatial configuration and only print the summed
up weight for the configuration rather than for each individual CSF of the configuration.

**246** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



Here, the program loops through classes of excitations. For each excitation it produces the excited configurations
(CFGs) and from it the linearly independent spin functions (CSFs) which are possible within the configuration. It
then calculates the interaction with the contracted 0 *[𝑡ℎ]* order roots and includes all CSFs belonging to a given CFG
in the variational space if the largest second order perturbation energy is larger or equal to `Tsel` . In the present case
*≈* 136,000 CSFs are produced of which 25% are selected. For larger molecules and basis sets it is not uncommon
to produce 10 [9] –10 [10] configurations and then there is no choice but to select a much smaller fraction than 20%. For
your enjoyment, the program also prints the total energies of each state after selection:



You can ignore this output if you want. In cases that the perturbation procedure is divergent (not that uncommon!)
the total energies look strange—don’t worry—the following variational calculation is still OK. The second order
perturbation energy is here divided into a selected part `E2(sel)` and the part procedure by the unselected configurations `E2(unsel)` . Depending on the mode of `EUnselOpt` this value may already be used later as an estimate
of the energetic contribution of the unselected CSFs. [3]

Now we have *≈* 4,200 CSFs in the variational space of CI block 1 and proceed to diagonalize the Hamiltonian over
these CSFs using a Davidson or DIIS type procedure:



(continues on next page)

3 In this case the maximum overlap of the 0 *𝑡ℎ* order states with the final CI vectors is computed and the perturbation energy is added to
the “most similar root”. This is of course a rather crude approximation and a better choice is to recomputed the second order energy of the
unselected configurations rigorously as is done with `EUnselOpt = FullMP2` .

**6.7. Multireference Configuration Interaction and Pertubation Theory** **247**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



The procedure converges on all roots simultaneously and finishes after six iterations which is reasonable. Now the
program calculates the Davidson correction ( `DavidsonOpt` ) which is printed for each root.



Already in this small example the correction is pretty large, ca. 27 mEh for the ground state (and *≈* 36 mEh for the
excited state, later in the output). Thus, a contribution of *≈* 9 mEh = 0.25 eV is obtained for the transition energy
which is certainly significant. Unfortunately, the correction becomes unreliable as the reference space weight drops
or the number of correlated electrons becomes large. Here 0.912 and 0.888 are still OK and the system is small
enough to expect good results from the Davidson correction.

**248** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**


The next step is to estimate the correction for the unselected configurations:



In the present case this is below 1 mEh and also very similar for all three states such that it is not important for the
transition energy.




The final ground state energy is `-114.113096211` which is an estimate of the full CI energy in this basis set. The
leading configuration is still the closed-shell configuration with a weight of *≈* 91%. However, a double excitation *outside* the reference space contributes some 1%. This is the excitation MO6,MO6 *→* LUMO,LUMO. This
indicates that more accurate results are expected once MO6 is also included in the reference space (this is the
HOMO-1). The excited state is dominated by the HOMO-LUMO transition (as desired) but a few other single- and
double- excitations also show up in the final CI vector.

Now that all CI vectors are known we can order the states according to increasing energy and print (vertical)
transition energies:




This result is already pretty good and the transition energies are within *≈* 0 *.* 1 eV of their experimental gas phase
values ( *≈* 3 *.* 50 and *≈* 4 *.* 00 eV) and may be compared to the CIS values of 3.8 and 4.6 eV which are considerably

in error.

In the next step the densities and transition densities are evaluated and the absorption and CD spectra are calculated
(in the dipole length formalism) for the spin-allowed transitions together with state dipole moments:



(continues on next page)

**6.7. Multireference Configuration Interaction and Pertubation Theory** **249**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



Here the transition is symmetry forbidden and therefore has no oscillator strength. The state dipole moment for the
ground state is 2.33 Debye which is somewhat lower than 2.87 Debye from the SCF calculation. Thus, the effect of
correlation is to reduce the polarity consistent with the interpretation that the ionicity of the bonds, which is always
overestimated by HF theory, is reduced by the correlation. Finally, you also get a detailed population analysis for
each generated state density which may be compared to the corresponding SCF analysis in the preceding part of
the output.

This concludes the initial example on the use of the MR-CI module. The module leaves several files on disk most
of which are not yet needed but in the future will allow more analysis and restart and the like. The `.ivo` file is a
standard `.gbw` type file and the orbitals therein can be used for visualization. This is important in order to figure
out the identity of the generated IVOs. Perhaps they are not the ones you wanted and then you need to re-run the
MR-CI with the IVOs as input, `NoIter` and the IVO feature in the new run turned off! We could use the IVOs as
input for a state averaged CASSCF calculation:



If we based a MR-ACPF calculation on this reference space we will find that the calculated transition energies are
slightly poorer than in the MRCI+Q calculation. This is typical of approximate cluster methods that usually require
somewhat larger reference spaces for accurate results. A similar result is obtained with SORCI.



(continues on next page)

**250** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

This gives:



This is systematically 0.4 eV too high. But let us look at the approximate average natural orbital (AANOs) occupation numbers:

This shows that there is a low-occupancy orbital (MO6) that has not been part of the reference space. Thus, we try
the same calculation again but now with one more active orbital and two more active electrons:



(continues on next page)

**6.7. Multireference Configuration Interaction and Pertubation Theory** **251**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



This gives:



Which is now fine since all essential physics has been in the reference space. Inspection of the occupation numbers
show that there is no suspicious orbital any more. Note that this is still a much more compact calculation that the
MRCI+Q.

Likewise, we get an accurate result from MRACPF with the extended reference space.



However, the SORCI calculation is *much* more compact. For larger molecules the difference becomes more and
more pronounced and SORCI or even MRDDCI2 (with or without +Q) maybe the only feasible methods—if at all.

**252** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**6.7.3 Excitation Energies between Different Multiplicities**

As an example for a relatively accurate MRCI+Q calculation consider the following job which calculates the tripletground and as the first excited singlet states of O 2 .



Note that the linear molecule is run in D 2 *ℎ* . This creates a slight problem as the CASSCF procedure necessarily
breaks the symmetry of the [1] ∆ state.



The result of the MRCI+Q is:




**6.7. Multireference Configuration Interaction and Pertubation Theory** **253**

**ORCA Manual** **,** **Release 6.0.1**

These excitation energies are accurate to within a few hundred wavenumbers. Note that the *≈* 200 wavenumber
splitting in the degenerate [1] ∆ state is due to the symmetry breaking of the CAS and the individual selection.
Repeating the calculation with the MP2 natural orbitals gives an almost indistinguishable result and a ground state
energy that is even lower than what was found with the CASSCF orbitals. Thus, such natural orbitals (that might
often be easier to get) are a good substitute for CASSCF orbitals and at the same time the symmetry breaking due
to the use of symmetry appears to be difficult to avoid.



**6.7.4 Correlation Energies**

The logic we are following here is the following: CID minus SCF gives the effect of the doubles; going to CISD
gives the effect of the singles; QCISD(=CCD) minus CID gives the effect of the disconnected quadruples. QCISD
minus QCID gives simultaneously the effect of the singles and the disconnected triples. They are a bit difficult to
separate but if one looks at the singles alone and compares with singles + disconnected triples, a fair estimate is
probably obtained. Finally, QCISD(T) minus QCISD gives the effect of the connected triples. One could of course
also use CCSD instead of QCISD but I felt that the higher powers of T 1 obscure the picture a little bit—but this is
open to discussion of course.

First H 2 O/TZVPP at its MP2/TZVPP equilibrium geometry ( *𝑇* pre = 10 *[−]* [6] and *𝑇* sel = 10 *[−]* [9] Eh for the MRCI and
MRACPF calculations):

One observes quite good agreement between single- and multireference approaches. In particular, the contribution
of the disconnected triples and singles is very small. The estimate for the disconnected quadruples is fairly good
from either the multireference Davidson correction or the ACPF and the agreement between CCSD(T) and these
MR methods is 2-3 mEh in the total energy which is roughly within chemical accuracy.

In order to also have an open-shell molecule let us look at NH with a N-H distance of 1.0 Å using the TZVPP basis

set.

**254** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Again, the agreement is fairly good and show that both single- and multiple reference approaches converge to the
same limit.

**6.7.5 Thresholds**

Now we choose the CO molecule (1.128 Ångström) with the SVP basis set and study the convergence of the results
with respect to the selection threshold. Comparison to high level single-reference approaches is feasible (The SCF
energy is `-112.645 946 Eh` ).

**Reference Values for Total Energies**

The single-reference values are:



The calculations without connected triples (BD, CCSD, QCISD) are about the best what can be achieved without
explicitly considering triple excitations. The CCSD is probably the best in this class. As soon as connected triples
are included the CCSD(T), QCISD(T) and BD(T) values are close and from experience they are also close to the
full CI values which is then expected somewhere between –112.950 and –112.952 Eh.

**Convergence of Single Reference Approaches with Respect to T** **sel**

Next it is studied how these single reference methods converge with T sel :



**6.7. Multireference Configuration Interaction and Pertubation Theory** **255**

**ORCA Manual** **,** **Release 6.0.1**

It is clear that the convergence is erratic if the singles are not automatically included. This is the reason for making
this the default from release 2.6.35 on. In the present case singles will only be selected due to round-off errors since
by Brillouin’s theorem the singles have zero-interaction with the ground state determinant. Thus, for individually
selecting single-reference methods it is a good idea to automatically include all single-excitations in order to get
converged results. The alternative would be a different singles selection procedure which has not yet been developed
however. The selection of doubles appear to converge the total energies reasonably well. It is seen that the selection
selects most CSFs between 10 *[−]* [5] and 10 *[−]* [7] Eh. Already a threshold of 10 *[−]* [6] Eh yields an error of less than 0.1
mEh which is negligible in relation to reaction energies and the like. Even 10 *[−]* [5] Eh gives an error of less than 0.1
kcal/mol.

**Convergence of Multireference Approaches with Respect to T** **pre**

We next turn to multireference treatments. Here we want to correlate all valence electrons in all valence orbitals and
therefore a CAS(10,8) is the appropriate choice. We first ask for the converged value of T pre by using T sel =10 *[−]* [14]

and obtain for MRCI+Q:



Thus, pretty good convergence is obtained for T pre = 10 *[−]* [4] *−* 10 *[−]* [6] . Hence 10 *[−]* [4] is the default.

To show a convenient input consider the following:



(continues on next page)

**256** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



This job computes at the same time all of the below and demonstrates once more the agreement between consequent
single- and multireference correlation methods



**6.7.6 Energy Differences - Bond Breaking**

For the calculation of energy differences we start again with the reference CCSD(T) calculation; this method is one
of the few which can claim chemical accuracy in practical applications:



The basis set is of course not suitable for quantitative comparison to experimental values. However, this is not the
point here in these calculations which are illustrative in nature. The SVP basis is just good enough to allow for a
method assessment without leading to excessively expensive calculations.

This is now to be compared with the corresponding energy differences computed with some single-reference approaches. A typical input is (this is a somewhat old-fashioned example – in the present program version you would
do a full valence CASSCF(10,8) or CASSCF(6,6) and invoke the MR-methods with a single keyword):



(continues on next page)

**6.7. Multireference Configuration Interaction and Pertubation Theory** **257**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

The results are:



With exception is CEPA1 and CEPA3, the results are OK. The reason for the poor performance of these methods is
simply that the formalism implemented is only correct for closed shells – open shells require a different formalism
which we do not have available in the MRCI module (but in the single reference MDCI module). Due to the simple
approximations made in CEPA2 it should also be valid for open shells and the numerical results are in support of

**258** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

that.

Next we turn to the multireference methods and take a CAS(10,8) reference as for CO in order to correlate all
valence electrons. [4]



This test calculation pleasingly shows the high consistency of multireference approaches which all converge more
or less to the same result which must be accurate.

**6.7.7 Energy Differences - Spin Flipping**

There are a number of interesting situations in which one is interested in a small energy difference which arises
from two states of different multiplicity but same orbital configuration. This is the phenomenon met in diradicals
or in magnetic coupling in transition metal complexes. As a primitive model for such cases one may consider the
hypothetical molecule H-Ne-H in a linear configuration which will be used as a model in this section.

The reference value is obtained by a MR-ACPF calculation with all valence electrons active (again, this example
is somewhat old fashioned – in the present program version you would do a CASSCF calculation followed by MR
methods with a single keyword):

(continues on next page)

4 Most of these results have been obtained with a slightly earlier version for which the MR energies are a little different from that what the
present version gives. The energy differences will not be affected.

**6.7. Multireference Configuration Interaction and Pertubation Theory** **259**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

which gives the reference value 108 cm *[−]* [1] . We now compare that to several other methods which only have the
two “magnetic” orbitals (the 1s’s on the hydrogens) in the active space:



This gives the result:



All these methods give good results with SORCI leading to a somewhat larger error than the others. The (difference
dedicated CI) DDCI2 method slightly underestimates the coupling which is characteristic of this method. It is nice
in a way that DDCI3 gives the same result as SORCI since SORCI is supposed to approximate the DDCI3 (or better
the IDDCI3) result which it obviously does.

This splitting can also be studied using broken symmetry HF and DFT methods as explained elsewhere in this
manual:



This confirms the usual notions; UHF underestimates the coupling and DFT overestimates it, less so for hybrid
functionals than for GGAs. The BP86 is worse than PW91 or PBE. The PBE0 hybrid may be the best of the
DFT methods. For some reason most of the DFT methods give the best results if the BS state is simply taken as
an approximation for the true open-shell singlet. This is, in our opinion, not backed up by theory but has been
observed by other authors too.

Now let us study the dependence on T sel as this is supposed to be critical (we use the DDCI3 method):



(continues on next page)

**260** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

The convergence is excellent once `AllSingles` are included.

**6.7.8 Potential Energy Surfaces**

Another situation where multireference approaches are necessary is when bond breaking is studied and one wants to
calculate a full potential energy surface. Say we want to compute the potential energy surface of the CH molecule.
First we have to figure out which states to include. Hence, let us first determine a significant number of roots for
the full valence CASSCF reference state (we use a small basis set in order to make the job fast).



This yields:




(continues on next page)

**6.7. Multireference Configuration Interaction and Pertubation Theory** **261**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

Thus, if we want to focus on the low-lying states we should include five doublet and one quartet root. Now we run
a second job with these roots and scan the internuclear distance.



The surfaces obtained in this run are shown in Fig. 6.30. You can nicely see the crossing of the [2] Σ and [2] ∆ states
fairly close to the equilibrium distance and also the merging of the [4] Σ state with [2] Π and [2] Σ towards the asymptote
that where C-H dissociates in a neutral C-atom in its [3] P ground state and a neutral hydrogen atom in its [2] S ground
state. You can observe that once `AllSingles` is set to true (the default), the default settings of the MRCI module
yield fairly smooth potential energy surfaces.

**262** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.30: Potential energy surfaces for some low-lying states of CH using the MRCI+Q method

In many cases one will focus on the region around the minimum where the surface is nearly quadratic. In this
case one can still perform a few (2, 3, 5, ) point polynomial fitting from which the important parameters can be
determined. The numerical accuracy and the behavior with respect to *𝑇* sel has to be studied in these cases since the
selection produces some noise in the procedure. We illustrate this with a calculation on the HF molecule:



The output contains the result of a Morse fit:

**6.7. Multireference Configuration Interaction and Pertubation Theory** **263**

**ORCA Manual** **,** **Release 6.0.1**



Which may be compared with the CCSD(T) values calculated with the same basis set:



The agreement between MRCI+Q and CCSD(T) results is fairly good.

**6.7.9 Multireference Systems - Ozone**

The ozone molecule is a rather classical multireference system due to its diradical character. Let us look at the
three highest occupied and lowest unoccupied MO (the next occupied MO is some 6 eV lower in energy and the
next virtual MO some 10 eV higher in energy):

(a) (a) MO-9 (b) (b) MO-10 (c) (c) MO 11(HOMO)

(d) (d) MO 12(LUMO)

Fig. 6.31: Frontier MOs of the Ozone Molecule.

These MOs are two *𝜎* lone pairs which are high in energy and then the symmetric and antisymmetric combinations
of the oxygen *𝜋* lone pairs. In particular, the LUMO is low lying and will lead to strong correlation effects since
the (HOMO) [2] *→* (LUMO) [2] excitation will show up with a large coefficient. Physically speaking this is testimony
of the large diradical character of this molecule which is roughly represented by the structure *↑* O-O-O *↓* . Thus,
the minimal active space to treat this molecule correctly is a CAS(2,2) space which includes the HOMO and the
LUMO. We illustrate the calculation by looking at the RHF, MP2 MRACPF calculations of the two-dimensional
potential energy surface along the O–O bond distance and the O-O-O angle (experimental values are 1.2717 Å and
116.78 *[∘]* ).

(continues on next page)

**264** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



This is a slightly lengthy calculation due to the 441 energy evaluations required. RHF does not find any meaningful
minimum within the range of examined geometries. MP2 is much better and comes close to the desired minimum
but underestimates the O–O distance by some 0.03 Å. CCSD(T) gives a very good angle but a O–O distance
that is too long. In fact, the largest doubles amplitude is *≈* 0.2 in these calculations (the HOMO–LUMO double
excitation) which indicates a near degeneracy calculation that even CCSD(T) has problems to deal with. Already
the CAS(2,2) calculation is in qualitative agreement with experiment and the MRCI+Q calculation then gives
almost perfect agreement.

The difference between the CCSD(T) and MRCI+Q surfaces shows that the CCSD(T) is a bit lower than the
MRCI+Q one suggesting that it treats more correlation. However, CCSD(T) does it in an unbalanced way. The
MRCI calculation employs single and double excitations on top of the HOMO-LUMO double excitation, which
results in triples and quadruples that apparently play an important role in balancing the MR calculation. These
excitations are treated to all orders explicitly in the MRCI calculation but only approximately (quadruples as simultaneous pair excitations and triples perturbatively) in the coupled-cluster approach. Thus, despite the considerable
robustness of CC theory in electronically difficult situations it is not applicable to genuine multireference problems.

This is a nice result despite the too small basis set used and shows how important it can be to go to a multireference treatment with a physically reasonable active space (even if is only 2 *×* 2) in order to get qualitatively and
quantitatively correct results.

(a) (a) RHF (b) (b) CASSCF(2,2) (c) (c) MP2 (d) (d) CCSD(T) (e) (e) MRCI+Q

(f) (f) Difference
CCSD(T)/MRCI+Q

Fig. 6.32: 2D potential energy surface for the *𝑂* 3 molecule calculated with different methods

**6.7. Multireference Configuration Interaction and Pertubation Theory** **265**

**ORCA Manual** **,** **Release 6.0.1**

**6.7.10 Size Consistency**

Finally, we want to study the size consistency errors of the methods. For this we study two non-interacting HF
molecules at the single reference level and compare to the energy of a single HF molecule. This should give a
reasonably fair idea of the typical performance of each method (energies in Eh) [5] :



The results are roughly as expected – CISD+Q has a relatively large error, ACPF and ACPF/2 are perfect for this
type of example; AQCC is not expected to be size consistent and is (only) about a factor of 10 better than CISD+Q
in this respect. CEPA-0 is also size consistent.

**6.7.11 Efficient MR-MP2 Calculations for Larger Molecules**

Uncontracted MR-MP2 approaches are nowadays outdated. They are much more expensive than internally contracted e.g. the NEVPT2 method described in section *N-Electron Valence State Pertubation Theory* . Moreover,
MR-MP2 is prone to intruder states, which is a major obstacle for practical applications. For historical reasons, this
section is dedicated to the traditional MR-MP2 approach that is available since version 2.7.0 ORCA. The implementation avoids the full integral transformation for MR-MP2 which leads to significant savings in terms of time
and memory. Thus, relatively large RI-MR-MP2 calculations can be done with fairly high efficiency. However, the
program still uses an uncontracted first order wavefunction which means that for very large reference space, the
calculations still become untractable.

Consider for example the rotation of the stilbene molecule around the central double bond

(b) (b)

The input for this calculation is shown below. The calculation has more than 500 basis functions and still runs
through in less than one hour per step (CASSCF-MR-MP2). The program takes care of the reduced number of
two-electron integrals relative to the parent MRCI method and hence can be applied to larger molecules as well.
Note that we have taken a “JK” fitting basis in order to fit the Coulomb and the dynamic correlation contributions
both with sufficient accuracy. Thus, this example demonstrates that MR-MP2 calculations for not too large reference
spaces can be done efficiently with ORCA (as a minor detail note that the calculations were started at a dihedral
angle of 90 degrees in order to make sure that the correct two orbitals are in the active space, namely the central
carbon p-orbitals that would make up the pi-bond in the coplanar structure).

5 Most of these numbers were obtained with a slightly older version but will not change too much in the present version.

**266** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**




**6.7.12 Keywords**

Here is a reasonably complete list of Keywords and their meaning. Note that the MRCI pogram is considered
legacy and we can neither guarantuee that the keywords still work as intended, nor is it likely that somebody will
be willing or able to fix a problem with any of them. Additional information is found in section 9.



(continues on next page)

**6.7. Multireference Configuration Interaction and Pertubation Theory** **267**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)
```
         MRACPF2
        MRACPF2a
        MRAQCC
        MRCEPA_R
        MRCEPA_0
        MRMP2
         MRMP3
        MRRE2
        MRRE3
        MRRE4
        CEPA1
        CEPA2
        CEPA3
   # CSF selection and convergence thresholds
   TSel 1e-14 # selection threshold
   TPre 1e-05 # pre-diagonalization threshold
   TNat 0.0 #
   ETol 1e-10
   RTol 1e-10
   # Size consistency corrections and the like
   EUnselOpt MaxOverlap
              FullMP2
   DavidsonOpt Davidson1
              Davidson2
              Siegbahn
              Pople
    NELCORR 15 # number of electrons correlated for MRACPF and
    the like
   # MRPT stuff
   UsePartialTrafo true/false # speedups MRMP2
   UseDiagonalContraction true/false # legacy
   Partitioning EN # Epstein Nesbet
              MP # Moeller Plesset
              RE # Fink's partitioning
    FOpt Standard # choice of Fock operators to be
    used in MRPT
             G0
             G3
    H0Opt Diagonal
             Projected
             Full
   MRPT_b 0.2 # intruder state fudge factor
   MRPT_SHIFT 1.0 # level shift
    # Integral handling
    IntMode FullTrafo # exact transformation (lots of memory)
             RITRafo # RI integrals (slow!)
   UseIVOs true/false # use improved virtual orbitals?
   # Try at your own risk
   CIMode Auto
           Conv
           Semidirect
           Direct
           Direct2
           Direct3

```
(continues on next page)

**268** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)
```
   # orbital selection
   EWin epsilon_min,epsilon_max # orbital energy window
   MORanges First_internal, Last_Internal, First_active,
   Last_Active, First-Virtual,Last_virtual # alternative MO
   definition
   XASMOs x1,x2,x3,... # List of XAS donor MOs (see above)
   #density generation
   Densities StateDens, TransitionDens
     # StateDens= GS, GS_EL, GS_EL_SPIN, ALL_LOWEST,
     ALL_LOWEST_EL, ALL_LOWEST_EL_SPIN, ALL, ALL_EL, ALL_EL_SPIN
    # TransitionDens= FROM_GS_EL, FROMGS_EL_SPIN,FROM_LOWEST_EL, \\ FROM_LOWEST_EL_SPIN,

```
*˓→* `FROM_ALL_EL,FROM_ALL_EL_SPIN`
```
   # Memory
   MaxMemVec 1024 # in MB
   MaxMemInt 1024 # in MB
  # Diagonalizer
  Solver DIIS
       DIAG
       NEWDVD
   MaxDIIS
   RelaxRefs true/false
   LevelShift 0.0
   MaxDim 15
   NGuessMat 10
   MaxIter 25
   NGuessMatRefCI 100
   DVDShift 1.0
   # Bells and whistles
   KeepFiles true/false
   AllSingles true/false # Force all singles to be included
   RejectInvalidRefs true/false # reject references with wrong
   number of unpaired electrons or symmetry
   DoDDCIMP2 true/false # do a MP2 correction for the missing
   DDCI excitation class ijab
   NatOrbIters 5 # number of natural orbital iterations
   DoNatOrbs 0,1,2 # 0=not, 1=only average density, >=2= each
   density
   PrintLevel None, MINI, Normal, Large
   PrintWFN 1
   TPrintWFN 1e-3
   # MREOM stuff (expert territory!)
   DoMREOM true/false
   # Definition of CI blocks
   NewBlock multiplicity irrep
     NRoots 1
     Excitations none
               CIS
               CID
               CISD
     # active space definition
     refs CAS(nel, norb) end
     # or

```
(continues on next page)

**6.7. Multireference Configuration Interaction and Pertubation Theory** **269**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)
### **6.8 MR-EOM-CC: Multireference Equation of Motion Coupled-** **Cluster**

The Multireference Equation of Motion Coupled-Cluster (MR-EOM-CC) methodology [193, 194, 203, 406, 407,
640] has been implemented in ORCA. The strength of the MR-EOM-CC methodology lies in its ability to calculate
many excited states from a single state-averaged CASSCF solution, for which only a single set of amplitudes needs
to be solved and the final transformed Hamiltonian is diagonalized over a small manifold of excited states only
through an uncontracted MRCI problem. Hence, a given MR-EOM calculation involves three steps, performed by
three separate modules in ORCA :

1. a state-averaged CASSCF calculation (CASSCF module),

2. the solution of amplitude equations and the calculation of the elements of the similarity transformed Hamiltonians (MDCI module),

3. and the uncontracted MRCI diagonalization of the final similarity transformed Hamiltonian (MRCI module).

The current implementation allows for MR-EOM-T|T *[†]* -h-v, MR-EOM-T|T *[†]* |SXD-h-v and MR-EOM-T|T *[†]* |SXD|Uh-v calculations. A more detailed description of these methods and the available input parameters will be given in
Sec. *Multireference Equation of Motion Coupled-Cluster (MR-EOM-CC) Theory* . We also note that the theoretical
details underlying these methods can be found in Ref. [407]. In Sec. *Multireference Equation of Motion Coupled-*
*Cluster (MR-EOM-CC) Theory*, we will discuss a strategy for the selection of the state-averaged CAS and other
steps for setting up an MR-EOM calculation in detail. Furthermore, we will discuss how spin-orbit coupling effects
can be included in MR-EOM calculations, a projection scheme to aid with convergence difficulties in the iteration of
the *𝑇* amplitude equations, an orbital selection scheme to reduce the size of the inactive core and virtual subspaces
in the calculation of excitation energies and a strategy for obtaining nearly size-consistent results in MR-EOM.
The purpose of this section is simply to provide a simple example which illustrates the most basic usage of the
MR-EOM implementation in ORCA.

**6.8.1 A Simple MR-EOM Calculation**

Let us consider an MR-EOM-T|T *[†]* |SXD|U-h-v calculation on formaldehyde. An MR-EOM-T|T *[†]* |SXD|U-h-v calculation is specified via the `MR-EOM` keyword along with the specification of a state-averaged CASSCF calculation
(i.e. CASSCF(nel, norb) calculation with the number of roots of each multiplicity to be included in the stateaveraging for the reference state) and the number of desired roots in each multiplicity block for the final MRCI
diagonalization. We note that the CASSCF module is described in sections *Complete Active Space Self-Consistent*
*Field Method* and *The Complete Active Space Self-Consistent Field (CASSCF) Module* and that a description of
the MRCI module is given in sections *Multireference Configuration Interaction and Pertubation Theory* and *The*
*Multireference Correlation Module* . Here, we have a state-averaged CAS(6,4) calculation, comprised of 3 singlets
and 3 triplets and we request 6 singlet roots and 6 triplet roots in our final MRCI diagonalization (i.e. the roots to
be computed in the MR-EOM-T|T *[†]* |SXD|U-h-v calculation):

**270** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**




One can alternatively perform an MR-EOM-T|T *[†]* -h-v or MR-EOM-T|T *[†]* |SXD-h-v calculation by replacing the
`MR-EOM` keyword, in the first line of the input above, by `MR-EOM-T|Td` or `MR-EOM-T|Td|SXD`, respectively. Namely,
replacing the first line of the input above with
```
!MR-EOM-T|Td def2-TZVP VeryTightSCF

```
runs the MR-EOM-T|T *[†]* -h-v calculation, while
```
!MR-EOM-T|Td|SXD def2-TZVP VeryTightSCF

```
runs the MR-EOM-T|T *[†]* |SXD-h-v calculation.

The final MRCI diagonalization manifold includes 2h1p, 1h1p, 2h, 1h and 1p excitations in MR-EOM-T|T *[†]* -h-v
calculations, 2h, 1p and 1h excitations in MR-EOM-T|T *[†]* |SXD-h-v calculations and 1h and 1p excitations in MREOM-T|T *[†]* |SXD|U-h-v calculations. Note that in the `%mdci` block, we have set the convergence tolerance ( `STol` )
for the residual equations for the amplitudes to 10 *[−]* [7], as this default value is overwritten with the usage of the
`TightSCF`, `VeryTightSCF`, etc. keywords. It is always important to inspect the values of the largest *𝑇*, *𝑆* (here,
we use *𝑆* to denote the entire set of *𝑆*, *𝑋* and *𝐷* amplitudes) and *𝑈* amplitudes. If there are amplitudes that are
large (absolute values *>* 0 *.* 15), the calculated results should be regarded with suspicion. For the above calculation,
we obtain:



(continues on next page)

**6.8. MR-EOM-CC: Multireference Equation of Motion Coupled-Cluster** **271**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

for the *𝑇* amplitudes,

for the *𝑆* amplitudes, and



for the *𝑈* amplitudes. Hence, one can see that there are no unusually large amplitudes for this calculation. **We note**
**that there can be convergence issues with the** ***𝑇*** **amplitude iterations and that in such cases, the flag:**
```
DoSingularPT true

```
**should be added to the** `%mdci` **block.** The convergence issues are caused by the presence of nearly singular *𝑇* 2

**272** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

amplitudes and setting the `DoSingularPT` flag to `true` activates a procedure which projects out the offending
amplitudes (in each iteration) and replaces them by suitable perturbative amplitudes. For more information, see
the examples in section *A Projection/Singular PT Scheme to Overcome Convergence Issues in the T Amplitude*
*Iterations* .

After the computation of the amplitudes and the elements of the similarity transformed Hamiltonians, within the
MDCI module, the calculation enters the MRCI module. For a complete, step by step description of the output of
an MRCI calculation, we refer the reader to the example described in section *A Tutorial Type Example of a MR*
*Calculation* . Let us first focus on the results for the singlet states ( `CI-BLOCK 1` ). Following the convergence of the
Davidson diagonalization (default) or DIIS procedure, the following results of the MRCI calculation for the singlet
states are printed:



For each state, the total energy is given in *𝐸* h ; the weight of the reference configurations ( `RefWeight` ) in the given

**6.8. MR-EOM-CC: Multireference Equation of Motion Coupled-Cluster** **273**

**ORCA Manual** **,** **Release 6.0.1**

state is provided, and the energy differences from the lowest lying state are given in eV and cm *[−]* [1] . Also, in each
case, the weights and a description of the configurations which contribute most strongly to the given state are also
provided. See section *A Tutorial Type Example of a MR Calculation* for a discussion of the notation that is used for
the description of the various configurations. To avoid confusion, we note that in the literature concerning the MREOM methodology [194, 203, 406, 407, 529, 530, 640], the term “%active” is used to denote the reference weight
multiplied by 100%. In general, `RefWeight` should be *>* 0 *.* 9, such that the states are dominated by reference
space configurations. This criterion is satisfied for the first three states and the reference weight of the fourth state
is sufficiently close to 0 *.* 9. **However, the reference weights of the two higher lying states (especially state 4) are**
**too small and these states should be discarded as the resulting energies will be inaccurate (i.e. states with**
**significant contributions from configurations outside the reference space cannot be treated accurately)** .

In the case of the triplet states ( `CI-BLOCK 2` ), we obtain the following results:

Here, we see that the first three states have reference weights which are *>* 0 *.* 9, while the reference weights of
the final three states are well below that threshold. Hence, the latter three states should be discarded from any
meaningful analysis.

Following the printing of the CI results for the final CI block, the states are ordered according to increasing energy
and the vertical transition energies are printed:



(continues on next page)

**274** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



Furthermore, following the generation of the (approximate) densities, the absorption and CD spectra are printed:


**Warning:**

   - It is important to note that the transition moments and oscillator strengths (and state dipole moments)
have been blindly computed by the MRCI module and currently, no effort has been made to include

**6.8. MR-EOM-CC: Multireference Equation of Motion Coupled-Cluster** **275**

**ORCA Manual** **,** **Release 6.0.1**

the effects of the various similarity transformations in the evaluation of these quantities. Hence these
quantities are only approximate and should only be used as a qualitative aid to determine which states
are dipole allowed or forbidden. Furthermore, since the calculated densities are approximate, so are the
results of the population analysis that are printed before the absorption and CD spectra.

   - While both the CASSCF and MRCI modules can make use of spatial point-group symmetry to some
extent, the MR-EOM implementation is currently limited to calculations in *𝐶* 1 symmetry.

**6.8.2 Capabilities**

The MR-EOM methodology can be used to calculate a desired number of states for both closed- and open-shell
systems from a single state-averaged CASSCF solution. Currently, the approach is limited to serial calculations
and to smaller systems in smaller active spaces. One should be aware that in the most cost-effective MR-EOMT|T *[†]* |SXD|U-h-v approach (i.e. the smallest diagonalization manifold), an MRCI diagonalization is performed over
all 1h and 1p excited configurations out of the CAS, which will inevitably limit the size of the initial CAS which
can be used. We have also implemented an orbital selection scheme which can be used to reduce the size of the
inactive core and virtual subspaces in the calculation of excitation energies, and this can be employed to extend the
applicability of the approach to larger systems. The current implementation can also be used in conjunction with
the spin-orbit coupling submodule ( *General Description* ) of the MRCI module to calculate spin-orbit coupling
effects in MR-EOM calculations to first order. These and other features of the current implementation will be
discussed in *Multireference Equation of Motion Coupled-Cluster (MR-EOM-CC) Theory* .

**6.8.3 Perturbative MR-EOM-PT**

The MR-EOM family of methods now also features an almost fully perturbative approach called MR-EOMPT [501].
This method shares the features of the MR-EOMCC parent method while using non-iterative perturbative estimates
for the *𝑇* [ˆ] and *𝑆,* [ˆ] *𝑋,* [ˆ] *𝐷* [ˆ] amplitudes. This slightly reduces the accuracy compared to iterative MR-EOMCC while
reducing runtime. Furthermore, convergence issues due to nearly singular *𝑇* [ˆ] and *𝑆,* [ˆ] *𝑋,* [ˆ] *𝐷* [ˆ] amplitudes cannot occur

anymore.

This method can be invoked by adding the keyword `DoMREOM_MRPT True` to the `%mdci` block.
### **6.9 Solvation**

ORCA features several implicit solvation models, including the fully integrated “conductor-like polarizable continuum (C-PCM)” and “Minnesota SMD” solvation models, which are available in all its components. With these
models, various types of calculations can be performed using a polarizable continuum with a realistic van der
Waals cavity as summarized below:

  - Energies of molecules in solution with a finite dielectric constant *𝜀* using HF or any DFT method.

  - Optimization of molecular structures in solution using HF or any DFT method with analytic gradients.

  - Calculation of vibrational frequencies using the analytic Hessian for HF or any DFT method, provided that
the same calculation is available in vacuum.

  - Calculation of solvent effects on response properties like polarizabilities through coupled-perturbed SCF
theory. For magnetic response properties, such as the g-tensor, the C-PCM response vanishes.

  - Calculations of solvent shifts on transition energies using the time-dependent DFT or CIS method. The
refractive index of the solvent needs to be provided in addition to the dielectric constant.

  - First order perturbation estimate of solvent effects on state and transition energies in multireference perturbation and configuration-interaction calculations.

Other implicit solvation strategies are available in ORCA. In particular, an interface to the open source implementation of the COSMO-RS model (openCOSMO-RS), as well as different solvation models that can be used

**276** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

in XTB (ALPB, ddCOSMO, and CPCM-X). A detailed overview of the available implicit solvation methods and
their usage is provided in Sections *ONIOM Methods*, and *Implicit Solvation Models* .

As a simple example, let us compute the solvent effect on the *𝑛* *→* *𝜋* *[*]* transition energy in formaldehyde with the
C-PCM model. This effect can be obtained by subtracting the solution-phase and gas-phase transition energies.
The gas-phase transition energy (4.633 eV) can be computed by using the following input:



By adding the `CPCM(water)` flag to the input used for the gas-phase calculation, the transition energy can now be
computed using the C-PCM model with water as the solvent:




This C-PCM calculation yields a transition energy of 4.857 eV:




Hence, water environment increases the transition energy by 0.224 eV. This increase can be attributed to the stabilization of lone pair orbitals by the presence of water molecules.
### **6.10 ORCA SOLVATOR: Automatic Placement of Explicit Solvent** **Molecules**

From ORCA6, we also have a tool that can automatically place explicit solvent molecules to a given system. It can
be done using two different approaches: a `STOCHASTIC` method which is very fast but less accurate, or a `DOCKING`
approach which makes use of the *DOCKER* . The later is slower, but more accurate and is the default.

**6.10. ORCA SOLVATOR: Automatic Placement of Explicit Solvent Molecules** **277**

**ORCA Manual** **,** **Release 6.0.1**

**6.10.1 First Example: Adding Water to a Histidine**

As a very simple initial example, let’s take a Histidine aminoacid and add three explicit water molecules at the best
positions using the `DOCKER` and `GFN2-XTB` . The input to get this is as simple as:



That is as simple as a regular input with the line `%SOLVATOR NSOLV 3 END` added. The solvent structure will be
automatically taken from the implicit solvation method (in this case `ALPB(WATER)` ), and the three water molecules
will be added. The output will look like:



where the solvent chosen is printed, together with some details about its dimensions, the number of molecules to
be added and the method. The structure from the internal database is also always printed.

The process is then monitored per solvent molecule:



(continues on next page)

**278** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)


and the final result is printed to the file `Basename.solvator.xyz` . There will be also an intermediate file named
`Basename.solvator.solventbuild.xyz` with the solvent molecules added one by one.

**Note:** In contrast to the DOCKER, the solute is **always** frozen by default. Set `FIXSOLUTE FALSE` under the
`%SOLVATOR` block to change that.

On the output `Einter` is the interaction energy obtained from the DOCKER and `dE` is the different between the
current and the previous `Einter` .

In this case, the result looks like:

Fig. 6.34: Three water molecules added by the solvator.

**Note:** Currently the SOLVATOR is **only** working with the GFN-XTB and GFN-FF methods and the ALPB
solvation model. It will be expanded later to others.

**6.10.2 Other Solvents**

The method itself is agnostic to the solvent, and any other could have been used. The example above with DMSO
would be:



and results in:

**6.10. ORCA SOLVATOR: Automatic Placement of Explicit Solvent Molecules** **279**

As with the docker, the `charge` and `multiplicty` can be given to the solvent if given as two integers on the
comment line (default is neutral closed-shell). Since the `ALPB` method has a fixed number of solvents, right now
one can still not give a custom epsilon value for the custom solvents, but it needs to be approximated to the next
closest solvent.

As an example, let’s create a file named `isopropanol.xyz` with a solvent which is not on the `ALPB` list:



and run:

**280** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**



**6.10.3 The Stochastic Method for Multiple Solvents**

In case you want to add a really large number of explicit solvent molecules, the `STOCHASTIC` mode will be significantly faster. Let’s add 100 water molecules on our target Histidine, now using `CLUSTERMODE STOCHASTIC` :



The output will be somewhat different:

(continues on next page)

**6.10. ORCA SOLVATOR: Automatic Placement of Explicit Solvent Molecules** **281**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



Fig. 6.37: A hundred water molecules added by the solvator.

**Important:** As the name says, the `CLUSTERMODE STOCHASTIC` is a probabilistic approach and is not nearly as
accurate as the `DOCKING` mode! Nonetheless it is useful for quite a few applications.

**282** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**6.10.4 Creating a Droplet**

The regular stochastic method will create a solvation sphere around the solute following it shape and topology. In
case you want to create a solvent distribution with spherical symmetry, you have to use set the `DROPLET TRUE`
keyword, such as:



Fig. 6.38: A hundred water molecules added by the solvator by enforcing spherical symmetry.

**6.10.5 Creating a Droplet with a Defined Radius**

Instead of defining the number of solvent molecules, one can also defined a maximum radius and the SOLVATOR
will add as many molecules as necessary until the radius is reached. This is only compatible with `CLUSTERMODE`
`STOCHASTIC` !



**6.10. ORCA SOLVATOR: Automatic Placement of Explicit Solvent Molecules** **283**

**ORCA Manual** **,** **Release 6.0.1**

The output in the end shows:



**Note:** The radius is taken from the centroid of the solute!

**Important:** All examples described above work for any other solvents, including custom ones.

**Note:** The default DOCKER settings for the solvator are equivalent to `!QUICKDOCK` . For more accurate methods
use `!NORMALDOCK` or even `!COMPLETEDOCK`, however they will be much slower.

A complete list of keywords and more discussions on the topic can be found at the later section *More on the ORCA*
*SOLVATOR*

**284** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**
### **6.11 Relativistic Calculations**

ORCA features three different approximations to cover relativistic effects:

1. The „Exact 2 component“ (X2C) Hamiltonian

2. The Douglas-Kroll-Hess (DKH) Hamiltonian to second order

3. The 0th order regular approximation (ZORA) with a model potential

Earlier versions of ORCA supported a number of additional approximations, which are no longer supported.

The main relativistic Hamiltonian that will be pursued in further development is the X2C Hamiltonian. Of the three
alternatives, we believe that X2C has the best feature set and we recommend to all of our users to preferentially use
this method.

All three relativistic model Hamiltonians are implemented for scalar relativistic energy calculations and these
are carried through consistently through the entire program. Scalar relativity shows up as an additional effective
potential that is added to the one-electron matrix. Scalar relativistic corrections to the two-electron interaction
are not available in ORCA. Furthermore, self-consistent field calculations (HF, DFT, CASSCF) with inclusion of
spin-orbit-coupling (SOC) are also not available in ORCA but we will not exclude the possibility to add this feature
in a future version of the program.

A general overview and some practical recommendations are given in the next sections. For detailed documentation
and all available options see *Relativistic Options* .

**6.11.1 Basis sets for relativistic calculations**

The different scalar relativistic potentials have different shapes in the core region. Consequently, each one of
them requires specialized all electron basis sets that are optimized for the Hamiltonian at hand. The most common choices are listed in the sections *Relativistically recontracted Karlsruhe basis sets* and *SARC basis sets* with
all available options listed in *Built-in Basis Sets* . An uncontracted basis set of sufficient size will always work.
Likewise, uncontracted fitting basis sets in all forms of RI calculations are always appropriate.

**Hint:** Use the `!Decontract` keyword to decontract the chosen (all-electron) basis set and make it suitable for
any relativistic Hamiltonian, as well as comparisons between them.

If large, uncontracted basis sets are used in scalar relativistic calculations, there is a distinct danger of variational
collapse. This behavior is related to the fact that the relativistic orbitals will diverge for a point nucleus. ORCA
features the Gaussian finite nucleus model of Dyall and Visscher for DKH and X2C. We recommend to always use
this feature ( `FiniteNuc` ) in relativistic calculations.

Given the fact relativistic all-electron calculations on heavy element compounds feature very steep core basis functions, numeric integration, such as in DFT and COSX, may be challenging. ORCA features automatic procedures
that adapt the integration grids for the presence of steep basis functions. However, in case you experience strange
results, the numeric integration is one potential source of problem. The cure is to go to larger integration grids
and, in particular, increase the radial integration accuracy ( `IntAcc` ).

**6.11.2 Scalar-relativistic gradients and properties**

Of the three model Hamiltonians, only X2C features analytic gradients. Hence, for geometry optimizations this is
also the preferred methods. For DKH and ZORA, the program automatically switches to the one-center approximation. This requires some attention by the users since final single point energies obtained with the one-center
approximation are inconsistent with energies obtained without it. The one-center approximation is usually of sufficient accuracy but we have observed cases in actual applications where it leads to clearly wrong geometries. Hence,
we strongly recommend to use the X2C Hamiltonian in this realm.

**6.11. Relativistic Calculations** **285**

**ORCA Manual** **,** **Release 6.0.1**

**Caution:** Geometry optimizations with DKH and ZORA (but not X2C) automatically use the one-center
approximation. When computing relative energies, do not mix energies from single-point calculations without
the one-center approximation with those from geometry optimizations that do make use of this feature.

If relativistic calculations are used for molecular properties there is a potential mismatch between nonrelativistically calculated property integrals and the relativistic Hamiltonian. The procedure to remove these inconsistencies is referred to as „picture change“. The picture change is usually carried through to the same level of approximation as the decoupling of the relativistic Hamiltonian into two-component and eventually to one-component
form. We strongly recommend to use picture change in all relativistic property calculations and consequently, this
is also the default. Relativistic property calculations without picture change are wildly inaccurate, in particular if
operators are involved that carry inverse powers of the electorn-nucleus distance. Picture change effects are implemented for DKH and X2C and to some extent also for ZORA. However, they are not implemented for all properties
that ORCA can calculate. Please pay attention to the output of the property integral and property programs. Both
programs will explicitly state which picture change effects are included in the molecular integrals.



**6.11.3 Exact two-component method (X2C)**

Despite the name, the X2C method is implemented in ORCA only as a scalar-relativistic, effective one-component
method. The theory and implementation are discussed in *Exact Two-Component Theory (X2C)*, together with
appropriate references to cite in your work. In the simplest case, it is sufficient to add the `X2C` simple keyword to
the input and choose an appropriate basis set:
```
! X2C X2C-TZVPall X2C/J

```
The DLU approximation,[660] discussed in *DLU approximation*, is the recommended way to reduce the cost of
the X2C transformation, particularly for gradient/Hessian calculations, with minor loss of accuracy. It is available
via the simple input keyword `DLU-X2C` .

**6.11.4 Douglas-Kroll-Hess (DKH)**

The first- or second-order DKH method be requested via the simple input keywords `DKH1` or `DKH2`, respectively
( `DKH` is an alias for the latter), together with appropriate basis sets:
```
! DKH DKH-def2-TZVP SARC/J

```
For most calculations, no other settings are needed. See *The Douglas-Kroll-Hess Method* for an overview of the
underlying theory.

**6.11.5 ZORA and IORA**

The 0 [th] order regular approximation (ZORA; pioneered by van Lenthe et al., see Ref. [864] and many follow
up papers by the Amsterdam group) implementation in ORCA essentially follows van Wüllen [867] and solves
the ZORA equations with a suitable model potential and a model density derived from accurate atomic ZORA
calculations. See *Relativistic Options* for explanation of the `ModelPot` and `ModelDens` keywords used to control
these models. If the relevant precautions are taken (see below), the use of the ZORA or IORA methods is as easy
as in the DKH/X2C case. For example:

**286** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**



**Attention:** The ZORA method is highly dependent on numerical integration and it is very important to pay
attention to the subject of radial integration accuracy! By default, from ORCA 5.0 we consider that during the
grid construction and the defaults should work very well. Only for very problematic cases, consider using a
higher `IntAcc` parameter or at least to increase the radial integration accuracy around the heavy atoms using
`SpecialGridAtoms` and `SpecialGridIntAcc` .
### **6.12 Calculation of Properties**

**6.12.1 Population Analysis and Related Things**

Atomic population related things are not real molecular properties since they are not observables. They are nevertheless highly useful for interpreting experimental and computational findings. By default, ORCA provides very
detailed information about calculated molecular orbitals and bonds through Mulliken, Löwdin, and Mayer population analyses. However, as it is easy to become overwhelmed by the extensive population analysis section of the
output, ORCA allows users to turn off most features.

The “ `ReducedPOP` ” keyword reduces the information printed out in the population analysis section, providing
orbital population of each atom with percent contribution per basis function type. This is highly useful in figuring
out the character of the MOs. Furthermore, one can request a printout of the MO coefficients through the output
block of the input file (see section *Population Analyses and Control of Output* ) or using the keyword “ `PrintMOs` ”

The distribution of the frontier molecular orbitals (FMOs) over the system can be requested with the “ `FMOPop` ”
keyword:



This provides Mulliken and Loewdin population analyses on HOMO and LUMO:




(continues on next page)

**6.12. Calculation of Properties** **287**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

Visualization of three-dimensional representation of MOs, natural orbitals, electron densities, and spin densities is
usually more intuitive than examining MO coefficients and it is is described in detail in section *Orbital and Density*
*Plots* . The files necessary for such visualizations can be readily generated with ORCA in various ways and then
opened in visualization software such as `gOpenMol` and `Molekel` . [1] . In the following example, we briefly describe
visualization of MOs.

To visualize MOs with `gOpenMol`, the `plt` file of MOs can be generated in the `gOpenMol_bin` format from the
`gbw` file using `orca_plot` utility program or directly from the ORCA run through the `%plots` block of the input
file:



In this input file, the `MO("CO-4.plt",4,0);` command is used to evaluare MO labeled as 4 for operator 0 and
then to strore it in the “CO-4.plt” file. For RHF and ROHF, one should always use operator 0. For UHF, operators
0 and 1 correspond to spin-up and spin-down orbitals, respectively.

When the produced `plt` files are opened with `gOpenMol` (see section *Surface Plots* for details), the textbook-like
*𝜋* and *𝜋* *[*]* MOs of the CO molecule are visualized as in Figure Fig. 6.40.

1 The `Molekel` developers ask for the following citation – please do as they ask:
MOLEKEL 4.2, P. Flukiger, H.P. Lüthi, S. Portmann, J. Weber, Swiss Center for Scientific Computing, Manno (Switzerland), 2000-2006.
S. Portmann, H.P.Łüthi. MOLEKEL: An Interactive Molecular Graphics Tool. CHIMIA (2000), 54, 766-770. The program appears to be
maintained by Ugo Varetto at this time.

**288** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(a) (a) (b) (b)

Fig. 6.40: (a) *𝜋* and (b) *𝜋* *[*]* MOs of the CO molecule obtained from the interface of `ORCA` to `gOpenMol` .

If the `gOpenMol_ascii` file format was requested, gOpenMol conversion utility or some other tools might then be
needed to convert this human-readable file to the machine-readable `gOpenMol_bin` format.

In order to use the interface to `Molekel`, an ASCII file in the `Cube` or `Gaussian_Cube` format needs to be generated.
Such ASCII files can be actually transferred between platforms. The `Cube` format can be requested in the `%plots`
block as:



To visualize MOs strored in the `*.cube` file, start `Molekel` and, via a right mouse click, load the `*.xyz` file and/or
the `*.cube` file. lternatively, navigate to the surface menu, select the “gaussian-cube” format, and load the surface.
For orbitals, click the “both signs” button and select a countour value in the “cutoff” field. Then, click “create
surface”. The colour schemes and other fine details of the plots can be easily adjusted as desired. Finally, create
files via the “snapshot” feature of `Molekel` . Figure Fig. 6.41 demonstrates a `Molekel` variant of Figure Fig. 6.40.

**6.12. Calculation of Properties** **289**

**ORCA Manual** **,** **Release 6.0.1**

(a) (a) (b) (b)

Fig. 6.41: (a) *𝜋* and (b) *𝜋* *[*]* MOs of the CO molecule obtained from the interface of `ORCA` to `Molekel` .

It is worth noting that there are several other freeware programs, such as `UCSF CHIMERA`, that can read
`Gaussian_Cube` files and provide high-quality plots.

In some situations, visualization of the electronic structure in terms of localized molecular orbitals might be quite
helpful. As unitary transformations among occupied orbitals do not change the total wavefunction, such transformations can be applied to the canonical SCF orbitals with no change of the physical content of the SCF wavefunction.
The localized orbitals correspond more closely to the pictures of orbitals that chemists often enjoy to think about.
Localized orbitals according to the Pipek-Mezey population-localization scheme are quite easy to compute. For
example, the following run reproduces the calculations reported by Pipek and Mezey in their original paper for the
N 2 O 4 molecule.



Based on the output file of this job, localized MOs consist of six core like orbitals (one for each N and one for each
O), two distinct lone pairs on each oxygen, a *𝜎* - and a *𝜋* -bonding orbital for each N-O bond and one N-N *𝜎* -bonding
orbital which corresponds to the dominant resonance structure of this molecule. You will also find a file with the
extension `.loc` in the directory where you run the calculation. Like the standard `gbw` file, it can used to extract
files for plotting or as input for another calculation (warning! The localized orbitals have no well defined orbital
energy. If you do use them as input for another calculation use `GuessMode=CMatrix` in the `%scf` block).

**290** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

If you have access to a version of the `gennbo` program from Weinhold’s group [2], you can also request natural
population analysis and natural bond orbital analysis. The interface is elementary and is invoked through the
keywords `NPA` and `NBO`, respectively:

If you choose simple `NPA`, then you will only obtain a natural population analysis. When `NBO` is chosen instead,
the natural bond orbital analysis will also be carried out. ORCA leaves a `FILE.47` file on disk. This file can be
edited to use all of the features of the `gennbo` program in the stand-alone mode. Please refer to the NBO manual
for further details.

**6.12.2 Absorption and Fluorescence Bandshapes using** `ORCA_ASA`

**Please also consider using the more recent ORCA_ESD, described in Section** ***Excited State Dynamics*** **, to**
**compute bandshapes.**

Bandshape calculations are nontrivial but can be achieved with ORCA using the procedures described in section
*Simulation and Fit of Vibronic Structure in Electronic Spectra, Resonance Raman Excitation Profiles and Spectra*
*with the orca_asa Program* . Starting from version 2.80, analytical TD-DFT gradients are available, which make
these calculations quite fast and applicable without expert knowledge to larger molecules.

**Note:**

  - Functionals with somewhat more HF exchange produce better results and are not as prone to “ghost states”
as GGA functionals unfortunately are!

  - Calculations can be greatly sped up by the RI or RIJCOSX approximations!

  - Analytic gradients for the (D) correction and hence for double-hybrid functionals are NOT available.

In a nutshell, let us look into the H 2 CO molecule. First we generate some Hessian (e.g. BP86/SV(P)). Then we
run the job that makes the input for the `orca_asa` program. For example, let us calculate the five lowest excited

states:


The ORCA run will produce a file `Test-ASA-H2CO.asa.inp` that is an input file for the program that generates
various spectra. It is an ASCII file that is very similar in appearance to an ORCA input file:

2 [Information about the NBO program can be found at http://nbo7.chem.wisc.edu](http://nbo7.chem.wisc.edu)

**6.12. Calculation of Properties** **291**

**ORCA Manual** **,** **Release 6.0.1**



(continues on next page)

**292** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



After setting `NAbsPoints` variable and spectral ranges in this file to the desired values, we invoke `orca_asa` as:
```
orca_asa Test-ASA-H2CO.asa.inp

```
This produces the following output:





(continues on next page)

**6.12. Calculation of Properties** **293**

**ORCA Manual** **,** **Release 6.0.1**


(continued from previous page)



The computed vibrationally resolved absorption spectrum is plotted as shown in Figure Fig. 6.42.

**294** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.42: The computed vibrationally resolved absorption spectrum of the H 2 CO molecule

The computed fluorescence spectrum of the lowest energy peak is plotted as shown in Figure Fig. 6.43. This peak
corresponds to S2. Although it is not realistic, it is sufficient for illustrative purposes.

**6.12. Calculation of Properties** **295**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.43: The computed fluorescence spectrum of the lowest energy peak of the H 2 CO molecule

The computed Resonance Raman (rR) excitation profiles of the three totally symmetric vibrational modes are
plotted as shown in Figure Fig. 6.44.

**296** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.44: The computed Resonance Raman excitation profiles of the three totally symmetric vibrational modes of
the H 2 CO molecule

=
As might be expected, the dominant enhancement occurs under the main peaks for the C O stretching vibration. Higher energy excitations particularly enhance the C-H vibrations. The computed rR spectra at the vertical
excitation energies are provided in Figure Fig. 6.45.

**6.12. Calculation of Properties** **297**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.45: The computed Resonance Raman spectra at the vertical excitation energies of the H 2 CO molecule

=
In this toy example, the dominant mode is the C O stretching, and the spectra look similar for all excitation
wavelengths. However, electronically excited states are mostly of different natures, yielding drastically different rR
spectra. Thus, rR spectra serve as powerful fingerprints of the electronic excitation being studied. This is also true
even if the vibrational structure of the absorption band is not resolved, which is usually the case for large molecules.

The `orca_asa` program is much more powerful than described in this section. Please refer to section *Simulation*
*and Fit of Vibronic Structure in Electronic Spectra, Resonance Raman Excitation Profiles and Spectra with the*
*orca_asa Program* for a full description of its features. The `orca_asa` program can also be interfaced to other
electronic structure codes that deliver excited state gradients and can be used to fit experimental data. It is thus a
tool for experimentalists and theoreticians at the same time!

**6.12.3 IR/Raman Spectra, Vibrational Modes and Isotope Shifts**

**IR Spectra**

****There were significant changes in the IR printing after ORCA 4.2.1!****

IR spectral intensities are calculated automatically in frequency runs. Thus, there is nothing to control by the user.
Consider the following job:

(continues on next page)

**298** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

which gives the following output:

The first column (‘Mode’) labels vibrational modes that increase in frequency from top to bottom.” The next column
provides vibrational frequencies. The molar absorption coefficient *𝜀* of each mode is listed in the “eps” column.
This quantity is directly proportional to the intensity of a given fundamental in an IR spectrum, and thus it is used
by the `orca_mapspc` utility program as the IR intensity.

The values under “Int” are the integrated absorption coefficient [3], and the “T**2” column lists the norm of the
transition dipole derivatives, already including the vibrational part.

To obtain a plot of the spectrum, the `orca_mapspc` utility can be run calling the output file as:
```
orca_mapspc Test-Freq-H2CO.out ir -w25

```
or calling the Hessian file as:
```
orca_mapspc Test-Freq-H2CO.hess ir -w25

```
The basic options of `orca_mapspc` are listed below:



To see its options in detail, call `orca_mapspc` without any input. The above `orca_mapspc` runs of the H 2 CO
molecule provide `Test-NumFreq-H2CO.out.ir.dat` file that contains intensity and wavenumber columns.
Therefore, this file can serve as input for any graph plotting program. The plot of the computed IR spectrum
of the H 2 CO molecule obtained with the above ORCA run is as given in Figure Fig. 6.46.

3 Explained in more detail by Neugbauer [631]

**6.12. Calculation of Properties** **299**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.46: The predicted IR spectrum of the H 2 CO molecule plotted using the file generated by the `orca_mapspc`
tool.

**Overtones, Combination bands and Near IR spectra via NEARIR**

Overtones and combination bands can also be incorporated to the computed IR or Near IR spectrum for completeness. The intensities of these bands are strongly dependent on anharmonic effects. ORCA can include these effects
by means of the VPT2 approach [77]. The full cubic force field, anharmonic corrections to overtones and combination bands, and a broad range of methods are available in the `orca_vpt2` module (see section *Anharmonic*
*Analysis and Vibrational Corrections using VPT2/GVPT2 and orca_vpt2* ).

In particular, the `NEARIR` keyword calls a simpler semidiagonal approach, including only two modes ( *𝑖* and *𝑗*, also
refered as 2MR-QFF in [74, 896]) and force constants up to cubic order ( *𝑘* *𝑖𝑖𝑗*, *𝑘* *𝑖𝑗𝑖* and *𝑘* *𝑖𝑖𝑖* ). For now, only the
intensities are corrected for anharmonic effects - **frequencies are not.**

**Overtones and Combination bands**

Since the calculation of these terms scale with *𝑁* *𝑚𝑜𝑑𝑒𝑠* [2] [, it can quickly become too expensive, thus we use by default]
the semiempirical GFN2-xTB [332] to compute the energies and dipole moments necessary to the higher order
derivatives (which can be changed later). To request this, simply add `!NEARIR` in the main input. An example
input for computing the fundamentals of toluene using B2PLYP double-hybrid functional and for computing the
anharmonics using XTB is as follows:

**Note:** These anharmonic corrections are very sensitive to the geometry. Therefore, perform a conservative geometry optimization (at least `TightOPT` ) whenever possible.

**300** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

In the output, the characteristics of the regular IR spectrum are printed first. Then, the characteristics of overtones
and combination bands are provided similarly to the fundamentals, as follows:

The “Mode” column shows the overtones, such as 6+6, and combination bands, such as 6+7 and 6+8. These new
quantities are automatically detected and incorporated in the IR spectrum when the output file is called with the
`orca_mapspc` utility as follows:
```
orca_mapspc toluene-nearir.out ir -w25

```
From the file `orca_mapspc` provided, the IR spectrum can be plotted as shown in Figure Fig. 6.47.

**6.12. Calculation of Properties** **301**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.47: Calculated and experimental infrared spectrum of toluene in gas phase. While the red plot includes
only the fundamentals, the blue plot includes also overtones and combination bands. The grey dashed plot is
the experimental gas-phase spectrum obtained from the NIST database. The theoretical frequencies were scaled
following literature values [442]

“Benzene fingers”, i.e., overtones and combination bands of the ring, are recovered in the computed spectrum.
Note that the frequencies were scaled using literature values [442], and are not yet corrected using VPT2.

**Near IR spectra**

Let us simulate near IR spectrum of methanol in CCl 4, as published by Bec and Huck [82], using B3LYP for
fundamentals, XTB for overtones, and CPCM for solvation. The input is as follows:

Calling the output with `orca_mapspc` by setting final point to about 8000 *𝑐𝑚* *[−]* [1] in order to extend the spectrum to
the near IR region, i.e.,

**302** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**
```
orca_mapspc toluene-nearir.out ir -w25 -x18000

```
one can simulate the spectrum from the generated “toluene-nearir.dat” file. As seen in Figure Fig. 6.48 the computed spectrum plotted with scaled computational frequencies (not yet corrected using VPT2) according to [442]
agrees reasonably well with the experimental spectrum.

Fig. 6.48: Calculated and experimental near IR spectrum of methanol in CCl 4 . The blue plot is for overtones; the
red plot is for combination bands; and the grey dashed plot is the experimental spectrum. Theoretical frequencies
were scaled according to literature values [442].

**Using other methods for the VPT2 correction**

To compute overtones with the method chosen for the calculation of the fundamentals, one needs only to set
`XTBVPT2` option in the `%freq` block to false, i.e.,
```
%freq XTBVPT2 False end

```
To set a different method for the calculation of overtones and combinations than used for the calculation of fundamentals, one needs first to perform a frequency calculation, then call the resulting Hessian file in `%geom` block, and
activate the `PRINTTHERMOCHEM` flag (see section *Thermochemistry* for details), i.e.,



**6.12. Calculation of Properties** **303**

**ORCA Manual** **,** **Release 6.0.1**

In this example, the fundamental modes are read from the “methanol.hess” file, but the anharmonics and intensities
of the overtones and combinations are computed using BP86. Any combination of methods, such as B3LYP/BP86
and B2PLYP/AM1, is allowed. Note that this description is an approximation to full VPT2 or GVPT2. For a more
complete treatment, see the VPT2 module described in section *Anharmonic Analysis and Vibrational Corrections*
*using VPT2/GVPT2 and orca_vpt2* .

By default, a step size of 0.5 in dimensionless normal mode unit is used during the numerical calculations. This
can be changed by setting `DELQ` in the `%freq` block:



The complete list of options related to VPT2 and in general frequency calculations can be found in Sec. *Frequency*
*calculations - numerical and analytical* .

**Vibrational Circular Dichroism (VCD) Spectra**

Vibrational circular dichroism spectrum calculations are implemented analytically at the SCF (HF or DFT) level
following the derivation of Weigend and coworkers. [716] The basic usage is shown in the following example:



Note that in addition to the Hessian, the VCD calculation requires the magnetic field response using GIAOs and
the electric field response with the field origin placed at (0,0,0). The latter matches the hard-coded magnetic field
gauge origin in the GIAO case and is necessary to ensure gauge-invariance of the results. ORCA does all of this
automatically but it means that if VCD is requested together with electric and/or magnetic properties in the same
job, the field origins cannot be changed.

Other keywords that influence the VCD calculation include `GIAO_1el` and `GIAO_2el` in `%eprnmr` and `CutOffFreq`
in `%freq` . Note also that VCD cannot be computed with `NumFreq` .

**304** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**Raman Spectra**

In order to predict Raman spectrum of a compound, derivatives of the polarizability with respect to the normal
modes must be computed. Thus, if a numerical frequency run ( `!NumFreq` ) is combined with a polarizability
calculation, the Raman characteristics will be automatically calculated.

Consider the following example:



The output provides the Raman scattering activity
(in *Å* [4] /AMU)[631] and the Raman depolarization ratio of each mode:




The ORCA run generates also a `.hess` file that includes polarizability derivatives and Raman activities. The effect
of isotope substitution on the Raman activities can be computed using the `.hess` file.

As in the IR spectrum case, `orca_mapspc` provides a `.dat` file for plotting the computed Raman spectrum:
```
orca_mapspc Test-NumFreq-H2CO.out raman -w50

```
The Raman spectrum of H 2 CO plotted by using the corresponding `.dat` file is as given in Figure Fig. 6.49.

**6.12. Calculation of Properties** **305**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.49: Calculated Raman spectrum of H 2 CO at the STO-3G level plotted using the `.dat` generated by the
`orca_mapspc` utility from numerical frequencies and Raman activities.

It is worth noting that Raman scattering activity *𝑆* *𝑖* of each mode *𝑖* is related to but not directly equal to the Raman
intensity *𝐼* *𝑖* of the corresponding mode, which is dependent on the excitation line *𝜈* 0 of the laser used in the Raman
measurement(for Nd:YAG laser: *𝜈* 0 = 1064 nm = 9398.5 cm *[−]* [1] ). To obtain significantly better agreement between
experimental and simulated Raman spectra, *𝐼* *𝑖* of each mode needs to be computed with the following formula:

*𝐼* *𝑖* = *𝜈* *𝑖* [1 *−* *𝑓* ( exp( *𝜈* 0 *−−𝜈ℎ𝑐𝜈* *𝑖* ) [4] *𝑆* *𝑖* */𝑘𝑇* *𝑖* )]

where *𝑓* is a normalization constant common for all modes; *ℎ*, *𝑐*, *𝑘*, and *𝑇* are Planck’s constant, speed of light,
Boltzmann’s constant, and temperature, respectively.

**Note:**

  - The Raman module works only when the polarizabilities are calculated analytically. Hence, only the methods, for which the analytical derivatives w.r.t. to external fields are implemeted, can be used.

  - Raman calculations take significantly longer than IR calculations due to the extra effort of calculating the polarizabilities at all displaced geometries. Since the latter step is computationally as expensive as the solution
of the SCF equations you have to accept an increase in computer time by a factor of *≈* 2.

**306** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**Resonance Raman Spectra**

Resonance Raman spectra (NRVS) and excitation profiles can be predicted or fitted using the procedures described
in section *Simulation and Fit of Vibronic Structure in Electronic Spectra, Resonance Raman Excitation Profiles*
*and Spectra with the orca_asa Program* . An example for obtaining the necessary orca_asa input is described in
section *Absorption and Fluorescence Bandshapes using ORCA_ASA* .

**NRVS Spectra**

The details of the theory and implementation of NRVS spectrum are as described in ref. [677, 680]. The NRVS
spectrum of *𝑖𝑟𝑜𝑛* *−* *𝑐𝑜𝑛𝑡𝑎𝑖𝑛𝑖𝑛𝑔𝑚𝑜𝑙𝑒𝑐𝑢𝑙𝑒𝑠* can be simply calculated calling `.hess` file of a previous frequency
calculation with the `orca_vib` utility. The output file of this utility can then be called with `orca_mapspc` utility
to produce a `.dat` file for plotting the spectrum:



For a the ferric-azide complex [680], the computed and experimental NRVS spectra are provided in Figure Fig.
6.50.

Fig. 6.50: Experimental (a, black curve), fitted (a, red) and simulated (b) NRVS spectrum of the Fe(III)-azide
complex obtained at the BP86/TZVP level (T = 20 K). Bar graphs represent the corresponding intensities of the
individual vibrational transitions. The blue curve represents the fitted spectrum with a background line removed.

As for the calculation of resonance Raman spectra described in section *Simulation and Fit of Vibronic Structure*
*in Electronic Spectra, Resonance Raman Excitation Profiles and Spectra with the orca_asa Program*, the DFT
estimations are usually excellent starting points for least-square refinements.

**6.12. Calculation of Properties** **307**

**ORCA Manual** **,** **Release 6.0.1**

Below we describe the procedure for computing such NRVS spectra on the Fe(SH) [1] 4 *[−]* complex with the BP86
functional, which typically provides good NRVS spectra. One needs first to optimize the geometry of the complex
and compute its vibrational structure:


Now run the `orca_vib` utility on the `.hess` file generated by this job to obtain an output file that can be used with
`orca_mapspc` utility:



This `orca_mapspc` run generates `Test-FeIIISH4-NumFreq.nrvs.dat` file in the xy-format. This file contains
phonon energy (x, in cm *[−]* [1] ) and NRVS intensity (y, in atomic units) and thus can be directly used for visualizing
the spectrum.

The corresponding NRVS spectrum is given in Figure Fig. 6.51 together with the computational IR spectrum on the
same frequency scale. NRVS reports the Doppler broadening of the Moessbauer signal due to resonant scattering
of phonons (vibrations) dominated by the movements of Fe nuclei. This is a valuable addition to IR spectrum
where the modes have very small intensities.

**308** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.51: (a) Theoretical IR spectrum of Fe(SH) [1] 4 *[−]* and arrow-pictures of the highest intensity modes around the
peak maxima. (b) The corresponding NRVS scattering spectrum.

**6.12. Calculation of Properties** **309**

**ORCA Manual** **,** **Release 6.0.1**

**Animation of Vibrational Modes**

For describing how to animate vibrational modes and generate their “arrow-pictures”, let us perform a frequency
calculation on H 2 CO:


The output of this job provides vibrational characteristics:



This output can be directly opened with `ChemCraft` to visualize normal modes of H 2 CO and to extract their arrowpictures representing the direction of nuclear movements as shown in Figure Fig. 6.52. As an example, one can
infer from this figure that the 1397 cm *[−]* [1] mode corresponds to a rocking vibration.

Fig. 6.52: Normal modes of H 2 CO with arrows indicating magnitude and direction of nuclear motions and the
associated vibrational frequencies in cm *[−]* [1] obtained from `ORCA` output file through the use of `ChemCraft`

**310** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

In order to animate vibrational modes and to create their “arrow-pictures” by using free program packages like
`gOpenMol`, the small utility program `orca_pltvib` can be used. This utility program generates a series of files
from an ORCA output file of a frequency run, which can be openned with molecular visualization programs. The
usage of `orca_pltvib` is as follows:
```
orca_pltvib Test-FREQ-H2CO.out [list of vibrations or all]

```
**6.12. Calculation of Properties** **311**

**ORCA Manual** **,** **Release 6.0.1**

**Isotope Shifts**

The calculated isotope shifts greatly aid in the identification of vibrations, the interpretation of experiments, and
the assessment of the reliability of the calculated vibrational normal modes. It would be a very bad practice to
recalculate the Hessian for investigating isotope shift since Hessian calculations are typically expensive, and the
Hessian itself is independent of the masses. Below we describe how to find the isotope effect without recomputing
the Hessian.

Let us suppose that you have calculated a Hessian as in the example discussed above, and you want to predict the
effect of [18] O substitution. In this case you can use the small utility program `orca_vib` . First of all you need to
edit the masses given in the `.hess` file by hand. For the example given above, the `.hess` file is as follows:



After changing the mass of O from 15.999 to 18.0 as shown above, let us call:
```
orca_vib Test-FREQ-H2CO.hess

```
This will recompute vibrational frequencies in the presence of [18] O. Let us compare vibrational frequencies in the
output of this run with the original frequencies in cm *[−]* [1] :

**312** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**



Another way to analyze isotope shifts is to plot the two predicted spectra and then subtract one from the other. This
will produce derivative-shaped peaks with zero crossings at the positions of the isotope-sensitive modes.

**Note:** In the presence of point charges and/or an external electric field, the translational and rotational symmetries
of the system may be broken. In such cases, you may prefer NOT to project out the translational and rotational
degrees of freedom of the Hessian. This can be achieved as:
```
orca_vib Test-FREQ-H2CO.hess -noproj

```
**6.12.4 Thermochemistry**

The second thing that you get automatically as the result of a frequency calculation is a thermochemical analysis
based on ideal gas statistical mechanics. This can be used to study heats of formation, dissociation energies and
similar thermochemical properties. To correct for the breakdown of the harmonic oscillator approximation for low
frequencies, entropic contributions to the free energies are computed, by default, using the Quasi-RRHO approach
of Grimme.[322] To switch-off the Quasi-RRHO method and use the RRHO method, use:



Where the CutOffFreq parameter controls the cut-off for the low frequencies mode (excluded from the calculation
of the thermochemical properties). Note that the default CutOffFreq is 1 (cm *[−]* [1] ) when Quasi-RRHO is on, since
Quasi-RRHO behaves much more reasonably for low frequencies than RRHO does. In particular, the entropy
contribution calculated by Quasi-RRHO approaches a constant value when the vibrational frequency approaches
zero, while the RRHO contribution diverges.

The Quasi-RRHO method smoothly interpolates between the entropy formulas of a harmonic oscillator and a
rigid rotor, such that high frequency vibrations behave like harmonic vibrations, and low frequency vibrations
behave like rotations with the same frequency. The frequency at which the entropy contribution is a half-half
mixture of rotation and vibration is called the “reference frequency” *𝜔* 0 of the Quasi-RRHO method, accessible
via the `QRRHORefFreq` keyword in `%freq` (see *Frequency calculations - numerical and analytical* ). The default
value (100 cm *[−]* [1] ) is consistent with the original Quasi-RRHO paper[322], but other papers may choose different
values, such as 50 cm *[−]* [1] . Meanwhile, ORCA’s Quasi-RRHO implementation deviates from the original paper in
the choice of “average molecular moment of inertia” *𝐵* av ; while in the original paper it is chosen as a fixed value
10 *[−]* [44] kg *·* m [2], in ORCA it is given as the isotropically averaged moment of inertia of the actual molecule at hand.
This is theoretically more justified than using the same moment of inertia for molecules of different sizes, although
the resulting difference in the Gibbs free energies is rather small, usually within 0.1 kcal/mol.

Note that the rotational contribution to the entropy is calculated using the expressions given by Herzberg [388]
including the symmetry number obtained from the order of the point group. [4] While this is a good approximation,

4 the corresponding equation for the partition function (assuming sufficiently high temperatures) of a linear molecule is *𝑄* *𝑖𝑛𝑡* = *𝜎ℎ𝑐𝐵* *𝑘𝑇* [and]


for non-linear molecules *𝑄* *𝑖𝑛𝑡* = *𝜎* 1


~~√~~


*𝜋* *[𝑘𝑇]*
*𝐴𝐵𝐶* [(] *ℎ𝑐*


for non-linear molecules *𝑄* *𝑖𝑛𝑡* = *𝜎* *𝐴𝐵𝐶* *𝜋* [(] *ℎ𝑐* [)] [3] [. A, B and C are the corresponding rotational constants,] *[ 𝜎]* [is the symmetry number. If]

you want to choose a different symmetry number, ORCA also provides a table with the values for this entropy contribution for other symmetry
numbers. Herzberg reports the following symmetry numbers for the point groups C 1,C *𝑖*,C *𝑠* : 1; C 2,C 2 *𝑣*, C 2 *ℎ* : 2; C 3,C 3 *𝑣*,C 3 *ℎ* : 3; C 4,C 4 *𝑣*,C 4 *ℎ* :
4;C 6, C 6 *𝑣*, C 6 *ℎ* : 6; D 2, D 2 *𝑑*, D 2 *ℎ* =V *ℎ* : 4; D 3, D 3 *𝑑*, D 3 *ℎ* : 6; D 4, D 4 *𝑑*, D 4 *ℎ* : 8; D 6, D 6 *𝑑*, D 6 *ℎ* : 12; S 6 : 3; C *∞𝑣* : 1; D *∞ℎ* : 2;T,T *𝑑* : 12; O *ℎ* :
24.


**6.12. Calculation of Properties** **313**

**ORCA Manual** **,** **Release 6.0.1**

one might want to modify the symmetry number or use a different expression [302]. For this purpose, the rotational
constants (in cm *[−]* [1] ) of the molecule are also given in the thermochemistry output.

For example let us calculate a number for the oxygen-oxygen dissociation energy in the H 2 O 2 molecule. First run
the following jobs:




The first job gives you the following output following the frequency calculation:



(continues on next page)

**314** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)
```
Summary of contributions to the inner energy U:
Electronic energy ... -151.55083691 Eh
Zero point energy ... 0.02631509 Eh 16.51 kcal/mol
Thermal vibrational correction ... 0.00040105 Eh 0.25 kcal/mol
Thermal rotational correction ... 0.00141627 Eh 0.89 kcal/mol
Thermal translational correction ... 0.00141627 Eh 0.89 kcal/mol
----------------------------------------------------------------------Total thermal energy -151.52128823 Eh
Summary of corrections to the electronic energy:
(perhaps to be used in another calculation)
Total thermal correction 0.00323359 Eh 2.03 kcal/mol
Non-thermal (ZPE) correction 0.02631509 Eh 16.51 kcal/mol
----------------------------------------------------------------------Total correction 0.02954868 Eh 18.54 kcal/mol
-------ENTHALPY
-------The enthalpy is H = U + kB*T
        kB is Boltzmann's constant
Total free energy ... -151.52129054 Eh
Thermal Enthalpy correction ... 0.00094421 Eh 0.59 kcal/mol
----------------------------------------------------------------------Total Enthalpy ... -151.52034633 Eh
Note: Rotational entropy computed according to Herzberg
Infrared and Raman Spectra, Chapter V,1, Van Nostrand Reinhold, 1945
Point Group: C2, Symmetry Number: 2
Rotational constants in cm-1: 10.087644 0.882994 0.851333
Vibrational entropy computed according to the QRRHO of S. Grimme
Chem.Eur.J. 2012 18 9955
------ENTROPY
------The entropy contributions are T*S = T*(S(el)+S(vib)+S(rot)+S(trans))
          S(el) electronic entropy
          S(vib) vibrational entropy
          S(rot) rotational entropy
          S(trans) translational entropy
The entropies will be listed as multiplied by the temperature to get
units of energy
Electronic entropy ... 0.00000000 Eh 0.00 kcal/mol
Vibrational entropy ... 0.00059250 Eh 0.37 kcal/mol
Rotational entropy ... 0.00789993 Eh 4.96 kcal/mol
Translational entropy ... 0.01734394 Eh 10.88 kcal/mol
----------------------------------------------------------------------Final entropy term ... 0.02583637 Eh 16.21 kcal/mol
In case the symmetry of your molecule has not been determined correctly
or in case you have a reason to use a different symmetry number we print
out the resulting rotational entropy values for sn=1,12 :

```
(continues on next page)

**6.12. Calculation of Properties** **315**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

And similarly for the OH-radical job.




(continues on next page)

**316** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)
```
-------ENTHALPY
-------The enthalpy is H = U + kB*T
        kB is Boltzmann's constant
Total free energy ... -75.72419205 Eh
Thermal Enthalpy correction ... 0.00094421 Eh 0.59 kcal/mol
----------------------------------------------------------------------Total Enthalpy ... -75.72324785 Eh
Note: Rotational entropy computed according to Herzberg
Infrared and Raman Spectra, Chapter V,1, Van Nostrand Reinhold, 1945
Point Group: C2v, Symmetry Number: 1
Rotational constants in cm-1: 0.000000 18.628159 18.628159
Vibrational entropy computed according to the QRRHO of S. Grimme
Chem.Eur.J. 2012 18 9955
------ENTROPY
------The entropy contributions are T*S = T*(S(el)+S(vib)+S(rot)+S(trans))
          S(el) electronic entropy
          S(vib) vibrational entropy
          S(rot) rotational entropy
          S(trans) translational entropy
The entropies will be listed as multiplied by the temperature to get
units of energy
Note: Rotational entropy computed according to Herzberg
Infrared and Raman Spectra, Chapter V,1, Van Nostrand Reinhold, 1945
Point Group: C2v, Symmetry Number: 1
Rotational constants in cm-1: 0.000000 18.628159 18.628159
Vibrational entropy computed according to the QRRHO of S. Grimme
Chem.Eur.J. 2012 18 9955
------ENTROPY
------The entropy contributions are T*S = T*(S(el)+S(vib)+S(rot)+S(trans))
          S(el) electronic entropy
          S(vib) vibrational entropy
          S(rot) rotational entropy
          S(trans) translational entropy
The entropies will be listed as multiplied by the temperature to get
units of energy
Electronic entropy ... 0.00065446 Eh 0.41 kcal/mol
Vibrational entropy ... 0.00000000 Eh 0.00 kcal/mol
Rotational entropy ... 0.00321884 Eh 2.02 kcal/mol
Translational entropy ... 0.01636225 Eh 10.27 kcal/mol

```
(continues on next page)

**6.12. Calculation of Properties** **317**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



Let us calculate the free energy change for the reaction: *𝐻* 2 *𝑂* 2 *→* 2 *𝑂𝐻*

The individual energy terms are:

Electronic Energy: -151.46985 a.u. -(-151.55084) a.u. = 0.08099 a.u. (50.82 kcal/mol)

Zero-point Energy: 0.01675 a.u. - 0.02631 a.u. = -0.00956 a.u. (-6.00 kcal/mol)

Thermal Correction(translation/rotation): 0.00472 a.u. - 0.00283 a.u. = 0.00189 a.u. (1.19 kcal/mol)

Thermal Enthalpy Correction: 0.00189 a.u. - 0.00094 a.u. = 0.00095 a.u. (0.60 kcal/mol)

Entropy: -0.04047 a.u. -(-0.02584) a.u. = -0.01463 a.u. (-9.18 kcal/mol)

Final ∆G: 37.43 kcal/mol

Thus, both the zero-point energy and the entropy terms contribute significantly to the total free energy change of
the reaction. The entropy term is favoring the reaction due to the emergence of new translational and rotational
degrees of freedom. The zero-point correction is also favoring the reaction since the zero-point vibrational energy
of the O-O bond is lost. The thermal correction and the enthalpy correction are both small.

**Tip:**

  - You can run the thermochemistry calculations at several user defined temperatures and pressure by providing
the program with a list of temperatures / pressures:




- Once a Hessian is available you can rerun the thermochemistry analysis at several user defined temperatures
/ pressures by providing the keyword PrintThermoChem and providing the name of the Hessian file:



**318** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**6.12.5 Anharmonic Analysis and Vibrational Corrections using VPT2/GVPT2 and**
```
   orca_vpt2

```
Building upon (analytical) harmonic calculations of the Hessian, it is possible to calculate the cubic plus semiquartic force field as well as higher-order property derivatives. For this purpose, the VPT2 module will compute
the Hessian and then generate two displaced geometries for each degree of freedom and for each displacement
another Hessian (and another property in case of vibrational corrections) will be computed. These are required
for an anharmonic analysis according to second-order vibrational perturbation theory. So overall, using VPT2 is
costly due to the number of calculations required for the numerical derivatives and is very sensitive to numerical
noise due to convergence, approximations and other settings. The VPT2 calculation can be initiated either via the
simple input command `!VPT2` or via the VPT2 keyword in the `%vpt2` block. Finer control can be achieved through
the `%VPT2` block, as exemplified in this analysis of water.



After the analysis, a `<basename>.vpt2` file should be present in the working directory. Within that file all the
force field and property derivatives are saved. It is used as an input for the `orca_vpt2` programme which is called
automatically after the initial displacement calculations. The programme can also be called separately with the
command `orca_vpt2 <basename>.vpt2` .

**Note:** ***A few remarks about VPT2 calculations:***

  - A VPT2 starting geometry **should always be tightly converged** . For small molecules the `!TightOPT` option
is not good enough ! Depending on your structure, you might want to experiment with the `TolE`, `TolRMSG`
and `TolMaxG` keywords of the `%geom` block.

  - Similarly, a well converged SCF is required. The use of the `ExtremeSCF` keyword or at least `VeryTightSCF`
is recommended.

  - The CP-SCF equations should be converged to at least 10 *[−]* [12] (modified via the `Z_Tol` setting in the `%method`
block.

  - For DFT calculations, tight grids like `DEFGRID3` are strongly recommended.

   - **Linear molecules are not supported yet**

  - Currently, only methods for which analytical Hessians are available are supported. Furthermore, **VPT2**
**calculations with DFT functionals which do not provide analytical Hessians cannot be carried out** .

  - By default, updated atomic masses are used to generate the semi-quartic force field (see *Mass dependencies* ).
The masses are also printed in the `<basename>.vpt2` file

  - A VPT2 analysis can be repeated on a previous calculation by running `orca_vpt2 <basename>.vpt2` .

**6.12. Calculation of Properties** **319**

**ORCA Manual** **,** **Release 6.0.1**

  - VPT2 does have limited restart capabilities. If the directory in which the VPT2 run is carried out already
contains `<basename>.hess` or `<basename>_eprnmr.property.txt` files, the program will skip these
points and use the information provided in the files.

VPT2 provides a vibrational analysis and thus access to :

  - mean and mean square displacement expectation values

  - centrifugal distortion constants

  - Watson’s symmetrically and asymmetrically reduced Hamiltonian parameters

  - anharmonic constants

  - Fermi resonance analysis

  - rotational and vibrational-rotational constants

  - fundamental transition (anharmonic frequencies)

  - zero-point ro-vibrational energies

  - overtones and combination bands with intensities (in contrast to NEARIR with full VPT2/GVBT2 treatment)

  - dedicated file interface for codes like SPCAT

If the computed data should be used for the simulation of spectra with codes like SPCAT, ORCA can provide a
dedicated file that can serve as a basis for an input. This is triggered in the `%output` block when a VPT2 calculation

is run:



This way, ORCA will generate a file called `pickett.txt` that contains the computed data and templates for `.var`
which can be modified to serve as input for codes like SPCAT. Please note that this feature is still being refined and
extended.

**Vibrational corrections of molecular properties using VPT2**

Using VPT2 it is also possible to compute zero-point vibrational corrections to molecular properties. Currently, this
is available for NMR chemical shieldings, spin-spin coupling constants, g- and A-tensors and requires two successive calculations. The first calculation is a VPT2 calculation just as shown above ( `<basename>.inp` ) that contains
the `VPT2` command and the level of theory at which the Hessians are computed. The second calculation (let’s call
it `<basename>_Prop.inp` will compute the property derivatives with a final call to VPT2. In order for this to
work, the property derivative calculation needs to read the `<basename>.hess` and `<basename>.vpt2` file from
the forcefield calculation. This is done by specifying the `%geom inhess read` with the command `inhessname`
`"<basename>.hess"` . This scheme is necessary as properties other than energies, geometries or frequencies often
require specialized methods and basis sets. For the numerical calculation of the force field and property derivatives different stepsizes can be used by specifying `AnharmDisp` and `PropDisp` in the VPT2 input block. The
defaults are 0.05, and after the calculation, the displaced geometries are stored in files named `myjob_DH001.xyz`
and `myjob_DP001.xyz` etc.

A typical example for calculating the vibrational correction to the [13] C NMR chemical shifts of methanol with a
B3LYP/def2-TZVP anharmonic forcefield and TPSS/pcSseg-2 shielding tensors would look like the following: the
standard input file, in our case `vpt2_methanol_FF.inp` with the level of theory for the Hessian and the VPT2
input block :

(continues on next page)

**320** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



and the next input file, say `vpt2_methanol_NMR.inp` with the same geometry and the level of theory for the
shielding tensor will look like this:



Running ORCA successively on both of these input files in the same directory will yield an output that contains
the zero-point vibrational corrections to the shielding tensors for each atom. For Atom 0, which is the carbon in
methanol, it looks like this:




(continues on next page)

**6.12. Calculation of Properties** **321**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



So the absolute shielding constant of carbon in methanol needs to be corrected by -4.8 ppm due to zero-point
vibration. From the mean and mean square displacements and the first and second derivatives of the shieldings
with respect to the normal modes, one can also identify degrees of freedom which give rise to larger contributions
of the vibrational correction.

A similar input for the HH spin-spin coupling constants would look like this :



As mentioned above, the exact same procedure is also available for A-tensors. Here is an example for the NH 2
radical with the VPT2 input file `vpt2_NH2_FF.inp` :




(continues on next page)

**322** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



and the input file - something like `vpt2_NH2_A.inp` - for the level of theory that will be used in the A-tensor
computation:

and similarly for the g-tensor if `Atensor` is replaced by `Gtensor` in the `%vpt2` block (the `%eprnmr` block can be
omitted then).

Note that a convenient way to compute vibrational corrections is the usage of a compound script. With an input
file called `NH2.inp` :

and the corresponding compound script `NH2.cmp` :




(continues on next page)

**6.12. Calculation of Properties** **323**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

a similar result can be obtained in one calculation.

**Note:** Make sure the correct hessian file names are given and the input files MUST not contain a compound block.
You can also rerun the VPT2 analysis using `orca_vpt2` directly. If you have an anharmonic force field calculation
named `myjob_ff` and a property derivative calculation named `myjob_prop` just call `orca_vpt myjob_ff.vpt2`
`myjob_prop.vpt2` .

**6.12.6 Electrical Properties**

A few basic electric properties can be calculated in ORCA although this has never been a focal point of development.
The properties can be accessed straightforwardly through the `%elprop` block:




(continues on next page)

**324** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

The polarizability (dipole-dipole, dipole-quadrupole, quadrupole-quadrupole) is calculated analytically through
solution of the coupled-perturbed (CP-)SCF equations for HF and DFT runs (see *CP-SCF Options* ) and through
the CP-CASSCF equations for CASSCF runs (see *CASSCF Linear Response* ). Analytic polarizabilities are also
available for CCSD (via AUTOCI-CCSD, see *AUTOCI Response Properties via Analytic Derivatives* ), RI-MP2
and DLPNO-MP2, as well as double-hybrid DFT methods. For canonical MP2 one can use AUTOCI for analytic calculations (see *AUTOCI Response Properties via Analytic Derivatives* ) or differentiate the analytical dipole
moment calculated with relaxed densities. For other correlation methods only a fully numeric approach is possible.



As expected the polarizability tensor is isotropic.

Dipole-quadrupole polarizability tensors are printed as a list of 18 different components, with the first index running
over x,y,z and the second index running over xx,yy,zz,xy,xz,yz. This is known as the “pure Cartesian” version of
the tensor, although other conventions may exist in the literature that differ from the ORCA values by a constant
factor.



(continues on next page)

**6.12. Calculation of Properties** **325**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



After this, the “traceless” version of the tensor is printed, which is usually denoted by *𝐴* *𝑥,𝑥𝑥* *, 𝐴* *𝑥,𝑥𝑦* etc. in the
literature[164, 247, 574]. This is the preferred format for reporting dipole-quadrupole polarizability tensors. Certain references use the opposite sign convention than reported here, but generally the conventions of traceless
polarizability tensors are more unified than those of pure Cartesian polarizability tensors.



The quadrupole-quadrupole polarizability tensor is similarly printed in both the pure Cartesian and traceless forms.
Again, the traceless form (usually denoted as *𝐶* *𝑥𝑥,𝑥𝑥* *, 𝐶* *𝑥𝑥,𝑥𝑦* etc.[164, 247, 574]) is the preferred format for re
**326** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**


porting.



(continues on next page)

**6.12. Calculation of Properties** **327**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



**Note:**

   - **Like the quadrupole moments themselves, the dipole-quadrupole and quadrupole-quadrupole polar-**
**izabilities depend on the gauge origin of the** `%elprop` **module. The latter can be changed using the**
`Origin` **keyword in** `%elprop` **; see section** ***Electric Properties*** **.**

At the SCF level, dynamic (frequency-dependent) dipole polarizabilities can be computed using either purely real
or purely imaginary frequencies.



In the example above, the dynamic dipole polarizability tensor for a single real frequency of 0.8 a.u. is computed.
For every frequency, linear response equations must be solved for all component of the perturbation operator (3
Cartesian components of the electric dipole). Note that imaginary-frequency polarizabilities are computed with
the same costs as real-frequency polarizabilities. By a simple contour integration they can be used to compute
dispersion coefficients.

For methods that do not support analytic polarizabilities, one can calculate numeric dipole-dipole and quadrupolequadrupole polarizabilities, either by finite differentiation of dipole/quadrupole moments with respect to a finite
dipole/quadrupole electric field, or by double finite differentiation of the total energy with respect to a finite
dipole/quadrupole electric field. The latter can be done using compound scripts (see *Compound Methods*, *Com-*
*pound Examples* ).

At the MP2 level, polarizabilities can currently be calculated analytically using the RI ( *RI-MP2 and Double-Hybrid*
*DFT Response Properties* ) or DLPNO ( *Local MP2 Response Properties* ) approximations or in all-electron canonical calculations, but for canonical MP2 with frozen core orbitals the dipole moment has to be differentiated numerically in order to obtain the polarizability tensor. In general in such cases, you should keep in mind that tight
SCF convergence is necessary in order to not get too much numerical noise in the second derivative. Also, you
should experiment with the finite field increment in the numerical differentiation process.

As an example, the following Compound job can be used to calculate the seminumeric polarizability at the MP2
level (replacing the now deprecated usage of `Polar 2` ):



(continues on next page)

**328** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

with the file `semiNumericalPolarizability.cmp` containing:

(continues on next page)

**6.12. Calculation of Properties** **329**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)
```
New_Step
 !&{method} &{basis} &{restOfInput}
 %Method
  z_tol 1e-8
 End
 %MP2
  Density Relaxed
 End
 #*xyzFile &{charge} &{mult} &{molecule}
Step_End
res = D_Free.readProperty(propertyName=myProperty, property_Base=true);
# -----------------------------------------------------------------# Loop over the x, y, z directions and create the appropriate string
# -----------------------------------------------------------------for direction from 0 to 2 Do
 #Create the appropriate direction oriented field string
 if (direction = 0) then #( X direction)
  write2String(FFieldStringPlus, " %lf, 0.0, 0.0", E_Field);
  write2String(FFieldStringMinus, "-%lf, 0.0, 0.0", E_Field);
 else if (direction = 1) then #( Y direction)
  write2String(FFieldStringPlus, " 0.0, %lf, 0.0", E_Field);
  write2String(FFieldStringMinus, " 0.0, -%lf, 0.0", E_Field);
 else #( Z direction)
  write2String(FFieldStringPlus, " 0.0, 0.0, %lf", E_Field);
  write2String(FFieldStringMinus, " 0.0, 0.0, -%lf", E_Field);
 EndIf
 # --------------------------------------- # Perform the calculations.
 # First the plus (+) one
 # --------------------------------------- ReadMOs(1);
 New_Step
  !&{method} &{basis} &{restOfInput}
  %SCF
   EField = &{FFieldStringPlus}
  End
  %Method
   z_tol 1e-8
  End
  %MP2
   Density Relaxed
  End
 Step_End
 res = D_Plus.readProperty(propertyName=myProperty, property_Base=true);
 # --------------------------------------- # And the minus (-) one
 # --------------------------------------- ReadMOs(1);
 New_Step
  !&{method} &{basis} &{restOfInput}
  %SCF
   EField = &{FFieldStringMinus}
  End
  %Method
   z_tol 1e-8
  End
  %MP2
   Density Relaxed
  End

```
(continues on next page)

**330** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)
```
 Step_End
 res = D_Minus.readProperty(propertyName=myProperty, property_Base=true);
 # ----------------------------------------- # Construct and store SCF polarizability
 # ----------------------------------------- a[direction][0] = (D_Plus[0]-D_Minus[0])/(2*E_Field);
 a[direction][1] = (D_Plus[1]-D_Minus[1])/(2*E_Field);
 a[direction][2] = (D_Plus[2]-D_Minus[2])/(2*E_Field);
EndFor
# ----------------------------------------# Diagonalize
# ----------------------------------------a.Diagonalize(aEigenValues, aEigenVectors);
# ----------------------------------------# Do some printing
# ----------------------------------------print( "\n\n");
print( " -------------------------------------------------------\n");
print( " COMPOUND \n");
print( " Semi analytical calculation of polarizability\n");
print( " -------------------------------------------------------\n");
print( " Method: %s\n", method);
print( " Basis : %s\n", basis);
print( " The electric field perturbation used was: %.5lf a.u.\n", E_Field);
print( " \n\n");
print( " -------------------------------------------------------\n");
print( " Raw electric semi-analytical polarizability tensor\n");
print( " -------------------------------------------------------\n");
For i from 0 to 2 Do
 print("%13.8lf %13.8lf %13.8lf\n", a[i][0], a[i][1], a[i][2]);
EndFor
print( " -------------------------------------------------------\n");
print("\n");
print( " -------------------------------------------------------\n");
print( " Raw electric semi-analytical polarizability Eigenvalues\n");
print( " -------------------------------------------------------\n");
print("%13.8lf %13.8lf %13.8lf\n", aEigenValues[0], aEigenValues[1], aEigenValues[2]);
print( " -------------------------------------------------------\n");
print("\n");
print( " -------------------------------------------------------\n");
print( " Raw electric semi-analytical polarizability Eigenvectors\n");
print( " -------------------------------------------------------\n");
For i from 0 to 2 Do
 print("%13.8lf %13.8lf %13.8lf\n", aEigenVectors[i][0], aEigenVectors[i][1],␣

```
*˓→* `aEigenVectors[i][2]);`
```
EndFor
print( "\n a isotropic value : %.5lf\n", (aEigenValues[0]+aEigenValues[1]+aEigenValues[2])/3.

```
*˓→* `0);`
```
#
#
# --------------------------------------------------# Maybe remove unneccesary files
# --------------------------------------------------if (removeFiles) then

```
(continues on next page)

**6.12. Calculation of Properties** **331**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



For more details on Compound jobs in general, see *Compound Methods* .

For other correlation methods, where not even relaxed densities are available, only a fully numeric approach (using
compounds scripts) is possible and requires obnoxiously tight convergence.

Note that polarizability calculations have higher demands on basis sets. A rather nice basis set for this property
is the Sadlej one (see *Built-in Basis Sets* ). In relation to electric properties, it might be interesting to know that it
is possible to carry out finite electric field calculations in ORCA. See section *Adding finite electric field* for more
information on such calculations.

**6.12.7 NMR Chemical Shifts**

NMR chemical shifts at the HF, DFT (standard GGA and hybrid functionals), CASSCF, as well as the RI- and
DLPNO-MP2 and double-hybrid DFT levels (see section *MP2 level magnetic properties* and references therein)
can be obtained from the EPR/NMR module of ORCA. For the calculation of the NMR shielding tensor the program
utilizes Gauge Including Atomic Orbitals (GIAOs - sometimes also referred to as London orbitals). [211, 375, 532]
In this approach, field dependent basis functions are introduced, which minimizes the gauge origin dependence and
ensures rapid convergence of the results with the one electron basis set. [289] Note that GIAOs are **NOT** currently
available with CASSCF linear response and a gauge origin must be provided in the `%eprnmr` block (see *CASSCF*
*Linear Response* ). GIAOs for CASSCF response are coming soon to ORCA!

The use of the chemical shift module is simple:

The output for the shieldings contains detailed information about the para- and diamagnetic contribution, the orientation of the tensor, the eigenvalues, its isotropic part etc. For each atom, an output block with this information
is given :




(continues on next page)

**332** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)




Note that all units are given in ppm and the chemical shieldings given are *absolute* shieldings (see below). At the
end of the atom blocks, a summary is given with the isotropic shieldings and the anisotropy [565] for each nucleus:



Thus, the absolute, isotropic shielding for the [13] C nuclei are predicted to be 229.5 and 227.6 ppm and for [17] O it
is 334.1 ppm. While basis set convergence using GIAOs is rapid and smooth, it is still recommended to do NMR
calculations with basis sets including tight exponents, such as the purpose-built pcSseg- *𝑛* . However, TZVPP or
QZVP should be sufficient in most cases. [59, 265]

An important thing to note is that in order to compare to experiment, a standard molecule for the type of nucleus
of interest has to be chosen. In experiment, NMR chemical shifts are usually determined relative to a standard,
for example either CH 4 or TMS for proton shifts. Hence, the shieldings for the molecule of interest and a given
standard molecule are calculated, and the relative shieldigs are obtained by subtraction of the reference value from
the computed value. It is of course important that the reference and target calculations have been done with the same
basis set and functional. This also helps to benefit from error cancellation if the standard is chosen appropriately
(one option is even to consider an “internal standard” - that is to use for example the [13] C shielding of a methyl
group inside the compound of interest as reference).

Let us consider an example - propionic acid (CH 3 -CH 2 [COOH). In databases like the AIST (http://sdbs.db.aist.go.](http://sdbs.db.aist.go.jp)
[jp) the](http://sdbs.db.aist.go.jp) [13] C spectrum in CDCl 3 can be found. The chemical shifts are given as *𝛿* 1 = 8.9 ppm, *𝛿* 2 = 27.6 ppm, *𝛿* 3
= 181.5 ppm. While intuition already tells us that the carbon of the carboxylic acid group should be shielded the
least and hence shifted to lower fields (larger *𝛿* values), let’s look at what calculations at the HF, BP86 and B3LYP
level of theory using the SVP and the TZVPP basis sets yield:

Looking at these results, we can observe several things - first of all, the dramatic effect of using too small basis
sets, which yields differences of more than 10 ppm. Second, the results obviously change a lot upon inclusion of

**6.12. Calculation of Properties** **333**

**ORCA Manual** **,** **Release 6.0.1**

electron correlation by DFT and are functional dependent. Last but not least, these values have nothing in common
with the experimental ones (they change in the wrong order), as the calculation yields *absolute shieldings* like in
the table above, but the experimental ones are *relative shifts*, in this case relative to TMS.

In order to obtain the relative shifts, we calculate the shieldings *𝜎* *𝑇𝑀𝑆* of the standard molecule (TMS HF/TZVPP:
194.1 ppm, BP86/TZVPP: 184.8 ppm, B3LYP/TZVPP: 184.3 ppm) and by using *𝛿* *𝑚𝑜𝑙* = *𝜎* *𝑟𝑒𝑓* *−* *𝜎* *𝑚𝑜𝑙* we can
evaluate the chemical shifts (in ppm) and directly compare to experiment:

A few notes on the GIAO implementation in ORCA are in order. The use of GIAOs lead to some fairly complex
molecular one- and two-electron integrals and a number of extra terms on the right hand side of the coupledperturbed SCF equations. The two-electron contributions in particular can be time consuming to calculate. Thus,
the RIJK, RIJDX, and RIJCOSX approximations were implemented and tested.[826] By default, the approximation
used for the SCF is also applied to the GIAO integrals, but the latter can be changed using the `GIAO_2el` keyword
in the eprnmr input block (see section *EPR and NMR properties* ). Note that, while the default COSX grids are
typically sufficiently accurate for chemical shifts, the use of `defgrid3` is recommended for special cases or post-HF
calculations.

The user can finely control for which nuclei the shifts are calculated (although this will not reduce the computational
cost very much, which is dominated by the CP-SCF equations for the magnetic field). This works in exactly the
same way as for the hyperfine and quadrupole couplings described in the next section. For example:



NMR chemical shifts are also implemented in combination with implicit solvent models, hence the NMR keyword
can be combined with the CPCM input block. Note that for calculations including implicit solvent, it is highly recommended to also optimize the geometries using the same model. Regardless, explicit solvent–solute interactions
observable in NMR (e.g. H-bonds), cannot be modelled with such a model: solvent molecules must be included
explicitly in the calculation.

**334** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**6.12.8 NMR Spin-Spin Coupling Constants**

The indirect spin-spin coupling constants observed in NMR spectra of molecules in solution consist of four contributions: The diamagnetic spin orbit term:


*𝐻* ˆ *𝐷𝑆𝑂* = [1]

2


∑︁

*𝑖𝑘𝑙*


( *𝑀* *[⃗]* *𝑘* *× ⃗𝑟* *𝑖𝑘* )( *𝑀* *[⃗]* *𝑙* *× ⃗𝑟* *𝑖𝑙* )

(6.9)
*𝑟* *𝑖𝑘* [3] *[𝑟]* *𝑖𝑙* [3]


The paramagnetic spin orbit term:

The Fermi contact term:

And the spin dipole term:


ˆ
*𝐻* *𝑃𝑆𝑂* = ∑︁

*𝑖𝑘*


*⃗𝑀* *𝑘* *⃗𝑙* *𝑖𝑘*

(6.10)
*𝑟* *𝑖𝑘* [3]


ˆ
*𝐻* *𝐹𝐶* = [8] *[ 𝜋]*

3


∑︁ *𝛿* ( *𝑟* *𝑖* *−* *𝑟* *𝑘* ) **m** *𝑘* (6.11)

*𝑖𝑘*


*𝐻* ˆ *𝑆𝐷* = ∑︁ *𝑖𝑘* **m** *[𝑇]* *𝑘* 3 **r** *𝑖𝑘* **r** *𝑟* *𝑖𝑘* *𝑖𝑘* [5] *[𝑇]* *[−]* *[𝑟]* *𝑖𝑘* [2] **s** *𝑖* (6.12)


While the Fermi contact term is usually the most significant, all contributions can be computed at the HF and DFT
level of theory using ORCA. For this purpose, the keyword `ssall` has to be invoked in the eprnmr input block,
while each of the four terms can be requested using `ssdso`, `sspso`, `ssfc`, and `sssd`, respectively. For example:



Results will be given in Hz. Note that the default isotopes used might not be the ones desired for the calculation
of NMR properties, so it is recommended to define the corresponding isotopes using the `ist` flag. It is possible
to also print the reduced coupling constants *𝐾* (in units of 10 [19] *·* T *·* J *[−]* [2] ), which are independent of the nuclear
isotopes, using the flag `PrintReducedCoupling=True` .

The CP-SCF equations must be solved for one of the nuclei in each pair and are the bottleneck of the computation.
Therefore, spin-spin coupling constants are calculated only between nuclei within a certain distance of eachother
(5 Ångstrom by default). The latter can be changed using the `SpinSpinRThresh` keyword.

If mulitple nuclides are requested, it is also possible to select only certain element pairs (e.g. only C–H and H–H,
without C–C) using the `SpinSpinElemPairs` keyword. Analogously, the `SpinSpinAtomPairs` keyword selects
the actual pairs of nuclei to consider. The union of the latter two options is used to *reduce* the selection made using
the `Nuclei` input, after which `SpinSpinRThresh` is applied.

Here is another example illustrating these additional options:



(continues on next page)

**6.12. Calculation of Properties** **335**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

**NMR Spectra**

From the computed NMR shieldings and spin-spin coupling constants, the coupled NMR spectra can be simulated.
The most typical NMR experiments are decoupled [13] *𝐶* and coupled [1] *𝐻* spectra, so we will focus on these here.
For simulating a full NMR spectrum, we will use ethyl crotonate as an example, and three steps are required: 1)
computation of the spin-spin coupling constants, 2) computation of the chemcial shieldings and 3) simulation of the
spectrum using a spin-Hamiltonian formalism. Note that these steps can be carried out independently and different
levels of theory can be used for shieldings and couplings and the order of steps 1 and 2 doesn’t matter.

Furthermore, if the spectra are to be simulated with TMS as reference, the shieldings for TMS are required (the hydrogen and carbon values in this case are 31.77 and 188.10 ppm, respectively). Here is the input for the calculation
for the coupling constants, which is named `ethylcrotonate_sscc.inp` :




The spin-spin coupling constants will be stored in the file `ethylcrotonate_sscc.property.txt`, which the
simulation of the NMR spectrum will need to read. The NMR shieldings and will be computed in the next step,
for which the input `ethylcrotonate_nmr.inp` looks like this:



**336** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

The final NMR spectrum simulation is carried out using `orca_nmrspectrum`, which requires a separate input file
`ethylcrotonate.nmrspec` which looks like this (note the required final END statement):



and contains the following keywords:
`NMRShieldingFile` and `NMRCouplingFile` denote the `.property.txt` files from which the shielding tensors
and coupling constants will be read by the NMR spectrum module. If this line is not given, the program will
exepect the shieldings or couplings in the property file of the current calculation.

`NMRSpecFreq` The NMR spectrometer frequency in MHz is decisive for the looks of the spectrum as shieldings
are given in ppm and couplings are given in Hz. Default is 400 MHz.

`NMRCoal` If two lines are closer than this threshold (given in Hz) then the module will coalesce the lines to one line
with double intensity. Default it 1 Hz.

`NMRREF[X]` Reference value for the absolute shielding of element X used in the relative shifts of the simulated
spectrum. Typically, these are the absolute shielding values from a separate calculation of TMS, for example, and
will be zero ppm in the simulated spectrum.

`NMREquiv` The user has to specify groups of NMR equivalent nuclei. These are typically atoms which interchange
on the NMR timescale, like methyl group protons. The shieldings and couplings will be averaged for each group
specified by the user.

with this input, `orca_nmrspectrum` is called with two arguments, the first one is a gbw file which contains all
informations about the molecule, typically this is the gbw file of the nmr or the sscc calculation, and the name of
the input file given above:
```
orca_nmrspectrum ethylcrotonate_nmr.gbw ethylcrotonate.nmrspec > output

```
If this calculation is carried out, the NMR spectrum module will read the files
`ethylcrotonate_sscc.property.txt` and `ethylcrotonate_nmr.property.txt`, extract the shieldings and
couplings, average the equivalent nuclei and set up an effective NMR spin Hamiltonian for each nucleus:

*𝐻* *𝑁𝑀𝑅* ( *𝑝, 𝑞* ) = *𝜎* *𝑝* *𝛿* *𝑝𝑞* + *𝐽* *𝑝𝑞* *𝐼* *𝑝* *𝐼* *𝑞* *.* (6.13)

**Caution:** This includes all nuclei this nuclear spin couples to and should not contain too many spins (see
`SpinSpinRThres` ), as the spin Hamiltonian for each atom and the nuclei it couples to is diagonalized brute
force. Afterwards, all spin excitations are accumulated and merged into the final spectrum for each element.
For ethyl crotonate the NMR spectrum output looks like this:
```
 ---------------------------------------------------- NMR Peaks for atom type 1, ref value 31.7700 ppm :
 ---------------------------------------------------- Atom shift[ppm] rel.intensity
  8 2.34 9.00
  8 2.36 9.00
  8 2.25 9.00
  8 2.27 9.00
  9 6.34 1.00

```
**6.12. Calculation of Properties** **337**

**ORCA Manual** **,** **Release 6.0.1**
```
  9 6.36 3.00
  9 6.38 3.00
  9 6.41 1.00
  9 6.14 1.00
  9 6.16 3.00
  9 6.19 3.00
  9 6.21 1.00
  12 7.95 1.00
  12 7.85 3.00
  12 7.75 4.00
  12 7.65 4.00
  12 7.56 3.00
  12 7.47 1.00
  13 1.71 9.00
  13 1.61 18.00
  13 1.52 9.00
  16 4.56 4.00
  16 4.46 12.00
  16 4.37 12.00
  16 4.27 4.00
 ---------------------------------------------------- NMR Peaks for atom type 6, ref value 188.1000 ppm :
 ---------------------------------------------------- Atom shift[ppm] rel.intensity
  2 25.70 1.00
  3 155.15 1.00
  4 19.96 1.00
  5 68.91 1.00
  6 174.39 1.00
  7 130.29 1.00
 ---------------------------------------------------- NMR Peaks for atom type 8, ref value 104.8826 ppm :
 ---------------------------------------------------- Atom shift[ppm] rel.intensity
  0 0.00 5.00
  1 149.74 5.00

```
The first column denotes the atom number of the nucleus the signal arises from, the second column denotes the
line position in ppm and the third line denotes the relative intensity of the signal. For oxygen, no reference value
was given, so the program will autmatically set the lowest value obtained in the calculation as reference value.

Using gnuplot, for example, to plot the spectrum, the following plots for [13] *𝐶* and [1] *𝐻* are obtained [5] :

5 The basic plot options for using gnuplot are `plot "mydata" using 2:3 w i, "mydata" using 2:3:1 with labels`

**338** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.54: Simulated [1] 3 *𝐶* (top) and 1H (bottom) NMR spectra. Note that as only HH couplings have been computed, the spectra do not include any CH couplings and the carbon spectrum is also uncoupled.

This makes comparison to experiment and assessment of the computed parameters much easier, however, it is not as
advanced as other codes and does not, for example, take conformational degrees of freedom etc. into account. Note
that the corresponding property files can also be modified to tinker with the computed shieldings and couplings.

**Visualizing shielding tensors using** `orca_plot`

For the visualization it is recommended to perform an ORCA NMR calculation such that the corresponding `gbw`
and `density` files required by `orca_plot` are generted by using the `!keepdens` keyword along with `!NMR` .
If `orca_plot` is called in the interactive mode by specifying `orca_plot myjob.gbw -i` (note that `myjob.`
`gbw`, `myjob.densities` and `myjob.property.txt` have to be in this directory), then following `1 - type of`
`plot` and choosing `17 - shielding tensor`, confirming the name of the property file and then choosing `11 -`
`Generate the plot` will generate a `.cube` file with shielding tensors depicted as ellipsoids at the corrsponding
nuclei. These can be plotted for example using Avogadro, isosurface values of around 1.0 and somewhat denser
grids for the cube file (like 100x100x100) are recommended. A typical plot for CF 3 SCH 3 generated with Avogadro
looks like this [6] :

6 the same scheme can be applied to visualize polarisability tensors in the molecular framework using `orca_plot` .

**6.12. Calculation of Properties** **339**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.55: The shielding tensors of each atom in CF3SCH3 have been plotted as ellipsoids (a,b and c axis equivalent
to the normalized principle axes of the shielding tensors) at the given nuclei.

**6.12.9 Hyperfine and Quadrupole Couplings**

Hyperfine and quadrupole couplings can be obtained from the EPR/NMR module of ORCA. Since there may be
several nuclei that you might be interested in the input is relatively sophisticated.

An example how to calculate the hyperfine and field gradient tensors for the CN radical is given below:



(continues on next page)

**340** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

In this example the hyperfine tensor is calculated for all carbon atoms and atom 2, which is nitrogen in this case.

**Note:**

  - counting of atom numbers starts from 1

  - All nuclei mentioned in one line will be assigned the same isotopic mass, i.e. if several nuclei are calculated,
there has to be a new line for each of them.

  - You have to specify the `Nuclei` statement *after* the definition of the atomic coordinates or the program will
not figure out what is meant by “ `all` ”.

The output looks like the following. It contains detailed information about the individual contributions to the hyperfine couplings, its orientation, its eigenvalues, the isotropic part and (if requested) also the quadrupole coupling

tensor.



(continues on next page)

**6.12. Calculation of Properties** **341**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



Another important point to consider for hyperfine calculations concerns the choice of basis sets. You should
normally use basis sets that have more flexibility in the core region. In the present example a double-zeta basis
set was used. For accurate calculations this is not sufficient. There are several dedicated basis set for hyperfine
calculations:

  - EPR-II basis of Barone and co-workers: It is only available for a few light atoms (H, B, C, N, O, F) and is
essentially of double-zeta plus polarization quality with added flexibility in the core region, which should
give reasonable results.

  - IGLO-II and IGLO-III bases of Kutzelnigg and co-workers: They are fairly accurate but also only available
for some first and second row elements.

  - CP basis: They are accurate for first row transition metals as well.

  - uncontracted Partridge basis: They are general purpose HF-limit basis sets and will probably be too expensive
for routine use, but are very useful for calibration purposes.

For other elements ORCA does not yet have dedicated default basis sets for this situation it is very likely that you
have to tailor the basis set to your needs. If you use the statement `Print[p_basis] 2` in the `%output` block
(or `PrintBasis` in the simple input line) the program will print the actual basis set in input format (for the basis
block). You can then add or remove primitives, uncontract core bases etc. For example, here is a printout of the
carbon basis DZP in input format:



(continues on next page)

**342** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

The “ `s 5` ”, for example, stands for the angular momentum and the number of primitives in the first basis function.
Then there follow five lines that have the number of the primitive, the exponent and the contraction coefficient
(unnormalized) in it. **Remember also that when you add very steep functions you** ***must*** **increase the size of**
**the integration grid if you do DFT calculations!** ***If you do not do that your results will be inaccurate*** **.** You can
increase the radial grid size by using `IntAcc` in the `Method` block or for individual atoms (section *Other details*
*and options* explains how to do this in detail). In the present example the changes caused by larger basis sets in
the core region and more accurate integration are relatively modest – on the order of 3%, which is, however, still
significant if you are a little puristic.

The program can also calculate the spin-orbit coupling contribution to the hyperfine coupling tensor as described in
section *EPR and NMR properties* .To extract the *A* tensor from a oligonuclear transition metal complex, the `A(iso)`
value in the output is to be processed according to the method described in ref. [645].

For the calculation of HFCCs using DLPNO-CCSD it is recommended to use the tailored truncation settings `!`
`DLPNO-HFC1` or `!DLPNO-HFC2` in the simple keyword line which correspond to the “Default1” and “Default2”
setting in Ref. [743].

If also EPR g-tensor or D-tensor calculations (see next section) are carried out in the same job, ORCA automatically
prints the orientation between the hyperfine/quadrupole couplings and the molecular g- or D-tensor. For more
information on this see section *orca_euler* .

**6.12.10 The EPR g-Tensor and the Zero-Field Splitting Tensor**

The EPR g-tensor is a property that can be well calculated at the SCF level with ORCA through solution of the
coupled-perturbed (CP-)SCF equations (see *CP-SCF Options* ) and at the CASSCF level via the CP-CASSCF equations (see *CASSCF Linear Response* ). As an example, consider the following simple g-tensor job:



The simplest way is to call the g-tensor property in the simple input line as shown above, but it can also be specified
in the `%eprnmr` block with `gtensor true` . Starting from ORCA 5.0 the default treatment of the gauge is the
GIAO approach, but this can be modified by the keyword `ori` . Other options are defined in section *EPR and NMR*
*properties* . `SOMF(1X)` defines the chosen spin-orbit coupling (SOC) operator. The details of the SOC operator
are defined in section *The Spin-Orbit Coupling Operator* . Other choices and additional variables exist and can be
set as explained in detail in section *The Spin-Orbit Coupling Operator* .

The output looks like the following. It contains information on the contributions to the g-tensor (relativistic
mass correction, diamagnetic spin-orbit term (= gauge-correction), paramagnetic spin-orbit term (= OZ/SOC)),

**6.12. Calculation of Properties** **343**

**ORCA Manual** **,** **Release 6.0.1**

the isotropic g-value and the orientation of the total tensor.



G-tensor calculations using GIAOs are now available at SCF and the RI-MP2 level. Note that GIAOs are **NOT**
currently available with CASSCF linear response and a gauge origin must be provided in the `%eprnmr` block (see
*CASSCF Linear Response* ). GIAOs for CASSCF response are coming soon to ORCA!

The GIAO one-electron integrals are done analytically by default whereas the treatment of the GIAO two-electron
integrals is chosen to be same as for the SCF. The available options which can be set with `giao_1el / giao_2el`
in the `%eprnmr` block can be found in section *EPR and NMR properties* .

Concerning the computational time, for small systems, e.g. phenyl radical (41 electrons), the `rijk` -approximation
is good to use for the SCF-procedures as well as the GIAO two-electron integrals. Going to larger systems,
e.g. chlorophyll radical (473 electrons), the `rijcosx` -approximation reduces the computational time enormously.
While the new default grid settings in ORCA 5.0 ( `defgrid2` ) should be sufficient in most cases, certain cases
might need the use of `defgrid3` . The output looks just the same as for the case without GIAOs, but with additional information on the GIAO-parts.

If the total spin of the system is *𝑆* >1/2 then the zero-field-splitting tensor can also be calculated and printed. For
example consider the following job on a hypothetical Mn(III)-complex.




(continues on next page)

**344** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

The output documents the individual contributions to the D-tensor which also contains (unlike the g-tensor) contributions from spin-flip terms.

Some explanation must be provided:

  - The present implementation in ORCA is valid for HF, DFT and hybrid DFT.

  - There are four different variants of the SOC-contribution, which shows that this is a difficult property. We
will briefly discuss the various choices.

  - The QRO method is fully documented[612] and is based on a theory developed earlier.[622] The QRO
method is reasonable but somewhat simplistic and is superseded by the CP method described below.

  - The Pederson-Khanna model was brought forward in 1999 from qualitative reasoning.[657] It also contains
incorrect prefactors for the spin-flip terms. We have nevertheless implemented the method for comparison.
In the original form it is only valid for local functionals. In ORCA it is extended to hybrid functionals and
HF.

  - The coupled-perturbed method is a generalization of the DFT method for ZFSs; it uses revised prefactors
for the spin-flip terms and solves a set of coupled-perturbed equations for the SOC perturbation. Therefore
it is valid for hybrid functionals. It has been described in detail.[614]

  - The DSS part is an expectation value that involves the spin density of the system. In detailed calibration
work[800] it was found that the spin-unrestricted DFT methods behave somewhat erratically and that much
more accurate values were obtained from open-shell spin-restricted DFT. Therefore the “UNO” option allows
the calculation of the SS term with a restricted spin density obtained from the singly occupied unrestricted
natural orbitals.

  - The DSS part contains an erratic self-interaction term for UKS/UHF wavefunction and canonical orbitals.
Thus, `UNO` is recommended for these types of calculations.[724] If the option `DIRECT` is used nevertheless,
ORCA will print a warning in the respective part of the output.

  - In case that D-tensor is calculated using the correlated wave function methods such as (DLPNO-/LPNO)CCSD, one should not use `DSS=UNO` option.

More information about the D-tensor can be found in section *Zero-Field-Splitting* .

**6.12. Calculation of Properties** **345**

**ORCA Manual** **,** **Release 6.0.1**

**6.12.11 Mössbauer Parameters**


1 [3]

2 [ground state and the] *[ 𝐼]* [=] 2


57 Fe Mössbauer spectroscopy probes the transitions of the nucleus between the *𝐼* = 1


2 2

excited state at 14.4 keV above the ground state. The important features of the Mössbauer spectrum are the isomer
shift ( *𝛿* ) and the quadrupole splitting (∆ *𝐸* Q ). An idealized spectrum is shown in Fig. 6.56.


Fig. 6.56: An idealized Mössbauer spectrum showing both the isomer shift, *𝛿*, and the quadrupole splitting, ∆ *𝐸* Q .

The isomer shift measures the shift in the energy of the *𝛾* -ray absorption relative to a standard, usually Fe foil. The
isomer shift is sensitive to the electron density at the nucleus, and indirectly probes changes in the bonding of the
valence orbitals due to variations in covalency and 3d shielding. Thus, it can be used to probe oxidation and spin
states, and the coordination environment of the iron.

The quadrupole splitting arises from the interaction of the nuclear quadrupole moment of the excited state with the
electric field gradient at the nucleus. The former is related to the non-spherical charge distribution in the excited
state. As such it is extremely sensitive to the coordination environment and the geometry of the complex.

Both the isomer shift and quadrupole splitting can be successfully predicted using DFT methods. The isomer shift
is directly related to the s electron density at the nucleus and can be calculated using the formula

*𝛿* = *𝛼* ( *𝜌* 0 *−* *𝐶* ) + *𝛽* (6.14)

where *𝛼* is a constant that depends on the change in the distribution of the nuclear charge upon absorption, and *𝜌* 0
is the electron density at the nucleus [609]. The constants *𝛼* and *𝛽* are usually determined via linear regression
analysis of the experimental isomer shifts versus the theoretically calculated electron density for a series of iron
compounds with various oxidation and spin states. Since the electron density depends on the functional and basis
set employed, fitting must be carried out for each combination used. A compilation of calibration constants ( *𝛼*, *𝛽*
and *𝐶* ) for various methods was assembled.[708] Usually an accuracy of better than 0.10 mm s *[−]* [1] can be achieved
for DFT with reasonably sized basis sets.

**346** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

The quadrupole splitting is proportional to the largest component of the electric field gradient (EFG) tensor at the
iron nucleus and can be calculated using the formula:


2
(6.15)

)︂ [1]


∆ *𝐸* Q = [1]

2 *[𝑒𝑄𝑉]* *[𝑧𝑧]*


1 + *[𝜂]* [2]
(︂ 3


where *𝑒* is the electrical charge of an electron and *𝑄* is the nuclear quadrupole moment of Fe (approximately 0.16
barns). *𝑉* *𝑥𝑥*, *𝑉* *𝑦𝑦* and *𝑉* *𝑧𝑧* are the electric field gradient tensors and *𝜂*, defined as


*𝜂* = *𝑉* *𝑥𝑥* *−* *𝑉* *𝑦𝑦*
⃒⃒⃒⃒ *𝑉* *𝑧𝑧*


(6.16)
⃒⃒⃒⃒


is the asymmetry parameter in a coordinate system chosen such that *|𝑉* *𝑧𝑧* *| ≥|𝑉* *𝑦𝑦* *| ≥|𝑉* *𝑥𝑥* *|* .

An example of how to calculate the electron density and quadrupole splitting of an iron center is as follows:



If the core properties basis set CP(PPP) is employed, one might have to increase the radial integration accuracy
for the iron atom. From ORCA 5.0 this is considered during grid construction and the defaults should work very
well. However for very problematic cases it can be increased by controlling the `SPECIALGRIDINTACC` flag under
`%METHOD` (see Sec. *Other details and options* for details).

The output file should contain the following lines, where you obtain the calculated quadrupole splitting directly
and the RHO(0) value (the electron density at the iron nucleus). To obtain the isomer shift one has to insert the
RHO(0) value into the appropriate linear equation (Eq. (6.14)).



**Note:**

  - Following the same procedure, Mössbauer parameters can be computed with the CASSCF wavefunction.
In case of a state-averaged CASSCF calculation, the averaged density is used in the subsequent Mössbauer
calculation.

**6.12.12 Broken-Symmetry Wavefunctions and Exchange Couplings**

A popular way to estimate the phenomenological parameter *𝐽* AB that enters the Heisenberg–Dirac–van Vleck
Hamiltonian which parameterizes the interaction between two spin systems is the “broken-symmetry” formalism.
The phenomenological Hamiltonian is:

*𝐻* HDvV = *−* 2 *𝐽* AB *𝑆* *[⃗]* A *𝑆* *[⃗]* B (6.17)

It is easy to show that such a Hamiltonian leads to a “ladder” of spin states from *𝑆* = *𝑆* A + *𝑆* B down to
*𝑆* = *|𝑆* A *−* *𝑆* B *|* . If the parameter *𝐽* AB is positive the systems “A” and “B” are said to be *ferromagnetically* coupled
because the highest spin-state is lowest in energy while in the case that *𝐽* AB is negative the coupling is *antiferro-*
*magnetic* and the lowest spin state is lowest in energy.

In the broken symmetry formalism one tries to obtain a wavefunction that breaks spatial (and spin) symmetry. It
may be thought of as a “poor man’s MC-SCF” that simulates a multideterminantal character within a single determinant framework. Much could be said about the theoretical advantages, disadvantages, problems and assumptions
that underly this approach. Here, we only want to show how this formalism is applied within ORCA.

**6.12. Calculation of Properties** **347**

**ORCA Manual** **,** **Release 6.0.1**


For *𝑁* A unpaired electrons localized on “site A” and *𝑁* B unpaired electrons localized on a “site B” one can calculate
the parameter *𝐽* AB from two separate spin-unrestricted SCF calculations: (a) the calculation for the high-spin state
with *𝑆* = [(] *[𝑁]* [A] [+] 2 *[𝑁]* [B] [)] and (b) the “broken symmetry” calculation with *𝑀* *𝑆* = [(] *[𝑁]* [A] *[−]* 2 *[𝑁]* [B] [)] that features *𝑁* A spin-up

electrons that are quasi-localized on “site A” and *𝑁* B spin-down electrons that are quasi-localized on “site B”.
Several formalisms exist to extract *𝐽* AB : [91, 303, 637, 638, 809, 898].


*𝐽* AB = *−* [(] *[𝐸]* [HS] *[ −]* *[𝐸]* [BS] [)] (6.18)

( *𝑆* A + *𝑆* B ) [2]


( *𝐸* HS *−* *𝐸* BS )
*𝐽* AB = *−* (6.19)
( *𝑆* A + *𝑆* B ) ( *𝑆* A + *𝑆* B + 1)

( *𝐸* HS *−* *𝐸* BS )
*𝐽* AB = *−* (6.20)
*⟨𝑆* [2] *⟩* HS *−⟨𝑆* [2] *⟩* BS

We prefer the last definition (Eq. (6.20)) because it is approximately valid over the whole coupling strength regime
while the first equation implies the weak coupling limit and the second the strong coupling limit.

In order to apply the broken symmetry formalism use:



The program will then go through a number of steps. Essentially it computes an energy and wavefunction for the
high-spin state, localizes the orbitals and reconverges to the broken symmetry state.

**Caution:** Make sure that in your input coordinates “site A” is the site that contains the larger number of
unpaired electrons!

Most often the formalism is applied to spin coupling in transition metal complexes or metal-radical coupling or to
the calculation of the potential energy surfaces in the case of homolytic bond cleavage. In general, hybrid DFT
methods appear to give reasonable semiquantitative results for the experimentally observed splittings.

As an example consider the following simple calculation of the singlet–triplet splitting in a stretched Li 2 molecule:



There is a second mechanism for generating broken-symmetry solutions in ORCA. This mechanism uses the individual spin densities and is invoked with the keywords `FlipSpin` and `FinalMs` . The strategy is to exchange the *𝛼*
and *𝛽* spin blocks of the density on certain user-defined centers after converging the high-spin wavefunction. With
this method arbitrary spin topologies should be accessible. The use is simple:



(continues on next page)

**348** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

Finally, you may attempt to break the symmetry by using the SCF stability analysis feature (see Section *SCF*
*Stability Analysis* ). The ground spin state can be obtained by diagonalizing the above spin Hamiltonian through
**ORCA-ECA** utility (see *orca_eca* ).

**Approximate Spin Projection Method**

The approximate spin projection (AP) method, proposed by Yamaguchi and co-workers, is a technique to remove
the spin contamination from exchange coupling constants.[738, 897, 898] In this scheme, the energy of a system
is given by

*𝐸* AP = *𝛼𝐸* BS *−* ( *𝛼* *−* 1) *𝐸* HS (6.21)

The parameter *𝛼* is calculated as

*𝛼* = *[𝑆]* [HS] [(] *𝑆* [HS] + 1 ) *−* *𝑆* *𝑍* [BS] ( *𝑆* *𝑍* [BS] [+ 1] ) (6.22)

*⟨* **S** [ˆ] [2] *⟩* [HS] *−⟨* **S** [ˆ] [2] *⟩* [BS]

Here, *𝑆* *𝑍* [BS] is the *𝑧* -component of the total spin for the BS state ( *𝑆* *𝑍* [BS] = ( *𝑁* *𝛼* *−* *𝑁* *𝛽* ) */* 2). Alternatively, one can
adopt Noodleman’s scheme,[638] where *𝛼* is calculated as follows

*𝛼* = *[𝑆]* [HS] [(] *𝑆* [HS] + 1 ) *−* *𝑆* *𝑍* [BS] ( *𝑆* *𝑍* [BS] [+ 1] ) (6.23)

( *𝑆* [HS] ) [2]

or Ruiz’s scheme,[734] with *𝛼* equal to

*𝛼* = *[𝑆]* [HS] [(] *𝑆* [HS] + 1 ) *−* *𝑆* *𝑍* [BS] ( *𝑆* *𝑍* [BS] [+ 1] ) (6.24)

*𝑆* [HS] ( *𝑆* [HS] + 1)

The AP method is requested via the tag `APMethod` in the `%scf` block:



The default is `APMethod 0`, which corresponds to a normal BS calculation. Yamaguchi’s AP method is available
for single point energy calculations and geometry optimizations. If we run a geometry optimization in the context
of Yamaguchi’s AP method, then, the gradient of equation (6.21) w.r.t a nuclear displacement *𝑋* reads as


*𝜕𝐸* AP



[BS]

*−* ( *𝛼* *−* 1) *[𝜕𝐸]* [HS]
*𝜕𝑋* *𝜕𝑋*


AP

= *𝛼* *[𝜕𝐸]* [BS]
*𝜕𝑋* *𝜕𝑋*



[HS]

+ *[𝜕𝛼]*
*𝜕𝑋* *𝜕𝑋*


(6.25)
*𝜕𝑋* [(] *[𝐸]* [BS] *[ −]* *[𝐸]* [HS] [)]


The last term contains the derivative *[𝜕𝛼]*


The last term contains the derivative

*𝜕𝑋* [. ORCA uses the formalism proposed by Saito and Thiel, which involves]
solving the CP-SCF equations in each geometry optimization cycle.[739] The cost of such a calculation is higher
than using Noodleman’s or Ruiz’s schemes, where *[𝜕𝛼]* [= 0][.]


*𝜕𝑋* [= 0][.]


**6.12. Calculation of Properties** **349**

**ORCA Manual** **,** **Release 6.0.1**
### **6.13 Local Energy Decomposition**

“Local Energy Decomposition” (LED) analysis[33, 105, 768] is a tool for obtaining insights into the nature of intermolecular interactions by decomposing the DLPNO-CCSD(T) energy into physically meaningful contributions.
For instance, this approach can be used to decompose the DLPNO-CCSD(T) interaction energy between a pair of
interacting fragments, as detailed in Section *Local Energy Decomposition* . A useful comparison of this scheme
with alternative ways of decomposing interaction energies is reported in Ref. [27, 28, 29].

**6.13.1 Closed shell LED**

All that is required to obtain this decomposition in ORCA is to define the fragments and specify the `!LED` keyword
in the simple input line.

LED decomposes separately the reference (Hartree-Fock) and correlation parts of the DLPNO-CCSD(T) energy.
By default, the decomposition of the reference energy makes use of the RI-JK approximation. `An RIJCOSX`
```
variant, which is much more efficient and has a much more favorable scaling for large

```
`systems, is also available, as detailed in section` *Additional Features, Defaults and List of*
*Keywords*, `and in` [27].

Note that, for weakly interacting systems, TightPNO settings are typically recommended. As an example, the
interaction of H 2 O with the carbene CH 2 at the PBE0-D3/def2-TZVP-optimized geometry can be analyzed within
the LED framework using the following input file:

The corresponding output file is reported below. The DLPNO-CCSD(T) energy components are printed out in
different parts of the output as follows:



At the beginning of the LED part of the output, information on the fragments and the assignment of localized MOs
to fragments are provided.




(continues on next page)

**350** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

The decomposition of the Hatree-Fock energy into intra- and inter-fragment contributions follows. It is based on
the localization of the occupied orbitals.



(continues on next page)

**6.13. Local Energy Decomposition** **351**

**ORCA Manual** **,** **Release 6.0.1**


(continued from previous page)



Afterwards, a first decomposition of the correlation energy is carried out. The different energy contributions to the
correlation energy (strong pairs, weak pairs and triples correction) are decomposed into intra- and inter-fragment
contributions. This decomposition is carried out based on the localization of the occupied orbitals.




(continues on next page)

**352** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

Afterwards, a summary with the decomposition of the total energy (reference energy + correlation) into intra- and
inter-fragment contributions is printed.



Hence, the decomposition reported above allows one to decompose all the components of the DLPNO-CCSD(T)
energy into intrafragment and interfragment contributions simply based on the localization of the occupied orbitals.
In order to convert the intra-fragment energy components into contributions to the binding energy, single point
energy calculations must be carried out on the isolated monomers, frozen in the geometry they have in the adduct,
and the corresponding terms must be subtracted. Note that one can also include the geometrical deformation energy
(also called “strain”) by simply computing the energy of the geometrically relaxed fragments (see Section *Local*
*Energy Decomposition* for further information).

For the DLPNO-CCSD strong pairs, which typically dominate the correlation energy, a more sophisticated decomposition, based on the localization of both occupied orbitals and PNOs, is also carried out and printed. Accordingly,
the correlation energy from the strong pairs is divided into intra-fragment, dispersion and charge transfer components. Note that, due to the charge transfer excitations, the resulting intra-fragment contributions (shown below)
differ from the ones obtained above.




(continues on next page)

**6.13. Local Energy Decomposition** **353**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

More detailed information into the terms reported above can be found in Section *Local Energy Decomposition*
and in Ref.[768] All the individual double excitations contributions constituting the terms reported above can be
printed by specifying “printlevel 3” in the `%mdci` block. Finally, a summary with the most important terms of the
DLPNO-CCSD energy, which are typically discussed in standard applications, is printed.




Note that the “Non dispersion” terms include all the components of the correlation energy except London dispersion.[28, 106]. For the strong pairs, “Non dispersion” includes charge transfer, intrafragment double excitations
and singles contributions. For the weak pairs, it corresponds to the intrafragment correlation contribution. In order
to convert the non dispersion correlation components into contributions to the binding energy, single point energy
calculations must be carried out on the isolated monomers.

**6.13.2 Example: LED analysis of intermolecular interactions**

The water-carbene example from the previous section will be used to demonstrate how to analyze intermolecular
interactions between two fragments using the LED decomposition (note that all energies are given in a.u. if not
denoted otherwise). As often done in practical applications, we will be using geometries optimized at the DFT
(PBE0-D3/def2-TZVP) level of theory on which DLPNO-CCSD(T) (cc-pVDZ,TightPNO) single point energies
are computed. Note that in practice, basis sets of triple-zeta quality or larger are recommended. In the first step,
the geometries of the dimer, H 2 O and CH 2 are optimized and DLPNO-CCSD(T) energies are computed to yield
*𝐸* *𝑑𝑖𝑚𝑒𝑟* *[𝑜𝑝𝑡]* [and] *[ 𝐸]* *𝑚𝑜𝑛𝑜𝑚𝑒𝑟𝑠* *[𝑜𝑝𝑡]* [. The input examples for the single-point DLPNO-CCSD(T) energies of the monomers at]
their optimized geometries and the necessary energies from the output files of these runs are as follows:




**354** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**






Single-point DLPNO-CCSD(T) energies of the monomers at their in-adduct geometries are also necessary. The
corresponding inputs and the necessary output parts for these calculations are as follows:








These energies are summarized in Table Table 6.9).

Table 6.9: Energies of the H 2 O-CH 2 example for illustrating how the different LED contributions are valuated.
The superscript *[𝑜𝑝𝑡]* denotes energies of optimized structures, *[𝑓𝑖𝑥𝑒𝑑]* denotes energies of isolated fragments in the
dimer structure. In the last column the energy of the dimer is reported.

**6.13. Local Energy Decomposition** **355**

**ORCA Manual** **,** **Release 6.0.1**

Note that for this example, we do not include any BSSE correction. For this system we obtain a binding energy of

*𝐸* *𝑖𝑛𝑡* = *𝐸* *𝑑𝑖𝑚𝑒𝑟* *[𝑜𝑝𝑡]* *[−]* *[𝐸]* *𝑚𝑜𝑛𝑜𝑚𝑒𝑟𝑠* *[𝑜𝑝𝑡]* [=] *[ −]* [115] *[.]* [269990255] *[ −]* [(] *[−]* [76] *[.]* [241018382] *[ −]* [39] *[.]* [022363662) =] *[ −]* [0] *[.]* [006608211]

which is -4.147 kcal/mol.

The basic principles and the details of the LED are discussed in section *Local Energy Decomposition* . The first
contribution to the binding energy is the energy penalty for the monomers to distort into the geometry of the dimer

∆ *𝐸* *𝑔𝑒𝑜−𝑝𝑟𝑒𝑝* = *𝐸* *𝑚𝑜𝑛𝑜𝑚𝑒𝑟𝑠* *[𝑓𝑖𝑥𝑒𝑑]* *[−]* *[𝐸]* *𝑚𝑜𝑛𝑜𝑚𝑒𝑟𝑠* *[𝑜𝑝𝑡]*

(see in equation (7.406)). This contribution is computed as the difference of the DLPNO-CCSD(T) energy of the
monomers in the structure of the dimer ( *𝐸* *𝑚𝑜𝑛𝑜𝑚𝑒𝑟𝑠* *[𝑓𝑖𝑥𝑒𝑑]* [) and of the relaxed monomers (] *[𝐸]* *𝑚𝑜𝑛𝑜𝑚𝑒𝑟𝑠* *[𝑜𝑝𝑡]* [). The following]
energies are obtained:

∆ *𝐸* *𝑔𝑒𝑜−𝑝𝑟𝑒𝑝* = ( *−* 76 *.* 240906844 + 76 *.* 241018382) + ( *−* 39 *.* 022051484 + 39 *.* 022363662) = 0 *.* 000423716

which amounts to 0.266 kcal/mol. Typically, the triples correction is evaluated separately:

∆ *𝐸* *𝑖𝑛𝑡* *[𝐶][−]* [(] *[𝑇]* [)] = *−* 0 *.* 006098691 *−* ( *−* 0 *.* 002963338 *−* 0 *.* 002869022) = *−* 0 *.* 000266331

This contributes -0.167 kcal/mol. The next terms in equation (7.406) concern the reference energy contributions.
The first one is the electronic preparation in the reference, which is evaluated as the difference of the `Intra REF.`
`energy` of the fragments (see previous section) and the reference energy of the separate molecules at the dimer

geometry:

∆ *𝐸* *𝑒𝑙* *[𝑟𝑒𝑓.]* *−𝑝𝑟𝑒𝑝* [(] *[𝐻]* [2] *[𝑂]* [) =] *[ −]* [76] *[.]* [005372788703 + 76] *[.]* [026011663 = 0] *[.]* [020638874297]

∆ *𝐸* *𝑒𝑙* *[𝑟𝑒𝑓.]* *−𝑝𝑟𝑒𝑝* [(] *[𝐶𝐻]* [2] [) =] *[ −]* [38] *[.]* [841007482585 + 38] *[.]* [881085139 = 0] *[.]* [040077656415]

which amounts to 0.060716530712 a.u. or 38.100 kcal/mol. The next two contributions stem from the decomposition of the reference inter-fragment contributions *𝐸* *𝑒𝑙𝑠𝑡𝑎𝑡* *[𝑟𝑒𝑓.]* [=] *[ −]* [0] *[.]* [056636132][ (-35.540 kcal/mol) and]
*𝐸* *[𝑟𝑒𝑓.]*
*𝑒𝑥𝑐ℎ* [=] *[ −]* [0] *[.]* [010292635][ (-6.459 kcal/mol) and can be found in directly in the LED output (] `[Electrostatics]`
`(REF.)` and `Exchange (REF.)` ). The correlation energy also contains an electronic preparation contribution,
but it is typically included in the correlation contribution ∆ *𝐸* *𝑛𝑜𝑛* *[𝐶][−][𝐶𝐶𝑆𝐷]* *−𝑑𝑖𝑠𝑝𝑒𝑟𝑠𝑖𝑜𝑛* [. Adding the non-dispersive strong]
and weak pairs contributions from the LED output ( `Non dispersion (strong pairs)` and `Non dispersion`
`(weak pairs)` ) one obtains :

*−* 0 *.* 348968665 *−* 0 *.* 000003885 = *−* 0 *.* 34897255

from which we have to subtract the sum of the correlation contributions of the monomers at the dimer geometry

∆ *𝐸* *𝑛𝑜𝑛* *[𝐶][−][𝐶𝐶𝑆𝐷]* *−𝑑𝑖𝑠𝑝𝑒𝑟𝑠𝑖𝑜𝑛* [=] *[ −]* [0] *[.]* [34897255] *[ −]* [(] *[−]* [0] *[.]* [211931843] *[ −]* [0] *[.]* [138097323) = 0] *[.]* [001056616]

which is 0.663 kcal/mol. The dispersive contribution can be directly found in the LED output ( `Dispersion`
`(strong pairs)` and `Dispersion (weak pairs)` ) and amounts to *𝐸* *𝑑𝑖𝑠𝑝𝑒𝑟𝑠𝑖𝑜𝑛* *[𝐶][−][𝐶𝐶𝑆𝐷]* [=] *[ −]* [0] *[.]* [001609975][ which]
is -1.010 kcal/mol. So all terms that we have evaluated so far are:

∆ *𝐸* = ∆ *𝐸* *𝑔𝑒𝑜−𝑝𝑟𝑒𝑝* + ∆ *𝐸* *𝑒𝑙* *[𝑟𝑒𝑓.]* *−𝑝𝑟𝑒𝑝* [+] *[ 𝐸]* *𝑒𝑙𝑠𝑡𝑎𝑡* *[𝑟𝑒𝑓.]* [+] *[ 𝐸]* *𝑒𝑥𝑐ℎ* *[𝑟𝑒𝑓.]* [+ ∆] *[𝐸]* *𝑛𝑜𝑛* *[𝐶][−][𝐶𝐶𝑆𝐷]* *−𝑑𝑖𝑠𝑝𝑒𝑟𝑠𝑖𝑜𝑛* [+] *[ 𝐸]* *𝑑𝑖𝑠𝑝𝑒𝑟𝑠𝑖𝑜𝑛* *[𝐶][−][𝐶𝐶𝑆𝐷]* [+ ∆] *[𝐸]* *𝑖𝑛𝑡* *[𝐶][−]* [(] *[𝑇]* [)]






which sum to the total binding energies of -0.006608211 a.u. or -4.147 kcal/mol that we have evaluated at the
beginning of this section. A detailed discussion of the underlying physics and chemistry can be found in [33].

**356** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**6.13.3 Open shell LED**

The decomposition of the DLPNO-CCSD(T) energy in the open shell case is carried out similarly to the closed
shell case. [33] An example of input file is shown below.

The corresponding output is entirely equivalent to the one just discussed for the closed shell case. However, the open
shell variant of the LED scheme relies on a different implementation than the closed shell one. A few important
differences exist between the two implementations, which are listed below.

  - In the closed shell LED the reference energy is typically the HF energy. Hence, the total energy equals the
sum of HF and correlation energies. In the open shell variant, the reference energy is the energy of the QRO
determinant. Hence, the total energy in this case equals the sum of the energy of the QRO determinant and
the correlation energy.

  - The singles contribution is typically negligible in the closed shell case due to the Brillouin’s theorem. In the
open shell variant, this is not necessarily the case. In both cases, the singles contribution is included in the
“Non dispersion” part of the strong pairs.

  - In the UHF DLPNO-CCSD(T) framework we have *𝛼𝛼*, *𝛽𝛽* and *𝛼𝛽* pairs. Hence, in the open shell LED, all
correlation terms (e.g. London dispersion) have *𝛼𝛼*, *𝛽𝛽* and *𝛼𝛽* contributions. By adding “printlevel 3” in
the `%mdci` block one can obtain information on the relative importance of the different spin terms.

  - The open shell DLPNO-CCSD(T) algorithm can also be used for computing the energy of closed shell
systems by adding the “UHF” keyword in the simple input line of a DLPNO-CCSD(T) calculation.

**6.13.4 Dispersion Interaction Density plot**

The Dispersion Interaction Density (DID) plot provides a simple yet powerful tool for the spatial analysis of the London dispersion interaction between a pair of fragments extracted from the LED analysis in the DLPNO-CCSD(T)
framework. [29] A similar scheme was developed for the closed shell local MP2 method. [894] The “dispersion
energy density”, which is necessary for generating the DID plot, can be obtained from a simple LED calculation
by adding “DoDIDplot true” in the `%mdci` block.



These can be converted to a format readable by standard visualization programs, e.g. a cube file, through
`orca_plot` . To do that, call `orca_plot` with the command:
```
orca_plot gbwfilename -i

```
and follow the instructions that will appear on your screen, i.e.:



(continues on next page)

**6.13. Local Energy Decomposition** **357**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



Type “1” for selecting the plot type. A few options are possible:



Select “LED dispersion interaction density” from the list by typing “15”. Afterwards, choose your favorite format
and generate the file.

**6.13.5 Automatic Fragmentation**

Starting from ORCA 4.2 it is possible to let the program define the fragments to be used in the LED analysis. In
this case, the program will try to identify all monomers in the system that are not connected through a covalent
bond and assign a fragment to each of them. The XYZ coordinates of the fragments are reported in the beginning
of the output file. For instance, given the input:

The program will automatically identify the H 2 O and the CH 2 fragments. Note that this procedure works for an
arbitrary number of interacting molecules. It is also possible to assign only certain atoms to a fragment and let the
program define the other ones:



(continues on next page)

**358** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

**6.13.6 Additional Features, Defaults and List of Keywords**

**Note:** Starting from ORCA 4.2 the default localization scheme for the PNOs has changed from PM (Pipek Mezey)
to FB (Foster Boys). This might cause slight numerical differences in the LED terms with respect to that obtained
from previous ORCA versions. To obtain results that are fully consistent with previous ORCA versions, PM must
be specified (see below).

The following options can be used in accordance with LED.

**Note:** Starting from ORCA 4.2 an RIJCOSX implementation of the LED scheme for the decomposition of the
reference energy is also available. This is extremely efficent for large systems. For consistency, the RIJCOSX
variant of the LED is used only if the underlying SCF treatment is performed using the RIJCOSX approximation,
i.e., if RIJCOSX is specified in the simple input line. An example of input follows.



Fianlly, here are some tips for advanced users.

  - The LED scheme can be used in conjuction with an arbitrary number of fragments.

  - The LED scheme can be used to decompose DLPNO-CCSD and DLPNO-CCSD(T) energies. At the moment, it is not possible to use this scheme to decompose DLPNO-MP2 energies directly. However, for closed
shell systems, one can obtain DLPNO-MP2 energies from a DLPNO-CCSD calculation by adding a series
of keywords in the `%mdci` block: (i) `TScalePairsMP2PreScr 0` ; (ii) `UseFullLMP2Guess true` ; (iii)
`TCutPairs 10` (or any large value). The LED can be used as usual to decompose the resulting energy.

**6.13. Local Energy Decomposition** **359**

**ORCA Manual** **,** **Release 6.0.1**

  - For a closed shell system of two fragments (say A and B), the LED scheme can be used to further decompose
the LED components of the reference HF energy (intrafragment, electrostatics and exchange) into a sum of
frozen state and orbital relaxation correction contributions. More information can be found in Ref. [29].

  - To obtain the frozen state terms one has to: (i) generate a .gbw file containing the orbitals of both fragments
(AB.gbw) using `orca_mergefrag A.gbw B.gbw AB.gbw`, where A.gbw and B.gbw are the orbital files of
isolated fragments at the aduct geometry; (ii) run the LED as usual by using `MORead` to read the orbitals in
the AB.gbw file in conjunction with `Maxiter 0` in both the `%scf` block (to skip the SCF iterations) and the
`%mdci` block (to skip the unnecessary CCSD iterations).
### **6.14 The Hartree-Fock plus London Dispersion (HFLD) method for** **the study of Noncovalent Interactions**

Starting from ORCA 4.2, the efficient and accurate HFLD method[30] can be used for the quantification and analysis
of noncovalent interactions between a pair of user-defined fragments. Starting from ORCA 5.0, an open shell
variant of the HFLD method is also available.[24]

The leading idea here is to solve the DLPNO coupled cluster equations while neglecting intramonomer correlation.
The LED scheme is then used to extract the London dispersion (LD) energy from the intermolecular part of the
correlation. Finally, the resulting LD energy is used to correct interaction energies computed at the HF level.
Hence, HFLD can be considered as a dispersion-corrected HF approach in which the dispersion interaction between
the fragments is added at the DLPNO-CC level. As such, it is particulartly accurate for the quantification of
noncovalent interactions such as those found in H-bonded systems, pre-reactive intermediates (e.g., Frustrated
Lewis Pairs), dispersion and electrostatically bound systems. Larger errors are in principle expected for transition
metal complexes, as it is the case for any dispersion corrected Hartree-Fock scheme.

The efficency of the approach allows the study of noncovalent interactions in systems with several hundreds of
atoms. An input example is reported below.

In the corresponding output, after the DLPNO-CC iterations and the LED output, the following information is
printed:



The total HFLD energy of the adduct is thus -114.932878050741 a.u.. To compute interaction energies, we have to
substract from this value the Hartree-Fock energies of the monomers in the geometry they have in the complex, i.e.,
-38.884413525377 and -76.040412827089 a.u. for CH 2 and H 2 O, respectively. The total interaction energy is thus
-0.00805 a.u. or -5.1 kcal/mol (the corresponding DLPNO-CCSD(T)/TightPNO/CBS value is -5.3 kcal/mol. [33]).
Note that, to obtain binding energies, the geometric preparation should be added to this value. This can be computed
using a standard computational method, e.g, DFT or DLPNO-CCSD(T).

Some of the most important aspects of the method are summarized below:

**360** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

   - `Accuracy and Recommended Settings.` For noncovalent interactions, HFLD typically provides an accuracy comparable to that of the DLPNO-CCSD(T) method if default PNO settings are used. For the HFLD
scheme, these are defined as TCutPNO = 3.3e-7 and TCutPairs 1e-5. If used in conjuction with a def2TZVP(-f) basis set, these settings are typically denoted as “ `HFLD*` ” and are recommeded for standard applications on large systems.[24] For example, `HFLD*` settings were used in Ref.[25] to elucidate the complex
pattern of interactions responsible for the stability of the DNA duplex. If great accuracy is required, it is
recommened to use TightPNO settings in conjuction with TCutPNO 1e-8 and two-point basis set extrapolation (aug-cc-pVTZ/aug-cc-pVQZ) to approach the CBS limit. These settings are typically denoted as the
“ `gold` ” HFLD settings.[24]

   - `Reference determinant in the Open shell HFLD scheme.` In the open shell case, HFLD relies on
a restricted reference determinant for the calculation of the LD energy. If the QRO determinant is used as
reference, the reference interaction energy can in principle be computed at the UHF or QRO levels. This leads
to two different schemes, namely the QRO/HFLD and UHF/HFLD. Alternatively, the restricted open-shell
HF (ROHF) determinant can be used as reference in HFLD calculations, which leads to the ROHF/HFLD
approach. The energy value reported as “FINAL SINGLE POINT ENERGY” in the output corresponds to
the UHF/HFLD scheme by default, which is typically slightly more accurate. See Ref. [24] for details.

   - `Efficency.` The calculation of the dispersion correction typically requires the same time as an HF calculation. This is true for small as well as for large systems.

   - `Analysis of Intermolecular Interactions.` The HFLD method can be combined with the Local
Energy Decomposition (LED) to study intermolecular interactions in great detail. The LED dispersion energy obtained with HFLD is often very close to that obtained from a full DLPNO-CCSD(T) calculation.
Hence, HFLD can be used as a cost-effective alternative to DLPNO-CCSD(T) to study, among other things,
the importance of London dispersion in molecular chemistry.

   - `Additional considerations.` (i) One can specify “ `NormalPNO` ” or “ `TightPNO` ” settings in the simple
input line. The corresponding DLPNO tresholds would be in this case fully consistent with those used in
the DLPNO-CCSD(T) method. (ii) The dispersion energy in the HFLD approach slightly depends by the
choice of the localization scheme used for occupied orbitals and PNOs. Default settings are recommended
for all intent and purposes. However, it is important to note that the localization iterations for occupied
and virtual orbitals must be fully converged in order to obtain consistent results. To achieve this goal, it
might be necessary to increase “ `LocMaxIter` ” or “ `LocMaxIterLed` ” (see below). However, this is typically
necessary only if very large basis sets (e.g. aug-cc-pV5Z) are used. (iii) Importantly, the method benefits
from the use of tightly converged SCF solutions. For closed-shell systems, a useful diagnostic in this context
is the “Singles energy” term that is printed in the LED part of the output. This term must be smaller than 1e-6
for closed shell species. If this is not the case, one should change the settings used for the SCF iterations.
Note also that all the features of the LED scheme (e.g. automatic fragmentation) are also available for the
HFLD method.

Note that, as HFLD relies on both the DLPNO-CCSD(T) and LED methods, the options of both schemes can be
used in principle in conjuction with HFLD. Some examples are shown below:

(continues on next page)

**6.14. The Hartree-Fock plus London Dispersion (HFLD) method for the study of Noncovalent361**
**Interactions**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)
### **6.15 ORCA MM Module**

Since version 4.2 ORCA features its own independent MM implementation.

The minimum input necessary for a MM treatment looks as follows.



In this section we discuss the basic keywords and options, i.e.

  - the basic structure of the ORCA Forcefield File,

  - how to generate the ORCA Forcefield File,

  - how to manipulate the ORCA Forcefield File,

  - how to speed up MM calculations,

  - further MM options and keywords.

Further options important for QM/MM calculations will be discussed in section *ORCA Multiscale Implementation* .

**6.15.1 ORCA Forcefield File**

For the MM part of the QM/MM calculation force-field parameters are necessary. ORCA has its own parameter
file format (ORCA forcefield file - ORCAFF.prms), which includes the atom specific parameters for nonbonded

interactions:

  - partial charge

  - LJ coefficients

and parameters for bonded interactions:

  - bonds

  - angles

  - Urey-Bradley terms

  - dihedrals

  - impropers

  - CMAP terms (cross-terms for backbone, currently not used)

Individual parameters, like e.g. atomic charge, equilibrium bond length and force constant, ..., can be conveniently
modified directly within the ORCA Forcefield File.

**362** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**How to generate the ORCA Forcefield File**

The easiest way to generate a ORCAFF.prms file is currently to convert from psf (protein structure file) files. Psf
files are specific to the CHARMM forcefield and its application via NAMD. Psf files for a specific protein system
[can easily be generated by the popular molecular visualization program VMD and its extension QwikMD, but also](https://www.ks.uiuc.edu/Research/vmd/)
[with other extensions in the VMD program (e.g. psfgen or fftk). The psf file contains information on the atom](https://www.ks.uiuc.edu/Research/vmd/plugins/psfgen/)
types and on the bonded interactions of all atoms. It does, however, not contain the parameters that belong to
these interactions. These parameteres are stored in specific files, often ending with prm, but also par or str. The
[CHARMM parameter files come with VMD installation, can be directly downloaded, or can be generated with the](http://mackerell.umaryland.edu/charmm_ff.shtml)
[VMD extension fftk (forcefield toolkit).](http://www.ks.uiuc.edu/Research/vmd/plugins/fftk/)

Once a ORCAFF.prms file is available, it can be manipulated, i.e. split up into several parts for individual
molecules, new ORCAFF.prms files can be generated for non-standard molecules, and individual ORCAFF.prms
files can be merged, as described in the following:

**Conversion from psf or prmtop files to ORCAFF.prms: convff**

The orca_mm module can convert psf and prm files (CHARMM), prmtop files (AMBER) or xml files (open force
field from the openff toolkit, compatible to AMBER) to the ORCAFF file with the -convff flag. Input options are:

For CHARMM topologies, when a psf file is available for a system with standard residues, prepared by e.g.
QwikMD, psfgen or other vmd tools, the conversion needs the psf plus the prm files as input:



ORCA can also convert Amber topologies to the ORCAFF file. Here, only the prmtop file is required:



ORCA can also convert xml files from the openff toolkit (AMBER compatible) to the ORCAFF file. Here, only
the xml file is required:



**Divide a forcefield file: splitff**

If a ORCAFF.prms file should be subdivided into several files, e.g. if the psf file stems from QWikMD with nonstandard molecules included, e.g. a ligand. In that case first the parameters of the ligand are split from the remaining
system, next the ligand needs to be protonated, then a simple ORCAFF.prms file is generated via orca_mm’s makeff
option, and finally the ligand’s new ORCAFF.prms file is added to the main systems file via the above described
mergeff option. Note that the file can only be split into files for nonbonded fragments.

Input options:



(continues on next page)

**6.15. ORCA MM Module** **363**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



**Merge forcefield files: mergeff**

If several ORCAFF.prms files are available and should be merged for an ORCA calculation, e.g. for a standard plus
a non-standard molecule.

Input options:



**Repeat forcefield files: repeatff**

In case the same ORCAFF.prms file needs to be repeated multiple times, the repeatff functionality is available.

Input options:




This feature can be useful e.g. in the case of solvating a molecule, i.e. adding multiple copies of a solvent to a
solute. First the solvent can be repeated N times, and subsequently the solute’s prms file can be merged together
with the solvent prms file.

**364** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**Divide a forcefield file: splitpdb**

When splitting a ORCAFF.prms file, also splitting of the pdb file is required. The file can be split into an arbitrary
number of individual files.

This can be useful together with the splitff command.

Input options:



**Merge PDB files: mergepdb**

If several PDB files are available and need to be merged for an ORCA calculation, e.g. a protein and a ligand or
multiple ligands, or a ligand that was first removed from a complex, then modified, and finally should get back into
the complex PDB file.

This can be useful together with the mergeff command.

Input options:




**Create simple force field: makeff**

The orca_mm tool can generate an approximate forcefield for a molecule, storing it in ORCAFF.prms format.
Here, the LJ coefficients are based on UFF parameters and the partial charges are based on a simple PBE or XTB
calculation. The resulting topology is certainly not as accurate as an original CHARMM topology, but can still be
used for an approximate handling of the molecule. Herewith, the molecule can be part of the QM region (having
at least the necessary LJ coefficients), or part of the MM region as a non-active spectator - being not too close to
the region of interest. In the latter case it is important that the molecule is not active, since bonded parameters
are not available. However, it can still be optimized as a rigid body, see sections *Geometry Optimizations using*
*the L-BFGS optimizer* and the usage in QM/MM calculations in section *Optimization with the Cartesian L-BFGS*
*Minimizer*, on MM level, optimizing its position and orientation with respect to the specific environment.

Input options:

**6.15. ORCA MM Module** **365**

**ORCA Manual** **,** **Release 6.0.1**



Note that ORCA generates bonds based on simple distance rules, which enables ORCA to detect where to add link
atoms between QM and MM atoms, see also section *QM-MM, QM-QM2 and QM2-MM Boundary* . But the user is
advised to treat a molecule, for which the ORCAFF.prms file was generated with the makeff option, either fully in
the QM, or fully in the MM region, unless the charge distribution has been properly taken care of (due to the need
of integer charges in QM and MM system).

**Get standard hydrogen bond lengths: getHDist**

For the definition of the link atoms standard bond lengths between C, N and O and hydrogen are directly set by
ORCA but can be modified by the user, see section *QM-MM, QM-QM2 and QM2-MM Boundary* . If other atom
types are on the QM side of the QM-MM boundary, their distance to the link atom has to be defined. In this case
a file can be provided to ORCA which defines the standard bond length to hydrogen for all possible atoms. Such a
file can be generated via the following command:

Input options:



This file can then be modified, the required values can be added, and the resulting file can be defined as input for
the QMMM calculation.

**Create ORCAFF.prms file for IONIC-CRYSTAL-QMMM**

For IONIC-CRYSTAL-QMMM calculations, section *IONIC-CRYSTAL-QMMM*, an ORCAFF.prms file with initial
charges and connectivities is required. If you are not using the orca_crystalprep tool for setting up such calculations,
see section *orca_crystalprep*, you can directly prepare the ORCAFF.prms file with the command:



(continues on next page)

**366** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

Here, na4cl4.xyz is the supercell structure file (it can contain tens of thousands of atoms).

**Note:**

  - For supercells with more complex oxidation states’, e.g. Co 3 O 4, the ORCAFF.prms file can be generated
conveniently via the orca_crystalprep tool, *orca_crystalprep* .

**6.15.2 Speeding Up Nonbonded Interaction Calculation**

For MM calculations of very large systems with hundreds of thousands of atoms, and for QMMM calculations with
fast QM methods (e.g. XTB, AM1) and / or very small QM systems, the computation of the nonbonded interactions
can become a bottleneck. Different schemes for speeding up the calculation of nonbonded interactions are available
within the ORCA MM implementation. Two schemes truncate long-range interaction, another scheme can be used
for calculations with active regions, i.e. calculations where only a part of the system is active or optimized. For more
information on active regions see section *Active and Non-Active Atoms - Optimization, Frequency Calculation,*
*Molecular Dynamics and Rigid MM Water* .

**Force Switching for LJ Interaction**

With force switching for the LJ interaction (described in reference [819]) a smooth switching function is used to
truncate the LJ potential energy smoothly at the outer cutoff distance LJCutOffOuter. If switching is set to false, the
LJ interaction is not truncated at LJCutOffOuter. The parameter LJCutOffInner specifies the distance at which the
switching function starts taking an effect to bring the van der Waals potential to 0 smoothly at the LJCutOffOuter
distance, ensuring that the force goes down to zero at LJCutOffOuter, without introducing discontinuities. Note
that LJCutOffInner must always be smaller than LJCutOffOuter.



**Force Shifting for Electrostatic Interaction**

With force shifting for the electrostatic interaction (described in reference [819]) the electrostatic potential is shifted
to zero at the cutoff distance CoulombCutOff. If shifting is set to false, the electrostatic interaction is not truncated
at CoulombCutOff.



**6.15. ORCA MM Module** **367**

**ORCA Manual** **,** **Release 6.0.1**

**Neglecting Nonbonded Interactions Within Non-Active Region**

When using active regions (see section *Active and Non-Active Atoms - Optimization, Frequency Calculation,*
*Molecular Dynamics and Rigid MM Water* ) for optimizations and MD runs, the nonbonded interactions at the
MM level can be neglected for those atom pairs, which are both non-active, without loss of accuracy for the results. Even relative energies between two structures are correct, if the atom positions of the non-active atoms are
identical. For all other cases, i.e. if the positions of atoms in the non-active region differ, the full nonbonded
interaction should be computed in the final single-point energy calculation. By default this option is switched off.



**6.15.3 Rigid Water**

As TIP3P water might have to be treated as rigid bodies due to its parametrization - please check out the specifics
of the applied force field parametrization - we offer a keyword for the automated rigid treatment of all active MM
waters. The following keyword applies bond and angle constraints to active MM waters in optimization as well as
MD runs:



**6.15.4 Available Keywords for the MM module**

Here we list all keywords that are accessible from within the mm block and that are relevant to MM, but also
QM/MM calculations. Some of the MM keywords can also be accessed via the qmmm block, see section *Additional*
*Keywords* .



(continues on next page)

**368** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)


### **6.16 ORCA Multiscale Implementation**

With ORCA 5.0 ORCA ‘s multiscale functionality has been extensively expanded. ORCA 5 features five different
multiscale methods for

  - proteins, DNA, large molecules, explicit solvation:

**–** additive **QMMM** ( *Additive QMMM* )

**–** subtractive **QM1/QM2** methods (2-layered ONIOM) ( *Subtractive QM/QM2 Method* )

**– QM1/QM2/MM** methods (3-layered ONIOM) ( *QM/QM2/MM Method* )

   - **CRYSTAL-QMMM** for crystals:

**– MOL-CRYSTAL-QMMM** for molecular crystals ( *MOL-CRYSTAL-QMMM* )

**– IONIC-CRYSTAL-QMMM** for semiconductors and insulators ( *IONIC-CRYSTAL-QMMM* )

The multiscale features are optimally connected to all other modules and tools available in ORCA allowing the
user to handle multiscale calculations from a QM-centric perspective in a simple and efficient way, with a focus on
simplifying the process to prepare, set up and run multiscale calculations.

From the input side all methods share a common set of concepts and keywords, which will be outlined in the first
part of this chapter. In the subsequent parts of this chapter, the different methods are described and further input
options are discussed.

**6.16. ORCA Multiscale Implementation** **369**

**ORCA Manual** **,** **Release 6.0.1**

**6.16.1 General Settings and Input Structure**

Some of the keywords in this section are common to all five multiscale features, and some are not. If keywords are
not available for one of the multiscale features, this will be mentioned.

**Overview on Combining Multiscale Features with other ORCA Features**

The multiscale features can be used together with all other possible ORCA methods:

**Single Point Calculations**

Use all kinds of available electronic structure methods as QM method.

**Optimization**

Use all kinds of geometry optimizations with all kinds of constraints, TS optimization, relaxed surface scans,
and the ScanTS feature. Use the L-Opt and L-OptH features including the combination of all kinds of
fragment optimizations (fix fragments, relax fragments, relax only specific elements in fragments, treat a
fragment as a rigid body).

**Transition States and Minimum Energy Paths**

Use all kinds of Nudged-Elastic Band calculations (Fast-NEB-TS, NEB, NEB-CI, NEB-TS, including their
ZOOM variants) and Intrinsic Reaction Coordinate calculations. (not implemented for MOL-CRYSTALQMMM and IONIC-CRYSTAL-QMMM)

**Frequency Calculations**

Use regular frequency calculations. If required, ORCA automatically switches on the Partial Hessian Vibrational Analysis (PHVA) calculation. (not tested for IONIC-CRYSTAL-QMMM)

**Molecular Dynamics**

Use the Molecular Dynamics (MD) module for Born-Oppenheimer MD (BOMD) with QM/MM in combination with all kinds of electronic structure methods. (not implemented for MOL-CRYSTAL-QMMM and
IONIC-CRYSTAL-QMMM)

**Property Calculation**

All kinds of regular property calculations are available. For electrostatic embedding the electron density is
automatically perturbed by the surrounding point charges.

**Excited State Calculations**

Use all kinds of excited state calculations (TD-DFT, EOM, single point calculations, optimizations, frequencies). (For the ONIOM calculations the low-level calculations are carried out in the ground state)

**Overview on Basic Aspects of the Multiscale Feature**

In the following, the basic concepts are introduced.

**QM atoms**

The user can define the QM region either directly, or via flags in a pdb file. See *QM Atoms* .

**QM2 atoms**

Only applicable for QM/QM2/MM. For the QM/QM2/MM method the low level QM region (QM2) is defined
via the input or via flags in a pdb file. See *QM2 Atoms* . For QM/QM2 the low level region consists of all
atoms but the QM atoms.

**Active atoms**

The user can choose an active region, e.g. for geometry optimizations the atoms that are optimized, for a
frequency calculation the atoms that are allowed to vibrate for the PHVA, or for an MD run the atoms that are
propagated. See *Active and Non-Active Atoms - Optimization, Frequency Calculation, Molecular Dynamics*
*and Rigid MM Water* and Fig. 6.57.

**Forcefield**

ORCA has its own forcefield file format (stored in files called basename.ORCAFF.prms). For a convenient
setup the orca_mm module offers the option to convert from other forcefield formats. Currently, the following
formats can be converted to the ORCA forcefield file format:

**370** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**CHARMM psf files**

protein structure file from the CHARMM forcefield. The psf files can be easily prepared with the
[popular molecular visualizer VMD, together with its extensions (psfgen, QwikMD, fftk, which works](https://www.ks.uiuc.edu/Research/vmd/)
together with ORCA ).

**AMBER prmtop files**

topology files from the AMBER force field. Tutorials on how to generate AMBER prmtop files (for
[standard and non-standard molecules) can be found here.](https://ambermd.org/tutorials/)

**Open Force Field**

[xml files from the openforcefield initiative. With the openff-toolkit xml topology files (compatible with](http://openforcefield.org/)
the AMBER force field) can be easily generated for small and medium-sized non-standard molecules.
[For a tutorial see here.](https://github.com/openforcefield/openff-toolkit/blob/master/examples/using_smirnoff_with_amber_protein_forcefield/BRD4_inhibitor_benchmark.ipynb)

**Simple forcefield for small to medium-sized molecules**

Alternatively, the orca_mm module can generate a simple approximate ORCAFF.prms file. For more
options, see *ORCA Forcefield File* .

This concept has the following advantages:

**Modification of forcefield parameters**

Atom and bond specific parameters can be easily modified within the ORCA forcefield file, allowing the
user maximum flexibility in modifying the forcefield, which might be particularly useful for chemical
systems like transition metal complexes. See *ORCA Forcefield File* .

**Standard and Non-Standard Ligands**

Ligands can be easily and flexibly exchanged or added to the system, see *ORCA Forcefield File* .

**Boundary Treatment**

ORCA automatically detects QM-MM boundaries, i.e. bonds that have to be cut between QM and MM
region. ORCA automatically generates the link atoms and keeps them at their relative position throughout
the run, even allowing to optimize the bond along the boundary. See *QM-MM, QM-QM2 and QM2-MM*
*Boundary* . Not applicable for CRYSTAL-QMMM.

**Treatment of overpolarization**

ORCA automatically adapts the charges at the QM-MM boundary. See *QM-MM, QM-QM2 and QM2-MM*
*Boundary* . Not applicable for both CRYSTAL-QMMM.

**Embedding types**

The electrostatic and mechanical embedding schemes are available. See *Embedding Types* .

Detailed information on the different available input and runtime options and additionally available keywords (see
*Additional Keywords* ) are given below.

**QM Atoms**

QM atoms can be defined either directly



or via the occupancy column of a pdb file.



If `Use_QM_InfoFromPDB` is set to true, a pdb file should be used for the structural input. QM atoms are defined via
1 in the occupancy column, MM atoms via 0. QM2 atoms (for QM/QM2/MM calculations, see *QM2 Atoms* ) can

**6.16. ORCA Multiscale Implementation** **371**

**ORCA Manual** **,** **Release 6.0.1**

be defined via 2 in the occupancy column. In this case `Use_QM2_InfoFromPDB` must be set to true. The IONICCRYSTAL-QMMM method can have even further entries in the PDB file, see *Different QM and MM regions Stored*
*in the PDB file* . Note that the `Use_QM_InfoFromPDB` keyword needs to be written before the coordinate section.



Note that contrary to the hybrid36 standard of PDB files, ORCA writes non-standard pdb files as:

  - atoms 1-99,999 in decimal numbers

  - atoms 100,000 and beyond in hexadecimal numbers, with atom 100,000 corresponding to index 186a0.

This ensures a unique mapping of indices. If you want to select an atom with an idex in hexadecimal space (index
larger than 100,000), convert the hexadecimal number into decimals when choosing this index in the ORCA input
file. Note also, that in the pdb file, counting starts from 1, while in ORCA counting starts from zero.

**Active and Non-Active Atoms - Optimization, Frequency Calculation, Molecular Dynamics and**
**Rigid MM Water**

The systems of multiscale calculations can become quite large with tens and hundreds of thousands of atoms. In
multiscale calculations the region of interest is often only a particular part of the system, and it is common practice
to restrict the optimization to a small part of the system, which we call the active part of the system. Usually this
active part consists of hundreds of atoms, and is defined as the QM region plus a layer around the QM region. The
same definition holds for frequency calculations, in particular since after optimization non-active atoms are not
at stationary points, and a frequency calculation would lead to artifacts in such a scenario. MD calculations on
systems with hundreds of thousands of atoms are not problematic, but there are applications where a separation in
active and non-active parts can be important (e.g. a solute in a solvent droplet, with the outer shell of the solvent
frozen).

**Note:**

  - If no active atoms are defined, the entire system is treated as active.

  - The active region definitions also apply to MM calculations, but have to be provided via the qmmm block.

**372** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**Input Format**

Active atoms can be defined either directly or via the B-factor column of a pdb file.



If `Use_Active_InfoFromPDB` is set to true, a pdb file should be used for the structural input. Active atoms are
defined via 1 in the B-factor column, non-active atoms via 0. Note that the `Use_Active_InfoFromPDB` keyword
needs to be written before the coordinate section.



Note that in the above example also the QM atoms are defined along with the active atoms.

**Optimization in redundant internal coordinates**

In ORCA’s QM/MM geometry optimization only the positions of the active atoms are optimized. The forces on
these active atoms are nevertheless influenced by the interactions with the non-active surrounding atoms. In order
to get a smooth optimization convergence for quasi-Newton optimization algorithms in internal coordinates, it
is necessary that the Hessian values between the active atoms and the directly surrounding non-active atoms are
available. For that reason the active atoms are extended by a shell of surrounding non-active atoms which are also
included in the geometry optimization, but whose positions are constrained, see Fig. 6.57. This shell of atoms can
be automatically chosen by ORCA. There are three options available:

**Distance**

(Default) The parameter `Dist_AtomsAroundOpt` controls which non-active atoms are included in the extension shell, i.e. non-active atoms that have a distance of less than the sum of their VDW radii plus
`Dist_AtomsAroundOpt` are included.

**Covalent bonds**

All (non-active) atoms that are covalently bonded to active atoms are included.

**No**

No non-active atoms are included.

The user can also provide the atoms for the extension shell manually. This will be discussed in section *Frequency*
*Calculation* .

**6.16. ORCA Multiscale Implementation** **373**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.57: Active and non-active atoms. Additionally shown is the extension shell, which consists of non-active
atoms close in distance to the active atoms. The extension shell is used for optimization in internal coordinates and
PHVA.

The set of active atoms is called the ‘activeRegion’, and the set of active atoms plus the surrounding non-active
atoms is called ‘activeRegionExt’. During geometry optimization the following trajectories are stored (which can
be switched off):

**basename_trj.xyz**

Entire QM/MM system

**basename.QMonly_trj.xyz**

Only QM region

**basename.activeRegion_trj.xyz**

Only active atoms

**basename.activeRegionExt_trj.xyz**

Active atoms plus extension

The following files are stored containing the optimized structures - if requested:

**basename.pdb**

Optimized QM/MM system in pdb file format

**basename.xyz**

Optimized QM/MM system

**basename.QMonly.xyz**

Only QM region

**basename.activeRegion.xyz**

Only active atoms

**basename.activeRegionExt.xyz**

Active atoms plus extension

**Optimization with the Cartesian L-BFGS Minimizer**

For very large active regions the quasi-Newton optimization in internal coordinates can become costly and it can be
advantageous to use the L-Opt or L-OptH feature, see section *Geometry Optimizations using the L-BFGS optimizer* .
For the L-Opt(H) feature there exist two ways to define the active region:

  - via the ActiveAtoms keyword (or the Use_Active_InfoFromPDB flag) or

  - via fragment definition and the different keywords for fragment optimization. Available options are:

**FixFrags**

Freeze the coordinates of all atoms of the specified fragments.

**RelaxHFrags**

Relax the hydrogen atoms of the specified fragments. Default for all atoms if !L-OptH is defined.

**374** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**RelaxFrags**

Relax all atoms of the specified fragments. Default for all atoms if !L-Opt is defined.

**RigidFrags**

Treat each specified fragment as a rigid body, but relax the position and orientation of these rigid bodies.

**Note:**

  - The L-Opt(H) option together with the fragment optimization can be used in order to quickly preoptimize
your system at MM level. E.g. you can optimize the hydrogen positions of the protein and water molecules,
and at the same time relax non-standard molecules, for which no exact bonded parameters are available, as
rigid bodies.



**Frequency Calculation**

If all atoms are active, a regular frequency calculation is carried out when requesting !NumFreq. If there are also
non-active atoms in the QM/MM system, the Partial Hessian Vibrational Analysis (PHVA, see section *Partial*
*Hessian Vibrational Analysis* ) is automatically selected. Here, the PHVA is carried out for the above defined
activeRegionExt, where the extension shell atoms are automatically used as ‘frozen’ atoms. Note that the analytic
Hessian is not available due to the missing analytic second derivatives for the MM calculation. Note that in a new
calculation after an optimization it might happen that the new automatically generated extended active region is
different compared to the previous region before optimization. This means that when using a previously computed
Hessian (e.g. at the end of an optimization or a NEB-TS run) the Hessian does not fit to the new extended active
region. ORCA tries to solve this problem by fetching the information on the extended region from the hess file. If
that does not work (e.g. if you distort the geometry after the Hessian calculation) you should manually provide the
list of atoms of the extended active region. This is done via the following keyword:



Note that ORCA did print the necessary information in the output of the calculation in which the Hessian was
computed:
```
Fixed atoms used in optimizer ... 27 1288 1289 1290 4400

```
**6.16. ORCA Multiscale Implementation** **375**

**ORCA Manual** **,** **Release 6.0.1**

**Nudged Elastic Band Calculations**

NEB calculations (section *Nudged Elastic Band Method* ) can be carried out in combination with the multiscale
features in order to e.g. study enzyme catalysis. When automatically building the extension shell at the start of a
Multiscale-NEB calculation, not only the coordinates of the main input structure (‘reactant’), but also the atomic
coordinates of the ‘product’ and, if available, of the ‘transition state guess’ are used to determine the union of
the extension shell of the active region. For large systems it is advised to use the active region feature for the
NEB calculation. Note that the atomic positions of the non-active atoms of reactant and product and, if available,
transition state guess, should be identical.

**Molecular Dynamics**

If there are active and non-active atoms in the multiscale system, only the active atoms are allowed to propagate in
the MD run. If all atoms are active, all atoms are propagated. For more information on the output and trajectory
options, see section *Regions* .

**Rigid MM Water**

As TIP3P water might have to be treated as rigid bodies due to its parametrization - please check out the specifics
of the applied force field parametrization - we offer a keyword for the automated rigid treatment of all active MM
water molecules. The following keyword applies bond and angle constraints to active MM water molecules in
optimizations as well as MD runs:
```
Rigid_MM_Water false # Default: false.

```
**Forcefield Input**

For the MM part of the QM/MM calculation forcefield parameters are necessary. Internally, ORCA uses the
ORCA forcefield. For a description on the format, how to obtain and manipulate the forcefield parameters, see
section *ORCA Forcefield File* .

**Note:**

  - ORCAFF.prms files only need to be provided for QM/MM, QM/QM2/MM and IONIC-CRYSTAL-QMMM
calculations.

  - For QM/QM2 and MOL-CRYSTAL-QMMM calculations there is no need to provide a ORCAFF.prms file.

  - The ORCAFF.prms file for the IONIC-CRYSTAL-QMMM calculation can be conveniently set up with the
orca_crystalprep tool, see section *orca_crystalprep* .

  - For IONIC-CRYSTAL-QMMM and MOL-CRYSTAL-QMMM calculations the self-consistently optimized
MM point charges of the entire supercell are stored in an ORCAFF.prms file, see section *Charge Convergence*
*between QM and MM region* . This ORCAFF.prms file can then be used in subsequent calculations with larger
QM regions, different methods and basis sets, excited state calculations, etc.

The force field filename is provided via the keyword `ORCAFFFilename` :



**376** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**QM-MM, QM-QM2 and QM2-MM Boundary**

This section is important for the QM/MM, QM/QM2 and QM/QM2/MM methods. For the latter method two
boundary regions are present (between QM and QM2 as well as between QM2 and MM region), and both can go
through covalent bonds. In the following we will only discuss the concept for the boundary between QM and MM,
but the same holds true for the other two boundaries.

**Link Atoms**

ORCA automatically generates link atoms based on the information of the QM region and on the topology of the
system (based on the ORCAFF.prms file). ORCA places link atoms on the bond between QM and MM atoms.

**Important:**

  - When defining the QM, QM2 and MM regions, make sure that you only cut through single bonds (not
aromatic, double, triple bonds, etc.).

**Bond Length Scaling factor**

The distance between QM atom and link atom is determined via a scaling factor (in relation to the QM-MM bond
length) that is computed as the ratio of the equilibrium bond length between QM and hydrogen atom (d0_QM-H)
and the equilibrium bond length between QM and MM atom (d0_QM-MM).

**Standard QM-H Bond Length**

For the equilibrium bond lengths to hydrogen, ORCA uses tabulated standard values for the most common atoms
involved in boundary regions (C, N, O), which can be modified via keywords as defined further below. ORCA
stores these values on-the-fly in a simple file (basename.H_DIST.prms). If necessary, the user can modify these
values atom-specific or add others to the file and provide this file as input to ORCA (see also paragraph *Get standard*
*hydrogen bond lengths: getHDist* ). For QM/QM2 and QM/QM2/MM methods the equilibrium bond lengths to
hydrogen are explicitly calculated.

**Bonded Interactions at the QM-MM Boundary**

The MM bonded interactions within the QM region are neglected in the additive coupling scheme. However, at
the boundary, it is advisable to use some specific bonded interactions which include QM atoms. By default ORCA
neglects only those bonded interactions at the boundary, where only one MM atom is involved, i.e. all bonds of
the type QM1-MM1, bends of the type QM2-QM1-MM1, and torsions of the type QM3-QM2-QM1-MM1. Other
QM-MM mixed bonded interactions (with more than two MM atoms involved) are included. The user is allowed
to include the described interactions, which is controlled via the following keywords:



(continues on next page)

**6.16. ORCA Multiscale Implementation** **377**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

**Charge Alteration**

If QM and MM atoms are connected via a bond (defined in the topology file), the charge of the close-by MM atom
(and its neighboring atoms) has to be modified in order to prevent overpolarization of the electron density of LA
and QM region. This charge alteration is automatically taken care of by ORCA. ORCA provides the most popular
schemes that can be used to prevent overpolarization:

**CS**

Charge Shift - Shift the charge of the MM atom away to the MM2 atoms so that the overall charge is conserved

**RCD**

Redistributed Charge and Dipole - Shift the charge of the MM atom so that the overall charge and dipole is
conserved

**Z0**

Keep charges as they are. This MM atom will probably lead to overpolarization

**Z1**

Delete the charge on the MM1 atom (no overall charge conservation)

**Z2**

Delete the charges on the MM1 atom and on its first (MM2) neighbors (no overall charge conservation)

**Z3**

Delete the charges on the MM1 atom and on its first (MM2) and second (MM3) neighbors (no overall charge
conservation)

**Embedding Types**

The following embeding schemes are available:

**Electrostatic**

The electrostatic interaction between QM and MM system is computed at the QM level. Thus, the charge
distribution of the MM atoms can polarize the electron density of the QM region. The LJ interaction between
QM and MM system is computed at the MM level.



In the scheme of electrostatic embedding, the evaluation of the electrostatic potential generated by the MM part
can be accelerated by using the FMM algorithm (described in reference [317]). This will speed up the building of
the Fock Matrix. The default recommended setup can be called using the FMM-QMMM keyword directly in the
keywords line. However, more details about the algorithm parameters and all input options can be found in (see
also paragraph *Fast Multipole Method* )
```
! FMM-QMMM

```
It is recommended to use that option whenever the MM part is composed of more than 10,000 atoms (or point
charges for ECM methods).

**378** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**6.16.2 Additive QMMM**

The minimum input necessary for an additive QM/MM calculation looks as follows.



**6.16.3 ONIOM Methods**

For the simulation of large systems with up to 10000 atoms, or for large QM regions in biomolecules, ORCA
provides the QM/QM2 and QM/QM2/MM methods. The specifics of the two different methods are discussed
further below. Here we are presenting the common concepts and keywords of both methods. For subtractive
methods, we use a high level (QM) and a low level (QM2) of accuracy for different parts of the system. The
advantages of this - in contrary to QM-MM methods - are as follows:

  - QM2 methods are polarizable, the interaction with the high level region is more accurate.

  - No MM parameters are needed for the atoms that are described at the QM2 level.

**Available QM2 Methods**

ORCA has several built in QM2 methods:

  - Semiempirical methods (AM1, PM3)

  - Tight-binding DFT (XTB0, XTB1, XTB (or XTB2))

  - Composite methods (HF-3c, PBEh-3c, r2SCAN-3c)

  - User-defined QM2 methods

The individual keywords for these methods are:



Users can define their own low-level methods in the following way



Alternatively, a custom QM2 method / basis set file can be provided:



The custom QM2 method file can contain any desired input, as e.g. the file myQM2Method.txt:

**6.16. ORCA Multiscale Implementation** **379**

**ORCA Manual** **,** **Release 6.0.1**



**Note:**

  - Only add methods (including convergence settings) and basis sets for the QM2Custom options. Everything
else (parallelization, memory, solvation, etc.) is taken care of by ORCA itself.

**Electrostatic Interaction between high and low level**

By default we are using electrostatic embedding, i.e. the high level system sees the atomic point charges of the
low level (QM2) system. These point charges are derived from the full system low level (QM2) calculation. The
following methods for determining these charges are available:



The QM2 point charges can be scaled with the following keyword.



**Boundary Region**

The boundary between high and low level part of the system can contain covalent bonds. For the detection and
realistic treatment of these covalent bonds, a topology of the large QM2 system is generated using the following
keyword.



**Note:**

  - By default ORCA uses the XTB method for the preparation of the QM2 topology. In order to use the default
you need to make sure to have the otool_xtb binary in your ORCA PATH, see *Semi-empirical tight-binding*
*methods: Grimme’s GFN0-xTB, GFN-xTB and GFN2-xTB* .

**380** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**Subtractive QM/QM2 Method**

The QM/QM2 method is a very convenient way of running multiscale calculations without the need to prepare any
parameters. This method is a subtractive QM-QM method, in which we treat a part of interest on a higher level of
accuracy, and the remainder of the system on lower level of accuracy. The implementation follows similar works
as e.g. described in reference [572].

The method can be used in a similar way as a regular QM calculation. Let us have a look at the proton transfer in
propionic acid, which can be modeled as follows:



with the product structure file (propionicAcid_prod.xyz):



As can be seen from the input, the only difference to a regular calculation is the necessity to define the high level
region via the QMAtoms keyword.

**6.16. ORCA Multiscale Implementation** **381**

**ORCA Manual** **,** **Release 6.0.1**

**System charges and multiplicities**

The two subsystems can have different (integer) charges and multiplicities. Defining the correct charges and multiplicities is important. The charge and multiplicity defined via the coordinate section defines the charge and
multiplicity of the high level region (QMAtoms). The user still needs to define the charge and multiplicity of the
total system (corresponding to the sum of the charge of the high level and low level parts, and corresponding to the
overall multiplicity).



**Available low level methods**

The following QM2 (low level) methods are available:



For information on how to specify the custom QM/QM2 method please see *Available QM2 Methods* .

**Solvation**

Implicit Solvation effects can be included in QM/QM2 calculations. On the one hand, for QM/XTB calculations,
one can adopt the analytical linearized Poisson-Boltzmann (ALPB) solvation model, the domain decomposition
COSMO (ddCOSMO), or the extended conductor-like polarizable continuum model (CPCM-X), and on the other
hand, if no XTB is requested, ORCA uses the C-PCM. The user just needs to add the following tags in the ORCA
input file,

XTB for the QM2 region:



No XTB for the QM2 region:
```
!QM/HF-3c CPCM(Water)

```
If the ddCOSMO (XTB) or the C-PCM (non-XTB) are requested, there are two possible ONIOM/implicit-solvation
methods:[875]

**382** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

   - **C-PCM/B:** The effect of the solvent is, in the first place, included in the calculation for the large QM2 system.
Once this calculation finishes, the solvation charges located on the surface of the cavity for the large system
are used as point charges for the subsequent low-level and high-level calculations for the small system.

   - **C-PCM/C:** The effect of the solvent is only included in the calculation for the large QM2 system.

The user can choose one scheme or the other via the tag “ `solv_scheme` ” in the “ `qmmm` ” block:



If the ALPB model or the CPCM-X are requested (within QM/XTB methods), the solvation effect is just included
in the calculation for the large QM2 system (as one does for the C-PCM/C scheme).

**QM/QM2/MM Method**

The QM/QM2/MM method uses a combination of the subtractive scheme for the QM-QM2 part, and the additive scheme for the (QM-QM2) - (MM) interaction. It can be used if very large QM regions are required for
biomolecules and explicitly solvated systems. The system is divided into a high level (QM), low level (QM2), and
MM region (MM).

**QM2 Atoms**

QM2 atoms need to be defined for QM/QM2/MM calculations. They can be defined either directly



or via the occupancy column of a pdb file (see *QM Atoms* ).

**System charges and multiplicities**

The high and low level subsystems can have different (integer) charges and multiplicities. Defining the correct
charges and multiplicities is important. The charge and multiplicity defined via the coordinate section defines
the charge and multiplicity of the high level region (QMAtoms). The user still needs to define the charge and
multiplicity of the medium system (corresponding to the sum of the charge of the high level and low level regions,
and corresponding to the overall multiplicity of the combined high and low level region). The charge of the MM
region is determined based on the MM parameters provided by the forcefield.



**6.16. ORCA Multiscale Implementation** **383**

**ORCA Manual** **,** **Release 6.0.1**

**Available low level methods**

The following QM2 (low level) methods are available:



For information on how to specify the custom QM/QM2/MM method please see *Available QM2 Methods* .

**Example Input**

An example for a QM/QM2/MM calculation looks as follows:



**6.16.4 CRYSTAL-QMMM**

For the simulation of extended systems ORCA provides the CRYSTAL-QMMM features:

**MOL-CRYSTAL-QMMM**

for molecular crystals.

**IONIC-CRYSTAL-QMMM**

for semiconductors and insulators.

In this section we present the concepts and keywords that are common to both methods. ORCA is a molecular code
and cannot carry out periodic calculations, but ORCA has been used for modeling selected properties for ionic
solids using embedded cluster models already in the past (see e.g reference [213]). With ORCA 5 we provide the
CRYSTAL-QMMM method, which simplifies setting up and running these types of embedded cluster calculations.
The user needs to provide the structure with a (large enough) supercell representative for the crystal, and provide
a list of QM atoms. The QM region should be located in the central part of the supercell. The QM atoms are
embedded in the remainder of the supercell, the surrounding MM atoms, which are represented by atom-centered
point charges and influence the QM calculations. How these charges are obtained, is outlined in the next paragraph.

**384** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**Charge Convergence between QM and MM region**

The core idea of the CRYSTAL-QMMM method is to reach charge convergence between the QM and the MM
atoms. For this purpose, the MM charges are updated self-consistently with the atomic (CHELPG) charges of the
QM atoms. This idea follows the work of reference [213] for the IONIC-CRYSTAL-QMMM and of reference

[109] for the MOL-CRYSTAL-QMMM.



During optimizations, the charge convergence scheme can be used (i) only at the very beginning, (ii) every N
geometry steps, or (iii) for each geometry step, using the following keyword:



After charge convergence, the converged charges are stored in the file basename.convCharges.ORCAFF.prms. It
can be used for a later calculation (with the same or different electronic structure settings) with the following
keyword combination:



**MM-MM Interaction**

Unlike with the other multiscale methods (QMMM, QM/QM2, QM/QM2/MM) the MM region is only treated as a
perturbation to the QM region. The (bonded and nonbonded) MM-MM interaction is not computed - since it would
not affect the QM-MM interaction - and thus the active region (optimizations, frequencies, ...) in CRYSTALQMMM calculations should be restricted to atoms of the QM region.

**6.16. ORCA Multiscale Implementation** **385**

**ORCA Manual** **,** **Release 6.0.1**

**Preparing CRYSTAL-QMMM Calculations**

The input structures and input files for the CRYSTAL-QMMM calculations can be prepared with the
orca_crystalprep module (see section *orca_crystalprep* ).

**MOL-CRYSTAL-QMMM**

Conceptually we use an additive QM/MM calculation, in which the QM region interacts with the MM region only
via nonbonded interactions. Lennard-Jones interaction between QM and MM region is computed using van der
Waals parameters from the UFF force field. The charge convergence treatment between QM and MM region starts
with zero charges on the MM atoms, and is iterated until convergence of the QM atomic (CHELPG) and MM point
charges is achieved.

The MOL-CRYSTAL-QMMM method expects as structural input a supercell that consists of repeating, identical
molecular subunits, i.e. the atom ordering of the molecules should always be the same, and one molecular subunit
should follow the next one. The minimum input necessary for a MOL-CRYSTAL-QMMM run looks as follows.



**Note:**

  - For molecular crystals it is assumed that the entire supercell consists of repeating units which each have zero
charge. QM regions should consist of one or multiple of such charge-neutral units.

**Extending the QM Region**

ORCA can extend the QM region (which we call QM core region, defined by the original QMAtoms input) by
one or multiple layers of molecular subunits using the `HFLayers` keyword. If the `HFLayers` keyword is used, the
molecular subunits of the defined number of layers around the QM core region is added to the QM region. The
layers of molecular subunits around the QM core region are detected via distance criteria.



The HFLayer can be seen as a buffer region between the molecular subunit of interest (original QM atoms) and the
surrounding subunits. The different possible reasons for HFLayers are as follows:

  - For DLPNO calculations with HFLayers, the DLPNO multilevel feature is automatically switched on. The
molecules of the HFlayer form an own fragment which is treated on HF level only, i.e. these molecules are
not included in the Post-HF treatment.

  - The HFLayers can also be used for non-DLPNO calculations. In such cases, the HFLayer molecules are in
the same way included in the QM calculation as the other QM molecules. But their definition is a convenient
way to choose a different basis set (and ECPs) for those molecules.

  - It can be assumed that the QM charges computed for the QM core region are more realistic than the charges
of the HFLayer atoms near the MM atomic charges. Thus, using only the QM atomic charges of the QM
core region represent more realistic charges for the charge convergence scheme.

**386** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**Note:**

  - The term HFLayers might be misleading. Strictly speaking, only for MOL-CRYSTAL-QMMM calculations
with DLPNO methods (e.g. DLPNO-CCSD(T), DLPNO-MP2, DLPNO-B2PLYP) the HF layer atoms are
treated on HF level. For other methods (e.g. DFT) the HF layer atoms are treated with the same electronic
structure method as the QM core region atoms.

  - If necessary, the atoms of the HFLayer can be defined by the user. Make sure that complete molecular
subunits are used here.



**Example Input**

An example for a MOL-CRYSTAL-QMMM calculation looks as follows:



**IONIC-CRYSTAL-QMMM**

Conceptually we use an embedded cluster calculation, in which the QM region interacts only with the MM atomic
point charges of the surrounding. Unlike with MOL-CRYSTAL-QMMM, the Lennard-Jones interaction between
QM and MM region is not computed. The charge convergence treatment between QM and MM region starts with
the initial MM charges (the charges initially read from the ORCAFF.prms file) and is iterated until convergence of
the QM atomic (CHELPG) and MM point charges is achieved.

**Boundary Region**

For ionic crystals a boundary region needs to be introduced between the QM region and the atomic point charges
of the MM atoms in order to avoid spurious electron leakage from the clusters and to treat dangling bonds on
the surface of the QM region. This boundary region consists of capped effective core potentials (cECPs). These
cECPs are placed on the position of the MM atoms that are directly adjacent to the QM region. ORCA analyzes
the connectivity of the atoms of the supercell and can thus detect the layers of atoms around the QM region, where
the first layer consists of the atoms directly bonded to the QM atoms, the second layer consists of the atoms directly
bonded to the atoms of the first layer and so on. The charges of these cECPs are determined in the same way as the
MM atomic charges during the charge convergence scheme.



**6.16. ORCA Multiscale Implementation** **387**

**ORCA Manual** **,** **Release 6.0.1**

**Extending the QM Region**

ORCA can extend the QM region (which we call QM core region, defined by the original QMAtoms input) by
one or multiple layers of atoms using the `HFLayers` keyword. If the `HFLayers` keyword is used, the atoms of the
defined number of layers around the QM core region is added to the QM region. The layers of atoms around the
QM core region are detected in the same way as defined above for the ECPLayers.



The HFLayer can be seen as a buffer region between the actual atoms of interest (original QM atoms) and the
surrounding cECP and MM point charge environment.The different possible reasons for HFLayers are as follows:

  - For DLPNO calculations with HFLayers, the DLPNO multilevel feature is automatically switched on. The
atoms of the HFLayer form an own fragment which is treated at HF level only, i.e. these atoms are not
included in the Post-HF treatment.

  - It can be assumed that the QM charges computed for the QM core region are more realistic than the charges
of the HFLayer atoms near the cECPs and MM atomic charges, in particular for highly charged systems.
Thus, using only the QM atomic charges of the QM core region represent more realistic charges for the
charge convergence scheme.

**Note:**

  - The term HFLayers might be misleading. Strictly speaking, only for IONIC-CRYSTAL-QMMM calculations with DLPNO methods (e.g. DLPNO-CCSD(T), DLPNO-MP2, DLPNO-B2PLYP) the HF layer atoms
are treated on HF level. For other methods (e.g. DFT) the HF layer atoms are treated with the same electronic
structure method as the QM core region atoms.

  - If necessary, the atoms of the HFLayer can be defined by the user:




- The charge of the HFLayer is automatically computed based on the formal charges of its atoms. If necessary,
the HFLayer charge can be provided by the user.



**Net Charge of the Entire Supercell**

For ionic crystals, the QM region (as well as the entire supercell) can consist of an unequal number of atoms of
each atom type. As a result of that, the QM region may have non-zero net charge. Consequently, when assigning
the atomic point charges to the MM atoms during the charge convergence scheme, the sum of the charge of the
QM region, of the ECP layer, and of the atomic charges of the MM atoms, can deviate from the ideal charge of the
supercell. In order to enforce the ideal charge of the supercell, the total charge of the entire system is enforced by
equally shifting the charges of all MM (including boundary) atoms.

**388** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**



The charge shifting procedure can be restricted to the MM atoms on the outer parts of the supercell by defining the number of OuterPCLayers. If `OuterPCLayers` is set to 1, only the atoms of the most outer layer of the
supercell (recognized based on the connectivity of the atoms) are included in the charge shifting procedure. If
`OuterPCLayers` is larger than 2, the atoms connected to the most outer layer are additionally included in the
charge shifting procedure, etc.



**Note:**

  - The charge of the QM core region can be chosen to be assigned automatically. This overwrites the charge
provided in the xyz or pdb section.



**Example Input**

A minimal example for an IONIC-CRYSTAL-QMMM calculation looks as follows:



**Different QM and MM regions Stored in the PDB file**

The stored PDB file contains the following entries in its occupancy column.

**0**

MM atoms mimicked by surrounding point charges.

**1**

QM core region atoms

**2**

HFLayer atoms

**3**

cECPs

**4**

OuterPCLayer atoms (subset of MM atoms) if defined, are the only atoms that are used in the charge shift
procedure for enforcing the total charge.

**6.16. ORCA Multiscale Implementation** **389**

**ORCA Manual** **,** **Release 6.0.1**

**6.16.5 Additional Keywords**

Here we list additional keywords and options that are accessible from within the `%qmmm` block and that are relevant
to QM/MM calculations. Some of these keywords can also be accessed via the `%mm` block, see section *Available*
*Keywords for the MM module* .



**390** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**
### **6.17 QM/MM via Interfaces to ORCA**

ORCA is easy to interface as a QM engine in pretty much any QM/MM environment, as it will accept a set of point
charges from an external file (see section *Inclusion of Point Charges* ) and it will return, in a transparent format,
all the required information for computing energies and gradients to the driving program. In our research group
we have experience with four different QM/MM environments: ChemShell, Gromacs, pDynamo and NAMD. In
the following each of the interfaces are described. Is beyond the scope of the manual to be exhaustive, and only
minimal working examples are going to be presented. These will cover mainly the technical aspects with respect
to the QM part of the QM/MM calculation. For the initial preparation of the system the user is referred to the
documentation of the driving program.

**6.17.1 ORCA and Gromacs**

In cooperation with the developers of Gromacs software package we developed an interface to ORCA. The interface
is available starting with Gromacs version 4.0.4 up to version 4.5.5.

As mentioned above, the initial setup has to be done with the Gromacs. In the QM/MM calculation Gromacs will
call ORCA to get the energy and the gradients of the QM atoms. The interface can be used to perform all job types
allowed by the Gromacs software package, e.g. optimizations, molecular dynamics, free energy. In addition, for
geometry optimizations we have implemented a microiterative scheme that can be requested by setting the keyword
`bOpt = yes` in the Gromacs .mdp file. This will cause ORCA to perform a QM geometry optimization every time
it is called by Gromacs. During this optimization ORCA will also compute the Lennard-Jones interaction between
the QM and MM atoms, and freeze the boundary atoms. This microiterative scheme can also be used to perform a
transition state optimization. If you are looking for a transition state and have a good initial guess for the structure,
you can carry out an optimization of the MM system and at the same time perform a transition state optimization
of the QM system with ORCA via the microiterative scheme. Since it is expensive to calculate the Hessian for each
microiterative microiterative step, the user can tell ORCA to use the (updated) Hessian matrix of the previous step
via `read_temp_Hess` in the ORCA input.

In order to allow full flexibility to the user, the information for the QM run are provided in a separate plain text
file, called `GromacsBasename.ORCAINFO` . When Gromacs writes the input for the ORCAcalculation, it will merge
this file with the information on the coordinates, point charges, Lennard-Jones coefficients and type of calculation
(EnGrad, Opt, TSOpt).

Below is a typical example of an input file created by Gromacs, where for each Gromacs optimization step, a full
optimization of the QM-part will be performed by ORCA, instead of just doing the energy and gradient calculation.



**Note:**

  - If you are using `bOpt` or `bTS` you have to take care of additional terms over the boundary. Either you can
zero out the dihedral terms of the Q2-Q1-M1-M2 configurations, or you can fix the respective Q2 atoms.

  - If you want to use the ORCA constraints, you have to also put them in the Gromacs part of the calculation.

**6.17. QM/MM via Interfaces to ORCA** **391**

**ORCA Manual** **,** **Release 6.0.1**

  - If there are no bonds between the QM and MM systems, the `bOpt` optimization of the QM system might have
convergence problems. This is the case if the step size is too large and thus QM atoms come too close to MM
atoms. The convergence problems can be circumvented by adding extra coordinates and Hessian diagonal
values for Cartesian coordinates of selected QM atoms to the set of internal coordinates. This should be
done for only few atoms that are in the boundary region.



**6.17.2 ORCA and pDynamo**

[The interface with the pDynamo library is briefly documented here. It uses the same plain text files to exchange](https://sites.google.com/site/pdynamomodeling/tutorials/orca)
information between the pDynamo library and ORCA. In order to have simiar functionality as presented above, we
have extended the interface to generate more complex ORCA input files by accepting verbatim blocks of text. We
have also implemented in pDynamo the capability of writing files containing Lennard-Jones parameters.

A simple example which calculates the QM/MM energy for a small designed peptide in which the side chain of
one amino acid is treated QM is ilustrated below. For this example, a complete geometry optimization is going to
be performed during the ORCA call.



After the execution of the above Python program, a series of files are going to be created `chignolin.inp`,
`chignolin.pc`, `chignolin.lj` and ORCA is going to be called. The generated ORCAinput file is listed below.

**392** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

There are few points that have to be raised here. Because the keyword `qmmm/pdynamo` was specified in the `header`
variable, the pDynamo library will automatically add the `constraint` block in the ORCA input, which will freeze
the link atoms and the QM atoms to which they are bound. It will also generate the `chignolin.lj` file containing all the Lennard-Jones parameters. The important parts of this file, which is somewhat different than the one
generated by Gromacs, are listed next.



(continues on next page)

**6.17. QM/MM via Interfaces to ORCA** **393**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

The second number on the first line refers to the type of combination rule used to calculate the Lennard-Jones
interaction. It is 0 if a geometric average is used (OPLS force field), or 1 for the Lorentz-Berthelot rules (AMBER
force field). The `id` on the last column is -1 for MM atoms and is equal to the atom number for the QM atoms. In
this case the hydrogen link atom is atom 0. The last block of the file is composed of atom pairs and a special factor
by which their Lennard-Jones interaction is scaled. In general this factor is equal to 1, but for atoms one or two
bonds apart is zero, while for atoms three bonds apart depends on the type of force field, and in this case is 0.5.

After successful completion of the ORCA optimization run, the information will be relayed back the pDynamo
library, which will report the total QM/MM energy of the system. At this point the type QM/MM of calculation is
limited only by the capabilities of the pDynamo library, which are quite extensive.

**6.17.3 ORCA and NAMD**

Since version 2.12, NAMD is able to perform hybrid QM/MM calculations. A more detailed explanation of all
available key words, setting up the calculation and information on tutorials and on the upcoming graphic interface
[to VMD are available on the NAMD website.](http://www.ks.uiuc.edu/~rcbernardi/QMMM/)

Similar to other calculations with NAMD, the QM/MM is using a pdb file to control the active regions. An example
is shown below, where the sidechain of a histidine protonated at N *𝜖* is chosen to be the QM region. Either the
occupancy column or the b-factor column of the file are used to indicate which atom are included in a QM area
and which are treated by the forcefield. In the other column, atoms which are connecting the QM area and the
MM part are indicated similarly. To clarify which column is used for which purpose, the keywords `qmColumn` and
`qmBondColumn` have to be defined in the NAMD input.



NOTES:

  - If one wants to include more than one QM region, integers bigger than 1 can be used to define the different
regions.

  - Charge groups cannot be split when selecting QM and MM region. The reason is that non-integer partial
charges may occur if a charge group is split. Since the QM partial charges are updated in every QM iteration,
this may lead to a change in the total charge of the system over the course of the MD simulation.

**394** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

  - The occupancy and b-factor columns are used for several declarations in NAMD. If two of these come
together in one simulation, the keyword `qmParamPDB` is used to define which pdb file contains the information
about QM atoms and bonds.

  - To simplify the selection of QM atoms and writing the pdb file a set of scripts is planned to be included in
future releases of NAMD.

To run the calculation, the keyword `qmForces on` must be set. To select ORCA `qmSoftware "orca"` must be
specified and the path to the executables must be given to `qmExecPath`, as well as a directory where the calculation
is carried out ( `qmBaseDir` ). To pass the method and specifications from NAMD to ORCA `qmConfigLine` is used.
These lines will be copied to the beginning of the input file and can contain both simple input as well as block
input. To ensure the calculation of the gradient, the `engrad` keyword should be used.

The geometry of the QM region including the selected links as well as the MM point charges are copied to the
ORCA inputfile automatically. Multiplicity and charge can be defined using `qmMult` and `qmCharge`, although the
latter can be determined automatically by NAMD using the MM parameters. It should be noted at this point that
NAMD is capable to handle more than one QM region per QM/MM calculation. Therefore for each region, charge
and multiplicity are expected. In the case of only one QM region, the input looks like the following:



Currently, two charge modes are available: Mulliken and CHELPG. They have to be specified in the NAMD
input using `QMChargeMode` and in the `qmConfigLine`, respectively. Different embedding schemes, point charge
schemes and switching functions are available, which will be not further discussed here. Another useful tool worth
mentioning is the possibility to call secondary executables before the first or after each QM software execution
using `QMPrepProc` or `QMSecProc`, respectively. Both are called with the complete path and name to the QM input
file, allowing e.g. storage of values during an QM/MM-MD.

It is strongly enphasized that at this points both programs are constantly developed further. For the latest information, either the ORCA forum or the NAMD website should be consulted.
### **6.18 Excited State Dynamics**

ORCA can now also be used to compute dynamic properties involving excited states such as absorption spectra,
fluorescence and phosphorescence rates and spectra, as well as resonant Raman spectra using the new `ORCA_ESD`
module. We do this by analytically solving the Fermi’s Golden Rule-like equation from Quantum Electrodynamics
(see the section *More on the Excited State Dynamics module* ), using a path integral approach to the dynamics, as
described in our recent papers [198, 199]. The computation of these rates relies on the harmonic approximation
for the nuclear normal modes. Provided this approximation holds, the results closely match experimental data.

The theory can do most of what `ORCA_ASA` can and more, such as including vibronic coupling in forbidden transitions (the so-called Herzberg-Teller effect, HT), considering Duschinsky rotations between modes of different
states, solving the equations using different coordinate systems, etc. There are also seven new approaches to obtain
the excited state geometry and Hessian without necessarily optimizing its geometry. Many keywords and options
are available, but most of the defaults already give good results. Let’s get into specific examples, starting with the
absorption spectrum. Please refer to section *More on the Excited State Dynamics module* for a complete keyword
list and details.

**6.18. Excited State Dynamics** **395**

**ORCA Manual** **,** **Release 6.0.1**

**6.18.1 Absorption Spectrum**

**The ideal model, Adiabatic Hessian (AH)**

To predict absorption or emission rates, including all vibronic transitions, ideally, one requires both the ground
state (GS) and excited state (ES) geometries and Hessians. For instance, when predicting the absorption spectrum
for benzene, which exhibits one band above 220 nm corresponding to a symmetry-forbidden excitation to the S1
state, the process is straightforward. Ground state information can be obtained from (Sec. *Geometry Optimizations,*
*Surface Scans, Transition States, MECPs, Conical Intersections, IRC, NEB* ):



and the S1 ES from (Sec. *Excited State Geometry Optimization* ):



Assuming DFT/TD-DFT here, but other methods can also be used (see *Tips, Tricks and Troubleshooting* ). With
both Hessians available, the ESD module can be accessed from:



**Important:** The geometry must match that in the GS Hessian when calling the ESD module. You can obtain it
from the .xyz file after geometry optimization or directly copy it from the .hess file (remember to use BOHRS on
the input to correct the units, if obtained from the .hess).

You must provide both names for the Hessians and set DOHT to TRUE here because the first transition of benzene
is symmetry forbidden, with an oscillator strength of 2e-6. Therefore, all intensity arises from vibronic coupling
(HT effect) [199]. In molecules with strongly allowed transitions, this parameter can typically remain FALSE (the
default). Some calculation details are printed, including the computation of transition dipole derivatives for the
HT component, and the spectrum is saved as BASENAME.spectrum.



The first column has the total spectrum, but the contributions from the Franck-Condon part and the Herzberg-Teller
part are also discriminated. As you can see, the FC intensity is less than 1% of the HT intensity here, highlighting
the importance of including the HT effect. It is important to note that, in theory, the absorbance intensity values
correspond to the experimental *𝜀* (in L mol cm *[−]* [1] ), and they depend on the spectral lineshape. The TotalSpectrum
column can be plotted using any software to obtain the spectrum named Full AH spectrum (shown in blue), in Fig.
6.58 below.

**396** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.58: Here is the experimental absorption spectrum for benzene (shown in black on the left), alongside predictions made using ORCA_ESD at various PES approximations.

The spectrum obtained is very close to the experimental results at 298K, even when simply using all the defaults,
and it could be further improved by adjusting parameters such as lineshape, as discussed in detail in Sec. *General*
*Aspects* and Sec. *More on the Excited State Dynamics module* .

**Note:**

  - The path integral approach in ORCA_ESD is much faster than the more traditional approach of calculating
all vibronic transitions with non-negligible intensities, one by one [748]. This is especially true for large
systems, where the number of bright vibronic transitions may potentially scale exponentially, but our approach’s scaling remains polynomial (in fact near linear scaling in favorable cases [199]). The price to pay
is that one can no longer read off the compositions of the vibronic states from the spectrum, in other words,
one cannot assign the peaks without doing further calculations. However, one can know whether a given
vibrational mode contributes to a given peak, by repeating the ESD calculation with a few modes removed,
and see if the peak is still present. This can be conveniently done using the MODELIST or SINGLEMODE
keywords. More information can be found in Sec. *More on the Excited State Dynamics module* .

  - The Huang-Rhys factors are important tools for qualitative and quantitative analysis of the contributions of
each vibrational mode to the vibrationally resolved spectrum (and also to the transition rate constants, as will
be discussed later). They can be requested by setting PRINTLEVEL in the %ESD module to 3 or above.

Of course, it is not always possible to obtain the excited state (ES) geometry due to root flipping, or it might be
too costly for larger systems. Therefore, some approximations to the ES Potential Energy Surface (PES) have been
developed.

**6.18. Excited State Dynamics** **397**

**ORCA Manual** **,** **Release 6.0.1**

**The simplest model, Vertical Gradient (VG)**

The minimal approximation, known as Vertical Gradient (VG), assumes that the excited state (ES) Hessian equals
the ground state (GS) Hessian and extrapolates the ES geometry from the ES gradient and that Hessian using some
step (Quasi-Newton or Augmented Hessian, which is the default here). Additionally, in this scenario, the simplest
Displaced Oscillator (DO) model is employed, ensuring fast computation [199]. To use this level of approximation,
simply provide an input like:



OBS: If no GSHESSIAN is given, it will automatically look for an BASENAME.hess file.

Choosing one of the methods in ORCA to compute excited state information is essential. Here, we utilize TD(A)DFT with IROOT 1 to compute properties for the first excited state. TD(A)-DFT is currently the sole method
offering analytic gradients for excited states; selecting any other method will automatically enforce NUMGRAD.

**Important:** Please note that certain methods, such as STEOM-DLPNO-CCSD, require significant time to compute numerical gradients. In such cases, we recommend using DFT/TD-DFT Hessians and employing the higherlevel method solely for single points.

If everything is set correctly, after the regular single point calculation, the ESD module in ORCA will initiate. It
proceeds to obtain the excited state (ES) geometry, compute derivatives, and predict the spectrum. The resulting
normalized spectrum can be observed in Fig. 6.58, depicted in red. Due to such simple model, the spectrum is also
simplified. While this simplicity is less critical for larger molecules, it highlight the potential benefit of employing
an intermediate model.

**A better model, Adiabatic Hessian After a Step (AHAS)**

A reasonable compromise between a full geometry optimization and a simple step with the same Hessian is to
perform a step and then recalculate the ES Hessian at that geometry. This approach is referred to here as Adiabatic
Hessian After Step (AHAS). In our tests, it can be invoked with the following input:



The spectrum obtained corresponds to the green line in Fig. 6.58. As shown, it closely resembles the spectrum
obtained using AH, where a full geometry optimization was performed. Although not set as the default, this
method comes highly recommended based on our experience [199]. Another advantage of this approach is that the
derivatives of the transition dipole are computed simultaneously over Cartesian displacements on the ES structure
using the numerical Hessian. Subsequently, these modes are straightforwardly converted.

**398** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

OBS: The transition dipoles used in our formulation are always those of the FINAL state geometry. For absorption,
this corresponds to the ES, so in AHAS, the derivatives are computed over this geometry. For fluorescence, the
default behavior is to recompute the derivatives over the GS geometry. Alternatively, you can choose to save time
and convert directly from ES to GS by setting CONVDER TRUE (though this is an approximation). For more
details, refer to Sec. *More on the Excited State Dynamics module* .

**Other PES options**

There are also a few other options that can be set using HESSFLAG. For example, you can calculate the vertical
ES Hessian over the GS geometry and perform a step, known as the **Vertical Hessian (HESSFLAG VH)** method.
This method has the advantage that the geometry step is expected to be better because it does not assume the
initial ES Hessian is equal to the GS Hessian. However, it is likely to encounter negative frequencies on that VH,
since you are not at the ES minimum. By default, ORCA will turn negative frequencies into positive ones, issuing a
warning if any were lower than -300 cm *[−]* [1] . You can also choose to completely remove them (and the corresponding
frequencies from the GS) by setting IFREQFLAG to REMOVE or leave them as negative with IFREQFLAG set
to LEAVE under %ESD. Just be aware that an odd number of negative frequencies might disrupt the calculation
of the correlation function, so be sure to check.

If your excited state is localized and you prefer not to recalculate the entire Hessian, you can opt for a **Hybrid Hes-**
**sian (HH)** approach. This involves recomputing the ES Hessian only for specific atoms listed in HYBRID_HESS
under %FREQ ( *Frequency calculations - numerical and analytical* ). The HH method uses the GS Hessian as a
base but adjusts it at the specified atoms. This computation can be performed either before or after the step, offering
two variations: **Hybrid Hessian Before Step (HESSFLAG HHBS)** or **Hybrid Hessian After Step (HESSFLAG**
**HHAS)** . When using either of these options, derivatives are recalculated across the modes as needed.

Another approach involves comparing the ES Hessian with the GS Hessian and selectively recomputing frequencies
that differs. This method works by applying a displacement based on the GS Hessian and evaluating the resulting
energy change. If the predicted mode matches the actual mode, the prediction should be accurate. However, if
the difference exceeds a specified threshold, the gradient is computed, and the frequency for that mode is recalculated accordingly. The final ES Hessian is then derived from the **Updated Frequencies (UF)** and the original GS
Hessian.

This approach offers the advantage of minimizing the computation of ES gradients typical in standard ES Hessians,
thereby speeding up the process. By default, the system checks for frequency errors of approximately 20%. You
can adjust this threshold using the UPDATEFREQERR flag; for instance, setting UPDATEFREQERR to 0.5 under
%ESD allows for a larger error tolerance of 50%. Additionally, you can implement either the **Updated Frequencies**
**Before Step (HESSFLAG UFBS)** or the **Updated Frequencies After Step (UFAS)** methods. Transition dipole
derivatives are computed concurrently with the update process.

OBS: All these options apply to Fluorescence and resonant Raman as well.

**Duschinsky rotations**

The ES modes can sometimes be expressed as linear combinations of the GS modes (see Sec. *General Aspects*
*of the Theory* ), a phenomenon known in the literature as Duschinsky rotation [228]. In our formulation within
ORCA_ESD, it is possible to account for this effect, which reflects a closer approximation to real-world scenarios,
albeit at a higher computational cost.

You can enable this feature by setting USEJ TRUE; otherwise, the rotation matrix J defaults to unity. For instance,
in the case of benzene, while the effect may not be pronounced, there is noticeable improvement in matching peak
ratios with experimental data when incorporating rotations. Exploring this option may reveal more significant
impacts in other cases.

**6.18. Excited State Dynamics** **399**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.59: Experimental absorption spectrum for benzene (black on the left) and the effect of Duschinsky rotation
on the spectrum.

**Temperature effects**

In our model, the effects of the Boltzmann distribution due to temperature are exactly accounted for [199]. The
default temperature is set to 298.15 K, but you can specify any other temperature by adjusting the TEMP parameter
under %ESD. However, it is important to note that when approaching temperatures close to 0 K, numerical issues
may arise. For instance, if you encounter difficulties modeling a spectrum at 5 K or wish to predict a jet-cooled
spectrum, setting TEMP to 0 will activate a set of equations specifically tailored for T=0 K conditions.

As can be seen in Fig. 6.60, at 0 K there are no hot bands and fewer peaks, while at 600 K there are many more
possible transitions due to the population distribution over the GS.

Fig. 6.60: Predicted absorption spectrum for benzene at different temperatures.

**400** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**Multistate Spectrum**

If you want to predict a spectrum that includes many different states, you should ignore the IROOT flag in all
modules and instead use the STATES flag under %ESD. For example, to predict the absorption spectra of pyrene
in the gas phase and consider the first twenty states, you would specify:



This input would result in the spectra shown in Fig. 6.61. In this case, each individual spectrum for every state
will be saved as BASENAME.spectrum.root1, BASENAME.spectrum.root2, etc., while the combined spectrum,
which is the sum of all individual spectra, will be saved as BASENAME.spectrum.

Fig. 6.61: Predicted absorption spectrum for pyrene in gas phase (solid blue) in comparison to the experiment
(dashed grey) at 298 K.

OBS: The flag UNIT can be used to control the output unit of the X axis. Its values can be CM-1, NM or EV and
it only affects the OUTPUT, the INPUT should always be in cm *[−]* [1]

**6.18. Excited State Dynamics** **401**

**ORCA Manual** **,** **Release 6.0.1**

**6.18.2 Fluorescence Rates and Spectrum**

**General Aspects**

The prediction of fluorescence rates and spectra can be performed in a manner analogous to absorption, as described
above, by using ESD(FLUOR) on the main input line. You can select any of the methods described earlier to
obtain the Potential Energy Surface (PES) by setting the appropriate HESSFLAG. The primary distinction is that
the transition dipoles must correspond to the geometry of the ground state (GS), while all other aspects remain
largely unchanged.

Fig. 6.62: Predicted absorption (right) and emission (left) spectrum for benzene in hexane at 298.15 K.

As depicted in Fig. 6.62, the fluorescence spectrum also closely matches the experimental data [199]. The difference observed in the absorption spectrum in Fig. 6.62, compared to previous spectra, arises because the experiment
was conducted in a solvent environment. Therefore, we adjusted the linewidth to align with the experimental data.

OBS: It is common for the experimental lineshape to vary depending on the setup, and this can be adjusted using
the LINEW flag (in cm *[−]* [1] ). There are four options for the lineshape function controlled by the LINES flag: DELTA
(for a Dirac delta function), LORENTZ (default), GAUSS (for a Gaussian function), and VOIGT (a Voigt profile,
which is a product of Gaussian and Lorentzian functions).

OBS2: The DELE and TDIP keywords can be used to input adiabatic (not vertical!) excitation energy and transition dipole moment computed at a higher level of theory. This enables calculating the computationally intensive
Hessians (especially the excited state Hessian) at a low level of theory without compromising the accuracy. For
more details, see Sec. *Mixing methods* .

If you need to control the lineshapes separately for Gaussian (GAUSS) and Lorentzian (LORENTZ), you can set
LINEW for Lorentzian and INLINEW for Gaussian (where “I” stands for Inhomogeneous Line Width).

**402** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**



OBS: The LINEW and INLINEW are NOT the full width half maximum ( *𝐹𝑊𝐻𝑀* ) of these curves. However,
they are related to them by: *𝐹𝑊𝐻𝑀* *𝑙𝑜𝑟𝑒𝑛𝑡𝑧* = 2 *× 𝐿𝐼𝑁𝐸𝑊* ; *𝐹𝑊𝐻𝑀* *𝑔𝑎𝑢𝑠𝑠* = 2 *.* 355 *× 𝐼𝑁𝐿𝐼𝑁𝐸𝑊* .

For the VOIGT curve, it is a little more complicated but in terms of the other FWHMs, it can be approximated as:

*𝐹𝑊𝐻𝑀* *𝑣𝑜𝑖𝑔𝑡* = 0 *.* 5346 *× 𝐹𝑊𝐻𝑀* *𝑙𝑜𝑟𝑒𝑛𝑡𝑧* + ~~√~~ (0 *.* 2166 *× 𝐹𝑊𝐻𝑀* *𝑙𝑜𝑟𝑒𝑛𝑡𝑧* [2] [+] *[ 𝐹𝑊𝐻𝑀]* *𝑔𝑎𝑢𝑠𝑠* [2] [)][.]

**Rates and Examples**

When you select ESD(FLUOR) on the main input, the fluorescence rate will be printed at the end of the output,
with contributions from Franck-Condon (FC) and Herzberg-Teller (HT) mechanisms discriminated. If you use
CPCM, the rate will be multiplied by the square of the refractive index, following Strickler and Berg [831].

If you calculate a rate without CPCM but still want to account for the solvent effect, remember to multiply the final
rate by this factor. Below is an excerpt from the output of a calculation with CPCM (hexane):

**Warning:** Whenever using ESD with CIS/TD-DFT and solvation, CPCMEQ will be set to TRUE by default,
since the excited state should be under equilibrium conditions! More info in *Including solvation effects via*
*LR-CPCM theory* .



**6.18. Excited State Dynamics** **403**

**ORCA Manual** **,** **Release 6.0.1**

In one of our theory papers, we investigated the calculation of fluorescence rates for the set of molecules presented
in Fig. 6.63. The results are summarized in Fig. 6.64 for some of the methods used to obtain the Potential Energy
Surface (PES) mentioned.

Fig. 6.63: The set of molecules studied, with rates on Fig. 6.64.

**404** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.64: Predicted emission rates for various molecules in hexane at 298.15 K. The numbers below the labels are
the HT contribution to the rates.

**6.18.3 Phosphorescence Rates and Spectrum**

**General Aspects**

As with fluorescence, phosphorescence rates and spectra can be calculated if spin-orbit coupling is included in
the excited state module (please refer to the relevant publication [198]). To enable this, ESD(PHOSP) must be
selected in the main input, and both a GSHESSIAN and a TSHESSIAN must be provided. The triplet Hessian can
be computed analytically from the spin-adapted triplets.



or, in this case, by computing the ground state triplet by simply setting the multiplicity to three:



Alternatively, one can use methods like VG, AHAS, etc., to approximate the triplet geometry and Hessian. However, this approach requires preparing the Hessian in a separate ESD run (Sec. *Approximations to the excited state*

**6.18. Excited State Dynamics** **405**

**ORCA Manual** **,** **Release 6.0.1**

*PES* ).

Additionally, you must input the adiabatic energy difference between the ground singlet and ground triplet states at
their respective geometries (without any zero-point energy correction) using the DELE flag under %ESD. In this
case, the spin-adapted triplet computed previously serves as our reference triplet state. An example input for the
rate calculation using TDDFT is as follows:



Phosphorescence rate calculation are always accompanied by the generation of the vibrationally resolved phosphorescence spectrum, which can be visualized in the same way as fluorescence spectra.

OBS.: When computing phosphorescence rates, each rate from individual spin sub-levels must be requested separately. You may use the $NEW_JOB option, just changing the `IROOT`, to write everything in a single input. After
SOC, the three triplet states ( *𝑇* 1 with *𝑀* *𝑆* = -1, 0 and +1) will split into IROOTs 1, 2 and 3, and all of them must be
included when computing the final phosphorescence rate. In this case, it is reasonable to assume that the geometries
and Hessians of these spin sub-levels are the same, and we will use the same .hess file for all three.

OBS2.: The ground state geometry should be used in the input file, similar to the case of fluorescence (vide supra).

**406** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

OBS3.: Apart from DELE, one can also use the TDIP keyword to input a high-level transition dipole moment,
similar to the fluorescence case. This enables e.g. the calculation of phosphorescence rates/spectra using e.g.
NEVPT2 or DLPNO-STEOM-CCSD transition dipole moments, with (TD)DFT geometries and Hessians. Note
however that the transition dipole moment in phosphorescence processes is complex, so 6 instead of 3 components
are required.

Here, we are computing the rate and spectrum for biacetyl in ethanol at 298 K. The geometries and Hessians
were obtained as previously described, with the ground triplet computed from a simple open-shell calculation.
To compute the rate, the flag DOSOC must be set to TRUE under %TDDFT (Sec *Spin-orbit coupling* ), or the
respective module, and it is advisable to set a large number of roots to ensure a good mixing of states.

Please note that we have chosen the RI-SOMF(1X) option for the spin-orbit coupling integrals, but any of the
available methods can be used (Sec. *The Spin-Orbit Coupling Operator* ).

**Calculation of rates**

As you can see, the predicted spectra for biacetyl (Fig. 6.65) are quite close to the experimental results [198, 784].
The calculation of the phosphorescence rate is more complex because there are three triplet states that contribute.
Therefore, the observed rate must be taken as an average of these three states.

*𝑘* *𝑎𝑣* *[𝑝ℎ𝑜𝑠𝑝]* = *[𝑘]* [1] [ +] *[ 𝑘]* 3 [2] [ +] *[ 𝑘]* [3]

To be even more strict and account for the Boltzmann population distribution at a given temperature *𝑇* caused by
the Zero Field Splitting (ZFS), one should use [593]:

*𝑘* *𝑎𝑣* *[𝑝ℎ𝑜𝑠𝑝]* = *[𝑘]* [1] [ +] *[ 𝑘]* [2] *[𝑒]* *[−]* [(Δ] *[𝐸]* [1] *[,]* [2] *[/𝑘]* *[𝐵]* *[𝑇]* [)] [ +] *[ 𝑘]* [3] *[𝑒]* *[−]* [(Δ] *[𝐸]* [1] *[,]* [3] *[/𝑘]* *[𝐵]* *[𝑇]* [)] (6.26)

1 + *𝑒* *[−]* [(Δ] *[𝐸]* [1] *[,]* [2] *[/𝑘]* *[𝐵]* *[𝑇]* [)] + *𝑒* *[−]* [(Δ] *[𝐸]* [1] *[,]* [3] *[/𝑘]* *[𝐵]* *[𝑇]* [)]

where ∆ *𝐸* 1 *,* 2 is the energy difference between the first and second states, and so on.

After completion of each calculation, the rates for the three triplets were 8.91 s *[−]* [1], 0.55 s *[−]* [1], and 284 s *[−]* [1] . Using
(6.26), the final calculated rate is about 98 s *[−]* [1], while the best experimental value is 102 s *[−]* [1] (at 77K) [592], with
about 40% deriving from the HT effect.

**6.18. Excited State Dynamics** **407**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.65: The experimental (dashed red) and theoretical (solid black, displaced by about 2800 cm *[−]* [1] ) phosphorescence spectra for biacetyl, in ethanol at 298 K.

OBS: A subtlety arises when the final state is not a singlet state, for example in radical phosphorescence (doublet
ground state) or singlet oxygen phosphorescence (triplet ground state). In this case the most rigorous treatment
would be to sum over the final states but average over the initial states. For example, with quartet-to-doublet
phosphorescence one gets

*𝑘* *𝑎𝑣* *[𝑝ℎ𝑜𝑠𝑝]* = *[𝑘]* [1] *[→]* [1] [ +] *[ 𝑘]* [2] *[→]* [1] *[𝑒]* *[−]* [(Δ] *[𝐸]* [1] *[,]* [2] *[/𝑘]* *[𝐵]* *[𝑇]* [)] [ +] *[ 𝑘]* [3] *[→]* [1] *[𝑒]* *[−]* [(Δ] *[𝐸]* [1] *[,]* [3] *[/𝑘]* *[𝐵]* *[𝑇]* [)] [ +] *[ 𝑘]* [4] *[→]* [1] *[𝑒]* *[−]* [(Δ] *[𝐸]* [1] *[,]* [4] *[/𝑘]* *[𝐵]* *[𝑇]* [)]

1 + *𝑒* *[−]* [(Δ] *[𝐸]* [1] *[,]* [2] *[/𝑘]* *[𝐵]* *[𝑇]* [)] + *𝑒* *[−]* [(Δ] *[𝐸]* [1] *[,]* [3] *[/𝑘]* *[𝐵]* *[𝑇]* [)] + *𝑒* *[−]* [(Δ] *[𝐸]* [1] *[,]* [4] *[/𝑘]* *[𝐵]* *[𝑇]* [)]

+ *[𝑘]* [1] *[→]* [2] [ +] *[ 𝑘]* [2] *[→]* [2] *[𝑒]* *[−]* [(Δ] *[𝐸]* [1] *[,]* [2] *[/𝑘]* *[𝐵]* *[𝑇]* [)] [ +] *[ 𝑘]* [3] *[→]* [2] *[𝑒]* *[−]* [(Δ] *[𝐸]* [1] *[,]* [3] *[/𝑘]* *[𝐵]* *[𝑇]* [)] [ +] *[ 𝑘]* [4] *[→]* [2] *[𝑒]* *[−]* [(Δ] *[𝐸]* [1] *[,]* [4] *[/𝑘]* *[𝐵]* *[𝑇]* [)]

1 + *𝑒* *[−]* [(Δ] *[𝐸]* [1] *[,]* [2] *[/𝑘]* *[𝐵]* *[𝑇]* [)] + *𝑒* *[−]* [(Δ] *[𝐸]* [1] *[,]* [3] *[/𝑘]* *[𝐵]* *[𝑇]* [)] + *𝑒* *[−]* [(Δ] *[𝐸]* [1] *[,]* [4] *[/𝑘]* *[𝐵]* *[𝑇]* [)]

where *𝑘* 2 *→* 1 is the phosphorescence rate constant from the second sublevel of the initial quartet to the first sublevel
of the final doublet, etc. Note that the Boltzmann factors of the final state do not enter the expression. Unfortunately,
since U-TDDFT is spin contaminated and unsuitable for calculating SOC-corrected transition dipole moments, the
transition dipoles in this case have to be calculated by more advanced methods, such as DFT/ROCIS or multireference methods. The transition dipole should then be given in the input file using the TDIP keyword.

**6.18.4 Intersystem Crossing Rates (unpublished)**

**General Aspects**

Yet another application of the path integral approach is to compute intersystem crossing rates, or non-radiative
transition rates between states of different multiplicities. This can be calculated if one has two geometries, two
Hessians, and the relevant spin-orbit coupling matrix elements.

The input is similar to those discussed above. Here ESD(ISC) should be used on the main input to indicate an
InterSystem Crossing calculation, and the Hessians should be provided by ISCISHESSIAN and ISCFSHESSIAN
for the initial and final states, respectively. Please note that the geometry used in the input file should correspond to
that of the FINAL state, specified through the ISCFSHESSIAN flag. The relevant matrix elements can be computed

**408** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

using any method available in ORCA and inputted as SOCME Re,Im under %ESD where Re and Im represent its
real and imaginary parts ( **in atomic units!** ).

As a simple example, one could compute the excited singlet and ground triplet geometries and Hessians for anthracene using TD-DFT. Then, compute the spin-orbit coupling (SOC) matrix elements for a specific triplet spinsublevel using the same method (see the details below), potentially employing methods like CASSCF, MRCI,
STEOM-CCSD, or another theoretical level. Finally, obtain the intersystem crossing (ISC) rates using an input
such as:



The SOCMEs between a singlet state and a triplet state consist of three complex numbers, not just one, because
the triplet state has three sublevels. If the user uses the SOCME of one of the sublevels as input to the ISC rate
calculation, this gives the ISC rate associated with that particular sublevel. However, experimentally one usually
does not distinguish the three sublevels of a triplet state, and experimentally ISC rates are reported as if the three
sublevels of a triplet state are the same species. Therefore, the rate of singlet-to-triplet ISC is the *sum* of the
ISC rates from the singlet state to the three triplet sublevels. Fortunately, in case the Herzberg-Teller effect (vide
infra) can be neglected, it is not necessary to perform three rate calculations and add up the rates, since the rate is
proportional to the squared modulus of the SOCME. Thus, one can run a *single* ESD calculation where the SOCME
is the square root of the summed squared moduli of the three SOCME components.

As an illustration, consider the *𝑆* 1 to *𝑇* 1 ISC rate of acetophenone. First, we optimize the *𝑆* 0 geometry, and (after
manually tweaking the geometry to break mirror symmetry) use it as an initial guess for the geometry optimization
and frequency calculations of the *𝑆* 1 and *𝑇* 1 states. Then, we calculate the *𝑆* 1 - *𝑇* 1 SOCMEs at the *𝑇* 1 geometry (note
that, as usual, final state geometries should be used for ESD calculations; this may differ from some programs other
than ORCA). These calculations are conveniently done using a compound script, although the individual steps can
of course also be done using separate input files.



(continues on next page)

**6.18. Excited State Dynamics** **409**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



After verifying that neither of the Hessians have imaginary frequencies (which is very important!), we can read the
computed SOCMEs:



(continues on next page)

**410** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

The “total” SOCME between *𝑆* 1 and *𝑇* 1 is then calculated, from the line that begins with “1 1”, as


√︀


0 *.* 00 [2] + ( *−* 0 *.* 59) [2] + 0 *.* 00 [2] + 1 *.* 79 [2] + 0 *.* 00 [2] + 2 *.* 57 [2] *𝑐𝑚* *[−]* [1] = 3 *.* 19 *𝑐𝑚* *[−]* [1] = 1 *.* 45 *×* 10 *[−]* [5] *𝑎𝑢*


One should therefore write `socme 1.45e-5` in the `%esd` block in the subsequent ISC rate calculation.

Importantly, the above approach is only applicable to singlet-to-triplet ISC, but not to triplet-to-singlet ISC (including, but not limited to, *𝑇* 1 *→* *𝑆* 0 and *𝑇* 1 *→* *𝑆* 1 processes). In the latter case, assuming that the triplet sublevels are
degenerate and in rapid equilibrium, we obtain that the observed rate constant is the *average*, not the sum, of the
rate constants of the three triplet sublevels, because each triplet sublevel has a Boltzmann weight of 1/3. Therefore,
the “effective” SOCME that should be plugged into the ESD module to get the observed rate constant is (here the
squared modulus *|𝑆𝑂𝐶𝑀𝐸* *𝑥* *|* [2] should be calculated as *𝑅𝑒* ( *𝑆𝑂𝐶𝑀𝐸* *𝑥* ) [2] + *𝐼𝑚* ( *𝑆𝑂𝐶𝑀𝐸* *𝑥* ) [2], etc.)


*𝑆𝑂𝐶𝑀𝐸* *𝑎𝑣* =


~~√~~


*|* *𝑆𝑂𝐶𝑀𝐸* *𝑥* *|* [2] + *|* *𝑆𝑂𝐶𝑀𝐸* *𝑦* *|* [2] + *|* *𝑆𝑂𝐶𝑀𝐸* *𝑧* *|* [2] (6.27)

3


i.e. a factor of *√* 3 smaller than the singlet-to-triplet case. However, both of the two assumptions (degenerate triplet

sublevels, and rapid equilibrium between sublevels) may fail under certain circumstances, which may contribute to
the error of the predicted rate. Nevertheless, in many cases the present, simple approach still provides a rate with
at least the correct order of magnitude.

OBS.: The adiabatic energy difference is NOT computed automatically for ESD(ISC), so you must provide it in
the input. This is the energy of the initial state minus the energy of the final state, each evaluated at its respective

geometry.

OBS2.: All the other options concerning changes of coordinate system, Duschinsky rotation, etc., are also available
here.

OBS3.: For many molecules, the *𝑆* 1 *→* *𝑇* 1 ISC process is not the dominant ISC pathway. This is because the
excited state compositions of *𝑆* 1 and *𝑇* 1 are often similar, and therefore ISC transitions between them frequently
do not satisfy the El-Sayed rule. Even if the only experimentally observed excited states are *𝑆* 1 and *𝑇* 1, it may still
be that the initial ISC is dominated by *𝑆* 1 *→* *𝑇* *𝑛* ( *𝑛>* 1), followed by ultrafast *𝑇* *𝑛* *→* *𝑇* 1 internal conversion.

OBS4.: Similarly, if the molecule starts at a high singlet state *𝑆* *𝑛* ( *𝑛>* 1), the dominant ISC pathway is not
necessarily the direct ISC from *𝑆* *𝑛* to one of the triplet states. Rather, it is possible (but not necessarily true) that
*𝑆* *𝑛* first decays to a lower singlet excited state before the ISC occurs.

OBS5.: If you calculate the DELE or SOCMEs at a higher level of theory and use it as an input for the ESD
calculation, please make sure that you have chosen the same excited state (in terms of state composition, not
energy ordering) in the Hessian and DELE/SOCME calculations. For example, suppose that you have obtained
the geometry and Hessian of the *𝑇* 2 state, but the *𝑇* 2 state of the higher level of theory has a very different state
composition than the *𝑇* 2 state at the level of theory used in the Hessian calculation; rather, it is *𝑇* 3 at the high level
of theory that shares the same composition as the *𝑇* 2 state at the lower level of theory. In this case, you should use
the SOCME related to *𝑇* 3 in the SOCME output file.

**6.18. Excited State Dynamics** **411**

**ORCA Manual** **,** **Release 6.0.1**

**ISC, TD-DFT and the HT effect**

In the anthracene example above, the result is an ISC rate ( *𝑘* *𝐼𝑆𝐶* ) smaller than 1 *𝑠* *[−]* [1], which is quite different from
the experimental value of 10 [8] *𝑠* *[−]* [1] at 77 *𝐾* [592]. The reason for this discrepancy, in this particular case, is because
the ISC occurs primarily due to the Herzberg-Teller effect, which must also be included. To achieve this, one needs
to compute the derivatives of the SOCMEs over the normal modes, currently feasible only using CIS/TD-DFT.

When using the %CIS/TDDFT option, you can control the SROOT and TROOT flags to select the singlet and
triplet states for which SOCMEs are computed, and the TROOTSSL flag to specify the triplet spin-sublevel (1, 0,
or -1).

In practice, to obtain an ISC rate ( *𝑘* *𝐼𝑆𝐶* ) close enough to experimental values, one would need to consider all
possible transitions between the initial singlet and all available final states. For anthracene, these are predicted to
be the ground triplet ( *𝑇* 1 ) and the first excited triplet ( *𝑇* 2 ), consistent with experimental observations [402], while
the next triplet ( *𝑇* 3 ) is energetically too high to be significant (Fig. 6.66 below). An example input used to calculate
the *𝑘* *𝐼𝑆𝐶* from *𝑆* 1 to *𝑇* 1 at 77 *𝐾* is:



**412** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.66: Scheme for the calculation of the intersystem crossing in anthracene. The *𝑘* *𝐼𝑆𝐶* ( *𝑖* ) between *𝑆* 1 and
each triplet is a sum of all transitions to the spin-sublevels and the actual observed *𝑘* *𝐼𝑆𝐶* *[𝑜𝑏𝑠]* [, which consolidates these]
transitions. On the right, there is a diagram illustrating the distribution of excited states with *𝐸* ( *𝑆* 1 ) *−* *𝐸* ( *𝑇* *𝑛* )
depicted on the side. Since *𝑇* 3 is energetically too high, intersystem crossing involving *𝑇* 3 can be safely neglected.

Then, the derivatives of the SOCME are computed and the rates are printed at the end. By performing the same
calculations for the *𝑇* 2 states and summing up these values, a predicted *𝑘* *𝐼𝑆𝐶* *[𝑜𝑏𝑠]* [= 1] *[.]* [17] *[ ×]* [ 10] [8] *[𝑠]* *[−]* [1] [ can be obtained,]
much closer to the experimental value, which is associated with a large error anyway.

OBS.: In cases where the SOCME are relatively large, e.g., SOCME *>* 5 *𝑐𝑚* *[−]* [1], the Herzberg-Teller effect might
be negligible, and a simple Frank-Condon calculation should yield good results. This is typically applicable to
molecules with heavy atoms, where vibronic coupling is less significant.

OBS2.: Always consider that there are actually THREE triplet spin-sublevels, and transitions from the singlet to
all of them should be included.

OBS3.: ISC rates are extremely sensitive to energy differences. Exercise caution when calculating them. If a more
accurate excited state method is available, it should be considered for prediction.

**6.18.5 Internal Conversion Rates (unpublished)**

The ESD module can also calculate internal conversion (IC) rates from an excited state to the ground state at the
TDDFT and TDA levels. Apart from the ground state and excited state Hessians, the only additional quantity that
needs to be calculated is the nonadiabatic coupling matrix elements (NACMEs).

The input file is simple:



(continues on next page)

**6.18. Excited State Dynamics** **413**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

Here the *𝑆* 0 geometry, as well as the *𝑆* 0 and *𝑆* 1 Hessian files, were obtained at the B3LYP-D3/def2-SVP level of
theory. Note that the NACME calculation uses full TDDFT and also includes the electron-translation factor (ETF),
which are the recommended practices in general. The “iroot 1” specifies that the initial state is *𝑆* 1 ; the final state
is always *𝑆* 0 and this cannot be changed.

The computed IC rate constant is given near the end of the output file:

For more accurate results, one may add explicit solvation shells, since implicit solvation models only describe the
electrostatic and dispersive effects of the solvent on the solute, but cannot provide the extra vibrational degrees of
freedom that can help dissipating the excitation energy. Conversely, by using an implicit solvent one also misses
the effect of the solvent viscosity on inhibiting the internal conversion, which is particularly important when one
wants to compare against experiments conducted at low temperatures.

**6.18.6 Resonant Raman Spectrum**

**General Aspects**

Using a theoretical framework similar to what was published for Absorption and Fluorescence, we have also developed a method to compute resonant Raman spectra for molecules [197]. In this implementation, one can employ
all the methods to obtain the excited state potential energy surfaces (PES) mentioned earlier using HESSFLAG,
and include Duschinsky rotations and even consider the Herzberg-Teller effect on top of it. This calculation can
be initiated by using ESD(RR) or ESD(RRAMAN) on the first input line. It is important to note that by default,
we calculate the “Scattering Factor” or “Raman Activity,” as described by D. A. Long [533] (see Sec. *General*
*Aspects of the Theory* for more information).

When using this module, the laser energy can be controlled by the LASERE flag. If no laser energy is specified, the
0-0 energy difference is used by default. You can select multiple energies by using LASERE 10000, 15000, 20000,
etc., and if multiple energies are specified, a series of files named BASENAME.spectrum.LASERE will be saved.
Additionally, it is possible to specify several states of interest using the STATES flag, but not both simultaneously.

As an example, let’s predict the resonant Raman spectrum of the phenoxyl radical. You need at least a ground state
geometry and Hessian, and then you can initiate the ESD calculation using:



(continues on next page)

**414** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

**Important:** The LASERE used in the input is NOT necessarily the same as the experimental one. It should be
proportional to the theoretical transition energy. For example, if the experimental 0-0 ∆E is 30000 cm *[−]* [1] and the
laser energy used is 28000 cm *[−]* [1], then for a theoretical ∆E of 33000 cm *[−]* [1], you should use a laser energy of 31000
cm *[−]* [1] to obtain the corresponding theoretical result. At the end of the ESD output, the theoretical 0-0 ∆E is printed
for your information.

Fig. 6.67: The theoretical (solid black - vacuum and solid blue - water) and experimental (dashed red - water)
resonant Raman spectrum for the phenoxyl radical.

OBS.: The actual Raman Intensity collected with any polarization at 90 degrees, the I( *𝜋/* 2; *‖* *[𝑠]* + *⊥* *[𝑠]* *, ⊥* *[𝑖]* ) [533],
can be obtained by setting RRINTES to TRUE under %ESD.

And the result is shown in Fig. 6.67. In this case, the default method VG was used. If one wants to include solvent
effects, then CPCM(WATER) should be added. As can be seen, there is a noticeable difference in the main peak
when calculated in water.

It is important to clarify some differences from the `ORCA_ASA` usage here. Using the ESD module, you do not
need to select which modes you will account for in the spectra; we include all of them. Additionally, we can only
operate at 0 K, and the maximum “Raman Order” is 2. This means we account for all fundamental transitions, first

**6.18. Excited State Dynamics** **415**

**ORCA Manual** **,** **Release 6.0.1**

overtones, and combination bands, without including hot bands. This level of approximation is generally sufficient
for most applications.

If you are working with a very large system and want to reduce calculation time, you can request RORDER 1 under
the %ESD options. This setting includes only the fundamental transitions, omitting higher-order bands. This
approach may be relevant, especially when including both Duschinsky rotations and the Herzberg-Teller effect,
which can significantly increase computation time.

The rRaman spectra are printed with the contributions from “Raman Order” 1 and 2 separated as follows:

**Isotopic Labeling**

If you want to simulate the effect of isotopic labeling on the rRaman spectrum, there is no need to recalculate the
Hessian again. Instead, you can directly modify the masses of the respective atoms in the Hessian files. This can
be done by editing the $ *𝑎𝑡𝑜𝑚𝑠* section of the input file or directly in the Hessian file itself (see also Sec. *Isotope*
*Shifts* ). After making these adjustments, you can rerun ESD using the modified Hessian files, for example:



As depicted in Fig. 6.68, the distinction between phenoxyl and its deuterated counterpart is evident. The peak
around 1000 cm *[−]* [1] corresponds to a C-H bond, which shifts to lower energy after deuteration. This difference of
approximately 150 cm *[−]* [1] aligns closely with experimental findings [852].

**416** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.68: The theoretical (solid black - C 6 H 5 O and solid blue - C 6 D 5 O) and experimental (dashed red) resonant
Raman spectrum for the phenoxyl radical.

OBS: Whenever an ES Hessian is calculated using the HESSFLAG methods, it is saved in a file named BASENAME.ES.hess. If you want to repeat a calculation, you can simply use this file as an input without the need to
recalculate everything.

**RRaman and Linewidths**

The keywords LINEW and INLINEW control the LINES function used in the calculation of the correlation function
and are related to the lifetime of intermediate states and energy disordering. However, they do not determine the
spectral linewidth itself, but rather the lineshape. The spectral linewidth is set independently using the RRSLINEW
keyword, which defaults to 10 *𝑐𝑚* *[−]* [1] .

It’s important to note that LINEW and INLINEW significantly influence the final shape of the spectrum and should
be chosen appropriately based on your specific needs. While the defaults are generally suitable, you may need to
adjust them according to your requirements.

**6.18.7 ESD and STEOM-CCSD or other higher level methods - the APPROXADEN**
**option**

If you plan to use the ESD module together with STEOM-CCSD, or other higher level methods such as EOMCCSD, CASSCF/NEVPT2, some special advice must be given.

Since these methods currently do not have analytic gradients, numerical ones will be requested by default to compute the excited state geometries. This, of course, can take a significant amount of time, as they require approximately 3 *×* *𝑁* atoms single-point calculations. We strongly recommend that, in these cases, you should use DFT/TDDFT to obtain the ground/excited/triplet state geometry and Hessians, and only use the higher-level method for the
final ESD step.

Also, we recommend using APPROXADEN under the %ESD options.



**6.18. Excited State Dynamics** **417**

**ORCA Manual** **,** **Release 6.0.1**

In this case, only one single point at the geometry of the ground state needs to be done, and the adiabatic energy
difference will be automatically obtained from the ES Hessian information, without the need of a second single
point at the extrapolated ES geometry, which could be unstable.

**6.18.8 Circularly Polarized Spectroscopies**

**General Aspects**

When circularly polarized (CP) light interacts with a chiral chemical structure (optically active), it differentially
absorbs left and right CP lights ( *𝐼* *𝐿𝐶𝑃* = *̸* *𝐼* *𝑅𝐶𝑃* ) resulting in the electronic circular dichroism (ECD). Similarly, it
can differentially emit left and right CP lights leading to CP luminescence (CPL), which includes CP fluorescence
(CPF) and phosphorescence (CPP) spectra.

**Vibration effects on ECD spectra**

Vertically excited (VE) computed ECD spectra are known to often be unable to describe the experiment. This is
for example the case in (R) methyl oxirane. The unshifted or shifted VE ECD BP86 computed spectra do not much
the experiment in terms of shape and intensity. It has been shown that these spectra need to be computed by taking
into account vibronic interactions[396].

Hence following structure optimization and frequencies calculations according to the input:


*̸*


*̸*


*̸*

we can compute ESD spectrum within in VE approximation and within the ESD modules according to the following
input:


*̸*


*̸*


*̸*

The result is provided in Figure Fig. 6.69 where one can see that according to the expectations the computed
spectrum agrees with the experiment only when FC and HT vibronic coupling schemes are taken into account

**418** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.69: Experimental (black) versus BP86/TDDFT (VE, blue and FC+HT red) ECD spectra for C3H6O molecule

**Computation of CP-FLUOR vs CP-PHOS spectra. The case of** *𝐶* 3 *𝐻* 6 *𝑂* **.**

Following the strategy described for the computation of PL (Fluorescence (PF) of Phosphorescence (PP)) spectra
in the case of *𝐶* 3 *𝐻* 6 *𝑂* one can also access the respective CPL and CPP spectra.

For this one needs to compute the hessian of the 1st excited singlet (ES1) and triplet states respectively (ET0)
according to the following inputs

(continues on next page)

**6.18. Excited State Dynamics** **419**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



and



Then one can setup the respective PL and CPL inputs as:

PF:




CPF:




**420** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**


PP:



CPP:




The results are summarized in Figure Fig. 6.70

**6.18. Excited State Dynamics** **421**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.70: a) Computed ABS and ECD (in blue) and Florescence and CPF (in red) under FC+HT vibronic coupling schemes b) Computed Phosphorescence and CPP under FC (in blue ) and FC+HT (in red) vibronic coupling
schemes

**Use of ABS, ECD PL and CPL as a routine analysis computational tools**

Having at hand the possibility to compute the above spectroscopic properties quartet. Consisting of Absorption,
ECD, Luminescent/Emission and CPL spectroscopies creates an arsenal of useful analysis computational tools.
Let us consider a practical example from the
the N- bridged triarylamine heterohelicenoid chiral family of molecules, which are known to be very good CPL
emitters in the CPL community. [186] Namely the R-, L- isomers of oxygen-bridged diphenylnaphthylamine for
which both ABS ECD, PL and CPL experimental spectra are available [635]

In a first step one needs to compute to calculate the ECD and CPL spectra, this implies that one needs to optimize
the ground state (GS) geometry and at least the GS hessian of both isomers, (see examples in *Fluorescence Rates*
*and Spectrum* and *Vibration effects on ECD spectra* ). Lets suppose that we have generated the GSHessian file
R_OptFreq.hess file for the R-isomer Then one can employ the ESD to calculate the Absorption, ECD, Fluorescence
and CPL (CPluorescecne) as follows.

For Absorption or ECD spectra a representative input is given by:



(continues on next page)

**422** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

For Fluorescence or CP Fluorescence spectra a representative input is given by:



(continues on next page)

**6.18. Excited State Dynamics** **423**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

The results are summarized in Figure Fig. 6.71

**424** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

Fig. 6.71: Black Experimental vs Calculated ABS, ECD, Fluorescence and CPF spectra for R- (in blue) and L- (in
red) isomers of diphenylnaphthylamine under FC+HT vibronic coupling schemes of the *𝜋* *→* *𝜋* *[*]* transition located
at 25000 *𝑐𝑚* *[−]* [1] .

**6.18.9 Magnetic Circular Dichroism (unpublished)**

**General Aspects**

By applying a quasi-degenerate perturbative theory, similar to the inclusion of spin-orbit coupling effects in the
phosphorescence calculations, the effect of an external magnetic field may be included in the representation of the
quantum states [268]. As a result, the differential absorption of left and right circularly polarized light may be
computed to obtain the vibrationally-corrected magnetic circularly dichroism spectrum. The input for the calculation is similar to the absorption case described above; nevertheless, ESD(MCD) should be used. Additionally, the
intensity of the external magnetic field “B” (in Gauss) should be included, and a Lebedev grid for a semi-numerical
molecular orientational average should be selected.

The method is only available with an electronic structure generated by TDDFT. The calculation supports the inclusion of Herzberg-Teller effects by setting DOHT TRUE, the ground state Hessian needs to be provided similarly
to the absorption case, while the excited state Hessian can be provided or computed under a no external magnetic
field approximation. An input example is:



Similarly, to the ESB(ABS) calculation the MCD spectrum is saved in a BASENAME.MCD file as:

**6.18. Excited State Dynamics** **425**

**ORCA Manual** **,** **Release 6.0.1**



**6.18.10 Tips, Tricks and Troubleshooting**

  - Currently, the ESD module works optimally with TD-DFT (Sec. *Excited States Calculations* ), but also
with ROCIS (Sec. *Excited States with RPA, CIS, CIS(D), ROCIS and TD-DFT* ), EOM/STEOM (Sec. *Ex-*
*cited States with EOM-CCSD* and Sec. *Excited States with STEOM-CCSD* ) and CASSCF/NEVPT2 (Sec.
*Complete Active Space Self-Consistent Field Method* and Sec *N-Electron Valence State Perturbation Theory*
*(NEVPT2)* ). Of course you can use any two Hessian files and input a custom DELE and TDIP obtained from
any method (see Sec. *More on the Excited State Dynamics module* ), if your interested only in the FC part.

  - If you request for the HT effect, calculating absorption or emission, you might encounter phase changes
during the displacements during the numerical derivatives of the transition dipole moment. There is a phase
correction for TD-DFT and CASSCF, but not for the other methods. Please be aware that phase changes
might lead to errors.

  - Please check the K*K value if you have trouble. When it is too large (in general larger than 7), a warning
message is printed and it means that the geometries might be too displaced and the harmonic approximation
might fail. You can try removing some modes using TCUTFREQ or use a different method for the ES PES.

  - If using DFT, the choice of functional can make a big difference on the excited state geometry, even if it is
small on the ground state. Hybrid functionals are much better choices than pure ones.

  - In CASSCF/NEVPT2, the IROOT flag has a different meaning from all other modules. In this case, the
ground state is the IROOT 1, the first excited state is IROOT 2 and so on. If your are using a state-averaged
calculation with more than one multiplicity, you need also to set an IMULT to define the right block, IMULT
1 being the first block, IMULT 2 the second and etc.

  - If using NEVPT2 the IROOT should be related to the respective CASSCF root, don’t consider the energy
ordering after the perturbation.

  - After choosing any of the HESSFLAG options, a BASENAME.ES.hess file is saved with the geometry and
Hessian for the ES. If derivatives with respect to the GS are calculated, a BASENAME.GS.hess is also saved.
Use those to avoid recalculating everything over and over. If you just want to get an ES PES, you can set
WRITEHESS TRUE under

  - Although in principle more complete, the AH is not NECESSARILY better, for we rely on the harmonic
approximation and large displacements between geometries might lead to errors. In some cases the VG,
AHAS and so one might be better options.

  - If you use these .hess files with derivatives over normal modes in one coordinate system, DO NOT MIX IT
with a different set of coordinates later! They will not be converted.

  - Sometimes, low frequencies have displacements that are just too large, or the experimental modes are too
anharmonic and you might want to remove them. It is possible to do that setting the TCUTFREQ flag (in
cm *[−]* [1] ), and all frequencies below the given threshold will be removed.

  - If you want to change the parameters related to the frequency calculations, you can do that under %FREQ
(Sec. *Vibrational Frequencies* ). The numerical gradient settings are under %NUMGRAD (Sec. *Numerical*
*Gradients* ).

  - When computing rates, the use of any LINES besides DELTA is an approximation. It is recommended to
compute the rate at much smaller lineshape (such as 10 cm *[−]* [1] ) to get a better value, even if the spectrum
needs a larger lineshape than that.

**426** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

  - When in doubt, try setting a higher PRINTLEVEL. some extra printing might help with your particular
problem.
### **6.19 The ORCA DOCKER: An Automated Docking Algorithm**

The most important aspects of chemistry/physics do not occur with single molecules, but when they interact with
each other. Now, given any two molecules, how to put them together in the best interacting “pose”? That is what
we try to answer when using the ORCA DOCKER. Docking here refers to the process of taking two systems and
putting them together in their best possible interaction.

**6.19.1 Example 1: A Simple Water Dimer**

Let us start with a very simple example. Given two water molecules, how to find the optimal dimer? With the
DOCKER that is simple and can be done with:



where the file `water.xyz` is a `.xyz` file which contains the same water structure, optionally with charge and
multiplicity (in that order) on the comment line (the second line by default):



The molecule given on the regular ORCA input will be the `HOST`, and the `GUEST` is always given through an external
file.

The output will start with:

where it writes the name of the file with the `GUEST` structure, the number of structures read, some extra info and
will optimize both host and guest (in this case they are the same), here by default using GFN2-XTB.

**Note:** If no multiplicity or charge are given, the `GUEST` is assumed to be neutral and closed-shell.

**Note:** The DOCKER right now is **only** working with the GFN-XTB and GFN-FF methods and the ALPB solvation
model. It will be expanded later to others.

**6.19. The ORCA DOCKER: An Automated Docking Algorithm** **427**

**ORCA Manual** **,** **Release 6.0.1**

That is followed by some extra info that is explained in more details on its own detailed section (see *More details*
*on the ORCA DOCKER* ):



That is followed by the docking itself, which will stop after a few iterations:

The idea here is to collect as many local minima as possible, that is, collect a first guess for all possible modes of
interaction between the different structures. We do this by allowing both structures to partially optimize, but it is
important to say we will not look for multiple conformers of the host and guest here.

With all solutions collected, we will take a fraction of them and do a final full optimization:




And as you can see, we also automatically print the `Interaction Energy`, which is simple an energy difference
between the final complex, host and guest. The final best structure with lowest interaction energy is then saved

**428** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

on the `Basename.docker.xyz` file. If needed, all other structures are saved on the `Basename.docker.struc1.`
`allopt.xyz`, as written on the output:

Now for a slightly more complex example, a uracil dimer:



where the `uracil.xyz` is a simple repetition of the structure, as with the water before.

**6.19. The ORCA DOCKER: An Automated Docking Algorithm** **429**

**ORCA Manual** **,** **Release 6.0.1**

In this case the output is more diverse, and in fact many different poses appear as candidates for the final optimiza
tion:

and structure number 6 is found to be the one with lowest interaction energy:



Here is a scheme with the structures found and their relative energies:

Fig. 6.73: Uracil dimer structures generated by DOCKER (duplicates removed) with relative energies in kcal/mol.

**Note:** There might be duplicated results after the final optimization, these are currently **not** automatically removed.
Here they were manually removed.

**Important:** The `PAL16` flag means XTB will run in parallel, but the ORCA DOCKER could be parallelized in
a much more efficient way by paralleizing over the workers. That will be done for the next versions and it will be
significantly more efficient.

**430** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

**6.19.3 Example 3: Adding Multiple Copies of a Guest**

Suppose you want to add multiple copies of the same guest, for example three water molecules on top of the uracil
one after the other. That can be simply done with:



and the guests on `water.xyz` will be added on top of the previous best complex three times. Now, there will
be files with names `Basename.docker.struc1.allopt.xyz`, `Basename.docker.struc2.allopt.xyz` and
`Basename.docker.struc3.allopt.xyz`, one for each step. Still, the same final `Basename.docker.xyz` file
and now a `Basename.docker.build.xyz` is also printed, with the best result after each iteration.

That’s how the results look like, from the `Basename.docker.xyz` :

Fig. 6.74: Cumulative docking of three guests

**Note:** By default the `HOST` is always optimized. It can be changed with `%DOCKER FIXHOST TRUE END` .

**6.19.4 Example 4: Find the Best Guest**

Another common case would be: given a list of guests - or conformers of the same guest (see *GOAT: global*
*geometry optimization and ensemble generator* ) - one might want to know what is the “best guest”, that is the one
with the lowest interaction energy.

In order to do that, simply pass a multixyz file and the DOCKER will try to dock all structures from that file, one
by one:



(continues on next page)

**6.19. The ORCA DOCKER: An Automated Docking Algorithm** **431**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

Here the file `uracil_water.xyz` looks like:



with a water followed by an uracil molecule. First, the water will be added, then the uracil, but both separately.
The initial output is a bit different:

with now two structures being read from file, and the `Docking approach` is labeled as `independent`, meaning
each structure will be docked independently of each other.

After everything, the output is:




**432** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

and one can see that the lowest interaction energy was that of structure 2 (the uracil), meaning it interacts strongly
with the `HOST` than the water molecule given. Now the file `Basename.docker.xyz` will contain all final structures,
ordered by interaction energy.

Fig. 6.75: Independent docking of water and uracil on top of an uracil molecule

**Note:** By default, the docking approach uses a fixed random seed and should always give the same result on the
same machine. To make it always completely random add `%DOCKER RANDOMSEED TRUE END` .

**Note:** In order to use the faster GFN-FF instead of GFN2-XTB, use `!DOCK(GFNFF)` . For a quicker (and less
accurate) docking, use `!QUICKDOCK` .

**Note:** To try multiple conformers of the `GUEST`, the ensemble file printed by GOAT `Basename.finalensemble.`
`xyz` can be directly given here and the whole ensemble will be tested against a give `HOST` .

A detailed description of the other options can be found on *More details on the ORCA DOCKER*

**6.19.5 Reduced Keyword List**



(continues on next page)

**6.19. The ORCA DOCKER: An Automated Docking Algorithm** **433**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)


### **6.20 Compound Methods**

Compound Methods is a form of sophisticated scripting language that can be used directly in the input of ORCA.
Using ‘ *Compound* ’ the user can combine various parts of a normal ORCA calculation to evaluate custom functions
of his own. In order to explain its usage, we will use an example. For a more detailed description of this module
the user is referred to section *Compound Methods* .

**6.20.1 example**

As a typical example we will use the constrained optimization describing the “umbrella effect” of *𝑁𝐻* 3 . The script
will perform a series of calculations and in the end it will print the potential of the movement plus it will identify
the minima and the maximum. The corresponding compound script is the one shown below.




(continues on next page)

**434** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)
```
step = 1.0*(amax-amin)/(nsteps-1);
# Loop over the number of steps
# ---------------------------for iang from 0 to nsteps-1 do
 angle = amin + iang*step;
 JobStep = iang+1;
 JobStep_m= JobStep-1;
 if (iang>0) then
  Read_Geom(JobStep_m);
  New_step
   ! &{method} &{basis} TightSCF Opt
   %base "&{JobName}.step&{JobStep}"
   %geom constraints
    {A 1 0 2 &{angle} C}
    {A 1 0 3 &{angle} C}
    {A 1 0 4 &{angle} C}
    end
   end
  Step_End
 else
  New_step
   ! &{method} &{basis} TightSCF Opt
   %base "&{JobName}.step&{JobStep}"
   %geom constraints
    {A 1 0 2 &{angle} C}
    {A 1 0 3 &{angle} C}
    {A 1 0 4 &{angle} C}
    end
   end
   * int 0 1
   N 0 0 0 0.0 0.0 0.0
   DA 1 0 0 2.0 0.0 0.0
   H 1 2 0 1.06 &{angle} 0.0
   H 1 2 3 1.06 &{angle} 120.0
   H 1 2 3 1.06 &{angle} 240.0
   *
  Step_End
 endif
  Read energies[iang] = SCF_ENERGY[jobStep];
  print(" index: %3d Angle %6.2lf Energy: %16.12lf Eh\n", iang, angle, energies[iang]);
EndFor
# Print a summary at the end of the calculation
# --------------------------------------------print("////////////////////////////////////////////////////////\n");
print("// POTENTIAL ENERGY RESULT\n");
print("////////////////////////////////////////////////////////\n");
variable minimum,maximum;
variable Em,E0,Ep;
variable i0,im,ip;
for iang from 0 to nsteps-1 do
 angle = amin + 1.0*iang*step;
 JobStep = iang+1;
 minimum = 0;
 maximum = 0;
 i0 = iang;
 im = iang-1;

```
(continues on next page)

**6.20. Compound Methods** **435**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



Let’s start with how somebody can execute this input. In order to run it, the easiest way is to save it in a normal
text file, using the name “umbrella.cmp” and then use the following ORCA input file:
```
%Compound "umbrella.cmp"

```
nothing more is needed. ORCA will read the compound file and act appropriately.

A few notes about this ORCA input. First, there is no simple input line, (starting with *“!”* ). A simple input is not
required when one uses the *Compound* feature, but In case the user adds a simple input, all the information from
the simple input will be passed to the actual compound jobs.

In addition, if one does not want to create a separate compound text file, it is perfecly possible in ORCA to use the
compound feature as any other ORCA block. This means that after the *%Compound* directive, instead of giving
the filename one can append the contents of the Compound file.

As we will see, inside the compound script file each compound job can contain all information of a normal ORCA
input file. There are two very important exceptions here: The number of processors and the *MaxCore* . These
information should be set in the initial ORCA input file and not in the actual compound files.

The Compound block has the same structure like all ORCA blocks. It starts with a *“%”* and ends with *“End”*, if
the input is not read from a file. In case the compound directives are in a file, as in the example above, then simply
the filename inside brackets is needed and no final *END* .

**6.20.2 Defining variables**

As we pointed out already, it is possible to either give all the information for the calculations and the manipulation
of the data inside the Compound block or create a normal text file with all the details and let ORCA read it. The
latter option has the advantage that one can use the same file with more than one geometries. In the previous
example we refer ORCA to an external file. The file *“umbrella.cmp”*, that contains all necessary information.

Let’s try to analyse now the Compound *“umbrella.cmp”* file.



(continues on next page)

**436** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

The first part contains some general comments and variable definitions. For the comments we use the same syntax
as in the normal ORCA input, through the *“#”* symbol. Plase not that more than one *“#”* symbols in the same line

cause an error.

After the initial comments we see some declarations and definitions. There are many different ways to declare
variables described in detail in section *Variables - General* .

All variable declarations begin with the directive *Variable* which is a sign for the program to expect the declaration
of one or more new variables. Then there are many options, including defining more than one variable, assigning
also a value to the variable or using a list of values. Nevertheless all declarations **MUST** finish with the *;* symbol.
This symbol is a message to the program that this is the end of the current command. The need of the *;* symbol in
the end of each command is a general requirement in *Compound* and there are only very few exceptions to it.

**6.20.3 Running calculations**



(continues on next page)

**6.20. Compound Methods** **437**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)



Then we have the most information dense part. We start with the definition of a *for* loop. The syntax in compound
for *for* loops is:

**For** *variable* **From** *startValue* **To** *endValue* **Do**

*directives*

**EndFor**

As we can see in the example above, the *startValue* and *endValue* can be constant numbers or previously defined
variables, or even functions of these variables. Keep in mind that they have to be integers. The signal that the loop
has reached it’s end is the *EndFor* directive. For more details with regard to the *for* loops please refer to section
*For* .

Then we proceed to assign some variables.



The syntax of the variable assignement is like in every programming language with a variable, followed with the
*=* symbol and then the value or an equation. Please keep in mind, that the assignement **must** always finish with
the *;* symbol.

The next step is another significant part of every programming language, namely the *if* block. The syntax of the *if*
block is the following:

**if** ( *expression to evaluate* **) Then**
*directives*

**else if (** *expression to evaluate* **) Then**
*directives*

**else**

*directives*

**EndIf**

The *else if* and *else* parts of the block are optional but the final *EndIf* must always signal the end of the *if* block.
For more details concerning the usage of the *if* block please refer to section *If* of the manual.

Next we have a command which is specific for compound and not a part of a normal programming language. This
is the *ReadGeom* command. It’s syntax is:

**Read_Geom** ( *integer value* );

Before explaining this command we will proceed with the next one in the compound script and return for this one.

The next command is the basis of all compound scripts. This is the *New_Step* Command. This command signals
compound that a normal ORCA calculation follows. It’s syntax is:

**New_Command** *Normal ORCA input* **Step_End**

Some comments about the *New_Step* command. Firstly, inside the *New_Step* - *Step_End* commands one can add all
possilbe commands that a normal ORCA input accepts. We should remember here that the commands that define

**438** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

the number of processors and the *MaxCore* command will be ignored.

A second point to keep in mind is the idea of the *step* . Every *New_Step - Step_End* structure corresponds to a step,
starting counting from 1 (The first ORCA calculation). This helps us define the property file that this calculation
will create, so that we can use it to retrieve information from it.

A singificant feature in the *New_Step - Step_End* block. is the usage of the structure **&{** ***variable*** **}** . This structure
allows the user to use variables that are defined outside the *New_Step - Step_End* block inside it, making the ORCA
input more generic. For example, in the script given above, we build the *basename* of the calculations
```
 %base "&{JobName}.step&{JobStep}"

```
using the defined variables *JobName* and *JobStep* . For more details regarding the usage of the **&{}** structure please
refer to section *&* while for the *New_Step - Step_End* structure please refer to the section *New_Step* .

Finally, a few comments about the geometries of the calculation. There are 3 ways to provide a geometry to
a *New_Step - Step_End* calculation. The first one is the traditional ORCA input way, where we can give the
coordinates or the name of a file with coordinates, like we do in all ORCA inputs. In *Compound* though, if we do
not pass any information concerning the geometry of the calculation, then *Compound* will automatically try to read
the geometry of the previous calculation. This is the second (implicit) way to give a geometry to a compound Step.
Then there is a third way and this is the one we used in the example above. This is the **Read_Geom** command.
The syntat of this command is:
**Read_Geom** ( *Step number* );
We can use this command when we want to pass a specific geometry to a calculation that is not explicitly given
inside the *New_Step - Step_End* structure and it is also not the one from the previous step. Then we just pass the
number of the step of the calculation we are interesting in just before we run our new calculation. For more details
regarding the *Read_Geom* command please refer to section *Read_Geom* .

**6.20.4 Data manipulation**

One of the most powerfull features of *Compound* is it’s direct access to properties of the calculation. In order to
use these properties we defined the *Read* command. In the previous example we use it to read the SCF energy of
the calculation:
```
Read energies[iang] = SCF\_ENERGY[jobStep];

```
The syntax of the command is:

**Read** *variable name* **=** *property*

where *variable name* is the name of a variable that is already defined, *property* is the property from the known
properties found in table *List of known Properties* and *step* is the step of the calculation we are interested in. For
more details in the *Read* command please refer to section *Read* .

(continues on next page)

**6.20. Compound Methods** **439**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

Once all data are available we can use them in equations like in any programming language.

The syntax of the print statement is:

**print(** *format string, [variables]* **);**

For example in the previous script we use it like:
```
print(" %3d %6.2lf %16.12lf \n",JobStep,angle, E0 );

```
where *%3d, %6.2lf* and *%16.2lf* are format identifiers and *JobStep, angle* and *E0* are previously defined variables.
The syntax follows closely the widely accepted syntax of the *printf* command in the programming language C. For
more details regarding the *print* statememnt please refer to section: *Print* .

Similar to the *print* command are the *write2file* and *write2string* commands that are used to write instead of the
output file, either to a file we choose or to produce a new string.

Finally it is really importnat not to forget that every compound file should finish with a final **End** .

Once we run the previous example we get the following output:



(continues on next page)

**440** **Chapter 6. Running Typical Calculations**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

with the step, the angle for the corresponding step, the energy of the constrained optimized energy plus the symbols
for the two minima and the maximum in the potential.

**6.20. Compound Methods** **441**

**ORCA Manual** **,** **Release 6.0.1**

**442** **Chapter 6. Running Typical Calculations**

**CHAPTER**