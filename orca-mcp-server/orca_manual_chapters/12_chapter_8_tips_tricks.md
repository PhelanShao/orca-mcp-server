### **EIGHT** **SOME TIPS AND TRICKS** **8.1 Input**

For calculations on open-shell systems we recommend to use the keywords `!UNO !UCO` in the input line. This
will generate quasi-restricted molecular orbitals `QRO`, unrestricted natural spin-orbitals `UNSO`, unrestricted natural
orbitals `UNO` and unrestricted corresponding orbitals `UCO` . Moreover, it will print the UCO overlaps in the output,
which can provide very clear information about the spin-coupling in the system. Below an example of the input
and section of the output is provided.
```
!B3LYP def2-SVP UNO UCO TightSCF

```
The UCO overlap section in the output will look like:

The overlap corresponds to a value usually less than 0.85 denotes a spin-coupled pair. Whereas, values close to
1.00 and 0.00 refers to the doubly occupied and singly occupied orbitals respectively.
### **8.2 Cost versus Accuracy**

A difficult but important subject in electronic structure theory is to balance the price/accuracy ratio of the calculations. This ratio is governed by: (a) the method used, (b) the basis set used and (c) the cutoffs and tolerances used.
There are certainly differing opinions among scientists and I merely quote a few general, subjective points:

  - Calculations with minimal basis sets are always unreliable and are only good for explorations. This is also
true for small split-valence basis sets like 3-21G, 3-21GSP and perhaps also 4-22GSP. These basis sets are
significantly more reliable than their minimal basis counterparts but are not capable of delivering quantitatively reliable results. They may, however, be the only choice if very large molecules are targeted.

  - In our own research we almost exclusively use the basis sets of the Karlsruhe group for non-relativistic
calculations. They have been updated to the “def2” set that is more consistent than the older basis sets.

**1237**

**ORCA Manual** **,** **Release 6.0.1**

  - Def2-SV(P) is the smallest and computationally efficient split-valence basis set and is largely identical to the
old SV(P), except for the transition metals which have more consistent polarization sets.

  - Def2-TZVP is different from the old TZVP. It has been realized that if one invests into an accurate triplezeta description of the valence region it makes limited sense to only employ a single polarization function.
The accuracy is then limited by the polarization set and is not much better than what one gets from SV(P).
Hence, def2-TZVP contains a single p-set for hydrogens but is otherwise very similar to the old TZVPP
basis set, e.g. it contains 2d1f polarization for main group elements and much more extensive polarization
sets for transition metals. The highest polarization function (f for main group) does add substantially to the
computational effort. Hence, we often use def2-TZVP without the f polarization function. In order to do
that one can use the keyword def2-TZVP(-f). Together with RI or RIJCOSX this is still computationally
economic enough for most studies.

  - Def2-TZVPP is a fully consistent triple-zeta basis set that provides excellent accuracy for SCF calculations
(HF and DFT) and is still pretty good for correlated calculations. It is a good basis set to provide final single
point energies.

  - Def2-QZVPP is a high accuracy basis set for all kinds of calculations. It provides SCF energies near the
basis set limit and correlation energies that are also excellent. It is computationally expensive but with RI
and RIJCOSX in conjunction with parallelization it can often still be applied for final single-point energy
calculations. In conjunction with such large basis sets one should also increase the accuracy of the integration grids in DFT and RIJCOSX — it would be a shame to limit the accuracy of otherwise very accurate
calculations by numerical noise due to the grid.

  - Correlation consistent basis sets provide good correlation energies but poor to very poor SCF energies. For
the same size, the ano-pVDZ basis sets are much more accurate but are also computationally more expensive.
Except for systematic basis set extrapolation we see little reason to use the cc bases.

  - Pople basis sets are somewhat old fashioned and also much less consistent across the periodic table than the
basis from the Karlsruhe group. Hence, we generally prefer the latter.

  - For scalar relativistic calculations (ZORA and DKH) we strongly recommend to use the SARC bases in
conjunction with the ZORA or DKH recontractions of the Karlsruhe bases. They are also flexible enough in
the core region for general purpose and spectroscopic applications.

  - Effective core potentials lead to some savings (but not necessarily spectacular ones) compared to all-electron
relativistic calculations. For accurate results, small core ECPs should be used. They are generally available
for the def2 Karlsruhe type basis sets for elements past krypton. In general we prefer Stuttgart–Dresden
ECPs over LANL ones. For the first transition row, the choices are more meager. Here Karlsruhe basis sets
do not exist in conjunction with ECPs and you are bound to either SDD or LANL of which we recommend
the former. Geometries and energies are usually good from ECPs, but for property calculations we strongly
recommend to switch to all electron scalar relativistic calculations using ZORA (magnetic properties) or
DKH (electric properties).

  - You can take advantage of a built-in basis set (printed using `!PrintBasis` or `orca_exportbasis` ) and then
modify it by uncontracting primitives, adding steeper functions etc. (fully uncontracted bases are generated
via `uncontract` in `%basis` ) Alternatively, some basis sets exist that are of at least double-zeta quality in
the core region including the DZP and Dunning basis sets. For higher accuracy you may want to consider
the `aug-` series of basis sets. See section *Choice of Basis Set* for more about basis set input.

  - Likewise, if you are doing calculations on anions in the gas phase it is advisable to include diffuse functions
in the basis set. Having these diffuse functions, however, makes things much more difficult as the locality of
the basis set is significantly reduced. If these functions are included it is advisable to choose a small value
for `Thresh` (10 *[−]* [12] or lower). This is automatically done if the smallest eigenvalue of the overlap matrix
is below DiffSThresh (which is 1e-6 by default). Also, diffuse functions tend to introduce basis set linear
dependency issues, which can be solved by setting `Sthresh` to a larger value than the default 10 *[−]* [7] (see
Section *Linear Dependence* ). Any value of `Sthresh` beyond 1e-6 has to be used carefully, specially if one
is running geometry optimizations, were different basis might be cut off during different geometry steps, or
when comparing different conformers since there could be some discontinuity on the final basis set.

  - The integration grids used in DFT should be viewed together with the basis set. If large basis set calculations
are converged to high accuracy it is advisable to also use large DFT integration grids (like `! DEFGRID3` ).
For “unlimited” accuracy (i.e. benchmark calculations) it is probably best to use product grids ( `Grid=0` )

**1238** **Chapter 8. Some Tips and Tricks**

**ORCA Manual** **,** **Release 6.0.1**

with a large value for `IntAcc` (perhaps around 6.0). The default grids have been chosen such that they
provide adequate accuracy at the lowest possible computational cost, but for all-electron calculations on
heavy elements in conjunction with scalar relativistic Hamiltonians you should examine the grid dependency
very carefully and adjust these parameters accordingly to minimize errors. You should be aware that for large
molecules the exchange-correlation integration is usually *not* the dominating factor (not even in combination
with RI-J).

  - Similarly important is the value of `Thresh` that will largely determine the tunaround time for direct SCF
calculations. It may be possible to go to values of 10 *[−]* [6] –10 *[−]* [8] which will result in large speed-ups. However,
the error in the final energy may then be 3 orders of magnitude larger than the cutoff or, sometimes, your
calculation will fail to converge, due to the limited integral accuracy. In general it will not be possible to
converge a direct SCF calculation to better than `Thresh` (the program will also not allow this). For higher
accuracy values of maybe 10 *[−]* [10] –10 *[−]* [12] may be used with larger molecules requiring smaller cutoffs. In cases
where the SCF is almost converged but then fails to finally converge (which is very annoying) decreasing
`Thresh` and switch to `TRAH` SCF is recommended. In general, `TCut` should be around `0.01` *×* `Thresh` in
order to be on the safe side.

  - DFT calculations have many good features and in many cases they produce reliable results. In particular if
you study organic molecules it is nevertheless a good idea to check on your DFT results using MP2. MP2 in
the form of RI-MP2 is usually affordable and produces reliable results (in particular for weaker interactions
where DFT is less accurate). In case of a large mismatch between the MP2 and DFT results the alarm rings
— in many such cases MP2 is the better choice, but in others (e.g. for redox processes or transition metal
systems) it is not. Remember that SCS-MP2 (RI-SCS-MP2) and double hybrid functionals will usually
produce more accurate results than MP2 itself.

  - Coupled-cluster calculations become more and more feasible and should be used whenever possible. The
LPNO-CCSD, DLPNO-CCSD and DLPNO-CCSD(T) calculations are available for single-point calculations
and provide accurate results. However, a coupled-cluster study does require careful study of basis set effects
because convergence to the basis set limit is very slow. The established basis set extrapolation schemes may
be very helpful here. For open-shell molecules and in particular for transition metals one cannot be careful
enough with the reference. You have to carefully check that the Hartree-Fock calculation converged to the
desired state in order to get coupled-cluster results that are meaningful. Orbital optimized MP2, CASSCF
or DFT orbitals may help but we have often encountered convergence difficulties in the coupled-cluster
equations with such choices.

  - Generally speaking, CEPA is often better than CCSD and approaches the quality of CCSD(T). It is, however,
also a little less robust than CC methods because of the less rigorous treatment of the single excitations in
relation to electronic relaxation.

  - Don’t forget: “Computers don’t solve problems – people do”. Not denying the importance and desire to
obtain accurate numbers: don’t forget that in the end it is the molecule and its chemistry or spectroscopy that
we want to learn something about. The fact that you may be able to compute one or the other number a little
more accurate doesn’t mean that this helps us understanding the physics and chemistry of our target system
any better. The danger of getting locked into technicalities and miss the desired insight is real!
### **8.3 Converging SCF Calculations**

Despite all efforts you may still find molecules where SCF convergence is poor. These are almost invariably related
to open-shell situations and the answer is almost always to provide “better” starting orbitals. Here is my standard
strategy to deal with this (assuming a DFT calculation):

  - Perform a small basis set ( `SV` ) calculation in using the `LSD` or `BP` functional and RI approximation with a
cheap auxiliary basis set. Set `Convergence=Loose` and `MaxIter=200` or so. The key point is to use a
large damping factor and damp until the DIIS comes into a domain of convergence. This is accomplished
by `SlowConv` or even `VerySlowConv` . If you have an even more pathological case you may need to set
`DampFac` larger and `DampErr` smaller than chosen by these defaults. This calculation is quite crude and may
take many cycles to converge. It will however be rather quick in terms of wall clock time. If the DIIS gets
stuck at some error 0.001 or so the `SOSCF` (or even better `TRAH` ) could be put in operation from this point on.

**8.3. Converging SCF Calculations** **1239**

**ORCA Manual** **,** **Release 6.0.1**

  - Use the orbitals of this calculation and `GuessMode=CMatrix` to start a calculation with the target basis set.
In DFT we normally use a pure GGA functional (e.g. BP86). This calculation normally converges relatively
smoothly.

  - Use the target functional, grid etc. to get the final calculation converged. In many cases this should converge
fairly well now.

Here are a few other things that can be tried:

  - Try to start from the orbitals of a related closed-shell species. In general closed-shell MO calculations tend
to converge better. You then hope to reach the convergence radius of another converger for the open-shell

case.

  - Try to start from the orbitals of a more positive cation. Cation calculations tend to converge better.

  - Try to start from a calculation with a smaller basis set. Smaller basis sets converge better. Then you have
the choice of `GuessMode=CMatrix` or `GuessMode=FMatrix` which will affect the convergence behavior.

  - Use large level shifts. This increases the number of iterations but stabilizes the converger. ( `shift shift`
`0.5 erroff 0 end` )

  - If you are doing DFT calculations try to start from a Hartree-Fock solution for your molecule. HF calculations tend to converge somewhat better because they have a larger HOMO-LUMO gap (there are of course
exceptions).

  - Carefully look at the starting orbitals ( `Print[P_GuessOrb]=1` ) and see if they make sense for your
molecule. Perhaps you have to reorder them (using `Rotate` ) to obtain smooth convergence.

  - Most of the time the convergence problems come from “unreasonable” structures. Did you make sure that
your coordinates are in the correct units (Angström or Bohrs?) and have been correctly recognized as such
by the program?

  - If you have trouble with UHF calculations try ROHF (especially SAHF or CAHF) first and then go to the
UHF calculation.

  - Fool around with `Guess=Hueckel`, `PAtom` or even `HCore` .

  - It may sometimes be better to converge to an undesired state and then take the orbitals of this state, reorder
them (using `Rotate` ) and try to converge to the desired state.

  - Similarly, bad orbitals may be manipulated using the SCF stability analysis (section *SCF Stability Analysis* )
to provide a new guess.

  - Try to start the calculation with a large damping factor ( `DampFac=0.90` ; or even larger) and specify a relatively small DIIS error to turn damping off (say `DampErr=0.02` ;). This will increase the number of cycles
but may guide you into a regime were the calculation actually converges.

  - The advices above mostly apply to Hartree-Fock and DFT. For CASSCF, the available options and how they
can aid to overcome convergence problems are described in the CASSCF manual section. In many cases
modifying the initial guess or adding a level shift will help. Do not hesitate to use large level-shifts (e.g 2.0
or even 3.0). The manual is accompanied by CASSCF tutorial that goes through many details of the process
including practical advices on convergence. The choice of initial guess is crucial. Some guesses work better
for organic molecules while others excel for transition-metal complexes. The tutorial therefore discusses
various initial guess options available in ORCA.

  - If nothing else helps, stop, grab a friend and go to the next pub (you can also send me an unfriendly e-mail
but this will likely not make your calculation converge any quicker; ¨ *⌣* ).

**1240** **Chapter 8. Some Tips and Tricks**

**ORCA Manual** **,** **Release 6.0.1**
### **8.4 Choice of Theoretical Method**

The array of available functionals makes it perhaps difficult to decide which one should be used. While this
is a matter of ongoing research and, in the end, can only be answered by experimentation and comparison to
experimental results or high-level *ab initio* calculations, I may attempt to give some guidelines.

The simplest density functionals (and in general the least accurate) are the local functionals ( `Functional=LSD` ).
Although several variants of the local DFT exist in ORCA there is little to choose among them — they give more
or less the same result.

The gradient corrected functionals are (very slightly) more expensive because the gradient of the electron density at
each point in space must be computed, but they are also significantly more accurate for structures and energetics of
molecules. The various gradient corrected functionals (GGA functionals) are generally similar in their behavior.
The BP functional is probably the most widely used in transition metal chemistry. The BLYP, PBE or PW91
functionals may also be considered. PWP has been shown to be rather good for hyperfine coupling predictions of
light nuclei in radicals. In addition, since no Hartree-Fock exchange is used you have the ability to speed up the
calculation by a factor of 4–40 if the RI approximation is employed. This approximation is really advisable for the
LSD and GGA functionals since it leads to very little or no loss in accuracy while giving large speedups. It is, in
fact, automatically chosen to be operative when you use pure functionals.

In addition, meta-GGAs (TPSS) are available in ORCA and may provide superior results for certain properties
compared to standard GGAs. They are somewhat but not much more expensive to evaluate than standard GGAs.

For many properties (but not necessarily for geometries), more accurate results are usually given by the hybrid
density functionals that incorporate part of the HF exchange. The computational effort for these is higher than for
the GGA functionals because the HF exchange needs to be computed exactly. Very large speedups result if this is
done via the RIJCOSX approximation. Nevertheless for energetics, properties and for predictions of charge and
spin densities the hybrids appear to be the best choice. The prototype functional of this kind is B3LYP, which has
been very widely used throughout chemistry and is successful for a wide range of molecular properties. Other
hybrids have been less well tested but maybe a good choice in specific situations, for example the PBE0 functional
has been advertised for NMR chemical shift predictions and other properties. From my personal experience I can
also recommend PBE0 and PWP1 as two functionals that give good predictions for EPR g-values and hyperfine
couplings. The TPSSh meta-GGA hybrid is also very succesful in this area. [1]

Together with DFT, it is often observed that the atom-pairwise dispersion correction of Stefan Grimme (DFT-D3,
and especially the newer DFT-D4) substantially improves the results at no extra cost.

Don’t forget that in present days the MP2 method becomes affordable for molecules of significant size and there
are quite a number of instances where MP2 (and particularly SCS-MP2) will do significantly better than DFT even
if it takes a little longer (the RI approximation is also highly recommended here). The perturbatively corrected
functionals (B2PLYP) may also be a very good choice for many problems (at comparable cost to MP2; note that
even for large molecules with more than 1000 basis functions the MP2 correction only takes about 10-20% of the
time required for the preceding SCF calculation if the RI approximation is invoked. For even larger molecules one
has the option of speeding up the MP2 part even further by the DLPNO approximation).

Beyond DFT and (SCS-)MP2 there are coupled-cluster methods and their implementation in ORCA is efficient.
With the local pair natural orbital methods you can even study molecules of substantial size and with appealing
turnaround times.

When to go to multireference methods is a more complicated question. Typically, this will be the case if multiplets
are desired, pure spin functions for systems with several unpaired electrons, in bond breaking situations or for
certain classes of excited states (loosely speaking: whenever there are weakly interacting electrons in the system).
However, whenever you decide to do so, please be aware that this require substantial insight into the physics and
chemistry of the problem at hand. An uneducated use of CASSCF or MRCI/MRPT method likely yields numbers
that are nonsensical and that at tremendous computational cost. Here, there is no substitute for experience (and
patience ¨ *⌣* ).

1 Some researchers like to adjust the amount of Hartree-Fock exchange according to their needs or what they think is “better” than the
standard. This increases the semiempirical character of the calculations and may represent fixes that only work for a given class of compounds
and/or properties while worsening the results for others. With this caveat in mind it is one of the things that you are free to try if you like it.
However, we do not recommend it since it will deteriorate the comparability of your results with those of other workers the vast majority of
which use standard functionals. An alternative to changing the amount of HF exchange could be to simply construct a linear regression for a
number of known cases and then use the linear regression.

**8.4. Choice of Theoretical Method** **1241**

**ORCA Manual** **,** **Release 6.0.1**

**1242** **Chapter 8. Some Tips and Tricks**

**APPENDIX**