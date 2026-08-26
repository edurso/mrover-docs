---
title: "Teleop Overview"
---
## What is the role of the Teleoperations team?

The Teleoperations (Teleop) team ensures the rover's physical systems are easily controllable by a human operator. We build and maintain key systems that allow operators to command the rover and receive feedback in real time.

## Base Station GUI

The Base Station GUI is a [Vue.js](/teleop/vue-introduction) web app that serves as the main interface for operating the rover. It:

- Captures controller inputs (Xbox, Thrustmaster joystick)
- Displays GPS, camera, and sensor data
- Sends waypoints to auton
- Controls devices used in science sample acquisition

and more...

## FastAPI Backend

To support the frontend GUI, we have a Python FastAPI backend that bridges it to Robot Operating Software 2 [(ROS2)](/general-resources/ros/intro-to-ros/). It:

- Maintains [WebSocket](/teleop/websockets-introduction) connections per subsystem (arm, drive, nav, science, etc.)
- Forwards ROS2 topics to the frontend via msgpack-serialized WebSocket messages
- Publishes controller inputs from the frontend to ROS2 topics
- Stores persistent data like GPS waypoints in [SQLite](/teleop/sqlite-introduction)
- Computes robotic arm commands (throttle, IK position, IK velocity)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3, TypeScript, Vite, Pinia, Tailwind CSS |
| Complex Visuals | Three.js (3D), Leaflet (Maps) |
| Backend | Python, FastAPI, uvicorn |
| Communication | WebSocket + msgpack binary serialization |
| Data | SQLite |
| Runtime | Bun (JS), ROS2 rclpy (Python) |

## Resources

[Teleop Quickstart](/teleop/quickstart)

[Teleop FAQ](/teleop/faq)

[Vue Introduction](/teleop/vue-introduction)

[Tailwind Introduction](/teleop/tailwind-introduction)

[GUI Styling Guidelines](/teleop/gui-style-checking)

[WebSocket Handlers Lookup](/teleop/consumers-lookup)

[Teleop Starter Project](/teleop/starter-project)

---

Have a suggestion for features? Put it [here](https://docs.google.com/forms/d/e/1FAIpQLSd-sDdytRO2hFJAeUFrdFSiaeeOY1nzcbLjtVUYSmkCp70zNw/viewform?usp=sharing&ouid=104464537546922765205)!
