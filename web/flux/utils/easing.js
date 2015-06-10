'use strict';

module.exports.ease_in_sine =  function (t, from, to) {
  var d = 1;
  var c = to - from;

  return -c * Math.cos(t/d * (Math.PI/2)) + c + from;
};


module.exports.ease_in_cubic = function (t, from, to) {
  var d = 1;
  var c = to - from;

  return c*(t/=d)*t*t + from;
};

module.exports.ease_out_cubic = function (t, from, to) {
  var d =1;
  var c = to - from;

  t /= d;
  t--;
  return c*(t*t*t + 1) + from;
};


module.exports.ease_in_quad = function (t, from, to) {
  var d =1;
  var c = to - from;

  t /= d;
  return c*t*t + from;
};

module.exports.ease_out_quad = function (t, from, to) {
  var d =1;
  var c = to - from;

  t /= d;
  return -c * t*(t-2) + from;
};
