---
title: "Getting Started"
sidebar:
  label: "1. Getting Started"
---
Before you can build and run the MRover codebase, you need a working development environment. There are two paths, and you should choose based on your hardware, subteam, experience level, and preferences. 

## Native Installation - Official

Ubuntu 24.04 LTS or Kubuntu 24.04 LTS running natively is the ***only officially supported*** path. If you're setting up a personal laptop for MRover or working on rover hardware, Ubuntu is highly recommended.

:::tip[Continue with:]
- [Installing Ubuntu](/setup/installing-ubuntu): dual-boot or fresh install, skip this if you already have Ubuntu 24.04.
- [Native Installation](/setup/installing-the-codebase): clones the repo and installs ROS, the toolchain, and your dev environment.
:::

---

## Portable Installation - Unofficial

Runs the codebase through a pixi-managed environment on macOS or another Linux distribution that is not Ubuntu 24. Current supported distribution families include:
- Debian
- Fedora
- Archlinux
 
You can therefore use any of those distributions or a distribution derived from them, eg. CachyOS, Linux Mint, etc. (package manager has to be one of apt, dnf, or pacman)

This path is maintained by software leadership and is ***best-effort only***. Do ***NOT*** use it if your work involves rover hardware. Use it if you are on autonomy, drone, or teleop, you are experienced with linux, know how to manage dependencies and environments, and have a real reason to dislike Ubuntu. 

:::tip[Continue with:]
- [Portable Installation](/setup/portable-install)
:::

---

Be aware that Windows is ***NOT*** supported. WSL testing on the portable installation is very limited. Our expectation for anyone with a windows laptop is to install Linux. 
