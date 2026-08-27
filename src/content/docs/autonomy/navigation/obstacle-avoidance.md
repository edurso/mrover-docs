---
title: "Obstacle Avoidance"
---
**Context**: [URC rules](https://urc.marssociety.org/home/requirements-guidelines) say that there may be obstacles in the way while traversing to the second object (the water bottle).

> The second object may have obstacles in the way that require autonomous avoidance.

**Problem**: We currently have a failure detection and recovery state but some obstacles may not be easy to recover from, and it would be better to just avoid them in the first place.

**Solution**: We will create a new search state for obstacle avoidance search. This search will initially follow the same search pattern as the regular search state, a spiral search. But if there is an obstacle we need to avoid, we will find the minimum cost path around the obstacle and back to the search spiral taking into account the data from the costmap and the distance to return to the spiral. 

<p align="center">
<img width="235" alt="image" src="https://github.com/umrover/mrover-ros/assets/101608185/47380b78-8795-4a0e-8603-7a6d3d239413">
<img width="290" alt="image" src="https://github.com/umrover/mrover-ros/assets/101608185/bab2201f-082f-4ee2-9c44-de88bb2474bf">
</p>

To calculate the minimum cost path, we will follow an algorithm. The current proposed algorithm is the following A* algorithm: f(n)=g(n)+h(n)

f(n) = total estimated cost of path through point n <br />
g(n) = cost so far to reach point n using costs in the local cost map <br />
h(n) = distance from n to next obtainable point on search spiral (target) <br />

**Interface**: We are provided a global 2D cost map from perception, sent over message. It will be an NxM matrix with float values representing 30m x 30m square area with origin at GNSS waypoint. The costmap will be thresholded. Each cell will contain one of three values: -1 (invalid), 0 (low cost), or 1 (high cost). The message type is [`nav_msgs/OccupancyGrid.msg`](https://docs.ros.org/en/melodic/api/nav_msgs/html/msg/OccupancyGrid.html). 

**Rough Steps**:
1. Learn how the new state machine library works. The code new code is merged into [master](https://github.com/umrover/mrover-ros). The files for the library are in src/util/state_lib and the updated states are in src/navigation. Some other examples of how to use the library are in test/util/state_lib.
2. Review proposed minimum cost path formula (A*) and confirm this is the best way of finding the minimum cost path. Do some research checking that this A* algorithm works, or if some functions need to change, or if a completely different formula/method should be used. This can be done by creating a small sample program and running the A* algorithm on fake data, and/or by researching other common formulas for finding the minimum cost path. [Here](https://youtu.be/aKYlikFAV4k?si=igrf7sL-hWC1s2Eg) is a video that gives an overview of the A* algorithm and some example code. There are 3 parts in this series, feel free to watch to get a better understanding of the algorithm.
3. Plan a new search state that includes obstacle avoidance. Since we would only be in this state when we are searching for the water bottle, we will call it WaterBottleSearchState. We can begin by creating an outline of this state. A document has been created in the ENGIN|MRover/Software/Auton/New States folder in the shared drive for this outline. Make sure to reference the current SearchState when planning this new state.
4. Create a data structure to hold the global cost map that perception sends us. Perception will continue to send us these messages with updates to the costmap as the rover is moving. We will create a callback function that will be run every time we receive a message where we can update our data structure and A* algorithm if needed.
5. Implement the A* algorithm described above. The next obtainable point/the target point on the search spiral we want to return to after leaving it to avoid obstacles (used for the h(n) part of the formula), will be the next point we haven't driven to in the search spiral. At every update of our costmap, we will check if that target point we set actually has a high cost. If it does, we will increment our target point to be the next next point on the search spiral. 
<p align="center">
<img width="900" alt="image" src="https://github.com/umrover/mrover-ros/assets/101608185/6c6d26ef-0d35-4068-917b-175f42eda5d7">
</p>