---
title: "Path Execution"
---
# **Context**: 
Last year A* was implemented into the rover's path planning logic providing us with obstacle avoidance behavior. However, one of the significant downsides of the incorporation of A* we found during testing was an increase in the time it takes for the rover to traverse from one point to another.

# **Problem**
During the auton mission, we are limited on time. As such, we need to drive in a way that will save us the most time possible.  

# **Solutions**
## [Pure Pursuit](/autonomy/navigation/pure-pursuit)
Currently, our path-tracking algorithm is built around a state machine that limits the rover's driving to essentially two states -- turn in place and drive forward (read more [here](/autonomy/navigation/overview) ). This is problematic since A*'s path is often quite jagged, meaning the rover is constantly stopping and turning in place to try to follow this path. To solve this, we will utilize a pure pursuit algorithm, which will eliminate the turn in place/drive forward behavior entirely. More details can be found at the page linked above.

## [Path Smoothing](/autonomy/navigation/path-smoothing)
One level above the rover's path-tracking is its path planning. As mentioned above, A*'s paths are quite jagged, and while the implementation of pure pursuit will generally smooth out the rover's traversal, we are also seeking to process and smooth out the A* trajectory before we begin to track it. This will reduce unnecessary oscillations and sharp turns, leading to a more efficient, natural, and stable trajectory for the rover to follow. As such, we will incorporate some form of path smoothing, either with relaxation, interpolation, or both, into the path planning process. More details can be found at the page linked above.

## [Inward Spiraling](/autonomy/navigation/inward-spiraling)
As detailed in the [navigation wiki](/autonomy/navigation/overview), the high-level decision-making for the rover's navigation is based off of a state machine. In the search state, we currently spiral from a center waypoint outwards within some radius. However, this is not optimal if we are driving to the center waypoint from outside of the search area's radius. Instead, rather than driving from outside of the search area to its center and spiraling back to the edge, we should start spiraling _inwards_ from the edge of the search area towards the center waypoint.