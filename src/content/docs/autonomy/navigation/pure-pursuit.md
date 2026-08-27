---
title: "Pure Pursuit"
---
Pure Pursuit is a geometric path tracking built around the idea of "chasing" a lookahead point on the path ahead of it and then computing a curvature and corresponding angular velocity for the rover to drive along a circular arc that will intercept that lookahead point. Read more about that [here](https://wiki.purduesigbots.com/software/control-algorithms/basic-pure-pursuit). 
:::note
This design specification initially utilizes proportion control for computing the angular velocity for the rover to follow to get to the lookahead point. However, as mentioned above, we want to use the original pure pursuit implementation, which computes angular velocity based off a curvature. Details on it are at the bottom of the page so please read ahead before beginning full implementation.
:::

To accomplish this, you will modify the `DriveController` class, overloading the get_drive_command function to accept a trajectory. This will allow us to still utilize the original well-tested drive control behavior before fully adopting Pure Pursuit.

Run `git fetch` and then `git checkout nav/pure-pursuit` to checkout the shared Pure Pursuit project branch. Here there is some skeleton code to begin with, and you can work collaboratively with others to complete this project. 

<img width="346" height="261" alt="Screenshot 2025-10-10 at 9 11 32 PM" src="https://github.com/user-attachments/assets/a914dfdc-40a8-4f55-bc5d-ceb7014d883d" />
<img width="291" height="177" alt="Screenshot 2025-10-10 at 9 11 49 PM" src="https://github.com/user-attachments/assets/2279dfa2-f2cc-48f4-a9a6-376064f295e3" />
