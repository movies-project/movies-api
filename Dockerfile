FROM node:18-alpine

WORKDIR /usr/src/server
COPY tsconfig*.json .
COPY package*.json .
COPY nest-cli.json .
RUN npm install

COPY apps/api apps/api
COPY libs libs
