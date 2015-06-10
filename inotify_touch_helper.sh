#!/bin/bash

#you need to install watchman tool from facebook
#brew install watchman

set -e

export LC_NUMERIC=C
export kWATCH_DIR='web'
export kTRIGGER_NAME='trigger'

SOURCE="${BASH_SOURCE[0]}"

while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done

DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

WATCH_DIR="$( cd -P "$( dirname "$SOURCE" )/$kWATCH_DIR" && pwd )"

echo 'START LOG' > "$DIR/osx/log_inotify.txt"

#смотрим src
watchman trigger-del "$WATCH_DIR" "$kTRIGGER_NAME"
watchman -- trigger "$WATCH_DIR" "$kTRIGGER_NAME" -- "$DIR/watch.sh"

