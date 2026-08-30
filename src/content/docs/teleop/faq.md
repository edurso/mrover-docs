---
title: "Teleop FAQ"
---
Before you look any further, make sure you have run `./build.sh` from the mrover directory.

## Python venv

### Output

```
ModuleNotFoundError: No module named 'rclpy'
```

### Solution

Enter `mrover` before trying to run the basestation.

You have not entered the Python virtual environment. To enter the python venv, enter `mrover` in the shell. This function jumps into the repo and activates the build overlay, which opens the python virtual environment and allows you to run the basestation.

---

## CMake

### Output 1

From your `./build.sh` output:

```
ZED not found
science_hw_bridge missing
```

### Solution 1

Some files that CMake expects are missing. You could try and remove the `#Perception` and `#Embedded` sections in `CMakeLists`, and reach out to your team lead for help.

### Output 2

`./build.sh` output gives many missing file errors.

### Solution 2

Try updating or deinitializing and then reinitializing git submodules.

``` bash
git submodule update <submodule> 
# or
git submodule deinit <submodule>
git submodule init <submodule>
```

Submodules include;
- deps/dawn
- deps/manif
- esw/fw

---

## Frontend not loading

### Output

Browser shows a blank page or connection refused on `localhost:8080`.

### Solution

Make sure the backend is running (`ros2 launch mrover basestation.launch.py`). Check the terminal output for errors. If you see bun/npm errors, try:

```bash
cd teleoperation/basestation_gui/frontend
bun install
```

Then relaunch the basestation.

---

## Missing `unique_identifier_msgs` header

### Output

From your `./build.sh` output:

```
fatal error: 'unique_identifier_msgs/msg/detail/uuid__struct.h' file not found
```

### Solution

Run `./clean.sh` then `./build.sh` from the `mrover` directory.

---

## manifpy

The manifpy repository is not installed or activated correctly. Try the code below, running from your `mrover` directory. If that doesn't work, reach out to your team lead.

```
sudo apt-get install libeigen3-dev
cd && git clone https://github.com/artivis/manif.git
cd manif
python3 -m pip install .
mrover
git submodule update --init deps/manif
```

---
