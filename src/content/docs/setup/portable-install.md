---
title: "Portable Installation (Unofficial)"
sidebar:
  label: "Portable Installation (Unofficial)"
---
:::caution
This path is **unofficial and community-maintained**. Only native Ubuntu 24.04 (see [Installing Ubuntu](/setup/installing-ubuntu) and [Native Installation](/setup/installing-the-codebase)) is officially supported. Use this only if native Ubuntu genuinely isn't an option, a personal macOS or Arch/Fedora machine, for instance. If you hit a problem here, leads can help on a best-effort basis, but it won't get the same priority as a native install issue.
:::

## Supported Platforms

The portable environment is built on [pixi](https://pixi.sh) and currently supports:
- macOS on Apple Silicon (arm64)
- Linux x86_64, on a non-Ubuntu distro (Arch, Fedora, etc.; if you're on Ubuntu, just use the [native install](/setup/installing-the-codebase) instead)

Intel Macs aren't supported yet (tracked separately), and anything else (Windows, Linux arm64) isn't supported by the portable path either. A VM running Ubuntu 24.04 natively inside it is your fallback; see [macOS VM Setup](/general-resources/vm/macos-vm-setup).

## Install

Run:
```
curl -o bootstrap-portable.sh -LO https://raw.githubusercontent.com/umrover/mrover-ros2/main/bootstrap-portable.sh && chmod +x bootstrap-portable.sh && ./bootstrap-portable.sh
```

This clones the repo to `~/mrover-ros2`, installs Homebrew on macOS if you don't have it, installs git/git-lfs/Ansible with your system's package manager, then runs Ansible against a pixi-managed environment instead of system packages. If you already have the repo cloned, skip `bootstrap-portable.sh` and run `./setup-portable.sh` directly.

You'll also need an SSH key set up with Github to clone. See the [native install guide](/setup/installing-the-codebase#set-up-your-ssh-key) if you haven't done that yet.

Once it finishes, log out and back in, open a new terminal, and run:
```
mrover
./build.sh
```

Same as the native install, `mrover` jumps you into the repo and activates your environment, except here that environment is the pixi shell, not your system Python/ROS install.

## Sanity Check

Same as the [native install](/setup/installing-the-codebase#sanity-check): run `mrover` then `ros2 launch mrover simulator.launch.py` and confirm the simulator comes up.

## If Something Breaks

Since this path gets far less testing than native Ubuntu:
1. Check that `pixi.toml` actually lists your platform. `setup-portable.sh` will refuse to run otherwise.
2. Ask in the MRover software channel before assuming it's a you-problem; pixi lockfile drift is a common cause.
3. If it's a real bug in the portable path, file it, but don't expect the same turnaround as a native-install bug.
