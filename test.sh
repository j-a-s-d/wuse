#!/usr/bin/env bash

xdg-open http://127.0.0.1:5555/tests.html &
php -q -S 127.0.0.1:5555 -t src/ >& /dev/null
