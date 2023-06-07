#!/bin/bash

# Initialise the system
curl -s -X POST -H "Content-Type: application/json" -d '{"message": "5 3"}' localhost:3000/api/initialise > /dev/null

# Create robots
curl -s -X POST -H "Content-Type: application/json" -d '{"message": "Robot1 11E"}' localhost:3000/api/robots > /dev/null
curl -s -X POST -H "Content-Type: application/json" -d '{"message": "Robot2 32N"}' localhost:3000/api/robots > /dev/null
curl -s -X POST -H "Content-Type: application/json" -d '{"message": "Robot3 03W"}' localhost:3000/api/robots > /dev/null

# Move Robot1
curl -s -X POST -H "Content-Type: application/json" -d '{"message": "Robot1 RFRFRFRF"}' localhost:3000/api/moveRobot > /dev/null

# Get Robot1 position
curl 'http://localhost:3000/api/robots?name=Robot1' -w "\n" |  jq '.message | if .isLost then "\(.lostAt.x)\(.lostAt.y)\(.direction) LOST" else "\(.coordinate.x)\(.coordinate.y)\(.direction)" end'

# Move Robot2
curl -s -X POST -H "Content-Type: application/json" -d '{"message": "Robot2 FRRFLLFFRRFLL"}' localhost:3000/api/moveRobot > /dev/null

# Get Robot2 position
curl 'http://localhost:3000/api/robots?name=Robot2' -w "\n" | jq '.message | if .isLost then "\(.lostAt.x)\(.lostAt.y)\(.direction) LOST" else "\(.coordinate.x)\(.coordinate.y)\(.direction)" end'


# Move Robot3
curl -s -X POST -H "Content-Type: application/json" -d '{"message": "Robot3 LLFFFLFLFL"}' localhost:3000/api/moveRobot > /dev/null

# Get Robot3 position
curl 'http://localhost:3000/api/robots?name=Robot3' -w "\n" | jq '.message | if .isLost then "\(.lostAt.x)\(.lostAt.y)\(.direction) LOST" else "\(.coordinate.x)\(.coordinate.y)\(.direction)" end'

