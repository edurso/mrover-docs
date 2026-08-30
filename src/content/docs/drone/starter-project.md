---
title: "Software Starter Project 2025-26"
---

# Drone Software Starter Project

This year, we are looking to develop capabilities for the drone to operate autonomously during the URC missions. The aim of the drone software starter project is to familiarize you with the key frameworks and software tools we will use to operate the drone and implement capability for autonomous flight. Once you have installed [all necessary software](/setup/installing-the-codebase), proceed through the sections of this page to complete the starter project.

## ROS2 Introduction

ROS2 is a 'meta operating system' for robotics applications. The goal of ROS2 is to provide a set of tools and libraries to simplify the process of developing and running robotics software. Before beginning the starter project, work through the tutorials on the ROS2 website. Do these tutorials in a new directory in `~/ros2_ws/src`.
1. Do the <b>CLI tools</b> tutorial to understand the basics of ROS2 and how to use it: [https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools.html](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools.html). Skim over the 'Configuring environment' section, but do the rest thoroughly. 
2. Do the **Publisher & Subscriber** tutorials, in the language you are more comfortable in: [https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Cpp-Publisher-And-Subscriber.html](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Cpp-Publisher-And-Subscriber.html)

These are the fundamentals of ROS2. The docs linked have many additional tutorials that cover pretty much anything you would ever do with ROS2, making them a fantastic resource.

## Clone and create starter project branch

Once you have completed the ROS2 tutorials, move onto the starter project. Here we will create a ROS2 node that uses the PX4 libraries to move the drone around. The key idea is we define a PX4 'Mode' that simply specifies a control mechanism for the drone. Examples of PX4 modes are 'takeoff' (which makes the drone take off) or 'hold' (which keeps the drone in its current position). In our case, our mode will fly the drone around in a pattern. Read more about PX4 and modes [here](https://docs.px4.io/main/en/ros2/px4_ros2_control_interface.html).

After cloning the drone repo, switch to the starter project branch:
```
git fetch
git checkout starter-project
```
Now, create a branch for your own starter project:
```
git checkout -b <your name>/starter-project
```

## Work through code
The starter project code is in the `starter-project/` directory. 

The main file for you to work on is `starter-project/src/starter_project_node.cpp`. Here you will create a PX4 flight mode node that is capable of commanding setpoints for the drone to follow. When you run this mode, a new flight mode will appear in QGroundControl called 'starter-project'. When you select this flight mode, the drone will fly in the pattern of setpoints you have defined. Read more about PX4 flight modes [here](https://docs.px4.io/main/en/ros2/px4_ros2_control_interface.html)

Open `starter-project/src/starter_project_node.cpp` to start the project. There you will see a class that inherits from `px4_ros2::ModeBase` as opposed to the `rclcpp::Node` that is normally used when creating a ros2 node. You will edit the functions of this class.

### 1. Define the setpoints for your drone to follow.
In the constructor, populate the `_setpoints` vector to define your own setpoints. These setpoints are relative to the drone's starting position and defined in meters. Come up with something creative and more interesting than just a square :)

### 2. Complete `starter_project_node.cpp`
Go through the sections marked TODO in `starter-project/src/starter_project_node.cpp`. At times, you might have to find out what a function does and its argument, or what a particular type does. Look into the documentation for the PX4-ROS2 interface [at this page](https://auterion.github.io/px4-ros2-interface-lib/index.html). Many times during this year, you will have to familiarize yourself with new documentation for any libraries we use, and I want you to build your skills understanding documentation through this process.

### 3. Complete `CMakeLists.txt`
Finally, open `starter-project/CMakeLists.txt`. [CMake](https://cmake.org/cmake/help/latest/guide/tutorial/index.html) is a very popular build tool for C++ that simplifies the process of compiling large pieces of software. It is used heavily in MRover. In the `CMakeLists.txt`, there are two TODOs for you to add dependencies. However, read through the rest of the file to see how it works.

## Building the code
Open a terminal and run:
```
source /opt/ros/humble/setup.sh
cd ~/ros2_ws/src/mrover_drone
colcon build --packages-select starter-project --symlink-install
source install/setup.zsh
```
The program `colcon` builds all of your code, specifically the `starter-project` package (that you just worked on). The flag `--symlink-install` creates symbolic links to some of the installed files instead of copying them over, reducing space on your filesystem.

The command `source install/setup.zsh` makes ROS2 aware of the packages we have just built. Do this whenever entering a new workspace.

## Testing the code


Work through the [development environment bringup](/drone/development-bringup) to run your code. Ignore step 6 to build the code. At step 7 (run demo), run:
```
ros2 run starter-project starter_project_node
```

Your drone should follow the pattern you defined.