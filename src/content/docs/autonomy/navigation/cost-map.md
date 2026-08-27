---
title: "Cost Map"
---
**Context**: [URC rules](https://urc.marssociety.org/home/requirements-guidelines) indicate a significant obstacle will obstruct the water bottle during the auton mission.

> The second object will be a standard 1 L wide-mouthed plastic water bottle of unspecified color/markings (approximately 21.5 cm tall by 9 cm diameter). The second object may have obstacles in the way that require autonomous avoidance.

> The last post may have obstacles in the way that require autonomous avoidance, such as being in a boulder field

**Problem**: When navigating during the auton mission, the rover may encounter rocky terrain which could cause the rover to break or get stuck. As a result, it is perception's job to detect where these obstacles are and relay that information over to the navigation system. This was done last year, but it is too slow to the point where we elected to turn the cost map off during missions

**Solution**: Perception will investigate different ways to speed the cost map up. The current idea is to run the cost map during missions where it is not needed and save the information (either by publishing or to a file) to be loaded in when needed.

<hr>

**Interface** (subject to change)

Node: `cost_map`

Subscribes: [sensor_msgs/PointCloud2](https://docs.ros.org/en/melodic/api/sensor_msgs/html/msg/PointCloud2.html) (ZED point cloud)

Publishes: [nav_msgs/OccupancyGrid](https://docs.ros.org/en/melodic/api/nav_msgs/html/msg/OccupancyGrid.html) (Global costmap)

Completed Steps:
1. Create subscriber for the point cloud topic
2. Process Point Cloud for extraneous points
3. Bin each of the points into their respective grid locations
4. Use binned points to compute cost*
5. Fill global costmap in using local costmap

Future Steps:
1. Create save file for costmap state
2. Test save file
3. Create costmap state topic
4. Test costmap state topic

The main goal of these steps are to create an accurate and fast costmap. This may require many iterations and will need to be tested IRL!!

<hr>

Points inside of point cloud will be initially relative to the zed's camera frame. However, the occupancy grid will be expressed in global frame with reference to a given waypoint. To transform the points in the ZED camera frame to the occupancy grid use the `SE3Conversions::fromTfTree(TfBuffer, "<camera_frame>", "<map frame>");` function.

Furthermore, using a Exponentially Weighted Moving Average ([EWMA](https://www.geogebra.org/m/tb88mqrm)) filter has been found to help reduce noise in final output.

Ask an auton lead if you have any questions about this.