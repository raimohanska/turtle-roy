FROM node:6
WORKDIR /app
# 1. deps
COPY package.json package-lock.json bower_components ./
RUN npm install --ignore-scripts
# 2. build
COPY . .
RUN node_modules/grunt-cli/bin/grunt build
# 3. run
EXPOSE 8070
CMD [ "node", "server.js" ]