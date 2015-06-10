/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableCellGroup.react
 * @typechecks
 */

"use strict";

var FixedDataTableHelper = require('./FixedDataTableHelper');
var ImmutableObject = require('./ImmutableObject');
var React = require('./React');
var ReactComponentWithPureRenderMixin = require('./ReactComponentWithPureRenderMixin');
var FixedDataTableCell = require('./FixedDataTableCell.react');

var cx = require('./cx');
var renderToString = FixedDataTableHelper.renderToString;
var translateDOMPositionXY = require('./translateDOMPositionXY');

var PropTypes = React.PropTypes;

var EMPTY_OBJECT = new ImmutableObject({});

var FixedDataTableCellGroupImpl = React.createClass({displayName: "FixedDataTableCellGroupImpl",
  mixins: [ReactComponentWithPureRenderMixin],

  propTypes: {

    /**
     * Array of <FixedDataTableColumn />.
     */
    columns: PropTypes.array.isRequired,

    /**
     * The row data to render. The data format can be a simple Map object
     * or an Array of data.
     */
    data: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),

    onColumnResize: PropTypes.func,

    rowHeight: PropTypes.number.isRequired,

    rowIndex: PropTypes.number.isRequired,

    zIndex: PropTypes.number.isRequired,
  },

  render:function() /*object*/ {
    var props = this.props;
    var columns = props.columns;
    var cells = [];
    var width = 0;

    for (var i = 0, j = columns.length; i < j; i++) {
      var columnProps = columns[i].props;
      width += columnProps.width;
      var key = 'cell_' + i;
      cells.push(
        this._renderCell(
          props.data,
          props.rowIndex,
          props.rowHeight,
          columnProps,
          width,
          key
        )
      );
    }

    var style = {
      width: width,
      height: props.height,
      zIndex: props.zIndex
    };

    return (
      React.createElement("div", {className: cx('fixedDataTableCellGroup/cellGroup'), style: style}, 
        cells
      )
    );
  },

  _renderCell:function(
    /*object|array*/ rowData,
    /*number*/ rowIndex,
    /*number*/ height,
    /*object*/ columnProps,
    /*?number*/ widthOffset,
    /*string*/ key
  ) /*object*/ {
    var cellRenderer = columnProps.cellRenderer || renderToString;
    var columnData = columnProps.columnData || EMPTY_OBJECT;
    var cellDataKey = columnProps.dataKey;
    var isFooterCell = columnProps.isFooterCell;
    var isHeaderCell = columnProps.isHeaderCell;
    var cellData;

    if (isHeaderCell || isFooterCell) {
      cellData = rowData[cellDataKey];
    } else {
      var cellDataGetter = columnProps.cellDataGetter;
      cellData = cellDataGetter ?
        cellDataGetter(cellDataKey, rowData) :
        rowData[cellDataKey];
    }

    var cellIsResizable = columnProps.isResizable &&
      this.props.onColumnResize;
    var onColumnResize = cellIsResizable ? this.props.onColumnResize : null;

    return (
      React.createElement(FixedDataTableCell, {
        align: columnProps.align, 
        cellData: cellData, 
        cellDataKey: cellDataKey, 
        cellRenderer: cellRenderer, 
        className: columnProps.cellClassName, 
        columnData: columnData, 
        height: height, 
        isFooterCell: isFooterCell, 
        isHeaderCell: isHeaderCell, 
        key: key, 
        maxWidth: columnProps.maxWidth, 
        minWidth: columnProps.minWidth, 
        onColumnResize: onColumnResize, 
        rowData: rowData, 
        rowIndex: rowIndex, 
        width: columnProps.width, 
        widthOffset: widthOffset}
      )
    );
  },
});

var FixedDataTableCellGroup = React.createClass({displayName: "FixedDataTableCellGroup",
  mixins: [ReactComponentWithPureRenderMixin],

  propTypes: {
    /**
     * Height of the row.
     */
    height: PropTypes.number.isRequired,

    left: PropTypes.number,

    /**
     * Z-index on which the row will be displayed. Used e.g. for keeping
     * header and footer in front of other rows.
     */
    zIndex: PropTypes.number.isRequired,
  },

  render:function() /*object*/ {
    var $__0=   this.props,left=$__0.left,props=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{left:1});

    var style = {
      height: props.height,
    };

    if (left) {
      translateDOMPositionXY(style, left, 0);
    }

    var onColumnResize = props.onColumnResize ? this._onColumnResize : null;

    return (
      React.createElement("div", {
        style: style, 
        className: cx('fixedDataTableCellGroup/cellGroupWrapper')}, 
        React.createElement(FixedDataTableCellGroupImpl, React.__spread({}, 
          props, 
          {onColumnResize: onColumnResize})
        )
      )
    );
  },

  _onColumnResize:function(
    /*number*/ widthOffset,
    /*number*/ width,
    /*?number*/ minWidth,
    /*?number*/ maxWidth,
    /*string|number*/ cellDataKey,
    /*object*/ event
  ) {
    this.props.onColumnResize && this.props.onColumnResize(
      widthOffset,
      this.props.left,
      width,
      minWidth,
      maxWidth,
      cellDataKey,
      event
    );
  },
});


module.exports = FixedDataTableCellGroup;
