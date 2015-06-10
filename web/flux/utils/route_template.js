'use strict';

var _ = require('underscore');

_.templateSettings = {
  interpolate: /\:([\w_]+)/g
};

module.exports = (route) => _.template(route);
