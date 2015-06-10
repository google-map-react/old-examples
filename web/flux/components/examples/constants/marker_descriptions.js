/*
 * marker visual parameters
 * image param is more prior than imageClass if both defined
 */

const markerDescriptions = [
  {
    size: {width: 62, height: 60},
    origin: {x: 15 / 62, y: 1},
    withText: true,
    // image: require('icons/map_icons/map_icon_text_red.svg')
    imageClass: 'map_icon_text_red'
  },
  {
    size: {width: 62, height: 60},
    origin: {x: 15 / 62, y: 1},
    withText: true,
    // image: require('icons/map_icons/map_icon_text_indigo.svg')
    imageClass: 'map_icon_text_indigo'
  },
  {
    size: {width: 44, height: 62},
    origin: {x: 0.37, y: 1},
    imageClass: 'map-marker__marker--as'
  },
  {
    size: {width: 44, height: 62},
    origin: {x: 0.37, y: 1},
    imageClass: 'map-marker__marker--ap'
  },
  {
    size: {width: 61, height: 65},
    origin: {x: 24 / 61, y: 63 / 65},
    image: require('icons/map_icons/map_icon_flag_orange.svg'),
    hintType: 'hint--error'
  },
  {
    size: {width: 49, height: 64},
    origin: {x: 0.5, y: 1},
    image: require('icons/map_icons/map_icon_std.svg')
  },
  {
    size: {width: 49, height: 64},
    origin: {x: 0.5, y: 1},
    image: require('icons/map_icons/map_icon_std_orange.svg')
  }
];

export default markerDescriptions;
