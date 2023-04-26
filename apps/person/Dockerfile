FROM node:18-alpine

ARG service_name=person

WORKDIR /usr/src/server
COPY tsconfig*.json .
COPY package*.json .
COPY nest-cli.json .
RUN npm install

WORKDIR /usr/src/server/apps/${service_name}
COPY apps/${service_name}/tsconfig*.json .
COPY apps/${service_name}/package*.json .
RUN npm install

WORKDIR /usr/src/server
COPY apps/${service_name} apps/${service_name}
COPY libs libs