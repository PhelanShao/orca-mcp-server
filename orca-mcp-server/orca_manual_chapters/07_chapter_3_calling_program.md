### **THREE** **CALLING THE PROGRAM (SERIAL AND PARALLEL)** **3.1 Calling the Program**

Under Windows the program is called from the command prompt! (Make sure that the PATH variable is set such
that the orca executables are visible)
```
orca MyMol.inp > MyMol.out

```
Under UNIX based operating systems the following call is convenient (here also: make sure that the PATH variable
is set to the directory where the orca executables reside):
```
orca MyMol.inp >& MyMol.out &

```
The program writes to *stdout* and *stderr* . Therefore the output must be redirected to the file *MyMol.out* in this
example. *MyMol.inp* is a free format ASCII file that contains the input description. The program will produce
a number of files *MyMol.x.tmp* and the file *MyMol.gbw* . The “*.gbw” file contains a binary summary of the
calculation. GBW stands for “Geometry-Basis-Wavefunction”. Basically this together with the calculation flags is
what is stored in this file. You need this file for restarting SCF calculations or starting other calculations with the
orbitals from this calculation as input. The “*.tmp” files are temporary files that contain integrals, Fock matrices
etc. that are used as intermediates in the calculation. If the program exits normally all of these files are deleted.
If it happens to crash you have to remove the files manually ( `rm MyMol*.tmp` under Unix or `del MyMol*.tmp`
under Windows). In case you want to monitor the output file while it is written, you can use the command (under
Unix):
```
tail -f MyMol.out

```
to follow (option -f) the progress of the calculation. Under Windows you have to either open another command
shell and use:



or you have to copy the output file to another file and then use any text editor to look at it.



you cannot use `edit MyMol.out` because this would result in a sharing violation.


**9**

**ORCA Manual** **,** **Release 6.0.1**
### **3.2 Calling the Program with Multiple Processes**

There are parallel versions for Linux, MAC and Windows computers (thanks to the work of Ms Ute Becker) which
make use of OpenMPI (open-source MPI implementation) and Microsoft MPI (Windows only). Most of the important modules in ORCA can run in parallel or in multi-process mode:

**3.2.1 List of Parallelized Modules**

The following modules and utility programs are presently parallelized/usable in multi-process mode:

Thus, all major modules are parallelized in the present version. The efficiency is such that for RI-DFT perhaps up
to 16 processors are a good idea while for hybrid DFT and Hartree-Fock a few more processors are appropriate.
Above this, the overhead becomes significant and the parallelization loses efficiency. Coupled-cluster calculations
usually scale well up to at least 8 processors but probably it is also worthwhile to try 16. For Numerical Frequencies
or Gradient runs it makes sense to choose nprocs = 4 or 8 times 6*Number of Atoms. For VPT2 on larger systems
you may well even try 16 times 6*Number of Atoms - if you use multiple processes per displacement. (Please check
out the section *Hints on the Use of Parallel ORCA* what you have to take care of for such kind of calculations.)

If you run a queuing system you have to make sure that it works together with ORCA in a reasonable way.

**Note:** Parallelization is a difficult undertaking and there are many different protocols that work differently for different machines. Please understand that we can not provide support for each and every platform. We are trying our
best to make the parallelization transparent and provide executables for various platforms but we can not possibly
guarantee that they always work on every system. Please see the download information for details of the version.

**10** **Chapter 3. Calling the Program (Serial and Parallel)**

**ORCA Manual** **,** **Release 6.0.1**

**3.2.2 Hints on the Use of Parallel ORCA**

Many questions that are asked in the discussion forum deal with the parallel version of ORCA. Please understand
that we cannot possibly provide one-on-one support for every parallel computer in the world. So please, make every
effort to solve the technical problems locally together with your system administrator. Here are some explanations
about what is special to the parallel version, which problems might arise from this and how to deal with them:

1. Parallel ORCA can be used with OpenMPI (on Linux and MAC) or MS-MPI (on windows) only. Please see
the download information for details of the relevant OpenMPI-version for your platform.

The OpenMPI version is configurable in a large variety of ways, which cannot be covered here. For a more
[detailed explanation of all available options, cf. http://www.open-mpi.org](http://www.open-mpi.org)

2. Please note that the OpenMPI version is dynamically linked, that is, it needs at runtime the OpenMPI libraries
(and several other standard libraries)! If you compile MPI on your own computer, you also need to have a
fortran compiler, as `mpirun` will contain fortran bindinngs.

(Remember to set `PATH` and `LD_LIBRARY_PATH` to mpirun and the mpi libraries)

3. Many problems arise, because parallel ORCA does not find its executables. To avoid this, it is crucial to call
ORCA with its complete pathname. The easiest and safest way to do so is to include the directory with the
orca-executables in your `$PATH` . Then start the calculation:



This seems redundant, but it really is important if you want to run a parallel calculation to call ORCA with
the full path! Otherwise it will not be able to find the parallel executables.

4. Assuming that the MPI libraries are installed properly on your computer, it is fairly easy to run the parallel
version of ORCA. You simply have to specify the number of parallel processes, like:
```
 ! PAL4 # everything from PAL2 to PAL8 and Pal16, Pal32, Pal64 is recognized

```
or



The parallelized modules of ORCA are started by the (serial) ORCA-Driver. If the driver finds `PAL4` or `%pal`
`nprocs 4 end` (e.g.) in the input, it will start up the parallel modules instead of the serial ones. So - please
do not start the driver with mpirun! (Please see below for what else has to be taken care of for a successfull
parallel run.)

5. It is recommended to run orca in local (not nfs-mounted) scratch-directories, ( `/tmp1` or `/usr/local` e.g.)
and to renew these directories for each run to avoid confusion with left-overs of a previous run.

6. It has proven convenient to use “wrapper” scripts. These scripts should



A basic example of such a submission script for the parallel ORCA version is shown below (this is for the
Torque/PBS queuing system, running on Apple Mac OS X):

**3.2. Calling the Program with Multiple Processes** **11**

**ORCA Manual** **,** **Release 6.0.1**



7. Parallel ORCA distinguishes the following cases of disk availability:

     - each process works on its own (private) scratch directory (the data on this directory cannot be seen by
any other process). This is flagged by **“working on local scratch directories”**

     - all processes work in a common scratch directory (all processes can see all file-data) ORCA will distinguish two situations:

**–**
all processes are on the same node - flagged by **“working on a common directory”**

**–**
the processes are distributed over multiple nodes but accessing a shared filesysten - flagged by
**“working on a shared directory”**

**12** **Chapter 3. Calling the Program (Serial and Parallel)**

**ORCA Manual** **,** **Release 6.0.1**

    - there are at least 2 groups of processes on different scratch directories, one of the groups consisting of
more than 1 process - flagged by **“working on distributed directories”**

Parallel ORCA will find out, which of these cases exists and will handle the I/O respectively. If ORCA states
disk availability differently from what you would expect, check the number of available nodes and/or the
distribution pattern (fill_up/round_robin)

8. If Parallel ORCA finds a file named “ `MyMol.nodes` ” in the directory where it’s running, it will use the nodes
listed in this file to start the processes on, provided your input file was “ `MyMol.inp` ”. You can use this file
as your machinefile specifying your nodes, using the usual OpenMPI machinefile notation.



or



**Note:** If you run the parallel ORCA version on only one computer, you do not need to provide a nodefile,
and neither have to enable an rsh/ssh access, as in this case the processes will simply be forked! If you start
ORCA within a queueing system you also don’t need to provide a nodefile. The queueing system will care
for it.

9. It is possible to pass additional MPI-parameters to mpirun by adding these arguments to the ORCA call - all
arguments enclosed in a single pair of quotes:
```
  /mypath_orca_executables/orca MyMol.inp "--bind-to core"

```
– or – for multiple arguments
```
  /mypath_orca_executables/orca MyMol.inp "--bind-to core --verbose"

```
10. If the MPI-environment variables are not equally defined on all participating compute nodes it might be
advisable to export these variables. This can be achieved by passing the following additional parameters to
mpirun via the ORCA call:
```
  /mypath_orca_executables/orca MyMol.inp "-x LD_LIBRARY_PATH -x PATH"

```
11. An additional remark on multi-process numerical calculations (frequencies, gradient, hybrid Hessian): The
processes that execute these calculations do not work in parallel, but independently, often in a totally asynchronous manner. The numerical calculations will start as many processes, as you dedicated for the parallel
parts before and they will run on the same nodes. If your calculation runs on multiple nodes, you have to set
the environment variable `RSH_COMMAND` to either “ `rsh` ” or “ `ssh` ”. If `RSH_COMMAND` is not defined, ORCA
will abort. This prevents that all processes of a multi-node run are started on the ‘master’-node.

12. On multiple user request the ‘parallelization’ of NumCalc has been made more flexible. If before ORCA
would start nprocs displacements with a single process each, the user can now decide on how many processes
should work on a single displacement.

For this the nprocs keyword got a sibling:



This setting will ORCA make use 32 processes, with 4 processes working on the same displacement, thus
running 8 displacements simultaneously. The methods that can profit from this new feature are

**3.2. Calling the Program with Multiple Processes** **13**

**ORCA Manual** **,** **Release 6.0.1**

    - all NumCalc-methods: as NumGrad, NumFreq, VPT2, Overtones, NEB, and GOAT.

     - the analytical Hessian, leading to a nice increase of parallel performance for really large calculations.

It is highly recommended to choose nprocs_group to be an integer divisor of nprocs_world!

For convenient use a couple of standard ‘groupings’ are made available via simple input keyword:



**Note:** If your system-administration does not allow to connect via rsh/ssh to other compute nodes, you
unfortunately cannot make use of parallel sub-calculations within NumCalc runs. This affects NEB as well
as GOAT, VPT2, Overtone-and-Combination-Bands, as well as Numerical Frequencies and Gradients.

**14** **Chapter 3. Calling the Program (Serial and Parallel)**

**CHAPTER**