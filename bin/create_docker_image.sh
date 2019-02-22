#!/bin/sh
SCRIPT_DIR=$(cd $(dirname ${0}) && pwd)
cd "$SCRIPT_DIR/.."

DOCKER_IMAGE_NAME="nodejs10-for-frontend-build"
IMAGE=`docker images | awk '{print $1}' | grep $DOCKER_IMAGE_NAME`
if [ "$IMAGE" != "$DOCKER_IMAGE_NAME" ]; then
    docker build -t $DOCKER_IMAGE_NAME .
fi
