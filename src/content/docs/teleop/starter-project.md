---
title: "Teleop Starter Project"
---

## Introduction

Here, you will complete a Vue component by:
* Creating page elements.
* Formatting page elements.
* Importing other components (```ArmControls``` and ```Rover3D```).
* Sending/receiving messages to/from the backend.

The tasks you complete in this project will be similar to tasks that you see in the future. Don't be afraid to ask questions if you can't understand something, or are just curious. At a quick glance, the teleop system may seem simple, but there are a lot of moving parts.

---

## Getting Started

### Opening the Code
First, go to [Teleop Quickstart](quickstart.md) and make sure your environment is set up. Critically, make sure you've run ```./build.sh``` and have all necessary dependencies.

Open up a terminal, and type ```mrover```. Then: 

Switch/go to the branch that has the starter project code: 

```bash
git switch teleop-starter-2026
```

Copy it into a new branch:

```bash
git switch -c <your-initials>/starter-project-2026
example: git switch -c km/starter-project-2026
```
:::note
Whenever you create a new feature, you should make a new branch and follow the naming convention of ```<your-initials>/<feature name>```. You'll often switch from main, but not always.
:::


Now you (hopefully) have the starter code ready to be worked on. But how do you run and debug it?  

### Running the Code

Go to the url ```http://localhost:8080/starter``` in your browser. You should see an error page. This is because it is trying to access a server on and IP address that doesn't have any - ```localhost``` a.k.a. ```127.0.0.1``` a.k.a. **your** computer. To create the server it needs, go to your terminal, and run
```bash
mrover
ros2 launch mrover basestation.launch.py mode:=dev
```
:::note
```mode:=dev``` launches in development mode. Without it, the basestation will launch in production mode and in a new window.
:::

This launches both the frontend and the backend. Now once you go back to your browser, you should see a webpage with a header and some text with "Hello World!" in it after reloading. If not, make sure you did everything in [Teleop Quickstart](quickstart.md), or ask for help.

:::note
* The ```/starter``` part of the url specifies that you are on the "Starter" page of the basestation. You can remove it to see the main page.  
* The ```:8080``` part of the url is the port number. It functions as a sort of "id" for the server on the particular computer.
:::

---

## Vue Files and Editing

Now, open up ```StarterProject.vue``` in a code editor. It's easiest to just run this in a new terminal:
```bash
mrover
code .
```
Then press **ctrl-p** and type the file's name to search for it. It should look something like this:  

```html
<template>
  <div class="view-wrapper">
    <h1>Hello world!</h1>
    <!-- TODO -->
  </div>
</template>

<script lang="ts" setup>
    import { onMounted, onUnmounted } from 'vue'
    ...
```

Let's add a button to it.  
Delete the ```<h1>``` and replace the ```// TODO add button``` with this code:
```html
<button class="btn btn-primary">
  Hello button!
</button>
```
Now, you have a button that does absolutely nothing! Note that if you go back to the browser, you don't have to reload to see your changes. This is due to *hot swapping*.  

---

## Typescript

### Connecting Script to Page Elements

We would probably like our buttons to not do nothing, so let's fix that by adding some functionality.  
  
Scroll down in the file until you find the ```spamTestMessages``` function. It should look like this:
```typescript
const spamTestMessages = () => {

  // Send a message every 1000 milliseconds
  const interval = setInterval(() => {
      console.log("Sent a message at " + new Date().toISOString())
  }, 1000)

  // Stop sending messages after 5000 miliseconds
  setTimeout(() => clearInterval(interval), 5000)
}
```
What better for adding functionality than a function? We will make it so that this code runs whenever the button is pressed. Go back to the button, and add the event ```@onclick="spamTestMessages()"``` to it as such. Don't forget to change the text to something descriptive:
```html
<button class="btn btn-primary" @click="spamTestMessages()">
  Spam test messages
</button>
```

Now click it and... still nothing? Open up your web browser's *inspector* (You can use the shortcut **ctrl-shift-i**, or right-click and select *"inspect"*) Go to the *console* tab, and, alongside a couple warnings, you should see a message like this appear:

```
Sent a message at 2026-06-22T21:30:56.817Z
```

Let's go through the code to see how it works.

### Function Analysis

```typescript
const interval = setInterval(() => {
  ...
}, 1000)
```
setInterval (as the comment suggests), runs the function inside of it every 1000 milliseconds (every second). An id for it is stored in the ```interval``` variable.
```typescript
setTimeout(() => clearInterval(interval), 5000)
```
setTimeout runs the function inside of it after 5000 milliseconds (5 seconds). That function (```clearInterval()```) stops the previous interval.

```typescript
const interval = setInterval(() => {
  console.log("Sent a message at " + new Date().toISOString())
}, 1000)
```
This part of the function causes the output. It prints a message to the console containing the current time.

---

## WebSockets
### Overview

Sending a message to the console is great and all, but it's only really useful for debugging. It would be nice to send messages to different parts of our code, including to the rover. *WebSockets* are part of how we do this.

***WebSocket*** is a networking protocol, like HTTP. It lets computers talk to each other via *WebSocket**s***. It sends messages quickly - great for real-time updates. In our codebase, when a ROS topic is published, it gets sent to the backend, and then forwarded to the frontend via a WebSocket (if one has been set up). It also works in reverse; a frontend element can send messages to the backend and then to the rover.

### Vue Component Setup
To use a WebSocket in a component, we first import necessary dependencies and define the necessary functions:

```typescript
import { useWebsocketStore } from '@/stores/websocket'
...
const { setupWebSocket, closeWebSocket, sendMessage } = useWebsocketStore()
```

Then, we set up needed WebSockets.

```typescript
onMounted(() => {
  setupWebSocket('starter')
  // TODO add necessary sockets
})
```

:::caution
  WebSocket setup and closing is typically handled in the highest level component, in a different way than above.  
  Check [Websocket Handlers](consumers-lookup.md) for more information.
:::

Messages can now be sent through this WebSocket (WebSocket with id "starter"). When the Vue component is unmounted, we also have to close the WebSocket.

### Status Indicator

The box in the upper left is a status indicator. A green light (on the left) indicates a transmit, while a red light indicates a receive. If the whole box is yellow, this indicates a disconnect - likely what you see right now.

### Try it yourself

Replace the ```console.log("Sent a message at " + new Date().toISOString())``` with the following code.

```typescript
sendMessage('starter', {
  type: 'debug',
  timestamp: new Date().toISOString(),
})
```

Click the button and... now even less happens. If you've been reading carefully, and saw the warnings in the console, you probably have a guess at what's happening. The starter WebSocket itself hasn't been properly set up on the server end.  

Go to ```server.py```. As the name suggests, it boots up most of the backend code. Add the following at the ```# TODO set up starter websocket```

```python
# TODO set up starter websocket
@app.websocket("/ws/starter")
async def ws_starter(websocket: WebSocket):
  await handle_websocket(websocket, StarterHandler)
```
Don't forget the corresponding import above.

```python
# TODO import StarterHandler
from teleoperation.basestation_gui.backend.ws.starter_ws import StarterHandler
```

Because you changed server-side code, you have to reset the basestation to see changes. Go back into the terminal running the basestation and press **ctrl-c**. This kills the backend. The frontend will stick around until the page unloads. Restart the basestation by running the launch command again (the command will probably come back if you just press **up** in your terminal).

:::note
**ctrl-c** will cancel any process/command currently running in the terminal. Use it whenever a program gets stuck!  
If you want to copy something in the terminal, use **ctrl-shift-c**, or just drag-select the text; it will depend on your environment.
:::

Now when you press the button... it's not nothing, I swear. You should see a green indicator in the corner, and if you go into the terminal, you should see something like this:

```bash
[gui_backend.sh-1] [WARN] [1753735204.830010889] [gui_backend_node]: debug message received by consumer, 2025-07-28T20:40:04.827Z
```

You have successfully set up a WebSocket!

### Extra Challenges

#### 1

Change the ```new Date().toISOString()``` to some other value. Press the button and see what happens in the terminal.

#### 2

Next, undo changing ```new Date().toISOString()```, and try this challenge: Get the following to display in your terminal:
```bash
[gui_backend.sh-1] [WARN] testing message 'Phil' received at <current time>
```

*Hint: look in ```starter_ws.py```. Where is a message's type used? What data does the WebSocket expect when it receives a particular message?*

#### 3

Finally, try receiving a message. The starter websocket publishes a String message to *"foo"* every 2 seconds. Get it to display that message in the browser's console.

*Hint:*

``` javascript
// TODO add onMessage
onMessage<?>('starter', '?', msg => {
  console.log(?)
})
```
---
## Components Inside of Components

If you have pried into some of the other views/pages, you've seen they have many sections with complex parts, and that some of those sections are reused on different pages. These sections are called *components*. The view itself is also a component. The Starter page is sparse, so let's try to add some to it.  

It would be nice to test the rover's arm on the page, so we should add the necessary components for that. First, we have to import them inside of the ```<script>``` tag. Replace the ```// TODO import components```:
```typescript
import ArmControls from '../components/ArmControls.vue'
import Rover3D from '../components/Rover3D.vue'
```

Add necessary WebSocket management:

```typescript
onMounted(() => {
  setupWebSocket('starter')
  setupWebSocket('arm') // <-- Add this
})
...
onUnmounted(() => {
  closeWebSocket('starter')
  closeWebSocket('arm') // <-- this too
})

```

Now that they have been imported, we can use them in the ```<template>```.

Replace the ```<!--TODO add components-->``` with this code:

```html
<ArmControls/>
<Rover3D/>
```

Now the page looks... kinda weird actually. We should format it.

---

## Formatting

[Tailwind](https://tailwindcss.com/docs/styling-with-utility-classes) is a CSS framework that we use for styling. It provides classes to modify styles of elements. Add some to the new components.

```html
<ArmControls class="island py-1" />
<Rover3D class="island m-0 p-0" style="max-height: 700px;" />
```

* ```island``` adds a white, rounded background to a component.
* ```p``` (and by extension, ```p-y```) changes padding.
* ```m``` is for changing margins.
* ```style``` is not part of Tailwind; it manually changes the elements CSS styling. ```max-height: 700px``` forces to ```Rover3D``` component to stay under 700 pixels of height  


The page looks a little better now, but it still has an odd layout. Group the button and ```ArmControls``` together using a ```<div>```

```html
<div>
  <button class="btn btn-primary" @click="spamTestMessages()">
      Spam test messages
  </button>
  <ArmControls class="island py-1" />
</div>
```

Even better, but there is a little awkwardness. Make the ```<div>``` into a *flexbox* (with additional styling) by adding ```class="flex flex-col gap-2 mb-2 p-1"``` to it. Your final ```<template>``` code should look like this:

```html
<template>
  <div class="view-wrapper">
    <div class="flex flex-col gap-2 mb-2 p-1">
        <button class="btn btn-primary" @click="spamTestMessages()">
            Spam test messages
        </button>
        <ArmControls class="island py-1" />
    </div>
    <Rover3D class="island m-0 p-0" style="max-height: 700px;" />
  </div>
</template>
```

Lookin' good! Graphic design is your passion as it is mine, I'm assuming.

:::note
A *flexbox* is a container that holds elements in a single row or column. It can shrink or grow elements as needed to fit inside of its empty space.  

*Grid* is also a common choice for holding multiple elements. It displays them in... well... a grid. Prefer to use it over *flexbox* when a layout starts to get cluttered, as *grid* is more predictable.  

See more info at [this Geeks for Geeks article](https://www.geeksforgeeks.org/css/comparison-between-css-grid-css-flexbox/) (albeit, for base CSS).
:::

:::caution
The basestation is designed to display best on a **1080p** screen - the one used at competition. You might have to adjust your settings or fullscreen the page to match it.
:::

---

## ```Arm Controls``` and ```Rover3D```

### Overview

```Rover3D``` is a display of the rover in its current state. It also displays a *costmap*, a grid of how "expensive" it would be for the rover to navigate a certain section of terrain.  

```Arm Controls``` allows the operator to move the robot arm with a controller, and displays the controller's state. Here, however, the code has been modified so that keyboard input also moves the arm.  

Here is part of the code for keyboard input (not all of it):

```typescript
interval = window.setInterval(() => {
  const axes: number[] = [0, 0, 0, 0]
  const buttons: boolean[] = []
  axes[0] = (keysPressed.d ? 1 : 0) - (keysPressed.a ? 1 : 0)
  axes[1] = (keysPressed.s ? 1 : 0) - (keysPressed.w ? 1 : 0)

  sendMessage('arm', {
    type: 'ra_controller',
    axes: axes,
    buttons: buttons
  })
}, 1000 / UPDATE_HZ)
```

It takes the keyboard input and "translates" it into a controller input.  
Here is part of the code for direct controller input:

```typescript
const { connected, axes, buttons, vibrationActuator } = useGamepadPolling({
  controllerIdFilter: 'Microsoft',
  topic: 'arm',
  messageType: 'ra_controller',
})
```

However, pressing anything won't move the arm currently. This is for two reasons:
* The arm mode has to be set.
* The backend needs a rover with an arm to move.

### Setting up ```Arm Controls```

Head inside ```ArmControls.vue```. In VSCode, you can control click its name from its html tag or import statement. Then, go to this div:

```html
<div class="flex w-full" role="group" aria-label="Arm mode selection" data-testid="pw-arm-mode-buttons">
  <!-- TODO add buttons-->
```

And add these buttons where the ```TODO``` is:

```html
<button
  type="button"
  class="btn btn-sm flex-1"
  :class="mode === 'disabled' ? 'btn-danger' : 'btn-outline-danger'"
  data-testid="pw-arm-mode-disabled"
  @click="newRAMode('disabled')"
>
  Disabled
</button>
<button
  type="button"
  class="btn btn-sm flex-1"
  :class="mode === 'throttle' ? 'btn-success' : 'btn-outline-success'"
  data-testid="pw-arm-mode-throttle"
  @click="newRAMode('throttle')"
>
  Throttle
</button>
```

Click throttle. The hard part is now done. Next, we need to get the rover, or at least a virtual one.

---

## Simulator

Open a new terminal, but keep the old one running the basestation. Run and then run these commands. If you get stuck in the simulator, press **esc**:

```bash
mrover
ros2 launch mrover simulator.launch.py
```

The simulator and RViz will open in new windows. *RViz* is a useful tool that allows you to see what the rover sees, and what topics are being broadcast. The simulator provides a digital version of the rover that communicates with the basestation in a similar way to if it was real.

### Navigating the Simulator

The simulator is the one with the MRover logo as its symbol. You can move the camera with **WASD**, **space**, **ctrl**, and the mouse. **Esc** toggles the mouse from being locked to unlocked and back again. 

### Controlling the Rover

Everything is currently frozen. Press **p** to enable physics, and uncheck **publish ik**. You can move the rover with **i**, **j**, **l**, and "**,**" while the mouse is locked. Go back to the Starter view in your browser. Make sure throttle mode is selected, and use **WASD** to control the arm. It will move in both the browser and the simulator. 

---

## ROS Topics

One last thing - Open up yet another terminal, but leave the other two running. Run these commands:

```bash
mrover
ros2 topic list
```

It will display every topic that currently exists. Let's try to see how our arm controls are being sent. Because we're using throttle mode, they will be sent through ```/arm_thr_cmd```. Echo that topic.

```bash
ros2 topic echo /arm_thr_cmd
```

Whenever you move the arm, a new message will appear. Press **ctrl-c** to stop the echoing.

---

## Git Commits

The starter project is pretty much done now, you can stop the simulator and basestation. Let's add it to the codebase for safekeeping. *Commit* your changes by running this in a terminal:

```bash
# "mrover" doesn't need to be run if from one of the previous terminals
mrover

# Mark all files in "." (a.k.a. this folder) for commit
git add .

# Go through the output this prints. It should say that every file you personally changed is marked for commit, likely in green.
# It's a good idea to check this before committing any changes
git status

# Commits locally with message "Starter project completed"
# (-m is required to put a message, and you should put a message with every commit)
git commit -m "Starter project completed"
```

This commits the changes *locally*. It only exists on your computer. To send your changes to the shared codebase, type this:

```bash
git push
```

That... probably gave an error. Run what it tells you to, which is probably this:

```bash
# --set-upstream can be replaced with -u
git push --set-upstream origin <your-initials>/teleop-starter-2026
```

This tells git to create a *remote branch* (shared) to match with your *local branch* (on your computer), and to put the changes there. Now that the remote branch exists, you can simply type ```git push``` whenever you make a new commit.  

### When a Feature is Finished

If this were a normal feature, this would be when you make a *pull request*, but this feature isn't going into the main branch. If it was pulled, you should delete the feature branch afterwards. If you want to delete your starter branch remotely, run this. 

```bash
git push -d origin <your-initials>/teleop-starter-2026
```

To delete it locally (although I advise you keep the branch for your future reference), run this:

```bash
git branch -d <your-initials>/teleop-starter-2026
```

Again, if this was a real feature, you **absolutely should** delete the remote *and* local branch **after** the pull request gets approved.

:::note
You shouldn't wait until a feature is completely, all-the-way done before making a commit. Commit whenever you get a new part of it working, or any noteworthy modification. Make a pull request when it is fully done.
:::

## Conclusion and Next Steps

There you have it! Your first teleop project done. It was a lot to take in, so don't sweat if you don't get it all right away. With practice, it will come to you. There are a couple things I haven't gone over, like our SQL databases, but what was covered above were the most essential things to know. Here are some things you can do to learn more, and help you in the future:

* **Read the docs.** You were probably already doing that, but, if you weren't, go ahead and do that. Try to read all about ROS2, all about teleop, the general resources, and some of each of the other teams.
* **Skim the codebase.** Look at files at multiple parts of the codebase, and try to figure out what they do. Modify them, remove them, add them, and see what happens. You can reset a branch back to its remote version with ```git reset --hard origin/<branch-name>```. I recommend looking in the views, the components, the _ws.py files, the .msgs, the shell scripts (.sh files), and whatever seems to interest you.
* **Customize your environment.** Change the colors on your terminal. Learn keyboard shortcuts for VSCode (did you know **ctrl-alt-"-"** will move the cursor to its previous position on Ubuntu, even between files). Try out Vim. Install some extensions. Put up a fancy wallpaper. Making navigating your computer easy will pay off in the long run.
* **Talk with other members.** MRover is a team, and we work best when there's good communication. Try to familiarize yourself with your teammates and some members of other teams too. Heck, try out another team if they look fun, I ain't stopping you. If you have any questions at all, don't be afraid to ask me or someone else.  
* **Ctrl-f, ctrl-shift-f, ctrl-p, and ctrl-click are your best friends.** I think I learned the most about MRover by looking at files related to what I was working on. Learn what these do, and try them out.


Now, go eat lunch or something. You've probably been here a while.
