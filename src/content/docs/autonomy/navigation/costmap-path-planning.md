---
title: "Costmap Path Planning"
---

**Solution**: We will integrate the costmap functionality from `WaterBottleSearchState` into the general `SearchState`, so that it can be used when searching for any target. Additionally, we may experiment with adding the costmap to `WaypointState`, so that we can avoid obstacles when traversing larger distances between waypoints. We will also implement an interface with teleop so that the costmap functionality can be toggled on or off—this can be used a safety switch in case the obstacle avoidance isn't functioning as intended, and it can be used to disable obstacle avoidance when the terrain clearly does not require it.

Here's a (simplified) overview of the navigation state machine as it is now:
![Nav State Machine (Simplified)](https://github.com/user-attachments/assets/61738dfe-3728-46dc-a952-79b7d9e571ce)

For more details on the specifics of how the current costmap implementation works, be sure to check out [this](/autonomy/navigation/obstacle-avoidance) page.