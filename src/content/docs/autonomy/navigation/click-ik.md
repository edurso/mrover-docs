---
title: "Click IK"
---
:::note
This project is going to be more complex and hands-on compared to other new projects due to the complexity of the robotic's arm system as a whole
:::

# Overview
Click IK is an extension of the existing Arm IK System that enables intuitive, point-and-click control of the robotic arm enabling operatorsto  click on a point in the camera feed to move the arm's end effector to that location. This system provides a more natural interface for teleoperation, particularly for the ES mission. 

In order to support operator awareness and safety, a possible extension for this would be to determine which pixels in the camera image correspond to reachable and safe positions for the arm. These points would be highlighted in green to indicate that they can be safely reached.

# Implementation
Click IK will receive 3D position data from a perception node. The perception node is responsible for converting the clicked pixel coordinates from the GUI into a 3D point using the point cloud.

Once Click IK receives the 3D target position, it performs the following steps:
1. Designates a safe path for the arm to follow to reach the target position.
2. Sends the planned motion path to the arm controller, which executes the movement.
3. Communicates information about which points are safe or unsafe back to teleop, allowing the operator to see visual feedback (e.g., green highlighting for reachable points).

For reference, the old click IK implementation can be found [here](https://github.com/umrover/mrover-ros/tree/click-ik)
