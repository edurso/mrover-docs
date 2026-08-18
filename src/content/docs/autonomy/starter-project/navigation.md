---
title: "Navigation"
sidebar:
  order: 4
---

For the navigation part of the starter project, you will write a ROS2 node that uses the outputs of the localization and perception nodes to navigate the rover. In particular, you will first command the rover to drive towards a predefined point (8m, 2m). Once the rover has arrived at this point, it should be able to detect and see an AR tag. The rover will then turn until it is aligned with the AR tag and then drive forward towards it until a predefined distance threshold.

Outlining the steps mentioned above, the navigation node can be broken up into two parts:

1.  Waypoint Navigation: Given the rover's pose (position and heading) from the localization node, the rover will turn and drive towards and stop at the point (8, 2).
2.  AR Tag Navigation: Using the perception node, the rover will turn towards the detected AR Tag. It will then drive towards the AR Tag and stop in front of it within a given distance threshold.

The navigation node in this part will command the rover to drive by publishing a drive command. Thinking in terms of the inputs and outputs for this node often makes this navigation node easier to understand:

### Inputs
- Rover pose (the rover’s position and orientation in space): obtained from the TF tree and maintained by the localization node. 
- Tag message: published from the perception node (from channel `tag`), describing any found AR tags.

### Outputs
- Velocity data: a drive command for the rover [Twist message](http://docs.ros.org/en/lunar/api/geometry_msgs/html/msg/Twist.html)

### Navigation Starter Project Structure

We've created the base structure of the navigation starter project for you. This structure is meant to mimic the structure of our current code, which uses a state machine. We recognize that there are other ways to implement this node; however, we want you to gain an understanding of our state machine and the way we structure code in the navigation subsystem. 

With that said, here is an outline of each sub-component in the navigation system and what you will need to do to complete this project. Start by implementing the underlying infrastructure, the context class, which is required for the navigation node to be able to properly read its inputs and send its outputs. After implementing the context class, you will implement two states: Drive and TagSeek State. To finish, you will add the necessary code to add these states to the state machine and initialize the navigation node.

The files you need to edit are under `mrover/starter_project/autonomy/src/navigation`.

#### Context class (no TODOs, fully provided)

In `context.py`

The goal of this class is to provide access to an interface for reading and writing information regarding the rover's environment and the rover itself. It contains the objects `Rover` and `Environment`, both of which you will need to implement various functions for. It also contains the ROS2 publisher and subscriber objects that you use to listen to and send messages for this node.
 
#### Rover class (TODOs)

In `context.py`

Start by implementing the Rover class. The rover object (accessed through the context object) is responsible for the interface for all things related to the rover. In our case, we need to implement three functions: 

1. `get_pose(self) -> Optional[SE3]`

In this function, you will fill in the code that returns an SE3 object. An SE3 object is a mathematical structure that represents where the rover is in the world. For more information about SE3s and what they are checkout [this wikipage](/autonomy/resources/3d-poses-transforms-rotations). Additionally, read over the docstrings within `mrover/starter_project/autonomy/src/util/SE3.py` to see the full SE3 interface. The docstring will outline the variables that make up this object.

Once you are familiar with an SE3 object, you're going to want to use the `SE3.from_tf_tree` function in order to obtain an SE3 that represents the rover's pose. This function is found in the `SE3.py` file. We have imported this class into the context file. The function’s parameters include:

`tf_buffer`: the tf buffer used to query the TF tree
`parent_frame`: the parent coordinate frame of the desired transform
`child_frame`: the child coordinate frame of the desired transform

Note that the `tf_buffer` has already been created for you and is owned by the Context object which is called `ctx` in the rover class. Once again, since this is the pose of the base of the rover relative to the map, you should specify your parent frame as "map" and your child frame as "rover_base_link" (this is the name used for the base of the rover).

2. `send_drive_command(self, twist: Twist)` 

Here we will need to fill in the code so that this function publishes a Twist message using the velocity command publisher object. To note, the velocity command publisher object is a member of the context (`vel_cmd_publisher`). This velocity command publisher object is of type Publisher, and you can use the function `publish()` on this publisher. This will publish the inputted Twist command and allow other nodes to obtain this data by subscribing to where this publisher publishes its data. If you wish, you can learn more about publishers and subscribers [here](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Py-Publisher-And-Subscriber.html).

3. `send_drive_stop(self)`

Here we will need to fill in the code so that this function stops the rover. (hint #1: use `send_drive_command()`) (hint #2: `Twist()` initializes velocities to be 0 in its message)

#### Environment class (TODO)

In `context.py`

The environment class is similar to the rover class; however, instead of providing an interface to things going on on the rover, it provides an interface to things going on in the environment around the rover. To write this interface, we need to implement two functions:

1. `receive_fid_data(self, message : StarterProjectTag)`

This function is that we have already setup to be a callback function for you. Being a callback function, it will be invoked every time we receive an AR tag position message from the perception node. To implement this function, you will need to update a member variable in the Environment class to hold the StarterProjectTag message passed into this function (hint: fid stands for fiducial, which is the AR tag in this case).

2. `get_fid_data(self) -> Optional[StarterProjectTag]`

This function should return either `None` or your AR tag position message. It should return `None` if you don't know where the tag is, or it should return the most recent ROS2 message regarding the AR tag's position if you do know where the tag is.
HINT: Use the same member variable you just set in your `receive_fid_data` function.

After implementing the Rover and Environment classes, you have now finished creating the lower level interfaces that we will be used to write higher level logic! Basically, all of the interaction with the outside world is complete, we now will use the abstractions we've created to code the logic of our state machine. Let's take a look at how we structure single states and build the states that we will need. After that, we will hook our states into the greater state machine and we will have completed the project!

First of all, what is a state? Please read [this page](/autonomy/navigation/overview) to learn what a state is. 

#### Done state (no TODOs, fully provided)

In `state.py`

We have provided a Done State that represents the rover in its "Done State". We don't want our program to end when the rover completes, so we have a state that essentially loops and does nothing. We have also provided a Fail State that represents a failure to finish the task.

#### Drive State (TODOs)

In `drive_state.py`

The goal of this state is to drive towards the set point (8, 2). We've created the class for you but you will need to implement the `on_loop()` function. We've provided a general outline in the comments of how this function might be structured and have also providing a function `get_drive_command()` imported from `drive.py` that you can use to do some of the math in this step for you. The function should return the state it needs to transition to next.

Hint: Use the functions from context.rover we've already written

#### Tag Seek State (TODOs)

In `tag_seek.py`

The goal of this state is to drive towards the AR tag after arriving at the set point (8, 2). We've created the class for you but, just like the Drive State, you will need to implement the `on_loop()` function. This will be a bit trickier as you don't actually have a pose to drive to; instead, you just have the same general measurements regarding angular and distance offsets that you calculated earlier.

You can get information about how close the rover is to the tag by using the function `get_fid_data` in context.env. You want the rover to be within a certain distance (`DISTANCE_TOLERANCE`) from the tag, and face the tag within a certain angular distance (`ANGULAR_TOLERANCE`), to be able to transition to the Done state. We have set these tolerances to be `DISTANCE_TOLERANCE = 0.99`, `ANGULAR_TOLERANCE = 0.3`. Hint: `get_fid_data()` returns `StarterProjectTag`, this includes information about how close the rover is to the tag and the measurements of where the center of the tag is in our view (x and y). In a way you can think of this as the location of the tag being relative to the rovers frame.

If the rover is not within the angular and distance tolerances, create a twist command and change the linear.x value and/or the angular.z value so that the rover becomes within the tolerances. Then send this twist command to the rover and stay in the TagSeekState.

#### Navigation class (TODOs)

In `navigation_starter_project.py`

The navigation class is where the whole state machine comes together. We've already done the hard work of creating the whole state machine now we just need to put it all together. We've already added the DoneState to the state machine, and use a similar pattern for adding the TagSeek and DriveState states to the state machine. Then to finish everything, you will need to write the line of code which initializes a node.
