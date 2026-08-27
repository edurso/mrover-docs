---
title: "Approach Target Base State"
---
**Context**: [URC rules](https://urc.marssociety.org/home/requirements-guidelines) say that we must detect and drive to ArUco tags that are placed upon posts and that may be far away:

> The 3 posts will have GNSS coordinates that are within the vicinity of the posts,
increasing in range from approximately 5-20 m.

Also the rules specify two new waypoints during the Autonomy mission that require the Rover to navigate toward two objects placed on the ground.

>The 2 objects will have GNSS coordinates within the vicinity of the objects (<10 m). Autonomous detection of the tools will be required. The first object will be an orange rubber mallet. The second object will be a standard 1 L wide-mouthed plastic water bottle of unspecified color/markings (approximately 21.5 cm tall by 9 cm diameter).

**Problem**: We currently have the ApproachPostState to approach these targets, but this only commands the rover towards a spotted fiducial target (AR tag). Since we are adding a long range camera to spot the AR tags, we will need another approach state specifically for the long range camera. And since we are also going to traverse to objects, we will need another approach state specifically for the objects. The code for these states will be very similar, but we want to avoid code duplication. 

**Solution**: We will create a new type of Base State for approaching targets that inherits from State (using the new state machine library). Then we will create three different child classes from this new ApproachTargetBaseState. These will be ApproachPostState, LongRangeState, and ApproachObjectState. The first two will be for traversing to posts, while the last one is for traversing to objects. The main differences between each of the child states will be the messages we are getting from perception about the target and the transitions.

<img width="700" alt="image" src="https://github.com/umrover/mrover-ros/assets/101608185/93ea35b1-c232-4056-8828-2d2222b8d572"> 
<br />

**Interface**: This is described more in the state implementation wiki pages.

**Rough Steps**: 
1. Learn how the new state machine library works. The code new code is merged into [master](https://github.com/umrover/mrover-ros). The files for the library are in src/util/state_lib and the updated states are in src/navigation. Some other examples of how to use the library are in test/util/state_lib.
2. Review the outlines of the new states in the ENGIN|MRover/Software/Auton/New States folder in the shared drive. These outlines don't contain all the code you need, make sure to reference the already implemented ApproachPostState for what other things you may need to add. 
3. Start coding up the outline of the ApproachTargetBaseState. After everyone understands this state, split into smaller groups to work on the ApproachPostState, [LongRangeState](/autonomy/navigation/second-camera-integration), and [ApproachObjectState](/autonomy/navigation/approach-object-state) states.