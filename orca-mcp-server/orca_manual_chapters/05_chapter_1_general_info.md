### **ONE** **GENERAL INFORMATION** **1.1 Program Components**

The program system ORCA consists of several separate programs that call each other during a run. The following
basic modules are included in this release (listed in alphabetical order):

Utility programs:

**1**

**ORCA Manual** **,** **Release 6.0.1**

Friends of ORCA:

In principle every individual module can also be called “standalone”. However, it is most convenient to do everything via the main module.

There is no real installation procedure. Just copy the executables wherever you want them to be and make sure
that your path variable contains a reference to the directory where you copied the files. This is important to make
sure that the programs can call each other (but you can also tell the main program the explicit position of the other
programs in the input file as described below). The xtb tool (recommended version 6.7.1 or higher) needs to be
[downloaded separately from the Grimme lab’s repository. The xtb binary needs to be copied to the directory to](https://github.com/grimme-lab/xtb/releases/tag/v6.7.1)
which the orca binaries were copied to.
### **1.2 Units and Conversion Factors**

Internally the program uses atomic units. This means that the unit of energy is the Hartree (Eh) and the unit of
length is the Bohr radius ( *𝑎* 0 ). The following conversion factors to other units are used:

**2** **Chapter 1. General Information**

**CHAPTER**