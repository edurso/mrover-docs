---
title: "Perception"
sidebar:
  order: 3
---
# Perception

For the perception starter project, you will implement a ROS2 node that uses camera data to detect ArUco tags using [OpenCV](https://github.com/opencv/opencv), a popular computer vision library. Navigation will read this data in order to align the rover with it. If you are unfamiliar with ArUco tags, it might be helpful to quickly read the "ArUco Markers" section of the [perception overview](/autonomy/perception/overview) as a primer. Don't worry about the "Update Loop" in the Details section.

### Inputs
- Image data: `Image` messages published to the `/zed/left/image` topic

### Outputs
- A custom message published to `/tag` topic containing data about the closest detected ArUco tag:
    - The tag's ID
    - The x-coordinate of the center of the tag in the image
    - The y-coordinate of the center of the tag in the image
    - A closeness metric representing how far away the tag is

Note: the [ROS2 humble wiki](https://docs.ros.org/en/humble/index.html), software leads, and fellow members are a great resource if you are struggling with anything. Don't be afraid to ask questions; it's how we learn!

## Implementation

### Creating a Custom Tag Message

ROS projects can be thought of as a collection of nodes that talk to each other via named [topics](http://wiki.ros.org/Topics). However, without any extra information, the data flowing between the nodes are just bytes. 

[Messages](http://wiki.ros.org/msg) help define how this data is structured. ROS has many predefined message types, but you can also create your own custom message templates. We want to make a custom type that gives Navigation useful information about the ArUco tag. We have implemented this in `msg/StarterProjectTag.msg` for you.

```
int32 tag_id
float32 x_tag_center_pixel
float32 y_tag_center_pixel
float32 closeness_metric
```

You will implement the functions in `perception.cpp` to identify the values of the above four variables, use them to construct a `StarterProjectTag`, and publish the message to the `/tag` topic for Navigation to read ("subscribe") from.

From the terminal, make sure you are in the mrover repository by running `mrover` and then `./build.sh` to build the message file.

<details>
  <summary>Optional for the curious: how do messages work behind the scenes?</summary>
  
  You might be wondering: "I only made a text file, how does this actually work in C++?" That's great intuition! We use the build system CMake to automatically generate the C++ code for this message

  <!-- DANTODO: Make sure this is accurate to the final product Sid cooks up -->
  In `AutonomyStarterProject.cmake` take a look at:

  ```cmake
  file(GLOB_RECURSE STARTER_PROJ_MESSAGE_PATHS RELATIVE ${CMAKE_CURRENT_SOURCE_DIR} CONFIGURE_DEPENDS 
          ${CMAKE_CURRENT_LIST_DIR}/msg/*.msg
  )
  ```
  This configurates CMake to generate all of the necessary files to be able to use each custom message in the `msg` directory.
</details>

## Code Overview
To complete the Perception starter project, you will implement 7 functions of the `Perception` class:
- the Perception() constructor
- imageCallback()
- findTagsInImage()
- selectTag()
- publishTag()
- getClosenessMetricFromTagCorners()
- getCenterFromTagCorners()

Each of these functions have corresponding headers in `perception.hpp` that might be helpful. You shouldn't have to create any other functions.

### Setup with Perception()
Let's take a look at the constructor `Perception::Perception` in `perception.cpp`. This function does a lot of important setup. Before we can figure out any information like where the center of the detected tag is, we first need to get the actual camera frame. 

As detailed in the Inputs section, each frame from the camera is published to the topic `/zed/left/image`. So the first thing this function does is read the camera frames from the topic. We do this using a subscriber. Take a look at the following code block:

<!-- DANTODO: KEEP THIS UPDATED -->
```
mImageSubscriber = create_subscription<sensor_msgs::msg::Image>("/zed/left/image", 1, [this](sensor_msgs::msg::Image::ConstSharedPtr const& frame) {
    imageCallback(frame);
});
```

This code defines a subscriber that subscribes to the topic `/zed/left/image`. The [this] [lambda](https://en.cppreference.com/w/cpp/language/lambda.html) syntax may look confusing, but all it's doing is calling the `imageCallback` function, passing the camera frame as an argument. 

When a new camera frame gets published to `/zed/left/image`, the subscriber calls `imageCallback` with the new camera frame. Thus, `imageCallback` gets called roughly 60 times per second. 

Now, uncomment the line starting with `mTagPublisher`. Once we're done processing an image, we need to publish it to a topic so that other nodes, such as the Navigation node, can use our newly processed data. This is the job of a publisher, which publishes a message of a specific type to some topic. In our case, we define a publisher that publishes `StarterProjectTag`s to the topic `/tag`:

```
// TODO: uncomment me!
// mTagPublisher = create_publisher<msg::StarterProjectTag>("/tag", 1);
```


Finally, we define the format of the tags we will be detecting by calling `cv::aruco::getPredefinedDictionary()`. The OpenCV library allows you to pick from various sets of valid markers. In this case we pick `DICT_4x4_50`, which means we guarantee that any ArUco tags we see will have 5x5 bit markers and an ID between 0-49. We'll discuss this topic further when we actually perform the detections.

For now, by uncommenting the publisher, you've finished implementing the first function! Lucky for you, the rest of the functions will be a slightly more complex and require a bit of a creativity :)

### Structuring the other functions

The `Perception()` constructor gets called only once, when the node is initially created. Before we get into implementation details for the remaining six functions, it's a good idea to figure out what they should do and how they interact with each other. 

Based on the names of the functions, the parameters/return variables for each function, and various comments, **identify:**
- The inputs and outputs of each function
- The order each function will be called in
- Which functions call each other

Talk with the people around you and the autonomy leads if you have any questions!

### imageCallback()

Let's begin implementing each of the functions. The details will be relatively sparse, since there is no "correct" solution or structure, so be creative! 

Lets start with the `imageCallback()` function. There are a few lines already in `imageCallback()`:

```
cv::Mat imageBGRA{static_cast<int>(imageMessage->height), static_cast<int>(imageMessage->width), 
              CV_8UC4, const_cast<uint8_t*>(imageMessage->data.data())};
cv::Mat image;

cv::cvtColor(imageBGRA, image, cv::COLOR_BGRA2BGR);
```

All this does is convert from BGRA to BGR (blue-green-red), remove the alpha (transparency) channel, and store the resulting BGR image in the `image` variable. For the starter project, you do not need `imageBGRA` and should only use the `image` variable.

Hint: since `imageCallback()` is the function that gets called by the subscriber, you've hopefully identified that it must call at least one other function to do the processing. 

### findTagsInImage()

As the name suggests, this function's goal is to extract all ArUco tags from the `image` parameter and place them into the `tags` output vector.

You will want to use the `cv::aruco::detectMarkers()` function for this. The hints in the comments and [this example](https://docs.opencv.org/4.2.0/d5/dae/tutorial_aruco_detection.html) from OpenCV should give you an idea for what parameters you need to pass. Also, consider what other functions you might want to call from this function.

### getCenterFromTagCorners()

This function's goal is to find the xy-coordinates of the center between the four corners for each tag. There's a few different ways to implement this function, so we won't provide a strategy or design to do it. Discuss with your partners/people around you and leads! While there are a few edge cases, this center does not need to be perfectly accurate. Simple is often better than complicated.

Hint: once `cv::aruco::detectMarkers()` is called, `mTagCorners` and `mTagIds` should contain the xy-coordinates of the corners and IDs (0-49) of the tags. Each four-tuple of corners is ordered as follows: top-left, top-right, bottom-right, bottom-left. `mTagIds` and `mTagCorners` are indexed the same; that is, the corners in `mTagCorners[0]` represent the corners of the tag with ID `mTagIds[0]`.

### getClosenessMetricFromTagCorners()

It's important to have some kind of closeness metric, since it identifies how far away a tag is (and if we're moving, whether or not we're getting closer to it). Again, there are a few different ways to implement this function, so we won't tell you how to do it. Be creative! 

For a closeness metric, you only need an approximation. It will be used to drive towards the tag and stop within a distance. Consider how you as a human would estimate how far something is from you. How would you approximate how far the vehicles in the image below are from you? How do you know they are different distances away? Be creative! 

![Cars on a road](https://upload.wikimedia.org/wikipedia/commons/9/9a/Depth_cues_1.png)

However you choose to implement the closeness metric, make sure to scale the number between 0 and 1 (where 0 is very close and 1 is far away), as the navigation starter project expects a range between these two numbers.

### selectTag()

We want to select the closest tag from the vector `findTagsInImage()` populates, since it makes sense to drive towards closer objects compared to farther ones. In other words, we want to pick the tag with the highest closeness metric. 

### publishTag()

Now that we have our desired tag, it is time to publish it to the proper topic. Implement `Perception::publishTag`. If you are unsure of the syntax, this [example](https://ros2course.readthedocs.io/en/latest/Writing%20publisher%20and%20subscriber%20nodes.%20C++.html) or a quick Google search will help you out. 

If there are no valid ArUco tags in frame, you should publish a "dummy" tag with an ID of -1.

## Putting It All Together

<!-- DANTODO: make sure the ros2 launch commands are accurate to final product-->
To test your tag detection algorithm, run `ros2 launch mrover starter_project.launch.py` to open the simulator. Then run `ros2 topic echo /tag` to monitor the output of perception. Make sure your node (the code you wrote) is not crashing in the log output! `ros2 topic echo /tag` should at least be continuously publishing invalid tags with ID of -1.

You can drive the rover around by pressing `p` to enable physics, and then move with `i`,`j`,`l`, and `,`. In the RViz window, press "Add" in the bottom left, then click the "by topic" tab, scrolling down and selecting the "/zed", "/left", "/image", "Image" option, and click "OK". This should open a small window in the bottom left displaying what the ZED camera sees inside the simulator. If you navigate the rover such that you can see the ArUco tag in the camera feed, but `ros2 topic echo /tag` isn't publishing a valid (not -1) tag, you might have some errors in your code.

Otherwise, congratulations! You have successfully completed the perception starter project!

### Debugging with VS Code

As a disclaimer, it can be difficult to use a debugger with MRover software, and various tools like `ros2 topic echo` and print statements are usually more helpful. However, it is possible to use VS Code to debug the starter project. First, comment out `perception_node` from the `starter_project.launch.py` file. Now, when the starter project is launched, it won't launch the perception node. You will instead be separately launching it from VS Code.

Now run `ros2 launch mrover starter_project.launch.py` in a terminal to launch the simulator and other two nodes.

In VS Code, hit Ctrl-Shift-P and run `Cmake: Debug`. Select "Unspecified" if it asks for a kit. Select the starter_project_perception target to run (these settings are also on the bottom bar).

Make sure to set breakpoints in the source code files! They can provide useful information that print statements can't.

### Extra

#### What is Camera Space?

![ArUco Tag Camera Space Example](https://user-images.githubusercontent.com/20666629/188225154-544900f7-f7c1-41b3-82fd-4d0ccfa1dcd9.png)

Consider the following image. Let's say it is 400x400 pixels. We can define a coordinate system that starts at the top left corner, consider that `(0,0)` with positive values of x extending right and positive values of y extending downward. The center of the tag would be about `(300,100)` in this space. Here is a diagram to aid understanding:

![Image Coordinate System](https://user-images.githubusercontent.com/20666629/191894080-e574e180-15bd-474a-aded-052bf541cdea.png)
