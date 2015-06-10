
export function getHintBaloonVerticalPosClass(y /*, mapHeight*/) {
  const K_MAX_BALLOON_HEIGHT = 240;
  return y > K_MAX_BALLOON_HEIGHT ? 'hint--top' : 'hint--bottom';
}

export function getHintBaloonHorizontalPosStyle(x, markerWidth, markerOffset, mapWidth) {
  const K_BALLOON_WIDTH_BASE = 250;
  // offset from map side
  const K_BALLOON_MAP_OFFSET = 10;
  // balloon with not more than map width
  const K_BALLOON_WIDTH = Math.min(K_BALLOON_WIDTH_BASE, mapWidth - 2 * K_BALLOON_MAP_OFFSET);
  // default ballon offset from arrow center i want
  const K_BALLOON_DEFAULT_OFFSET = K_BALLOON_WIDTH * 0.15;
  // from corner
  const offset = -K_BALLOON_DEFAULT_OFFSET + markerWidth * 0.5;
  // overflow in px (marker assymetric)
  const leftX = x + offset - markerWidth * markerOffset;
  const rightX = leftX + K_BALLOON_WIDTH;
  // recalc if overflow
  const mapOffset = offset + Math.min(0, (mapWidth - K_BALLOON_MAP_OFFSET) - rightX) + Math.max(0, K_BALLOON_MAP_OFFSET - leftX);

  const K_BALLOON_WIDTH_STYLE = {
    width: `${K_BALLOON_WIDTH}px`,
    left: `${mapOffset}px`,
    marginLeft: '0px'
  };
  return K_BALLOON_WIDTH_STYLE;
}

export function getHintBottomOffsetClass(markerWidth, markerOffset) {
  const K_HINT_ARROW_WIDTH = 12;
  const offset = Math.round(-(markerWidth / 2 + K_HINT_ARROW_WIDTH / 2 - markerOffset * markerWidth));
  if (__DEV__) {
    if (offset < -40 || offset > 40) {
      console.error('HintBottomOffset is out of range, extend range at sass/markers/map_marker.sass'); // eslint-disable-line no-console
    }
  }
  // classes generated at sass/markers/map_marker.sass
  return 'map-marker--hint-bottom-delta-' + offset;
}
