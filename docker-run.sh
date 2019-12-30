#!/bin/sh

docker run --rm -d -p 3000:3000 -p 3001:3001 --name=gremlin-visualizer gremlin-visualizer:latest
