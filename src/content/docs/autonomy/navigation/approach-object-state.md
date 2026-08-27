---
title: "Approach Object State"
---
**Context**: As of this year, [URC Rules](https://urc.marssociety.org/home/requirements-guidelines) specify two new waypoints during the Autonomy mission that require the Rover to detect and navigate toward two objects placed on the ground.

> The 2 objects will have GNSS coordinates within the vicinity of the objects (<10 m). Autonomous detection of the tools will be required. The first object will be an orange rubber mallet. The second object will be a standard 1 L wide-mouthed plastic water bottle of unspecified color/markings (approximately 21.5 cm tall by 9 cm diameter).

**Problem**: We currently have the ApproachPostState, but this state only commands the rover towards a spotted fiducial target (AR tag). 

**Solution**: Since we are also going to be traversing to objects, we will need to add another approach state specifically for the objects.

**Interface**:

Perception will publish information about permanent objects to the TF tree. Navigation will receive the information through the TF tree by querying what we are looking for (rubber mallet, water bottle).

**Rough Steps**:
1. Look at outline of the state in ENGIN|MRover/Software/Auton/New States folder in the shared drive.
2. Add a state for approaching objects (ApproachObjectState) inherited from the new ApproachTargetBaseState. Traverse to objects in a similar way as the tags because we have a distance measurement provided by perception in the TF tree.
