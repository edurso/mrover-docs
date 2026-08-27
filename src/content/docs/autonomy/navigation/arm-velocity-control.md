---
title: "Arm Velocity Control"
---
To achieve Cartesian velocity control of the end effector, the most straightforward solution employs a "carrot-on-a-stick approach." What this means is that the velocity control relies on position control under the hood, but does so with small increments to approximate true velocity control.

As an example, suppose the arm is currently at position $(0,0,0)$ and it is commanded to move in the direction $(1,0,0)$. The carrot-on-a-stick approach will set the arm's target as something like $(0,0,0)+0.1\cdot(1,0,0)=(0.1,0,0)$. This will make the arm move slightly in the correct direction. If this velocity command is continued, the arm's position target will then be updated to $(0.2,0,0)$, $(0.3,0,0)$, and so on.

The speed of the arm is controlled by the magnitude of the commanded velocity vector—the target will be incremented by an amount proportional to the velocity vector. In particular, when $|v|=1$, the arm is moving at full speed, and when $|v|=0$, the arm should not be moving at all.