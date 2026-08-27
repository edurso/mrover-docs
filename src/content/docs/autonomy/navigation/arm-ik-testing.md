---
title: "Arm IK Testing Visualization"
---
Last year, we began to implement arm inverse kinematics on the rover. However, we did not have enough time to test both inside the sim and on the real rover, so the IK was not used in competition. This year, we would definitely like to get IK competition-ready, both for to improve the experience of the operators and especially for the new autonomous typing challenge. Thus, we would like to formalize the testing of the arm IK.

First, we need to more thoroughly test the IK in the sim before trying it on the rover. One step in doing so is visualizing the space of reachable arm targets. To do so, we can create a pointcloud that looks something like this:

![image](https://github.com/user-attachments/assets/3075cd6b-e10c-4a45-acb1-e054e6eb5a5e)

In this particular image, there are a variety of colors that indicate how "easy" it is for the arm to reach a given position. However, for our purposes, we will (at least to start) simply mark points as reachable or not reachable. We can indicate this through the color of the points in the pointcloud (i.e. green for unreachable and red for reachable).

To create this pointcloud, the perhaps easiest course of action would be to make a new auxiliary node (perhaps named `test_ik`) that will generate and publish the pointcloud. Within this node, we can generate a list of points in a rectangular prism that we know will encompass all of the reachable arm positions (we want to overestimate this so that we don't miss any points). We then want to test each of these to see if the arm can reach it.

One way to do this would be to write all the arm IK math in the `test_ik`, but this would be unnecessarily repeating work that has already been done. Additionally, our goal is to test the existing implementation, not to test a new one that could potentially introduce new and separate bugs! So, we'd like to re-use the existing implementation (currently located in `teleoperation/arm_controller/`).

One approach (perhaps the easiest) would be to command the arm (by sending a message over the `arm_ik` topic) and see if the `arm_controller` node is able to move the arm to the given position. Currently, the `arm_controller` node reports its status by logging with `RCLCPP_WARN_THROTTLE`, but this is not the most useful thing for another node to receive. Instead, we can create a new publisher in the `arm_controller` node that can report the status of the arm.

So the overall approach would be something along the lines of:
1. Generate a list of points to test
2. For each point,
    1. Send the point to the `arm_controller` node as a target position1.
    2. Wait for the status the `arm_controller` provides
    3. Record the outcome as a color-coded point in a pointcloud
3. Publish the pointcloud so that it can be visualized with rviz

Please note that these ideas are very preliminary and may not be the best course of action! They are certainly subject to change and improvement!