---
title: "Downloading Offline Map"
---

## Python Script

See [here](https://github.com/umrover/mrover-ros2/blob/main/teleoperation/download_offline_maps.py)

Python script to download offline maps directly into `teleoperation/basestation_gui/frontend/public/map/`.

Run with

```
python3 scripts/download_offline_maps.py --location=<loc>
```

Loc can be:

- a2 - ann arbor, common testing locations on north campus
- urc - utah
- circ - canada

Map tiering

- the area that's actually downloaded shrinks as we zoom in to save space
- the center of each location is specified in the script, and there is math to determine the appropriate area to download

# S3 Storage

There exists an AWS S3 bucket that we used in the past to store the offline map. This has not been utilized in some time, but if you would like to use it to store your offline map tile store (so that we don't further push our google drive limit), reach out to any of the software
leads to log into our team AWS account. If your map store is in the bucket it can be downloaded and automatically extracted to the static/map directory by running src/teleop/download_map/download_map.py after inputting our AWS keys to the json that the script automatically creates for you.
Likely not needed, script is simple to use
