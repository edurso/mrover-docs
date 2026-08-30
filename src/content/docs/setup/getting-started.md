---
title: "Getting Started"
sidebar:
  label: "1. Getting Started"
---
Before you can build and run the MRover codebase, you need a working dev environment. There are two ways to get one, depending on what hardware you're on.

## Native Installation (Official)

Ubuntu 24.04 LTS (noble) running natively is the **only officially supported** path. If you're setting up a personal laptop for MRover or working on rover hardware, use this.

1. [Installing Ubuntu](/setup/installing-ubuntu): dual-boot or fresh install, skip this if you already have Ubuntu 24.04 (or you're on a Jetson).
2. [Native Installation](/setup/installing-the-codebase): clones the repo and installs ROS, the toolchain, and your dev environment.

## Portable Installation (Unofficial)

Not on Ubuntu, and don't want to be? [Portable Installation (Unofficial)](/setup/portable-install) runs the codebase through a pixi-managed environment on macOS (Apple Silicon) or a non-Ubuntu Linux distro. It's community-maintained and best-effort only. Use it if native Ubuntu genuinely isn't an option for you, not because it sounds more convenient.
