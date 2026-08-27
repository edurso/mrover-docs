---
title: "Navigation State Machine Library"
---
After using Smach as the library for defining and running our navigation state machine last year, a number of issues with smach motivated the ideation and implementation of a new state machine library built specifically to address Smach's shortcomings with a focus on reducing potential runtime errors and cleaning up cluttered code.

## Problems in Smach

### Separation of transitions and states

### Representation of transitions and states with strings

### Persistent State Objects

### No direct control over entry and exit behavior

### Feature bloat


## Key Design Points of the new library

### States return the next state as an object (no strings)

### States are not persistent

### onEnter(), onLoop(), onExit() interface

## How it works


## How to use it

### Create a State

### Create a State Machine

### Run the State Machine

### Introspection Messages

### Log Level

