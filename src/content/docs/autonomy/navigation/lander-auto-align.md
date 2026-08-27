---
title: "Lander Auto Align"
---
**Context**: In the ES mission we must align the rover with a mock lander. This is best explained visually so ask a lead for URC film.

**Problem**: Manually aligning with a face on the lander is difficult.

**Solution**: Use the ZED to detect the closest face on the lander. Run a control loop to align the rover heading with the normal of that face.

* Downsample the point cloud so it is faster to process
* Filter out all points which have normal z-components far away from zero, this will remove the ground
* Filter out any other outliers to try and get only points on the lander face
* Run principle component analysis (PCA) algorithm on remaining points to find directions of variation (eigenvectors)
* Vector closest to the 0 vector should be the plane
* Start with finding rover angle to plane and then move on to some sort of control loop

<hr>

**Interface** (subject to change): Use a [action server](https://docs.ros.org/en/humble/Tutorials/Intermediate/Writing-an-Action-Server-Client/Cpp.html) to run a closed loop control algorithm, implementing a [nonlinear feedforward plus feedback control law](https://hades.mech.northwestern.edu/images/7/7f/MR.pdf). 

**Completed:**
1. PCA algorithm

**To be Done:**
1. Calculate angle
2. Move to lander