---
title: "Adaptive Pure Pursuit"
---
To close #546

This project is to rewrite our underlying drive controller that determines how to actually move navigation from one point to another. In the past we have driven purely based on the rover's position and the single point where we want to go. We would compute the vector from the rover to that point then adjust our angular and linear speeds to try to drive along that vector. Below is a rough example:

<img width="400" alt="image" src="https://github.com/umrover/mrover-ros/assets/20312121/06f78016-3ec4-472f-b4fc-44a7a29e3b7d">


For the search spiral however, we found that these method has unintended consequences specifically because we are targeting a point that may be really far away. In general, we found that the correction was too weak far away from the target, and too strong close up to the target leading to "hockey-stick" like path following (talk to Ankith if you're more interested in this). So we implemented a very rough version of the pure pursuit algorithm to solve the issue.

Instead of targeting the end point, we instead also took as input the previous point in the path so we could compute the line along which the rover is trying to drive. We then compute the point a certain "look-ahead" distance away from the closest point to the rover on that line and target that point instead. If the end point is closer than the "look-ahead" distance, we just chose the end point. Below is an illustration:

<img width="540" alt="image" src="https://github.com/umrover/mrover-ros/assets/20312121/56e8df12-5980-4be9-af45-1dbfe6181861">

What we want to try now is to not just take in the previous point to do this computation as if each segment of the search spiral is an independent path, but instead take in the entire search trajectory. This will allow us to compute look ahead points on the next segment instead of just setting it to the endpoint of the current segment as soon as we are close. Thus this will allow us to smoothly "cut-corners" and have a more circular and smooth search spiral which should hopefully increase our search speed. Below is an illustration of what previously used to happen close to the end points of a segment:

<img width="902" alt="image" src="https://github.com/umrover/mrover-ros/assets/20312121/9097ed11-e3f4-4fd5-bcaa-4cb3b82b9c02">


And below is what we want it do instead:

<img width="898" alt="image" src="https://github.com/umrover/mrover-ros/assets/20312121/c4405459-8f94-4dd4-b7d2-56f751294f85">


While this seems like a very simple change, there are changes that need to be made to the actual drive function interface as well as changes that need to be made to how trajectories are handled when we drive to them and when they are completed that will need to be thought through. We will have a design meeting on this and lay out the basic design for this below once roughly sketched out.






