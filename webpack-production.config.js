require('babel/register');

module.exports = [
	require('./make-webpack-config')({
		longTermCaching: true,
		separateStylesheet: true,
		minimize: true,
		debug: false,
		// модули которые меняются редко или почти никогда
		commonsChunk: ['react/addons', 'immutable', 'underscore', 'babel-core/external-helpers', 'babel/polyfill'],
		faker: ['faker']
	}),
	require('./make-webpack-config')({
		minimize: false, // TODO сменить на true
		debug: true, // TODO сменить на false
		prerender: true
	})
];
