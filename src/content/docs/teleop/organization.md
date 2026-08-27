---
title: "Teleop Codebase Organization"
---

## Directory Structure

### Summary

*note: not all directories included below*

```
teleoperation  
├── basestation_gui  
│   ├── backend  
|   |   ├── managers  
|   |   ├── routes  
|   |   └── ws  
│   └── frontend  
|       ├── public  
|       |   └── urdf  
|       └── src  
|           ├── components  
|           |   ├── ControllerDataTable
|           |   └── three
|           ├── composables  
|           ├── router  
|           ├── stores  
|           ├── types  
|           ├── utils  
|           └── views  
└── camera_client  
    ├── include  
    └── src  
```

---

### Basestation GUI

```basestation_gui``` contains all the code for the Base Station.  

#### Backend

Contains code for the server.  

```managers``` contains classes that handle functionality requiring a consistent state.  

```routes``` contains functions that handle HTTP requests.  

```ws``` contains WebSocket definitions.  

#### Frontend

Contains code for the frontend.  

```public``` contains graphical assets for the frontend. ```urdf``` contains .urdf and .glb models.  

```src``` contains all the code for the frontend.
* ```components``` contains Vue components.
  * ```three``` contains 3D rover display code.
* ```composables``` contains reusable logic.
* ```router``` manages paths to views.
* ```stores``` contains code that handles Pinia stores.
* ```types``` contains custom variable types.
* ```utils``` contains various APIs.
* ```views``` contains main pages.

---

### Camera Client

Contains code for the camera client. Split into header (```include```) and source (```src```) files.  

---

## Lockfile Tracking

Teleop does not track bun.lock. Lockfile conflicts are frequent across branches, and package.json should contain critical information regarding dependency and version control. Further granulated control of dependencies are not needed, and therefore the lockfile should not be tracked.
