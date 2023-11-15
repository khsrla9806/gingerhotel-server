# Node Base Image
FROM node:16-alpine

# RUN mkdir -p /app
WORKDIR /app

# Current Local . to /app/
ADD . /app/

# install Library
RUN npm install

# Build
RUN npm run build

# PORT
EXPOSE 8080

# Start
ENTRYPOINT npm run start:prod