require('babel/register');

module.exports = [
  require('./make-webpack-config')({
    minimize: false, // TODO сменить на true
    debug: true, // TODO сменить на false
    prerender: true
  })
];
