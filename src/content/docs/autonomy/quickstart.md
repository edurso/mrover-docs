---
title: "Autonomy Quickstart"
---
This assumes that you have already installed (and verified) ROS for our system if not follow this [tutorial](/setup/installing-the-codebase) 

This tutorial will take you through starting up the autonomy system and running the navigation code to hopefully be able to see the rover run in simulation.

Run the navigation launch file:

`ros2 launch mrover simulator.launch.py`
And in a separate terminal
`ros2 launch mrover autonomy.launch.py`

This starts the simulation environment and starts all necessary nodes for the autonomy mission.


<img width="400" alt="image" src="https://media.githubusercontent.com/media/umrover/mrover-ros/JRA/starter-project/data/starter_project/rviz.png">
<img width="400" alt="image" src="https://media.githubusercontent.com/media/umrover/mrover-ros/JRA/starter-project/data/starter_project/rover_and_hammer.png">

Next, from another terminal window/tab, run:

`ros2 run mrover visualizer.py`

This will launch a state machine visualizer that should show you the structure of the state machine as well as highlight the current active state.

<img width="500" alt="visualizer" src="https://user-images.githubusercontent.com/50927446/213591107-dacbad52-1541-443f-a386-fae8091bc05c.png">

Now, from another terminal window/tab, run:

`ros2 run mrover debug_course_publisher.py`

This will publish a test course to the navigation system and you should start to see the rover moving towards the waypoint and completing the autonomy mission as well as updates on the state machine visualizer regarding what state the rover is in.