import './polyfills.js';

const config = require('../config.js');
global.__DEV__ = !config.K_IS_PRODUCTION;

const express = require('express');
const app = express();
const _ = require('underscore');
const path = require('path');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');


app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(methodOverride());

app.use(config.K_SERVER_PATH + '/w_assets', express.static(path.join(__dirname, '..', 'build/public')));
app.use(config.K_SERVER_PATH + '/assets', express.static(path.join(__dirname, '..', 'build/public/assets')));


// wait all thenable objects initialized
Promise.all([
  require('./main.js')
])
.then(routes => {
  _.each(routes,
    route =>
      app.use(route));

  const server = require('http').createServer(app);

  server.on('error', (err) => {
    console.log('APP SERVER ERROR ' + err); // eslint-disable-line no-console
  });

  server.listen(config.K_PORT, '0.0.0.0', () => {
    console.log('APP SERVER STARTED AT PORT ' + config.K_PORT); // eslint-disable-line no-console
  });
});
