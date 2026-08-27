---
title: "5-DOF IK"
---
**Context:** Inverse kinematics (IK) figures out the position of the joints of a robotic arm given an end effector goal position (hand/gripper). Most IK solvers use 6dof since most robots use 6dof when using IK as it allows for the most flexibility. [Here](https://www.youtube.com/watch?v=IN8tjTk8ExI) is a good video of a basic 2dof robot using IK with the guy explaining how he solved it. [This](https://moveit.ros.org/) is the link to our current package used to solve 6dof.

**Problem:** Our current implementation of IK uses 6dof using the MoveIt package from ROS. However, our new rover will use 5dof. MoveIt doesn't support this, so we need to use something else.

**Solution:**
Use another IK package. In the event there's no 5dof package, we'll have to create our own.

**Interface:**
ROS calls a service given a goal state and then calls the IK solver C++ program which will tell it what joint angles each one needs to be at. Then it will send a joint state back to the arm. (Generic layout...definitely will change)

**Rough Steps:**
* Research 5dof IK packages
* If there's not one, then research creating a custom IK solver for 5dof
* Implement an IK solver
* Implement solver into our framework and test with URDF model