let path = require('path');
let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let loadersByExtension = require('./config/loadersByExtension');
// let joinEntry = require('./config/joinEntry');

const webDir = 'web';

function reactEntry(options) {
  return (options.prerender ? `./${webDir}/flux/app.js` : `./${webDir}/app.js`);
}

module.exports = (options) => {
  let entry = {
    main: reactEntry(options)
  };

  let root = path.join(__dirname, `${webDir}/flux`);
  let jsRoot = path.join(__dirname, `${webDir}`);

  let modulesDirectories = ['node_modules', 'flux', 'assets'];

  const babelLoaderString = 'babel-loader?stage=0' + (options.prerender ? '' : '&externalHelpers');

  let loaders = {
    'jsx': {
      loader: options.hotComponents ? `react-hot-loader!${babelLoaderString}` : babelLoaderString,
      include: [jsRoot]
    },
    'js': {
        loader: babelLoaderString,
        include: [jsRoot]
    },
    'json': 'json-loader',
    'json5': 'json5-loader',
    'txt': 'raw-loader',
    'png|jpg|jpeg|gif|svg': 'url-loader?limit=10000',
    'woff|woff2': 'url-loader?limit=100000',
    'ttf|eot': 'file-loader',
    'wav|mp3': 'file-loader',
    // 'html': 'html-loader',
    'md|markdown': ['html-loader', 'markdown-loader']
  };

  let stylesheetLoaders = {
    'css': 'css-loader',
    'less': 'css-loader!less-loader',
    'styl': 'css-loader!stylus-loader',
    'sass':
      'css-loader!autoprefixer-loader!sass-loader?indentedSyntax=sass&' +
      'includePaths[]=' +
      path.resolve(__dirname, `${webDir}/sass/node_modules`) +
      ':' +
      path.resolve(__dirname, `${webDir}/../node_modules`) +
      '!sass-imports?../flux/common_vars.json',

    'scss':
      'css-loader!autoprefixer-loader!sass-loader?includePaths[]=' +
      path.resolve(__dirname, `${webDir}/sass/node_modules`) +
      ':' +
      path.resolve(__dirname, `${webDir}/../node_modules`)
  };

  let additionalLoaders = [
  ];

  let alias = {
  };

  let aliasLoader = {
  };

  let externals = [
  ];

  let extensions = ['', '.web.js', '.js', '.jsx'];


  let publicPath = options.devServer ?
    'http://' + (process.env.EXT_IP || '0.0.0.0') + ':' + (process.env.HOT_RELOAD_PORT || 3081) + '/_assets/' :
    '/_assets/';


  let output = {
    path: path.join(__dirname, 'build', options.prerender ? 'prerender' : 'public'),
    publicPath: publicPath,
    filename: '[name].js' + (options.longTermCaching && !options.prerender ? '?[chunkhash]' : ''),
    chunkFilename: (options.devServer ? '[id].js' : '[name].js') + (options.longTermCaching && !options.prerender ? '?[chunkhash]' : ''),
    sourceMapFilename: 'debugging/[file].map',
    // libraryTarget === 'commonjs2' Export by setting module.exports: module.exports = xxx
    libraryTarget: options.prerender ? 'commonjs2' : undefined,
    pathinfo: options.debug
  };

  let excludeFromStats = [
    /node_modules[\\\/]react(-router)?[\\\/]/,
    /node_modules[\\\/]items-store[\\\/]/
  ];

  let plugins = [
    function statsPlugin() {
      if (!options.prerender) {
        this.plugin('done', (stats) => {
          let jsonStats = stats.toJson({
            chunkModules: true,
            exclude: excludeFromStats
          });
          jsonStats.publicPath = publicPath;
          require('fs').writeFileSync(path.join(__dirname, 'build', 'stats.json'), JSON.stringify(jsonStats, null, ' '));
        });
      }
    },
    new webpack.PrefetchPlugin('react/addons'),
    new webpack.PrefetchPlugin('react/lib/ReactComponentBrowserEnvironment'),
    new webpack.PrefetchPlugin('immutable')
  ];


  if (options.prerender) {
    externals.push(
      /^react(\/.*)?$/,
      'react/addons',
      'immutable',
      'underscore'
    );

    plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }));
  }


  if (options.commonsChunk) {
    let names = [];
    if (options.faker) {
      // faker and other debug libs
      entry.faker = options.faker;
      names.push('faker');
    }

    entry.commons = options.commonsChunk;
    names.push('commons');

    plugins.push(new webpack.optimize.CommonsChunkPlugin({names, minChunks: Infinity}));
    // plugins.push(new webpack.optimize.CommonsChunkPlugin('faker', 'faker.js' + (options.longTermCaching && !options.prerender ? '?[chunkhash]' : '')));
  }


  Object.keys(stylesheetLoaders).forEach((ext) => {
    let sLoaders = stylesheetLoaders[ext];

    if (Array.isArray(sLoaders)) sLoaders = sLoaders.join('!');
    if (options.prerender) {
      stylesheetLoaders[ext] = 'null-loader';
    } else if (options.separateStylesheet) {
      stylesheetLoaders[ext] = ExtractTextPlugin.extract('style-loader', sLoaders);
    } else {
      stylesheetLoaders[ext] = 'style-loader!' + sLoaders;
    }
  });


  if (options.separateStylesheet && !options.prerender) {
    plugins.push(new ExtractTextPlugin('[name].css' + (options.longTermCaching ? '?[contenthash]' : '')));
  }

  if (options.minimize) {
    plugins.push(

      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        sourceMap: false
      }),
      new webpack.optimize.DedupePlugin()
    );
  }

  // собрать все переменные окружения
  let envObj = Object.keys(process.env).reduce((o, k) => {
    o[k] = JSON.stringify(process.env[k]);
    return o;
  }, {});

  if (options.minimize) {
    envObj.NODE_ENV = JSON.stringify('production');
  }

  plugins.push(
    new webpack.DefinePlugin({
      'process.env': envObj,
      '__DEV__': options.minimize ? false : true
    })
  );

  if (options.minimize) {
    plugins.push(
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.NoErrorsPlugin()
    );
  }

  return {
    entry: entry,
    output: output,
    target: options.prerender ? 'node' : 'web',
    context: __dirname,
    node: {
      __filename: true
    },
    module: {
      loaders: loadersByExtension(loaders).concat(loadersByExtension(stylesheetLoaders)).concat(additionalLoaders)
    },
    devtool: options.devtool,
    debug: options.debug,

    resolveLoader: { // где искать лоадеры
      root: path.join(__dirname, 'node_modules'),
      alias: aliasLoader
    },
    externals: externals,
    resolve: { // где искать модули
      root: root,
      modulesDirectories: modulesDirectories,
      extensions: extensions,
      alias: alias
    },
    plugins: plugins,
    devServer: {
      stats: {
        exclude: excludeFromStats
      },
      // hot: true,
      progress: true,
      colors: true,
      host: '0.0.0.0',
      port: (process.env.HOT_RELOAD_PORT || 3081),
      inline: true
    }
  };
};
