---
title: "Fundamentals of ROS"
sidebar:
  label: "2. Fundamentals of ROS"
---
Here are some things to know about ROS

## Organization of ROS code
The top level organization of ROS code is a **package**. A package is simply a folder with a collection of ROS code. This git repository is the mrover package. Within it is both library code and executable for our Rover's localization, perception, navigation, and simulation. Packages often contain one or more **nodes**.  Nodes are simply executable processes that connect to the ROS infrastructure. For example, one node that we have is the state machine node that takes in various perception and localization data, makes decisions, and outputs a drive command for the rover. Nodes talk to each other via **topics**. A topic is simply a channel where nodes can publish or subscribe to data messages. The topic will have a particular message format. An example of a topic is `/camera/rgb`. This topic has a message type of `Image`. A camera driver node might publish image messages to this topic and perception code might subscribe to the topic to process the images. See [here](https://docs.ros.org/en/humble/Concepts/Basic/About-Topics.html) for more on ROS topics.

Another thing to be aware of is launch files. Launch files are python scripts which launch and configure a series of ROS nodes (these files have the extension `.launch.py`). Some old-timers might remember the days of running `./jarvis exec jetson/<project>` over and over again in a big tmux session to individually bring up `percep`, `gps`, `nav`, `loc` and a handful of other processes that autonomy needed. ROS launch files elegantly solve this problem. Additionally, you might remember having to SSH between various jetsons to start processes on different processors. Launch files can also handle this. 

## Useful ROS commands
* `ros2 node list` shows you all the running nodes in a given domain
* `ros2 topic list` shows you all the topics. You can get further info about topics like the message type with other `ros2 topic` commands (ex. `ros2 topic info`)
* `ros2 run <package-name> <node>` will run a particular node from the specified package 
* `ros2 launch <package-name> <launchfile>` will run a particular launch file in the specified package 
* `apt install ros-<version>-<package>` will let you install existing ROS packages that are in the package repositories. For example, `sudo apt install ros-humble-rqt-tf-tree` installs the rqt_tf_tree package for ROS2 on Ubuntu 22.04. Note that some packages are not in the repositories and will have to be built from sources. More on this later. 
* `ros2 run rqt_tf_tree rqt_tf_tree` shows the hierarchy of defined transformations 

## Publisher/Subscriber Model
One common paradigm in interprocess communication libraries is the [publish-subscribe pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern). Processes are able to publish messages to certain topics, and subscribes can subscribe to those topics to receive messages. The publisher has no knowledge of who its subscribers are, and there can be many subscribers to one publisher. This is used frequently in ROS. Consider a node that acts as a driver for a camera. When it reads an image, it broadcasts it on a topic named `image` and any other processes that needs visual data can receive the image by subscribing to the topic.  

## URDFs and Xacros
It is useful to have a model of the robot for things like simulation, visualization, and inverse kinematics. In ROS it is typical to specify this in a URDF or Xacro file. These are essentially XML files that specify a robot as a collection of joints and links. Joints are used to connect and move links. Links have an associated physical and visual geometry. Here is a URDF of our rover visualized: 

<img width="1829" height="500" alt="image" src="https://github.com/user-attachments/assets/d2ea3d4a-4c87-4c84-bdf8-de715115d4dc" />

You can see that there are links for each wheel that are connected to the chassis link via revolute joints. 

## TF
In robotics we are interested in many frames of reference. Sometimes we want to know where something is relative to the frame of our rover's base. Other times we might have a static reference frame and we want to find the rover within that. We also often need to convert between frames. While I might detect AR tags relative to the frame of the rover's camera, for pathing it is most useful to know where they are relative to the world reference frame. TF is a library that stores information about the hierarchy of frames and allows us to convert coordinates between them. TF will store a tree of frames like this one: 

![tf](https://user-images.githubusercontent.com/10037572/188724277-65e81cd3-301c-4ed2-8158-87600c4a0a9d.png)


We can add new frames to the TF tree by publishing a transform that defines a new frame relative to one of the existing frames in the tree. 

## Robot State and Joint State Publishers 
While a URDF specifies how the pieces of a robot are connected, it does not inherently contain a 'state' for the robot. In order for visualization programs to render the robot something must publish transforms for each link to the TF tree. This is achieved via the robot_state_publisher node. The robot state publisher depends on joint_states in order to create these transforms. As such, the joint states are published by the joint_state_publisher. The joint state_publisher simply ensures that when not overridden, a default state will be published for each joint. Without this we would have to make sure to repeatedly publish a state for every joint manually in our own code. 


## RViz 
RViz is a super handy visualization program. You can use it to visualize and debug things. Before writing your own debugging tools, check if RViz already does what you need. It likely does! For instance, here is us path planning using the simulated rover with RViz.
 
<img width="858" height="594" alt="image" src="https://github.com/user-attachments/assets/fd4b5114-75dd-468e-a8ca-45861e55c6d1" />

Rviz can also:
* Visualize camera images 
* Visualize point clouds

If you are ever trying to visualize something, you can probably publish a certain message type to RViz. 

## Running ROS Across Multiple Devices
Since ROS communicates over UDP, it is very easy to get it working on a system with multiple devices. In ROS2 the centralized ROS master node was removed in favor of a more distributed framework. However, in order to still maintain isolation between different ROS networks, we can specify a domain environment variable such that nodes with the same domain id will appear in the same ROS network:

```bash
export ROS_DOMAIN_ID=<domain id> # on MRover we use 5
```

These can be put in a bash script and then you can run `source script_name` before running each time, or in our case, we can just add these to each device's `.bashrc` file since we won't need to run ROS in a different configuration.

## Ros2 bag
see [this page](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools/Recording-And-Playing-Back-Data/Recording-And-Playing-Back-Data.html) for a tutorial on the `ros2 bag` command.