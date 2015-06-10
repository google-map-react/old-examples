const exampleDefs = {
  main: {
    title: 'MAIN EXAMPLE',
    info: '<strong>MAP INTERFACE I WISH BE EVERYWHERE.</strong><br/><br/>' +
          '<div>' +
          'Nice svg icons with any css animations;<br/>' +
          'Nice looking conrollable tooltips and balloons;<br/>' +
          'No table paging <i>(infinite table scroll)</i>;<br/>' +
          'Ability to hover on every marker <i>(zoom out to test)</i>;<br/>' +
          'Hover probability <i>(different hover probability for markers)</i>;<br/>' +
          'No map moving on balloon open.<br/><br/>' +
          '</div>'
  },

  simple: {
    title: 'SIMPLE EXAMPLE',
    info: 'Base map usage example. <br/>' +
          'Show any react component on the map.'
  },

  simple_hover: {
    title: 'SIMPLE HOVER EXAMPLE',
    info: 'Show base of internal hover algorithm.'
  },

  distance_hover: {
    title: 'DISTANCE HOVER EXAMPLE',
    info: 'Show how to use internal hover algorithm.<br/>' +
          'For use with non symmetric markers, or to tweak hover probability on some kind of markers.<br/>' +
          'There is more probable to hover on marker A at this example.'
  },

  events: {
    title: 'EVENTS EXAMPLE',
    info: 'Be sure you understand <a href="https://github.com/matthewwithanm/react-controllables">react-controllables</a>.<br/>' +
          'Click on markers.'
  },

  balderdash: {
    title: 'BALDERDASH',
    info: 'Many different markers.'
  }
};

const examples = Object.keys(exampleDefs)
  .reduce((r, k) => ((r[k] = k), r), {});

Object.keys(exampleDefs).reduce((prev, current) => {
  exampleDefs[prev].next = '/map/' + current;
  return current;
});

Object.keys(exampleDefs).reduceRight((prev, current) => {
  exampleDefs[prev].prev = '/map/' + current;
  return current;
});

Object.keys(exampleDefs).forEach(k => {
  exampleDefs.source = k;
});

export default exampleDefs;
export {examples};
