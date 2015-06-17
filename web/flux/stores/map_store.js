import {
  QUERY_MAP,
  TABLE_VISIBLE_ROWS_CHANGE_MAP,
  CHANGE_BOUNDS_MAP,
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
      return state.set('data', markersData);
    case CHANGE_BOUNDS_MAP:
      const {center, zoom, bounds, marginBounds} = data;
      return state.set('mapInfo', new Map({center, zoom, bounds, marginBounds}));
    default:
      return state;
  }
}

