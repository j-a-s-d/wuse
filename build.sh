#!/usr/bin/env bash

esbuild --target=es6 --minify --tree-shaking=false ./src/wuse.js --outfile=./dist/wuse.min.js

