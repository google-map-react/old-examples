#!/bin/bash
export LC_NUMERIC=C

# get script dir
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done

DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

cd $DIR/../build
rm -rf gh-pages

EXAMPLES=(main simple simple_hover distance_hover events balderdash)

for EXAMPLE in ${EXAMPLES[@]}; do
  mkdir -p "gh-pages/map/${EXAMPLE}"
  wget -O "gh-pages/map/${EXAMPLE}/index.html" "http://localhost/google-map-react/map/${EXAMPLE}"
done

cp -r $DIR/../build/public/assets gh-pages/assets

mkdir -p gh-pages/w_assets
cp $DIR/../build/public/* gh-pages/w_assets/
