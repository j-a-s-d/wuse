#!/usr/bin/env bash

sleep 3s && xdg-open http://127.0.0.1:5555/tests/ &
php -q -S 127.0.0.1:5555 -t src/ >& /dev/null

