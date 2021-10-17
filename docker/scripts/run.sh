#!/bin/sh
set -e
. /code/frontend/docker/scripts/base.sh

exec /sbin/su-exec user quasar dev --port $APP_PORT