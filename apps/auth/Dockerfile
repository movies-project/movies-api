FROM node:18-alpine

ARG service_name=auth

WORKDIR /usr/src/server
COPY tsconfig*.json .
COPY package*.json .
COPY nest-cli.json .
RUN npm install

COPY apps/${service_name} apps/${service_name}
COPY libs libs
