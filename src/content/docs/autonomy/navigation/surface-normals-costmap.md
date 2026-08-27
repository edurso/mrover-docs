---
title: "Surface Normals Costmap"
---
**Context**: [URC rules](https://urc.marssociety.org/home/requirements-guidelines) indicate a significant obstacle will obstruct the water bottle during the auton mission.

> The second object will be a standard 1 L wide-mouthed plastic water bottle of unspecified color/markings (approximately 21.5 cm tall by 9 cm diameter). The second object may have obstacles in the way that require autonomous avoidance.

**Problem**: When navigating during the auton mission, we assume the ground is flat enough for the rover to drive over any obstacles. This is not a realistic assumption for driving to the water bottle so perception must provide information about surrounding obstacles so navigation can avoid them.

**Solution**: Perception will construct a local costmap using the ZED's point cloud [surface normals](https://www.stereolabs.com/docs/depth-sensing/using-depth/#getting-normal-map). This costmap will be stitched together over time in the map frame and allow navigation to autonomously path plan.

**IMPORTANT NOTE**: The design for this has changed from having two separate nodes for projection and stitching respectively. This is because projection is relatively straightforward and we think having both steps in the same node is fine.

<hr>

**Interface** (subject to change)

Node: `costmap`

Subscribes: [sensor_msgs/PointCloud2](https://docs.ros.org/en/melodic/api/sensor_msgs/html/msg/PointCloud2.html) (ZED point cloud)

Publishes: [nav_msgs/OccupancyGrid](https://docs.ros.org/en/melodic/api/nav_msgs/html/msg/OccupancyGrid.html) (Global costmap)

Note: This will have to run as a [nodelet](http://wiki.ros.org/nodelet) under the perception_nodelet_manager

Rough Steps:
1. Create subscriber for the point cloud topic
2. Compute surface normals from the point cloud using [PCL](https://pointclouds.org/documentation/classpcl_1_1_normal_estimation.html) (see last year's branch https://github.com/umrover/mrover-ros/tree/arschallwig/cost-mapping for reference)
3. Project surface normals into local occupancy grid
4. Apply transform on local occupancy grid from the zed frame to map frame
5. Fill global costmap in using local costmap

<hr>
The local occupancy grid will be expressed in the ZED camera frame and the global occupancy grid will be expressed in the map frame. Determining the buckets in the global occupancy grid that are occupied will require expressing each bucket in the local occupancy grid as a point (i.e. the center of the bucket), transforming that point into the global map frame, then projecting that point into the global occupancy grid to mark the corresponding global grid bucket as occupied. A visualization of the local and global grids are below.

![Screenshot from 2023-11-15 14-04-34](https://github.com/umrover/mrover-ros/assets/51866496/702fff05-1101-44f0-b95b-b2a7412df3b6)

Ask an auton lead if you have any questions about this.