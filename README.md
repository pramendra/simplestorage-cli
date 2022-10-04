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
