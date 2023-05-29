#!/bin/bash
electronProjectPath=$(node -p "require('./package.json').electronProjectPath")
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "cd \"$electronProjectPath\"; electron ."
