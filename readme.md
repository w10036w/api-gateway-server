# API Gateway Server

## Guide

### Development

1. install node v8.10 [latest version supported by aws lambda]
2. (optional) Install [playground](https://github.com/prisma/graphql-playground/releases)
3. `npm i`
4. create specific env file `/env/.env.{ANYTHING}.js`, e.g. `.env.region.js` refer to `./.env.tpl`
5. `npm run setenv region`

6. ```bash
    # if run with playground app
    npm run dev
    # else
    npm run server
    # then visit localhost:8000/graphql

    # if run serverless-offline
    npm run handler
    # then visit localhost:8000/playground

    # normal deploy
    npm run build

    # deploy to aws
    npm run deploy
    ```

### ESLint + prettier + babel setup

- Modules required
  
  `npm i -D eslint prettier babel-eslint prettier-eslint`, and any plugins / configs used in `.eslintrc.js`
- VSCode Settings
  1. install plugins: `eslint`, `prettier`
  2. any issue check `OUTPUT` (tab besides `TERMINAL`)
  3. modify settings.json

  ```json
  // NOTE switch off internal format that is conflict with eslint.autoFixOnSave
  "editor.formatOnSave": false,
  //eslint
  "eslint.enable": true,
  "eslint.autoFixOnSave": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  // prettier
  "prettier.eslintIntegration": true,
  ```

- [Reference of Rules](https://eslint.org/docs/rules/)

### Visualize Module Size

`npm run monitor`

### Benchmark (to be done)

### Test (to be done)


## Todo List

- [x] `Dataloader` Usage, cache / LRU cache
- [x] edges implementation (`before` handler left)
- [x] 3rd party scalars: [@okgrow/graphql-scalars](https://github.com/okgrow/graphql-scalars)
- [ ] use `marco` to completely wipe unnecessary codes, e.g. stub requires
- [ ] serverless deployment to amazon
- [ ] explore other graphql validationRules
- [ ] client set head `Accept-Encoding: gzip`
- [ ] Relay mock data
  - [ ] [graphql-anywhere](https://www.npmjs.com/package/graphql-anywhere)
- [ ] [how to use fragments in relay](https://www.apollographql.com/docs/react/advanced/fragments)
- [ ] [Why use connections](https://blog.apollographql.com/explaining-graphql-connections-c48b7c3d6976)
- [ ] [babel macro](https://medium.freecodecamp.org/using-babel-macros-with-react-native-8615aaf5b7df) penv.marco cannot point to other variable except NODE_ENV
- [ ] [APP] Add Relay in CRA
  
  ```js
  import graphql from 'babel-plugin-replay/macro
  graphql`query UserQuery { viewer }`
  ```

- [ ] tunning nodejs with `npm i -D autocannon 0x`: search and github nearform/slow-rest-api
- [ ] api-db-server example: [node_graphql_apollo_template](https://github.com/brianschardt/node_graphql_apollo_template)

## packages pending to install

### graphql helpers

- `npm i -D babel-plugin-relay/macro`

### Typescript packages added for potential usage

- `npm i -D typescript @babel/preset-typescript serverless-plugin-typescript ts-node @types/lodash @types/node`
- `npm i -S serverless-plugin-typescript`
- installed `ts-loader`

### native

- `npm i -S react-native-animatable`

### Babel

### Client common

- `npm i -S floway rxjs`

### Web

- polyfill from Financial Time `<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>`

## Reference list

- [react-redux-graphql-apollo-bootstrap-webpack-starter](https://github.com/MacKentoch/react-redux-graphql-apollo-bootstrap-webpack-starter)
