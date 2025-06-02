### **FIVE** **INPUT OF COORDINATES**

Coordinates can be either specified directly in the input file or read from an external file, and they can be in either
Cartesian (“xyz”) or internal coordinate format (“Z-matrix”).
### **5.1 Reading coordinates from the input file**

The easiest way to specify coordinates in the input file is by including a block like the following, enclosed by star
symbols:



Here `CType` can be one of `xyz`, `int` (or `internal` ), or `gzmt`, which correspond to Cartesian coordinates, internal
coordinates, and internal coordinates in Gaussian Z-matrix format.

The input of Cartesian coordinates in the “ `xyz` ” option is straightforward. Each line consists of the label for a given
atom type and three numbers that specify the coordinates of the atom. The units can be either Ångström or Bohr.
The default is to specify the coordinates in Ångströms (this can be changed through the keyword line or via the
variable `Units` in the `%coords` main block described below).



For example for CO [+] in a *𝑆* = 1 */* 2 state (multiplicity = 2 *×* 1 */* 2 + 1 = 2)



Internal coordinates are specified in the form of the familiar “Z-matrix”. A Z-matrix basically contains information about molecular connectivity, bond lengths, bond angles and dihedral angles. The program then constructs
Cartesian coordinates from this information. Both sets of coordinates are printed in the output such that conversion
between formats is facilitated. The input in that case looks like:



(continues on next page)

**57**

**ORCA Manual** **,** **Release 6.0.1**

(continued from previous page)

The rules for connectivity in the “ `internal` ” mode are as follows:

   - `NA` : The atom that the actual atom has a distance ( `RN` ) with.

   - `NB` : The actual atom has an angle ( `AN` ) with atoms `NA` and `NB` .

   - `NC` : The actual atom has a dihedral angle ( `DN` ) with atoms `NA`, `NB` and `NC` . This is the angle between the actual
atom and atom `NC` when looking down the `NA-NB` axis.

  - Note that - contrary to other parts in ORCA - atoms are counted starting from 1.

Angles are always given in degrees! The rules are compatible with those used in the well known MOPAC and ADF

programs.

Finally, `gzmt` specifies internal coordinates in the format used by the Gaussian program. This resembles the following:



An alternative way to specify coordinates in the input file is through the use of the `%coords` block, which is
organized as follows:

**58** **Chapter 5. Input of Coordinates**

**ORCA Manual** **,** **Release 6.0.1**
### **5.2 Reading coordinates from external files**

It is also possible to read the coordinates from external files. The most common format is a `.xyz` file, which can
in principle contain more than one structure (see section *Multiple XYZ File Scans* for this multiple XYZ feature):
```
* xyzfile Charge Multiplicity Filename

```
For example:
```
* xyzfile 1 2 mycoords.xyz

```
A lot of graphical tools like Gabedit, molden or Jmol can write Gaussian Z-Matrices ( `.gzmt` ). ORCA can also
read them from an external file with the following
```
* gzmtfile 1 2 mycoords.gzmt

```
Note that if multiple jobs are specified in the same input file then new jobs can read the coordinates from previous
jobs. If no filename is given as fourth argument then the name of the actual job is automatically used.

In this way, optimization and single point jobs can be very conveniently combined in a single, simple input file.
Examples are provided in the following sections.
### **5.3 Special definitions**

   - **Dummy atoms** are defined in exactly the same way as any other atom, by using “DA”, “X”, or “Xx” as the
atomic symbol.

   - **Ghost atoms** are specified by adding “:” right after the symbol of the element (see *Counterpoise Correction* ).

   - **Point charges** are specified with the symbol “Q”, followed by the charge (see *Inclusion of Point Charges* ).

   - **Embedding potentials** are specified by adding a “>” right after the symbol of the element (see *Embedding*
*Potentials* ).

   - **Non-standard** isotopes or nuclear charges are specified with the statements “ `M =` ...” and “ `Z =` ...”, respectively, after the atomic coordinate definition.

**Note:**

1. The nuclear charge can adopt non-integer values

2. When the nuclear charge is modified throughca “ `Z =` ...” statement, the total charge of the system
should still be calculated based on the unmodified charge. For example, for a calculation of a single
hydrogen atom whose `Z` is set to 1.5, a charge of 0 and a spin multiplicity of 2 should be entered into
the charge and multiplicity sections of the input file, despite that the actual total charge is 0.5.

   - **Fragments** can be conveniently defined by declaring the fragment number a given atom belongs to in parentheses “ `(n)` ” following the element symbol (see *Fragment Specification* ).

   - **Frozen coordinates**, which are not changed during optimizations in Cartesian coordinates, are defined with
a “$” symbol after the X, Y, and/or Z coordinate value (cf. constraints on all 3 Cartesian components *Con-*
*strained Optimizations* ).

**5.2. Reading coordinates from external files** **59**

**ORCA Manual** **,** **Release 6.0.1**

**60** **Chapter 5. Input of Coordinates**

**CHAPTER**