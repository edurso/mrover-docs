---
title: "Installing Ubuntu"
sidebar:
  label: "Installing Ubuntu"
---
We officially support **Ubuntu 24.04 LTS (noble) running natively**, and only that. If you're dual-booting, you'll need about 50 GB of space (100 GB if you're on Perception, due to the NVIDIA packages). There are many dual-boot tutorials online if you're not comfortable daily-driving Linux yet.

If you already have Ubuntu 24.04 installed, or you're setting up a Jetson (which ships with its own NVIDIA-provided Ubuntu image), skip straight to [Native Installation](/setup/installing-the-codebase).

Other options exist (macOS, Arch, non-Ubuntu Linux via a pixi-based portable environment) but they are **unofficial and best-effort only**. See [Portable Installation](/setup/portable-install) if native Ubuntu genuinely isn't an option for you.

## Dual-Booting Ubuntu 24.04 LTS from Windows

The following steps may or not be necessary prerequisites. If you find other important steps, have better tutorial links, or don't think something is necessary for certain Windows devices, please add your knowledge.
1. Check if you have BitLocker by right clicking on the Windows icon on your taskbar and clicking on Disk Management. In the Disk Manager, check if any of your partitions (usually the largest one) say "BitLocker encrypted" on them. If so, you have BitLocker and should try to [suspend it](https://4sysops.com/archives/disable-bitlocker-on-windows-11/#rtoc-3). If there is no option to suspend it, just make sure you can [find your backup keys](https://support.microsoft.com/en-us/windows/finding-your-bitlocker-recovery-key-in-windows-6b71ad27-0b89-ea08-f143-056f5ab347d6) either on your Microsoft account or on a flash drive and you will be fine.
2. [Disable Fast Boot](https://www.lifewire.com/disable-fast-startup-in-windows-10-5094422) (You may need to [enable or disable hibernate](https://docs.microsoft.com/en-us/troubleshoot/windows-client/deployment/disable-and-re-enable-hibernation))
3. [Disable Secure Boot](https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/disabling-secure-boot?view=windows-11)

For a tutorial on dual booting Ubuntu, read [this page](https://itsfoss.com/install-ubuntu-1404-dual-boot-mode-windows-8-81-uefi/); the steps are the same regardless of Ubuntu version, just grab the 24.04 image instead. If you need to make your own bootable flash drive, use [this image](https://releases.ubuntu.com/noble/) and [Rufus](https://rufus.ie/en/).

After everything is set up, update your drivers:
1. Search (by pressing the windows key) for "update manager" and select "software updater".
2. When a box says your computer is up to date, click settings.
3. Open the Additional Drivers tab.
4. Look for a proprietary, tested driver. If one exists, select it and click "Apply changes".

If you can't get audio to work, open the terminal and enter `sudo alsa force-reload`.

## Ensure Your Time and Date is Correct

Windows and Ubuntu use your hardware clock differently by default. Please set the time correctly by hitting the windows key, searching for time, clicking on the first settings link, and configure it manually. If you do not do this the APT package manager will fail to work. If you are annoyed by constantly switching this see: https://askubuntu.com/a/169384

Next: [Native Installation](/setup/installing-the-codebase).
