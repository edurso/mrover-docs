---
title: "Arm IK"
---
# Context

We are hoping to fully integrate IK(position & velocity) to both enable the operator to more easily control the arm and use it for the autonomous typing challenge.

# Problem

The current IK implementation has not been fully tested on the rover, so it is not yet ready for competition use. Additionally, joint B of the arm is being redesigned this year. As such, we need determine the limitation of the arm to ensure there are no unforeseen or unexpected challenges operators might face while operating.

# Solution

The end effector has a limited range of motion, particularly in terms of pitch. This means that it is not always possible to make the end effector parallel to the ground (as we would like to, especially for typing) for all arm positions. Thus it is necessary to determine the bubble of positions that are reachable with the end effector level, so that we can optimally position the rover for typing. More details on finding this "bubble" can be found [here](/autonomy/navigation/arm-ik-testing).