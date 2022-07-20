#!/usr/bin/env bash

esbuild --target=es6 --tree-shaking=false --bundle ./src/wuse.js --outfile=./dist/wuse.min.js --minify

