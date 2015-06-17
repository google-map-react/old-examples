import React, {PropTypes, Component} from 'react/addons';
import shouldPureComponentUpdate from 'react-pure-render/function';

import MainMapLayout from './main_map_layout.jsx';
import IceTable from 'components/controls/fixed_table_examples/ice_table.jsx';
import MainMapBlock from './main_map_block.jsx';

import {Connector} from 'redux/react';
import { bindActionCreators } from 'redux';

export default class MainMapPage extends Component {
  static propTypes = {
    layout: PropTypes.string
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
  }

  _renderMap() {
    return (
      <FluxComponent connectToStores={{
        map: (store) => ({
          center: store.getMapInfo().get('center'),
          zoom: store.getMapInfo().get('zoom'),
          markers: store.getMarkers(),
          visibleRowFirst: store.getTableRowsInfo().get('visibleRowFirst'),
          visibleRowLast: store.getTableRowsInfo().get('visibleRowLast'),
          maxVisibleRows: store.getTableRowsInfo().get('maxVisibleRows'),
          hoveredRowIndex: store.getTableRowsInfo().get('hoveredRowIndex'),
          openBallonIndex: store.getOpenBalloonIndex()
        })}}
        injectActions={{
          map: (actions) => ({
            onBoundsChange: actions.changeBounds,
            onMarkerHover: actions.markerHoverIndexChange,
            onChildClick: actions.showBallon
          })
        }}>
        <MainMapBlock />
      </FluxComponent>
    );
  }

  _renderTable() {
    return (
      <FluxComponent connectToStores={{
        map: (store) => ({
          markers: store.getMarkers(),
          hoveredMapRowIndex: store.getHoverMarkerIndex(),
          resetToStartObj: store.getMapInfo()
        })}}
        injectActions={{
          map: (actions) => ({
            onHoveredRowIndexChange: actions.tableHoveredRowIndexChange,
            onVisibleRowsChange: actions.tableVisibleRowsChange,
            onRowClick: actions.showBallon
          })
        }}>
        <IceTable />
      </FluxComponent>
    );
  }

  render() {
    return (
      <MainMapLayout layout={this.props.layout} renderMap={this._renderMap} renderTable={this._renderTable} />
    );
  }
}
