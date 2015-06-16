import { Store } from 'flummox';
import immutable, { Map, List } from 'immutable';
import {serialize, deserialize} from './utils/serialize.js';
import view from './decorators/view.js';

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

export default class MapStore extends Store {
  static serialize = serialize;
  static deserialize = deserialize;

  state = {
    data: new List(),

    mapInfo: new Map({
      center: new List([59.938043, 30.337157]),
      // set for server rendering for popular screen res
      bounds: new List([60.325132160343145, 29.13415407031249, 59.546382183279206, 31.54015992968749]),
      marginBounds: new List([60.2843135300829, 29.21655153124999, 59.58811868963835, 31.45776246874999]),
      zoom: 9
    }),

    openBalloonIndex: -1,

    hoverMarkerIndex: -1,

    tableRowsInfo: new Map({
      hoveredRowIndex: -1,
      visibleRowFirst: 0,
      visibleRowLast: K_LAST_VISIBLE_ROW_AT_SERVER_RENDERING,
      maxVisibleRows: K_LAST_VISIBLE_ROW_AT_SERVER_RENDERING
    })
  };

  constructor({ mapActions }) {
    super();
    this.registerAsync(mapActions.query, null, this._onQueryEnd, this._onQueryError);
    this.register(mapActions.query, this._onQueryEnd);
    this.register(mapActions.changeBounds, this._onBoundsChanged);

    this.register(mapActions.tableHoveredRowIndexChange, this._onTableHoveredRowIndexChange);
    this.register(mapActions.tableVisibleRowsChange, this._onTableVisibleRowsChange);

    this.register(mapActions.markerHoverIndexChange, this._onMarkerHoverIndexChange);
    this.register(mapActions.showBallon, this._onShowBallon);
  }

  _onBoundsChanged({center, zoom, bounds, marginBounds}) {
    this.setState({
      mapInfo: immutable.fromJS({center, zoom, bounds, marginBounds}),
      openBalloonIndex: -1
    });
  }

  _onTableHoveredRowIndexChange(hoveredRowIndex) {
    this.setState({tableRowsInfo: this.state.tableRowsInfo.merge({hoveredRowIndex})});
  }

  _onTableVisibleRowsChange({visibleRowFirst, visibleRowLast, maxVisibleRows}) {
    this.setState({
      tableRowsInfo: this.state.tableRowsInfo.merge({visibleRowFirst, visibleRowLast, maxVisibleRows}),
      openBalloonIndex: -1
    });
  }

  _onMarkerHoverIndexChange(hoverMarkerIndex) {
    this.setState({hoverMarkerIndex});
  }

  _onQueryEnd(body /*, payload */) {
    this.setState({data: body});
  }

  _onQueryError(error, payload) {
    console.error('MapStore _onQueryError', error, payload);
  }

  _onShowBallon(openBalloonIndex) {
    this.setState({
      openBalloonIndex: openBalloonIndex === this.state.openBalloonIndex ? -1 : openBalloonIndex
    });
  }

  getMapInfo() {
    return this.state.mapInfo;
  }

  getTableRowsInfo() {
    return this.state.tableRowsInfo;
  }

  getHoverMarkerIndex() {
    return this.state.hoverMarkerIndex;
  }

  getOpenBalloonIndex() {
    return this.state.openBalloonIndex;
  }

  @view(['data', 'mapInfo'])
  getMarkers() {
    return calcFilteredAndSortedMarkers(this.state.data, this.state.mapInfo);
  }
}
