---
title: "Inward Spiraling"
---
# Overview
This project will be implemented inward spiraling for the rover path planning during the search state. Our current implementation utilizes outwards spiraling where the rover begins at the center and spirals outward until reaching the boundary. However, with inward spiraling, the rover starts at the boundary and spirals inward toward the center.

We want to implement this because  the inward spiral approach because it’s more time-efficient when the rover is already positioned outside the search area. Instead of first navigating to the center just to begin searching outward, the rover can immediately start scanning inward—saving time.

<img width="237" height="241" alt="Screenshot 2025-10-10 at 10 10 00 PM" src="https://github.com/user-attachments/assets/5eedb30f-d637-4fc8-8186-a4711c87ae9c" />
<img width="237" height="241" alt="Screenshot 2025-10-10 at 10 10 25 PM" src="https://github.com/user-attachments/assets/fa80fd85-9ca7-4791-8184-75b3d8a798e2" />
<img width="152" height="87" alt="Screenshot 2025-10-10 at 10 11 49 PM" src="https://github.com/user-attachments/assets/4ee0f95e-4b19-4b2a-9cf8-1cf922e7c21d" />

Outwards spiraling -- our current implementation -- is on the left and inward spiraling is on the right.

# Implementation

For this project, you will be working in the `trajectory.py` file. In here you will find the `Trajectory` class definition and a `SearchTrajectory` data class currently used to generate outward spirals. In `SearchTrajectory`'s `spiral_traj` function, you will need to pass in one more parameter, the rover's position. Then you will implement
1. the logic to choose the type of spiraling it should perform(ie. inward or outward)
2. the inward spiraling path based on the current outward spiraling function

Run `git fetch` and then `git checkout nav/inward-spiraling` to checkout the shared path smoothing project branch. 
