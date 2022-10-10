## How to build

```bash
$ npm run build
```

### test the build

```bash
$ NODE_ENV=production node dist/src/cli.js -h
```

## How to setup development

```bash
$ nvm use
$ npm i
```

### test dev

```bash
$ npx ts-node src/cli.ts -h
```

#### outpub

```
cli.ts [command]
Commands:
  cli.ts delete <fileid>    Delete a file
  cli.ts download <fileid>  Download a file
  cli.ts list               Lists files
  cli.ts upload <path>      Upload a file
```

### Upload a file

```bash
$ npx ts-node src/cli.ts upload ./package.json
```

> uploaded files are encrypted

### Download a file

```bash
$ npx ts-node src/cli.ts --out ./db download 318dd246-bc99-4e0b-acf0-7d97c53f1c40
```

> downloaded files are decryped and downloaded into output directory

### Delete a file

```bash
$ npx ts-node src/cli.ts delete f887ad29-441f-4f3a-a290-20d1f5a39914
```

> delete file with fileid

### List files

```bash
$ npx ts-node src/cli.ts list
```

> list all files

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

### setup command line

```bash
$ npm install yargs
$ npm install @types/yargs --save-dev
```

#### how to use

```bash
$ npx ts-node src/cli.ts greet japan --upper
HELLO, JAPAN!%
```

### upload files to mounted volume

```bash
$ npm install cli-progress --save
$ npm i --save-dev @types/cli-progress
```

### how to encrypt/decrypt file

```bash
$ npx ts-node src/cli.ts upload ./package.json
$ npx ts-node src/cli.ts download ./files/package.json.encrypt
```
