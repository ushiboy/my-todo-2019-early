#!/bin/sh

SCRIPT_DIR=$(cd $(dirname ${0}) && pwd)
cd "$SCRIPT_DIR/.."
DOCKER_IMAGE_NAME="nodejs10-for-frontend-build"
PROJECT_ROOT_DIR=`pwd`
USER=`whoami`
USER_ID=`id -u`
GROUP_ID=`id -g`

RUN_ACTION=`cat << EOS
    cd /tmp/frontend && \
    npm install && \
    npm run build
EOS`

docker run -u $USER_ID:$GROUP_ID \
    -v $PROJECT_ROOT_DIR:/tmp/frontend:rw \
    --rm $DOCKER_IMAGE_NAME /bin/sh -c "$RUN_ACTION"

rm -rf Todo Todo.zip Todo-*.zip
mv build Todo
REV=`git rev-parse HEAD`
echo $REV > Todo/GIT_REVISION
zip Todo.zip -r Todo
cp Todo.zip "Todo-$REV.zip"
