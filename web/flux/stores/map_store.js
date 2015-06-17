import {
  QUERY_MAP,
  CHANGE_BOUNDS_MAP,
  TABLE_VISIBLE_ROWS_CHANGE_MAP,
  TABLE_HOVERED_ROWS_INDEX_CHANGE_MAP,
  MARKER_HOVER_INDEX_CHANGE_MAP,
  SHOW_BALLON_MAP} from '../consts/map_actions_types.js';

import immutable, {Map, List} from 'immutable';

const K_LAST_VISIBLE_ROW_AT_SERVER_RENDERING = 5;

function ptInSect(x, a, b) {
  return (x - a) * (x - b) <= 0;
}

function ptInRect(pt, rect) {
  return ptInSect(pt.get('lat'), rect.get(0), rect.get(2)) && ptInSect(pt.get('lng'), rect.get(1), rect.get(3));
}

// use rbush https://github.com/mourner/rbush if you have really big amount of points
function calcFilteredAndSortedMarkers(data, mapInfo) {
  const marginBounds = mapInfo && mapInfo.get('marginBounds');

  if (!data || !marginBounds) {
    return new List();
  }

  return data
    .filter(m => ptInRect(m, marginBounds));
}

function defaultMapState() {
  return immutable.fromJS({
    data: [],
    dataFiltered: [],

    mapInfo: {
      center: [59.938043, 30.337157],
      // set for server rendering for popular screen res
      bounds: [60.325132160343145, 29.13415407031249, 59.546382183279206, 31.54015992968749],
      marginBounds: [60.2843135300829, 29.21655153124999, 59.58811868963835, 31.45776246874999],
      zoom: 9
    },

    openBalloonIndex: -1,

    hoverMarkerIndex: -1,

    tableRowsInfo: {
      hoveredRowIndex: -1,
      visibleRowFirst: 0,
      visibleRowLast: K_LAST_VISIBLE_ROW_AT_SERVER_RENDERING,
      maxVisibleRows: K_LAST_VISIBLE_ROW_AT_SERVER_RENDERING
    }
  });
}

export default function map(state = defaultMapState(), {type: exampleActionType, ...data}) {
  switch (exampleActionType) {
    case QUERY_MAP:
      const {markersData} = data;
      return state
        .set('data', markersData)
        .update(s => s.set('dataFiltered', calcFilteredAndSortedMarkers(s.get('data'), s.get('mapInfo'))));

    case CHANGE_BOUNDS_MAP:
      const {center, zoom, bounds, marginBounds} = data;
      return state
        .update('mapInfo', mapInfo => mapInfo.merge({center, zoom, bounds, marginBounds}))
        .set('openBalloonIndex', -1)
        .update(s => s.set('dataFiltered', calcFilteredAndSortedMarkers(s.get('data'), s.get('mapInfo'))));

    case TABLE_VISIBLE_ROWS_CHANGE_MAP:
      const {visibleRowFirst, visibleRowLast, maxVisibleRows} = data;
      return state
        .update('tableRowsInfo', tableRowsInfo => tableRowsInfo.merge({visibleRowFirst, visibleRowLast, maxVisibleRows}))
        .set('openBalloonIndex', -1);

    case TABLE_HOVERED_ROWS_INDEX_CHANGE_MAP:
      const {hoveredRowIndex} = data;
      return state
        .update('tableRowsInfo', tableRowsInfo => tableRowsInfo.merge({hoveredRowIndex}));

    case MARKER_HOVER_INDEX_CHANGE_MAP:
      const {hoverMarkerIndex} = data;
      return state
        .set('hoverMarkerIndex', hoverMarkerIndex);

    case SHOW_BALLON_MAP:
      const {openBalloonIndex} = data;
      return state
        .set('openBalloonIndex', openBalloonIndex === state.get('openBalloonIndex') ? -1 : openBalloonIndex);

    default:
      return state;
  }
}

