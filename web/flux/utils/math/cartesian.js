'use strict';
var _ = require('underscore');

var cartesian = function(array_of_arrays) {
  return _.reduce(array_of_arrays, function(memo, arg) {
      return _.flatten(_.map(memo, function(x) {
          return _.map(arg, function(y) {
              return x.concat([y]);
          });
      }), true);
  }, [ [] ]);
};

var permuations = function(array) {
  if(array.length === 0) return [];
  var v = _.map(array, function(){
    var arr = array.slice(0);
    return arr;
  });
  return _.filter(cartesian(v), function(arr) {
    return arr.length === _.uniq(arr).length;
  });
};


module.export.cartesian = cartesian;
module.export.permuations = permuations;


/*
var create_regexp = function (words, capturing) {
    words = _.map(words, function(w) {
      return  w;
    });
    
    var prefix = (!!capturing) ? '' : '?:';
    
    
    //теперь надо составить все возможные перестановки words (регулярки не умеют AND без ?= оператора в подмножестве индексированного поиска таких нет)
    var words_permutations = permuations(words);
    var regexp_query = _.map(words_permutations, function(permutation) {
      return '('+ prefix + permutation.join('.*')+')';
    }).join('|');

    return new RegExp(regexp_query,'ig');
};


var text_a = [
'jdjkshfjk sfdh df sdmfnmsdnfewlkrlewr fsd wekhjksdf  sd kjfskdfjksdhjkfh sdf dshf jksdhfk jsd jdjkshfjk sfdhjfkdhs aw dsfdslkjfksdjfkljsdflk',
'jdjkshfjk sfdh df sdmfnmsdnfewlkrlewr fsd wekhjksdf  sd kjfskdfjksdhjkfh sdf dshf jksdhfk jsd jdjkshfjk sfdhjfkdhs aw dsfdslkjfksdjfkljsdflk',
'jdjkshfjk sfdh df sdmfnmsdnfewlkrlewr fsd wekhjksdf  sd kjfskdfjksdhjkfh sdf dshf jksdhfk jsd jdjkshfjk sfdhjfkdhs aw dsfdslkjfksdjfkljsdflk',
'jdjkshfjk sfdh df sdmfnmsdnfewlkrlewr fsd wekhjksdf  sd kjfskdfjksdhjkfh sdf dshf jksdhfk jsd jdjkshfjk sfdhjfkdhs aw dsfdslkjfksdjfkljsdflk',
'jdjkshfjk sfdh df sdmfnmsdnfewlkrlewr fsd wekhjksdf  ko lo veryveryverylonglonglonglonglonglong milgesung opanorasd kjfskdfjksdhjkfh sdf dshf jksdhfk jsd jdjkshfjk sfdhjfkdhs aw dsfdslkjfksdjfkljsdflk',
'jdjkshfjk sfdh df sdmfnmsdnfewlkrlewr fsd wekhjksdf  sd kjfskdfjksdhjkfh sdf dshf jksdhfk jsd jdjkshfjk sfdhjfkdhs aw dsfdslkjfksdjf bw kljsdflk',
'jdjkshfjk sfdh df sdmfnmsdnfewlkrlewr fsd wekhjksdf  sd kjfskdfjksdhjkfh sdf dshf jksdhfk jsd jdjkshfjk sfdhjfkdhs aw dsfdslkjfksdjf bw kljsdflk',
];




//var text = text_a.join('\n');
//var re = create_regexp(['aw','bw']);
//re = create_regexp(['jdjkshfjk', 'milgesung','jsd', 'opanorasd', 'sdf', 'dshf', 'jksdhfk']);

var words = ['ko','lo'];
var words = ['veryveryverylonglonglonglonglonglong','opanorasd', 'ko', 'lo'];
console.time('aaa');
for(var i=0;i!=100000;++i) {
  //var match = re.exec(text);
  //re.exec('');
  _.find(text_a, function(txt) {
    return _.all(words, function(word) {
      return txt.indexOf(word) > -1;
    });
  });
}
console.timeEnd('aaa');



var idx = _.find(text_a, function(txt) {
  return _.all(words, function(word) {
    return txt.indexOf(word) > -1;
  });
});
console.log(idx);

*/