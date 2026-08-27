---
title: "Path Smoothing"
---
# Path Relaxation

## Concept  

Path relaxation simplifies the discrete path by removing or adjusting redundant waypoints while maintaining low traversal cost and obstacle clearance.  
It can be viewed as a local optimization process that "relaxes" the original path shape into a smoother, simpler form.

## Process  

1. **Identify Redundant Points**  
   - Evaluate intermediate waypoints whose removal does **not increase overall path cost** (e.g., distance, curvature, or risk).   
   - Ensure that skipping these points still keeps the path in **safe, low-cost regions** of the costmap.

2. **Collapse Intermediate Points**  
   - Merge or remove these redundant nodes, effectively simplifying the path without losing safety guarantees.

3. **Shift Points Locally**  
   - Slightly adjust remaining points **within their neighborhood** to reduce curvature or sudden heading changes.  
   - These shifts create **smoother geometric transitions** between segments.

4. **Iterate the Process**  
   - Repeat relaxation until further simplification no longer improves smoothness or violates constraints.
***
<img width="385" height="509" alt="Screenshot 2025-10-10 at 9 37 58 PM" src="https://github.com/user-attachments/assets/315d4ec5-9ae3-4e25-9f47-fd3cb024e13a" />
---

# Path Interpolation

## Concept  

Path interpolation takes a (possibly relaxed) discrete set of waypoints and fits a **continuous mathematical curve** through them.  
This provides a differentiable representation of the path — suitable for smooth control, velocity profiling, and dynamic re-planning.

## Process  

1. **Compute a Continuous Function**  
   - Fit a function that passes through or near a trajectory's waypoints. Some possible approaches are with:
     - **Polynomial splines** (cubic, quintic)
     - **B-splines**
     - **Bezier curves**

2. **Short-Horizon Interpolation for Dynamic Environments**  
   - In environments with **changing costmaps**, recompute only a **local segment** of the path using **short-horizon B-spline interpolation**.  
   - This enables **faster re-planning** while preserving global smoothness.
***
<img width="444" height="429" alt="Screenshot 2025-10-10 at 9 37 37 PM" src="https://github.com/user-attachments/assets/2463d061-15f5-4296-a30f-84f8a4f0854c" />

# Implementation

Almost every state(ignoring Done/Off states) will use A* to produce a trajectory that it wants the rover to follow, and currently that resides in an A* class. We should rework this such that there is a general path planning class that will take care of both A* planning and the smoothing post-processing.

Run `git fetch` and then `git checkout nav/path-smoothing` to checkout the shared path smoothing project branch. 