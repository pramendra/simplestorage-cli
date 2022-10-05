## Tutorial

### Create a source directory

```bash
$ mkdir simplestorage
$ cd simplestorage
```

### Check node version

```bash
$ node -v
```

> v16.17.1

### Set node version

```bash
$ touch .nvmrc
```

### use node version

```bash
$ nvm use
```

### setup node project

```bash
$ npm init -y
```

### setup node gitignore

```bash
$ curl -L -s https://www.gitignore.io/api/node > .gitignore
```

### setup typescript

```bash
$ npm install typescript --save-dev
$ npm install @types/node --save-dev
$ npx tsc --init --rootDir src --outDir dist \
--esModuleInterop --resolveJsonModule --lib es6 \
--module commonjs --allowJs true --noImplicitAny true
```

### setup source

```bash
$ mkdir src
$ touch src/index.ts
```

### setup dev env

```bash
$ npm install --save-dev ts-node nodemon
```

#### configure nodemon

```
{
  "watch": ["src"],
  "ext": ".ts",
  "ignore": [],
  "exec": "ts-node ./src/index.ts"
}
```

#### configure script

add following

```
"scripts": {
  "start:dev": "nodemon",
},
```

#### test configuration

```bash
$ npm run start:dev
```

### setup vscode

```bash
$ mkdir .vscode
$ touch .vscode/settings.json
```

#### configure vscode

```
{
  "eslint.enable": true,
  "[typescript]": {
    "editor.formatOnSave": true
  },
  "javascript.validate.enable": false,
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "node_modules/": true,
    "dist/": true,
    "npm": true
  }
}
```

### setup code lint

```bash
$ npm install --save-dev prettier tslint tslint-config-prettier tslint-plugin-prettier
```

#### configure tslint

```bash
$ touch tslint.json
```

##### add following to tslint.json

```
{
  "rulesDirectory": ["tslint-plugin-prettier"],
  "rules": {
    "prettier": true
  }
}
```

#### configure code formating

```bash
$ touch .prettierrc
```

add folllowing to .prettierrc

```
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

### setup test

```bash
$ npm install --save-dev jest ts-jest @types/jest
$ mkdir tests
$ tests/index.test.ts
```

#### configure jest

```bash
$ npx ts-jest config:init
```

> make necessary changes in jest.config.js

#### add test script

```
"scripts": {
  "test": "jest"
},
```

#### create and test greet

```bash
$ touch src/greet.ts
$ test/greet.test.ts
```

#### test the configuration

```bash
$ npm test

```

### setup env

```bash
$ npm install --save-dev dotenv-cli
```

#### update script

```
"scripts": {
  "start:dev": "dotenv -e .env -- nodemon",
},
```

### setup docker dev

#### Create docker-compose.yml

```
version: '3'
services:
  dev-app:
    container_name: dev-simple-storage
    build:
      context: .
      dockerfile: Dockerfile
    tty: true
    env_file: .env
    volumes:
      - ./jest.config.js:/app/jest.config.js
      - ./nodemon.json:/app/nodemon.json
      - ./tsconfig.json:/app/tsconfig.json
      - ./tslint.json:/app/tslint.json
      - ./src:/app/src
      - ./tests:/app/tests
    command: npm run start:dev

```

#### Create Dockerfile

```
FROM node:18-alpine3.15

WORKDIR /app

COPY package*.json ./

RUN npm install
```

#### how to run docker in dev environment

##### build and run image

```bash
$ docker-compose up -d --build --remove-orphans
```

#### Logs of running dev container

```bash
$ docker logs dev-simple-storage -f
```

#### Jump into container shell

```bash
$ docker-compose exec dev-app sh
```

#### Other helpful docker command

```
List all images

docker image ls
Remove all images at once

docker rmi $(docker images -q)
Containers
List all active containers

docker ps
List all active and dead containers

docker ps -a
Stop all running containers

docker stop $(docker ps -a -q)
Delete all stopped containers:

docker rm $(docker ps -a -q)
```
