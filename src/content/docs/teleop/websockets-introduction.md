---
title: "Websockets Introduction"
---

## Overview

**WebSocket** is a networking protocol, like HTTP. It uses WebSocket**s** to provide real-time communication between computers. The main way we use them is to forward ROS topics that have been received by the backend to the frontend, however, some of our WebSocket's don't involve ROS at all. In any case, Websockets allows for 2-way exchanges between our frontend and backend.

## Using Websockets  

To interact with WebSockets in typescript, use ```useWebsocketStore()```'s methods.

``` typescript
import { useWebsocketStore } from '@/stores/websocket'

// Do this:
const { setupWebSocket, closeWebSocket, sendMessage, onMessage, etc. } = useWebsocketStore()

...

sendMessage('websocket_name', {
    type: 'type'
})

onMessage<ExampleMessage>('websocket_name', 'example', msg => {
    // Do something when this message is received
    // Here, it logs the value to the console
    console.log(msg.value)
})

// This works too, but prefer above for consistency:
useWebsocketStore().sendMessage('websocket_name', {
    type: 'type'
})
```

Websockets must first be initialized before use. Typically, this is done in the [highest level component](/teleop/consumers-lookup), but you can manually initialize and deinitialize them with  

``` typescript
setupWebSocket('websocket_name')
closeWebSocket('websocket_name')
```

Active WebSockets should have indicators in the top right of the basestation GUI. Red (RX) indicates a receive, while green (TX) indicates a transmit.

## Websocket Creation and Structure

### ```server.py```

All websockets are launched with the rest of the backend in ```server.py```.

``` python
...
@app.websocket("/ws/arm")
async def ws_arm(websocket: WebSocket):
    await handle_websocket(websocket, ArmHandler)
...
```

### Websocket File

WebSocket handlers are defined as python classes in the ```ws``` folder. An example may look like this:

```python
from backend.ws.base_ws import WebSocketHandler
from backend.managers.ros import get_logger
from rclpy.publisher import Publisher
# std_msgs.msg has messages created by ROS
from std_msgs.msg import String
# mrover.msg has messages created by us
from mrover.msg import ControllerState

class ExampleHandler(WebSocketHandler):
    my_pub: Publisher

    def __init__(self, websocket):
        super().__init__(websocket, "example")

    async def setup(self):
        self.my_pub = self.node.create_publisher(String, "/example_topic", 1)
        self.publishers.extend([self.my_pub])

        self.forward_ros_topic("/arm_controller_state", ControllerState, "arm_state")

    async def handle_message(self, data):
        msg_type = data.get("type")

        if msg_type == "test":
            get_logger().log("Message received!")
        else:
            get_logger().warning(f"Unhandled EXAMPLE message: {msg_type}")
```

### Publishing vs. Forwarding vs. Receiving messages

**Receiving** messages is pretty straightforward. Somewhere (usually from a typescript file or Vue component), a message is sent to a WebSocket, and that WebSocket does something with that message.  

**Publishing** is when a WebSocket creates its own message and sends it.  **Forwarding** is when a WebSocket makes an existing ROS topic available through using the WebSocket's interface.
