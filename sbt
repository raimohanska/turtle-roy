#!/bin/bash
bower install
java -Xmx512M -XX:MaxPermSize=128M -jar `dirname $0`/project/sbt-launch.jar "$@"
