# Base Image
FROM node:lts-alpine3.11

# Environment variables
ENV NODE_ENV=PROD

# Files to copy
COPY server.js /src/
COPY package-lock.json /src/
COPY package.json /src/

# Commands
RUN cd /src; npm install

# Expose container port
EXPOSE 3000

CMD [ "node", "/src/server.js" ]