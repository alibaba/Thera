#!/bin/sh
npm install --verbose  

if [ $? == 0 ]; then
	npm rebuild --runtime=electron --target=1.3.15 --disturl=https://atom.io/download/atom-shell --abi=49
fi

if [ $? == 0 ]; then
	script/build --install --code-sign --compress-artifacts --deploy
fi
