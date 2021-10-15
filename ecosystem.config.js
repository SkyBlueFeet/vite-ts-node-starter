const { name } = require('./package.json');
const path = require('path');

const dotenv = require('dotenv');

dotenv.config();
dotenv.config({ path: `.env.production` });

module.exports = {
  apps: [
    {
      name,
      script: path.resolve(__dirname, './dist/index.js'),
      instances: require('os').cpus().length,
      autorestart: false,
      watch: false,
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
    },
  ],
};
