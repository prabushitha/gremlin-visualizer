FROM node:10-alpine

RUN npm cache clean --force && \
	npm config set strict-ssl false && \
	apk add wget unzip && \
	wget --no-check-certificate https://github.com/jackmead515/gremlin-visualizer/archive/master.zip && \
	unzip master.zip && \
	cd gremlin-visualizer-master && \
	npm install

WORKDIR /gremlin-visualizer-master
EXPOSE 8080
CMD [ "npm", "start" ]
