### **ORCA 6.0 FOREWORD**

Welcome to ORCA 6 – we sincerely hope that you will enjoy it!

ORCA 6.0 is a major turning point for the ORCA project and consequently, it seems appropriate to dwell a little
bit on how we got to this point in this foreword.

The ORCA program suite started its life around 1995 as a semi-empirical program written in Turbo Pascal and
designed to calculate some magnetic and optical spectra of open-shell transition metal complexes in enzyme active
sites. It was unimaginable at the time that it could possibly grow into a major, large-scale software that is used by
tens or thousands of people world-wide.

In its evolution the ORCA package probably had a similar trajectory to many other programs: it started with good
intentions, courage paired with a healthy dose of ignorance and a vision of a few concrete tasks that it should be
able to perform. And it did that. But right there at the beginning, when the foundations were laid for years to come,
there was no master plan. There also was no experience – neither with larger-scale software development, nor with
quantum chemistry in general.

The logical consequence of the absence of a master plan was, that the program grew in a way that was rather needdriven and short-time goal oriented. The original infrastructure was not horrifically bad, but it was not designed in
a way that was strongly suggestive of healthy growth for decades to come. Not surprisingly, after 5-6 generations
of Ph.D. students and postdocs working on it, some individuals more disciplined than others (including the original
author), the inevitable happened: the code started to look intimidating to new students entering the project since
the code started to be clumsy and convoluted.

The consequence of convoluted code is that new programmers start to copy and paste large sections of code which
adds significantly to the overhead and made the code even less readable. One immediate consequence of such
organically grown code is that it is exceedingly difficult to properly adapt it to the challenges of a rapidly changing
hardware landscape and we eventually had to realize that this is also true for the ORCA code.

In the year 2020, when the pandemic hit globally and travelling ceased, there came a time of relative calmness
that allowed for contemplation and also concentrated, continued work. At this time, the SHARK package was
created based on an idea that I had back in 2016. It turned out to be very successful and led to a highly performant
integral code that also was very compact thanks to the loop-kernel-consumer (LKC) concept proposed by Frank
Wennmohs. Together with other innovations, for example large improvements in the chain of spheres exchange
(COSX) approximation by Robert Izsak, Benjamin Helmich Paris and Bernardo de Souza as well the integration
grids in ORCA (by Bernardo de Souza). SHARK, COSX and improved numerical integration formed the core of
what was released as ORCA 5.0 on July 1st 2021. The improved performance by the program was received very
favorably by the user community and led to an explosive growth of the user base. At the point of writing (2024), the
number of ORCA users is increasingly roughly quadratically with time. At the day of writing, ORCA has ~70000
academically registered users and an unknown (but large) number of users in industry.

While we were proud of what we had achieved with ORCA 5.0, it was clear that we had just seen the tip of the
iceberg. What was lurking underneath was a complete redesign of the infrastructure, not just patching SHARK
into the strategic places. This task amounts to basically a complete rewrite of the entire code and a redesign of the
flow of information. This is obviously an intimidatingly complex and large project and something that – to the best
of my knowledge – has never been done in the history of quantum chemistry: take a major, large-scale program
package and redesign it from scratch – but this time with the hindsight and insights from close to 3 decades of
doing it.

Talking to many colleagues a common statement is “if I could start over again, I would do XYZ, but”. In the case
of ORCA, it actually happened – we did just that! It was a long and occasionally painful road and it would be a lie
to not admit that there were moments were I felt like giving up on the idea. But after three long years, it was finally
seen through to the end (well, almost) thanks to the tireless efforts and the development team and the enthusiasm
and patience that the members have contributed.

It was clear to me that the project “rewrite ORCA” is a bad project for Ph.D. students and postdocs and consequently,
I have taken a large part of the tedious work on myself in the hope that the other developers could focus on continuing
doing great science - and they did! And they did by embracing and using the emerging new infrastructure which
was no small feat since the new infrastructure was a moving target for years and the developers had to work around

**i**

**ORCA Manual** **,** **Release 6.0.1**

bugs, mistakes and incompleteness of the new infrastructure. But they did do that and showed great dedication,
appreciation and skill in doing so. And of course, a number of individuals also helped with the tedious part of the
whole project and to all those, I am particularly grateful.

The result of our efforts, you now hold in your hands: the ORCA program, version 6.0. But as I explained above,
ORCA 6.0 is not just an update to the program, it is essentially an entirely new quantum chemistry package – but
one that was designed with a master plan, a vision of how such a package could or should be organized. This led
to a highly streamlined and highly efficient new infrastructure that will greatly facilitate future developments.

Please allow me a few personal words: This release of ORCA is a turning point and also a very emotional moment
for me. Recreating the ORCA infrastructure and deleting much of the legacy code amounted to reliving a large part
of my scientific life in fast forward. Many memories were tied to specific code parts and so many images returned
along the way of how life was when this or that was written and what that world looked like back then. Hitting the
“delete” button did not come easy and there might have been a tear or two lurking here and there, especially on the
last weekend before the initial code freeze where I deleted more than 250000 lines of legacy code and edited over
500 files of source code.

ORCA 6 was the result of the work of a large number of outstanding and dedicated individuals. Unfortunately, It is
impossible to individually mention all of them here (for this, please check the credit section at the beginning of the
output), but I do want to ensure *all* ORCA developers of my deepest sympathy, my admiration and my gratitude for
staying on path, for their hard work, for their creativity, for their intellectual brilliance, for the dedication and for
sharing in the vision. Especially the latter was not a given, in particular in those moments where things were broken
that once upon a time were working perfectly. Specifically, I am indebted to Frank Wennmohs for his long-term
friendship, for enduring my stubbornness in pursuing this project and for his decisive contributions in important
moments. I also want to praise Dagmar Lenk for running our testsuite with almost 2000 jobs every night, analyze
the results with superhuman patience and patiently going after the people that were supposed to fix the errors. And
of course, my very special thanks and deepest gratitude also goes to Ute Becker. Ute has been a member of the
team since the early 2000s. She has single-handedly parallelized ORCA and in all these years, she always had
everybody’s back – implementing, helping, testing, cleaning up behind people without ever complaining and with
laser precision and the highest efficiency. Ute will formally retire by the end of 2024 but we consider ourselves
lucky that she has agreed to keep working with us on the next generations of ORCA, at least for a while.

I am also deeply indebted to the members of FAccTs. Ever since the foundation of FAccTs, it has been continuously
growing and is now very successful in the market. This is largely due to Christoph Riplinger’s ingenuity, vision and
insightful leadership. It is a major pleasure to see FAccTs bloom and grow, drive technology and also assemble a
significant number of the most talented individuals that passed through the group in Mülheim. Importantly, several
FAccTs members have made major contributions to the release of ORCA 6, in particular Bernardo de Souza,
Georgi Stoychev and Miquel Garcia Rates have written extremely effective and important code and have also been
instrumental in streamlining and optimizing the infrastructure.

Now that ORCA 6 has become reality we are highly excited to give it you and we sincerely hope that you embrace
it and make good use of it. Thank you for staying with us through the long wait that led to ORCA 6. We believe
that we have made the program fit for the next decades to come and to be a great platform for keeping up with the
rapidly changing hard- and software landscape. The efficient new infrastructure that Orca 6 is based on will allow
for much improved development speed and consequently, we are looking highly forward to giving you the next
ORCA versions with exciting new functionality in due course.

Thank you for your support!

Frank Neese, on behalf of the development team on July 17, 2024

**ii** **Chapter 0. ORCA 6.0 Foreword**
