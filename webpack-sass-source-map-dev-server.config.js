require('babel/register');

// config with sourceMaps for sass css files, but without hot sass replacement
// sometimes it's really impossible without sourceMap to find sass definition in third party sass libraries
module.exports = require('./make-webpack-config')({
  devServer: true,
  hotComponents: true,
  // devtool: 'inline-source-map',
  devtool: 'sourcemap',
  debug: true,
  separateStylesheet: true,
  babel: true
});
