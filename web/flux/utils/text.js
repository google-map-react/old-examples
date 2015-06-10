'use strict';

var _ = require('underscore');

var re_not_ = /[^а-яА-ЯёЁa-zA-Z0-9_\.\,]+/ig;
var re_not_link_ = /[^а-яА-ЯёЁa-zA-Z0-9_\-\.\,\:]+/ig;


var create_selection_replacer = (str) => {
  var splitted = str.split(re_not_);
  splitted = _.filter(splitted, (s) => s!=="");

  var re = new RegExp('((?:'+splitted.join(')|(?:')+'))', 'ig');
  return (txt) =>  txt.replace(re, '<strong>$1</strong>');
};

module.exports.create_selection_replacer = create_selection_replacer;

module.exports.remove_tags = (value) => {
  var re = /<(.|\n)*?>/ig;
  return value.replace(re, '');
};

module.exports.encode_object_properties = (obj) => {
  return _.reduce(obj, (memo, v, k) => {
    memo[k] = _.isString(v) ? encodeURIComponent(v) : v;
    return memo;
  }, {});
};

module.exports.encode_link_object_properties = (obj) => {
  return _.reduce(obj, (memo, v, k) => {
    memo[k] = _.isString(v) ? encodeURIComponent(v.replace(re_not_link_, '_')) : v;
    return memo;
  }, {});
};

module.exports.decl_num = (number) => {
  var cases = [2, 0, 1, 1, 1, 2];
  return (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5];
};


