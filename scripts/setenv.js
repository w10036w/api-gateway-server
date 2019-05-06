/* eslint-disable */
'use strict';
const fs = require('fs')
const paths = require('./paths');

// todo get process.args

const args = [...process.argv].slice(2)

fs.createReadStream(`${paths.envFiles}/.env.${args[0]||'default'}.js`)
  .pipe(fs.createWriteStream(paths.dotenv));
