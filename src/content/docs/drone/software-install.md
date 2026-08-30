---
title: "Software Install"
---

## Install ROS2
Follow [these instructions](/setup/installing-the-codebase) to get the MRover ROS2 install done.

We still need more packages:
```
sudo apt install ros-dev-tools net-tools v4l-utils ffmpeg
```
## Clone Drone Repository
```
mrover
cd ../
```
Running `pwd` should tell you you're in the folder `ros2_ws/src`

After confirming this, clone the repository:
```
git clone git@github.com:umrover/mrover-drone.git --recurse-submodules mrover_drone && cd mrover_drone
```
Run the following commands to ensure the dependencies are at the correct versions:
```
cd ~/ros2_ws/src/mrover_drone/deps
cd PX4-Autopilot
git checkout v1.15.4
cd ../px4_msgs
git checkout release/1.15
cd ../px4-ros2-interface-lib
git checkout 1.4.0
```

If submodules / dependencies change:
```
git submodule update --recursive
```

## Initialize ROS2 Dependencies (Non-MacOS only)
[ROSDEP Wiki Page](https://wiki.ros.org/rosdep)

Initialize ROSDEP:
```
sudo rosdep init
rosdep update
```

Install Dependencies:
```
cd ~/ros2_ws
rosdep install --from-paths src --ignore-src -r -y
```

If this fails, try:
```
sudo apt upgrade && sudo apt update
```
## Extra step for MacOS users

Follow [these instructions](https://docs.px4.io/main/en/dev_setup/dev_env_mac.html) before proceeding to building external dependencies.

## Build External Dependencies
Based on [PX4 Build Guide](https://docs.px4.io/main/en/ros2/user_guide#install-px4)

### Manual Build
Manual build process copied from the above link

#### Build PX4
```
cd ~/ros2_ws/src/mrover_drone/deps/
```

If on Ubuntu, run:
```
bash ./PX4-Autopilot/Tools/setup/ubuntu.sh
```
If on Mac, run:
```
sh ./PX4-Autopilot/Tools/setup/macos.sh
pip3 install -r ./PX4-Autopilot/Tools/setup/requirements.txt
```
Ignore errors about not being able to do a '--user install'.

Continue:
```
cd PX4-Autopilot/
export CMAKE_POLICY_VERSION_MINIMUM=3.5
make px4_sitl
```

If this doesn't work, install the following python dependencies:
```
pip3 install --user pyros-genmsg jsonschema kconfiglib future
```

#### Build uXRCE-DDS-Agent
```
cd ~/ros2_ws/src/mrover_drone/deps/Micro-XRCE-DDS-Agent
mkdir build
cd build
cmake ..
make
sudo make install
sudo ldconfig /usr/local/lib
```

#### Download QGroundControl
Download [QGroundControl v4.4.0-rc1](https://github.com/mavlink/qgroundcontrol/releases/download/v4.4.0rc1/QGroundControl.AppImage). Move to your desired folder, then make it an executable:

```
chmod +x QGroundControl.AppImage
```

## Test Installation

Start by running the DDS *agent*. In a new terminal, run:
```
cd ~/ros2_ws/src/mrover_drone/deps/PX4-Autopilot
source /opt/ros/humble/setup.zsh
MicroXRCEAgent udp4 -p 8888
```

This will start a MicroXRCE DDS agent on port 8888.

We can now start the PX4-sitl ("software in the loop") simulator.

This will start a uXRCe-DDS *client* automatically on localhost port 8888.

In a new terminal, run the following command:
```
cd ~/ros2_ws/src/mrover_drone/deps/PX4-Autopilot
make px4_sitl gz_x500
```
You should now see output in the DDS agent terminal, and Gazebo should launch.

## Install MAVROS
[MAVROS GitHub](https://github.com/mavlink/mavros/blob/master/mavros/README.md)

MAVROS should be added by rosdep. However, you must run the following to download a required dataset:
```
cd ~/ros2_ws/src/mrover_drone
chmod +x ./scripts/install_geographiclib_datasets.sh
sudo ./scripts/install_geographiclib_datasets.sh
```
If this refuses to download, do:
```
cd ../..
rosdep install --from-paths src --ignore-src -r -y
```

### PX4_MSGS
ROS messages and services that reflect the PX4 uORB topics.

As of Jan. 13th there was a build issue (https://github.com/PX4/PX4-Autopilot/issues/23736). The fix seems to have been included in the 1.15 release, but if using an older one you can manually edit the build file and remove the errant comment on line 719 as specified in the bug report.

Build this package (using colcon):
```
cd ~/ros2_ws
colcon build --packages-select px4_msgs
```

### ROS2_PX4 Interface Library
[Link to Library](https://docs.px4.io/main/en/ros2/px4_ros2_interface_lib.html)

This is a (relatively new) way to interface between ROS2 and PX4 which takes advantage of a shared data distribution layer.

Build this package (using colcon):
```
cd ~/ros2_ws
colcon build --packages-select px4_ros2_cpp
```

## Last Steps / Final Configuration
Add the following to your ~/.zshrc file: (nano ~/.zshrc)
```
alias drone="cd ~/ros2_ws/src/mrover_drone"
```
