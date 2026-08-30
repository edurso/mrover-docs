---
title: "macOS VM Setup"
---
:::note
If you're on macOS, try the [portable (pixi) install](/setup/portable-install) first, it runs natively on Apple Silicon without a VM. Use this VM path only as a fallback if that doesn't work for your machine.
:::
:::note
This installation requires at least 40GB of free space but allocating more is highly recommended.
:::
1. If you have a Mac with a silicon chip, download this arm server image from [here](https://cdimage.ubuntu.com/releases/jammy/release/). Otherwise download this image [here](https://releases.ubuntu.com/jammy/)
2. Install the UTM application [here](https://mac.getutm.app/). UTM will allow you to virtualize Ubuntu and essentially work out of a Ubuntu machine.
3. Open UTM, select 'Create a New Virtual Machine', then 'Virtualize', then for the operating system select 'Other', allocate a minimum of 4gb of memory
4. Then choose CD/DVD Image for the boot device and then browse for and select the ubuntu image you just downloaded as the boot ISO image
5. Specify how much storage you want the machine to have(64GB is sufficient) and continue
6. No shared directory is needed so continue. Then set the name of your VM and save. 
7. Launch your new VM by clicking the play button and select 'Try or Install Ubuntu Server'
:::note
If you have a non silicon chip mac and are using the desktop server image(the second link in step 1), then setup the machine and skip to step 15. Otherwise, during this setup stage, you won't have a cursor because we are configuring a 'server' so to move around options use the arrow keys and to select and option press enter.
:::
8. Select your preferred language, then continue without updating
9. Until you reach profile configuration, select done for all the next steps(you will have to wait on the 'Ubuntu archive mirror configuration' step) and confirm destructive action on the storage configuration
10. On profile configuration, setup the machine to your liking(as if you were setting up an entirely new computer)
11. Continue to select Done and do not setup anything with ssh configuration and skip the featured server snaps step(no server snaps are required)
12. On the installation step, once finished, you will be prompted to reboot your machine. After selecting that option, close your VM and in UTM clear the iso
<img width="1451" height="359" alt="Screenshot 2025-10-19 at 1 43 49 PM" src="https://github.com/user-attachments/assets/62796737-2130-474e-9306-26766cf5464c" />
13. Launch the machine again and login.

14. Run the following commands and restart your machine again

```
sudo systemctl set-default graphical.target
sudo systemctl start graphical.target
sudo apt update
sudo apt upgrade
sudo apt install ubuntu-desktop
```

15. Run `sudo reboot` and sign into your VM.

16. Now follow the codebase installation steps [here](/setup/installing-the-codebase)