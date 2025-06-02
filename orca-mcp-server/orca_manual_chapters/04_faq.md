### **FAQ – FREQUENTLY ASKED QUESTIONS** **0.2 Why do some of my calculations give slightly different results** **with ORCA-5?**

Besides the new grids there has been some change to the default settings in ORCA-6.

**0.2.1 Why do some of my calculations give slightly different results with ORCA-**
**6.0.0?**

When running RPA or the CP-SCF with COSX, the algorithm from ORCA-6.0.0 was hard-coded to a memoryhungry one, which was not the original intention. In ORCA-6.0.1 that was fixed, and the automatic one is now the
default (see, for example, *CP-SCF Options* ). This might cause very small differences to these results, specially if
the number of densities is small.

This does not affect any “normal” energy, gradient or etc. calculations. Only those particular cases of RPA and
CP-SCF.
### **0.3 Why is ORCA called ORCA?**

Frank Neese made the decision to write a quantum chemistry program in the summer of 1999 while finishing a
postdoc at Stanford University. While thinking about a name for the program he wanted to write he decided against
having yet another “whatever-Mol-something”. The name needed to be short and signify something strong yet
elegant.

During this time in the US Frank went on a whale watching cruise at the California coast—the name “ORCA”
stuck. It is often asked whether ORCA is an acronym and over the years, various people made suggestions what
acronym this could possibly be. At the end of the day it just isn’t an acronym which stands for anything. It stands
for itself and the association which comes with it.
### **0.4 How do I install ORCA on Linux / MacOS / Windows?**

On Linux and MacOS the most convenient way to install ORCA is by using the command-line installer. You
have to download a .run file, e.g. `orca_6_0_0_linux_x86-64_shared_openmpi416.run` . Then make the file
executable, that is, open a terminal, enter the directory in which you stored the file and enter:
```
chmod a+x orca_6_0_0_linux_x86-64_shared_openmpi416.run

```
Afterwards you can simple execute the file, like
```
./orca_6_0_0_linux_x86-64_shared_openmpi416.run

```
The installer will install orca in a user directory, as well as set the path to include the orca directory. After *opening*
*a new window* ORCA can be used as indicated.

The installer has a few more options, like extract-only, setting the path interactively, and setting the path by option:



The options have to be given *after* a double dash, e. g.
```
./orca_6_0_0_linux_x86-64_shared_openmpi416.run -- -p /my/home/orca/dir

```

**vii**

**ORCA Manual** **,** **Release 6.0.1**
### **0.5 How do I install the xtb module?**

[Please download xtb version 6.7.1 from the Grimme lab’s repository Grimme lab’s repository and copy the xtb](https://github.com/grimme-lab/xtb/releases/tag/v6.7.1)
binary into the orca directory.
### **0.6 I’ve installed ORCA, how do I start it?**

First and most importantly, ORCA is invoked from the command line on all platforms. A simple click on a binary
or an input file won’t start a calculation. Under Linux and MacOS you need to open a terminal instance and navigate
to the folder containing an example.inp file. You can run an ORCA calculation with the command:
```
<full orca binary folder path>/orca example.inp > example.out

```
Similarly, under Windows you need to open a command prompt (Win7, Win8) or a power shell (Win10), navigate
to said directory and execute the following command:
```
<full orca binary folder path>/orca example.inp > example.out
### **0.7 How do I cite ORCA?**

```
Please do **NOT** just cite the generic ORCA reference given below but also cite in addition our original papers! We
give this program away for free to the community and it is our pleasure and honour to do so. Our payment are
your citations! This will create the visibility and impact that we need to attract funding which in turn allows us to
continue the development. So, **PLEASE**, go the extra mile to look up and properly cite the papers that report the
development and ORCA implementation of the methods that you have used in your studies!

The generic reference for ORCA is:
Neese,F.; Wennmohs,F.; Becker,U.; Riplinger,C. “The ORCA quantum chemistry program package” *J. Chem.*
*Phys.*, **2020** 152 Art. No. L224108 doi.org/10.1063/5.0004608

There has been an update for ORCA 5.0:
Neese, F. “Software update: The ORCA program system—Version 5.0” *Wiley Interdisciplinary Reviews: Compu-*
*tational Molecular Science*, **2022**, Vol. 12, Issue 5, p. e1606.
### **0.8 Are there recommended programmes to use alongside ORCA?**

[As a matter of fact there are: We make extensive use of Chemcraft. It is interesting to note that it works well in](http://www.chemcraftprog.com)
[MacOS or Linux (using Wine or a virtual machine). Another popular visualization programme is Chimera together](https://www.cgl.ucsf.edu/chimera/)
[with the SEQCROW plugin.](https://github.com/QChASM/SEQCROW)

[OpenBabel is very useful for file conversion to various chemical formats.](http://openbabel.org/wiki/Main_Page)

[Finally, Avogadro is an excellent tool to edit molecular geometries. It is also able to generate ORCA input files.](http://avogadro.cc)
[The Avogadro version with the latest ORCA modifications is available on the ORCA download site.](https://orcaforum.kofo.mpg.de/app.php/dlext/)

[For other valuable questions/suggestions, please check out the ORCA forum.](https://orcaforum.kofo.mpg.de/index.php)

**viii** **Chapter 0. FAQ – frequently asked questions**

**ORCA Manual** **,** **Release 6.0.1**
### **0.9 My old inputs don’t work with the new ORCA version! Why?**

Please be aware that between ORCA revisions keywords and defaults might have changed or keywords may have
been deprecated (for detailed information please see the Release Notes). It is therefore not unexpected that the
same inputs will now either give slightly different results, or will totally crash. If you are unsure about an input,
please consult the manual. It is provided by the ORCA developers and should contain all information implemented
in the published version of ORCA.
### **0.10 My SCF calculations suddenly die with ‘Please increase Max-** **Core’! Why?**

The SCF cannot restrict its memory to a given MaxCore, which, in the past, has led to crashes due to lack of
memory after many hours of calculation. To prevent this, the newer ORCA versions will try to estimate the memory
needed at an early stage of the calculation. If this estimation is smaller than MaxCore, you are fine. If it is larger
than MaxCore, but smaller than 2*MaxCore, ORCA will issue a warning and proceed. If the estimation yields a
value that’s larger than 2*MaxCore, ORCA will abort. You will then have to increase MaxCore. Please note, that
MaxCore is the amount of memory dedicated to each process!
### **0.11 When dealing with array structures, when does ORCA count** **starting from zero and in which cases does counting start** **from one?**

Since ORCA is a C++ based program its internal counting starts from zero. Therefore all electrons, atoms, frequencies, orbitals, excitation energies etc. are counted from zero. User-based counting such as the numeration of
fragments is counted from one.
### **0.12 How can I check that my SCF calculation converges to a cor-** **rect electronic structure?**

The expectation value ⟨︀ *𝑆* [2] [⟩︀] is an estimation of the spin contamination in the system. It is highly recommended
for open-shell systems, especially with transition metal complexes, to check the UCO (unrestricted corresponding
orbitals) overlaps and visualise the corresponding orbitals. Additionally, spin-population on atoms that contribute
to the singly occupied orbitals is also an identifier of the electronic structure.
### **0.13 I can’t locate the transition state (TS) for a reaction expected** **to feature a low/very low barrier, what should I do?**

For such critical case of locating the TS, running a very fine (e.g. 0.01 Å increment of the bond length) relaxed
scan of the key reaction coordinate is recommended. In this way the highest energy point on a very shallow surface
can be identified and used for the final TS optimisation.

**0.9. My old inputs don’t work with the new ORCA version! Why?** **ix**

**ORCA Manual** **,** **Release 6.0.1**
### **0.14 During the geometry optimisation some atoms merge into** **each other and the optimisation fails. How can this problem** **be solved?**

This usually occurs due to the wrong or poor construction of initial molecular orbital involving some atoms. Check
the basis set definition on problematic atoms and then the corresponding MOs!
### 0.15 While using MOREAD feature in ORCA, why am I getting an error **saying, “no orbitals found in the .gbw file”?**

ORCA produces the `.gbw` file immediately after it reads the coordinates and basis set information. If you put a
`.gbw` file from a previous calculation with same base name as your current input into the working directory, it will
be overwritten and the previous orbital data will be lost. Therefore, it is recommended to change the file name or
`.gbw` extension to something else ( `.gbw.old`, for example).
### **0.16 With all the GRID and RI and associated basis set settings I’m** **getting slightly confused. Can you provide a brief overview?**

Hartree–Fock (HF) and DFT require the calculation of Coulomb and exchange integrals. While the Coulomb
integrals are usually done analytically, the exchange integrals can be evaluated semi-numerically on a grid. Here,
the pure DFT exchange is calculated on one type of grid (controlled through the `GRID` keyword) while the HF
exchange can be evaluated on a different, often smaller grid ( `GRIDX` ). For both parts, further approximations can
be made (RI-J and RI-K [1] or COSX, respectively). When RI is used, auxiliary basis sets are required (<basis >/ J
for RI-J and <basis >/ JK for RI-JK). The following possible combinations arise:

  - HF calculation

**–**
Exact J + exact K: no auxiliary functions and no grids needed.

**–** RIJ + exact K ( `RIJONX`, `RIJDX` ): <basis >/ J auxiliaries, no grids.

**–**
RIJ + RIK = RIJK: <basis >/JK auxiliaries, no grids.

**–** RIJ + COSX: <basis >/ J auxiliaries, COSX grid controlled by the `GRIDX` keyword.

  - GGA DFT functional

**–** Exact J + GGA-XC: no auxiliary functions needed, DFT grid controlled by the `GRID` keyword.

**–** RIJ + GGA-XC: <basis >/ J auxiliaries, DFT grid controlled by the `GRID` keyword.

  - Hybrid DFT functional

**–** Exact J + exact K + GGA-XC: no auxiliary functions needed, DFT grid controlled by the `GRID` keyword.

**–** RIJ + exact K ( `RIJONX`, `RIJDX` ) + GGA-XC: <basis >/ J auxiliaries, DFT grid controlled by the `GRID`
keyword.

**–** RIJ + RIK (RIJK) + GGA-XC: <basis >/ JK auxiliaries, DFT grid controlled by the `GRID` keyword.

**–** RIJ + COSX + GGA-XC: <basis >/ J auxiliaries, COSX grid controlled by the `GRIDX` keyword, DFT
grid controlled by the `GRID` keyword.

1 Note that ORCA can only use RI-K in conjunction with RI-J; hence the combination RI-JK.

**x** **Chapter 0. FAQ – frequently asked questions**

**ORCA Manual** **,** **Release 6.0.1**
### **0.17 There are a lot of basis sets! Which basis should I use when?**

ORCA offers a variety of methods and a large choice of basis sets to go with them. Here is an incomplete overview:







**0.17. There are a lot of basis sets! Which basis should I use when?** **xi**

**ORCA Manual** **,** **Release 6.0.1**

**xii** **Chapter 0. FAQ – frequently asked questions**

**CHAPTER**