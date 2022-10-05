#!/usr/bin/env bash

function build() {
  esbuild --target=es6 --tree-shaking=false --bundle ./src/wuse.js --outfile=./dist/$@
}

build wuse.dbg.js --footer:js='Wuse.DEBUG=Wuse.MEASURE=!0;'
build wuse.min.js --minify

