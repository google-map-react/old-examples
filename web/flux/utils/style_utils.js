'use strict';

module.exports.from_px_to_number = function(val) {
  return +val.replace('px','');
};

module.exports.from_percent_to_number = function(val) {
  return +val.replace('%','');
};
