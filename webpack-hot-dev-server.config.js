require('babel/register');

module.exports = require('./make-webpack-config')({
	devServer: true,
	hotComponents: true,
	devtool: 'eval',
	debug: true,
  babel: true
});
