import path from 'path';
global.__config = path.join(__dirname, '/');

const K_IS_PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
  K_SERVER_PATH: process.env.SERVER_PATH || '',
  K_USE_PRERENDER: process.env.USE_PRERENDER === undefined ? K_IS_PRODUCTION : process.env.USE_PRERENDER === 'true',
  K_IS_PRODUCTION: K_IS_PRODUCTION,
  K_DEV_RELEASE: path.join(__dirname, '/build'),
  K_PORT: 3000,
  K_CACHE_MAIN_PAGE_SECONDS: 0
};

