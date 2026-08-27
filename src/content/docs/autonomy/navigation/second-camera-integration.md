---
title: "Second Camera Navigation Integration (LongRangeState)"
---
**Context**: [URC rules](https://urc.marssociety.org/home/requirements-guidelines) say that we must detect and drive to ArUco tags that are placed upon posts and that may be far away:

> The 3 posts will have GNSS coordinates that are within the vicinity of the posts,
increasing in range from approximately 5-20 m.

**Problem**: The [ZED stereo camera](https://www.stereolabs.com/zed-2/) can only detect tags around 8 meters away, so to find the tag, we have to run a spiral search until the tag is in the frame of view of the ZED stereo camera. This takes away precious time as the autonomy period is only 30-60 minutes long.

**Solution**: Once the rover goes into the search state (starts the search spiral), it will look for the tag in both the ZED stereo camera and the new secondary camera.

**Interface**:

We will receive messages from perception

`LongRangeTags.msg`
```
LongRangeTag[] tags
```

`LongRangeTag.msg`
```
int32 id
int32 hitCount
float32 bearing
```
**Rough Steps**:
1. Create a data structure in context for new messages from the secondary camera (could add in Environment class). Also create our own hit count for the tags we are receiving messages for.
2. Create a new file for the new state. Add this state to the infrastructure and add transitions in other states. 

Description of state: Look for the tag in both the ZED and long range cameras
<p align="center">
<img width="549" alt="image" src="https://github.com/umrover/mrover-ros/assets/101608185/e8509b86-a720-42a8-833b-eb669dfd8bba">
</p>

* If the rover sees the tag only in the long range camera, not the ZED camera, the rover will transition into a new state (LongRangeState). We won’t know how far the tag is from the rover since the zoom camera has no depth perception, unlike the ZED camera. Roughly, how we could transition into the LongRangeState is as follows:
  * Keep track of time we last received a message and keep a hit counter for the tag
  * When we get a message, we will upgrade hit counter and once we see it enough in a certain amount of time, we will transition into the LongRangeState
  * If we don’t receive a message in 3 seconds once in the LongRangeState, we will transition back into the SearchState
  * Get bearing from message and create a “target” location to drive to by setting a point a certain look ahead distance far away from the rover once aligned with the bearing

<p align="center">
<img width="158" alt="image" src="https://github.com/umrover/mrover-ros/assets/101608185/232bceb6-be4e-4db5-bb5f-500dde9dcd6a">
</p>

* If the tag goes out of view, and still isn’t seen in the ZED, go back into SearchState
* If the rover sees the tag in the ZED camera (even if the long range camera sees it or not), this overrides any information from the long range camera so the rover will drive to the tag normally (transition into ApproachPostState)

3. Test in sim
4. Test on the rover
