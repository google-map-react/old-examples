#!/bin/bash
#set -e
CONTAINER_NAME=google_map_react/main
DOCKER_HOST_NAME=gmr
SERVER_PATH=

export LC_NUMERIC=C

# get script dir
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done

DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

usage()
{
cat << EOF
examples

dev build
./docker_run.sh

production with offset
./docker_run.sh --production --offset 3030

dev with offset
./docker_run.sh --offset 3030


for developer build
./docker_run

for production build
./docker_run --production

also you can use
--offset $PORT
EOF
}

NODE_ENV_FOR_CONTAINER=
PORT_OFFSET=3080

while :
do
  case $1 in
      -h | --help | -\?)
          usage
          exit 0
          ;;

      -p | --production)
          # пример параметра без знчения
          NODE_ENV_FOR_CONTAINER=production
          shift
          ;;

      -o | --offset)
          PORT_OFFSET=$2
          shift 2
          ;;

      -*)
          printf >&2 'WARN: Unknown option (ignored): %s\n' "$1"
          shift
          ;;

      *)  # no more options. Stop while loop
          break
          ;;
  esac
done


EXT_IP="$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | grep -v '172.1' | head -1)"

HOT_RELOAD_PORT=$(expr $PORT_OFFSET + 1)



echo "be sure you has this ip in your network $EXT_IP"
#on osx you need to install watchman 'brew install watchman'
SYSTEM=`uname`
[ "$SYSTEM" = "Darwin" ] && ./inotify_touch_helper.sh

CROSS_COMPAT_DIR=${DIR#$HOME}

docker run --name "$DOCKER_HOST_NAME" -d -t \
-e HOSTNAME="$DOCKER_HOST_NAME" \
-e SERVER_PATH="$SERVER_PATH" \
-e EXT_IP="$EXT_IP" \
-e HOT_RELOAD_PORT="$HOT_RELOAD_PORT" \
-e NODE_ENV="$NODE_ENV_FOR_CONTAINER" \
-p $PORT_OFFSET:80 \
-p $HOT_RELOAD_PORT:$HOT_RELOAD_PORT \
-v $HOME$CROSS_COMPAT_DIR:/home/ice$CROSS_COMPAT_DIR \
--add-host "$DOCKER_HOST_NAME":127.0.0.1 \
"$CONTAINER_NAME"


HOST_VAR=$(docker exec -it "$DOCKER_HOST_NAME" su - ice -c 'echo $HOSTNAME')
HOST_VAR=${HOST_VAR%?} #last symbol is bad clear it
while [[ "$HOST_VAR" != "$DOCKER_HOST_NAME" ]]; do
  HOST_VAR=$(docker exec -it "$DOCKER_HOST_NAME" su - ice -c 'echo $HOSTNAME')
  HOST_VAR=${HOST_VAR%?} #last symbol is bad clear it
  echo "wait " -"$HOST_VAR"- -"$DOCKER_HOST_NAME"-
  sleep 1
done

docker exec -it "$DOCKER_HOST_NAME" su - ice -c "cd /home/ice$CROSS_COMPAT_DIR && NODE_ENV= npm install"

sleep 1

#run tmux inside container
docker exec -it -d "$DOCKER_HOST_NAME" su - ice -c "script -q /dev/null -c 'cd /home/ice$CROSS_COMPAT_DIR && ./tmux_run'"

echo 'done'
