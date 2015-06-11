/*
 * emulate async server data query
 */
import {memoize, serialize} from 'async-decorators';

import genMarkersData from 'components/examples/data/gen_markers_data.js';

const getDataAsync = (ms = 0, data = null) => new Promise(r => setTimeout(() => r(data), ms));


const K_EMUL_ROUNDTRIP_TIME_MS = 100;
const K_ROW_DEBOUNCE_INTERVAL = 16; // increase if you wanna show really big amount of markers


export default function createMapActions() {
  return {
    @serialize({raiseSkipError: false}) // possible memory leak, check
    @memoize({expireMs: 1000 * 60 * 15})
    async query(params) {
      return await getDataAsync(K_EMUL_ROUNDTRIP_TIME_MS, genMarkersData(params));
    },

    changeBounds({center, zoom, bounds, marginBounds}) {
      return {center, zoom, bounds, marginBounds};
    },

    tableHoveredRowIndexChange(index) {
      return index;
    },

    markerHoverIndexChange(index) {
      return index;
    },

    showBallon(index) {
      return index;
    },

    @serialize({raiseSkipError: false}) // skips all but first and last
    async tableVisibleRowsChange({visibleRowFirst, visibleRowLast, maxVisibleRows}) {
      return await getDataAsync(K_ROW_DEBOUNCE_INTERVAL, {visibleRowFirst, visibleRowLast, maxVisibleRows});
    }
  };
}
