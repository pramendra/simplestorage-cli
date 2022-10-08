FROM node:18-alpine3.15

WORKDIR /app

COPY package*.json ./
COPY ["jest.config.js", "nodemon.json", "tsconfig.json", "tslint.json", "./"]
COPY src ./src
COPY tests ./test

RUN npm install