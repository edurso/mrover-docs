---
title: "Introduction to ROS"
sidebar:
  label: "1. Introduction to ROS"
---
## What is ROS? 
ROS is an open source framework for developing robotics software. It is short for robot operating system, but it is not truly an operating system like Ubuntu or Windows. Instead it is "middle-ware" that provides some common things needed for a robotic system. ROS runs on top of Ubuntu Linux. Robots typically run many pieces of software ranging from high level autonomy like computer vision to lower level software like device drivers and control loops. In many cases, this software is even distributed across computing devices such as on peripheral microcontrollers driving sensors or on high powered servers communicating with onboard computers via radio. ROS provides the following capabilities: 
* Interprocess communication via publisher-subscriber model 
* Communication between distributed processes over serial, network, and other types of connections
* Its own build system (Colcon) that isolates build environments and provides simple dependency resolution 
* Package management to rapidly pull in and run existing open-source ROS code and libraries for your robot
* Fantastic tooling and infrastructure for things like IK, motion planning, visualization, and localization 
* Much more 

ROS is the standard ecosystem for research in robotics and there is a huge, very active community behind it. This also means there are lots of online resources to learn about ROS. 

## FAQs about ROS
Q: Are we limited to only using ROS libraries and packages since we are using ROS? 

A: No. ROS provides packages for many common robotics libraries so that they can be used with ROS easily. In some cases, these libraries even provide nodes that can be executed and used. A great example of this is the ARUCO library and OpenCV. We could install OpenCV as usual, link it with Colcon, and make use of the ARUCO functions in our code. However, the ROS package for ARUCO actually provides a node that subscribes to camera images and outputs detections, which lets the user avoid even writing code. However, with this being said, on MRover we try to limit the number of dependencies inside our codebase to improve maintainability.

Q: What about vice versa? Can ROS libraries be used outside of ROS?

A: Not always. A lot of ROS libraries fundamentally rely on the infrastructure of ROS itself, and thus can only be used with ROS. This means that by using ROS we gain access to a wealth of really great software that top robotics researchers have developed that we can't use otherwise. 

Q. What does it mean for a program to be a "ROS program"? 

A. Typically this would mean that the program is a process that is connected to the ROS network and registered as a node. This python program can be considered a basic ROS program: 
```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node

class ExampleNode(Node):
    def __init__(self) -> None:
        super().__init__("ExampleNode")
        self.timer = self.create_timer(1, self.callback)

    def callback(self):
        self.get_logger().info("Timer Callback...")


def main() -> None:
    rclpy.init()
    node = ExampleNode()
    rclpy.spin(node)   
    rclpy.shutdown()

if __name__ == "__main__":
    main()
```


Q. How does the interprocess communication actually work? 

A. Inside of ROS there is a layer of abstraction called the ROS middleware (RMW). Here is where are all of the ROS messages are sent between nodes. In ROS2, this is implemented UDP using a data distribution service, on MRover we use [Fast-DDS](https://github.com/eProsima/Fast-DDS).
 


