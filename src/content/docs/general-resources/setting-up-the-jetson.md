---
title: "Setting up the Jetson"
---
:::caution
This page is out of date. Flashing now happens through `ansible/roles/jetson_flash` (see `ansible/jetson_flash.yml` in `mrover-ros2`), not NVIDIA SDKManager. Someone on ESW with access to a Jetson needs to rewrite this against the actual ansible role's steps and verify the recovery-mode boot sequence still matches. Until then, treat this page as unreliable.

For everyday dev setup (not initial flashing), just run `./setup.sh` from the repo on the Jetson itself; it detects the Jetson automatically.
:::
## Download NVIDIA SDKManager on the Host Computer

Download the proper version for your host system here: https://developer.nvidia.com/nvidia-sdk-manager

You may have to make a NVIDIA developer account prior to this

I used Ubuntu 20.04.5 LTS so I installed the `.deb` version, for that run `sudo apt install -f ./sdkmanager_*.deb`

Make sure `tlp` is not installed on your system!!! For some reason it breaks the flashing.

## Boot the Jetson in recovery mode

TODO
