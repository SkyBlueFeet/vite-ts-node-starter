const dotenv = require('dotenv');
const path = require('path');

const env1 = dotenv.config();

const env2 = dotenv.config({
  path: path.resolve('.env.' + process.env.NODE_ENV),
});

module.exports = {
  ...env1.parsed,
  ...env2.parsed,
};
