/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableRowBuffer
 * @typechecks
 */
'use strict';

var IntegerBufferSet = require('./IntegerBufferSet');

var clamp = require('./clamp');
var invariant = require('./invariant');
var MIN_BUFFER_ROWS = 5;
var MAX_BUFFER_ROWS = 15;

// FixedDataTableRowBuffer is a helper class that executes row buffering
// logic for FixedDataTable. It figures out which rows should be rendered
// and in which positions.

  function FixedDataTableRowBuffer(
rowsCount,
    /*number*/  defaultRowHeight,
    /*number*/ viewportHeight,
    /*?function*/ rowHeightGetter)
   {
    invariant(
      defaultRowHeight !== 0,
      "defaultRowHeight musn't be equal 0 in FixedDataTableRowBuffer"
    );

    this.$FixedDataTableRowBuffer_bufferSet = new IntegerBufferSet();
    this.$FixedDataTableRowBuffer_defaultRowHeight = defaultRowHeight;
    this.$FixedDataTableRowBuffer_viewportRowsBegin = 0;
    this.$FixedDataTableRowBuffer_viewportRowsEnd = 0;
    this.$FixedDataTableRowBuffer_maxVisibleRowCount = Math.ceil(viewportHeight / defaultRowHeight) + 1;
    this.$FixedDataTableRowBuffer_bufferRowsCount = clamp(
      MIN_BUFFER_ROWS,
      Math.floor(this.$FixedDataTableRowBuffer_maxVisibleRowCount/2),
      MAX_BUFFER_ROWS
    );
    this.$FixedDataTableRowBuffer_rowsCount = rowsCount;
    this.$FixedDataTableRowBuffer_rowHeightGetter = rowHeightGetter;
    this.$FixedDataTableRowBuffer_rows = [];
    this.$FixedDataTableRowBuffer_viewportHeight = viewportHeight;

    this.getRows = this.getRows.bind(this);
    this.getRowsWithUpdatedBuffer = this.getRowsWithUpdatedBuffer.bind(this);
  }

  FixedDataTableRowBuffer.prototype.getRowsWithUpdatedBuffer=function()  {
    var remainingBufferRows = 2 * this.$FixedDataTableRowBuffer_bufferRowsCount;
    var bufferRowIndex =
      Math.max(this.$FixedDataTableRowBuffer_viewportRowsBegin - this.$FixedDataTableRowBuffer_bufferRowsCount, 0);
    while (bufferRowIndex < this.$FixedDataTableRowBuffer_viewportRowsBegin) {
      this.$FixedDataTableRowBuffer_addRowToBuffer(
        bufferRowIndex,
        this.$FixedDataTableRowBuffer_viewportHeight,
        this.$FixedDataTableRowBuffer_viewportRowsBegin,
        this.$FixedDataTableRowBuffer_viewportRowsEnd -1
      );
      bufferRowIndex++;
      remainingBufferRows--;
    }
    bufferRowIndex = this.$FixedDataTableRowBuffer_viewportRowsEnd;
    while (bufferRowIndex < this.$FixedDataTableRowBuffer_rowsCount && remainingBufferRows > 0) {
      this.$FixedDataTableRowBuffer_addRowToBuffer(
        bufferRowIndex,
        this.$FixedDataTableRowBuffer_viewportHeight,
        this.$FixedDataTableRowBuffer_viewportRowsBegin,
        this.$FixedDataTableRowBuffer_viewportRowsEnd -1
      );
      bufferRowIndex++;
      remainingBufferRows--;
    }
    return this.$FixedDataTableRowBuffer_rows;
  };

  FixedDataTableRowBuffer.prototype.getRows=function(
firstRowIndex,
    /*number*/ firstRowOffset)
    {
    // Update offsets of all rows to move them outside of viewport. Later we
    // will bring rows that we should show to their right offsets.
    this.$FixedDataTableRowBuffer_hideAllRows();

    var top = firstRowOffset;
    var totalHeight = top;
    var rowIndex = firstRowIndex;
    var endIndex =
      Math.min(firstRowIndex + this.$FixedDataTableRowBuffer_maxVisibleRowCount, this.$FixedDataTableRowBuffer_rowsCount);

    this.$FixedDataTableRowBuffer_viewportRowsBegin = firstRowIndex;
    while (rowIndex < endIndex ||
        (totalHeight < this.$FixedDataTableRowBuffer_viewportHeight && rowIndex < this.$FixedDataTableRowBuffer_rowsCount)) {
      this.$FixedDataTableRowBuffer_addRowToBuffer(
        rowIndex,
        totalHeight,
        firstRowIndex,
        endIndex - 1
      );
      totalHeight += this.$FixedDataTableRowBuffer_rowHeightGetter(rowIndex);
      ++rowIndex;
      // Store index after the last viewport row as end, to be able to
      // distinguish when there are no rows rendered in viewport
      this.$FixedDataTableRowBuffer_viewportRowsEnd = rowIndex;
    }

    return this.$FixedDataTableRowBuffer_rows;
  };

  FixedDataTableRowBuffer.prototype.$FixedDataTableRowBuffer_addRowToBuffer=function(
rowIndex,
    /*number*/ offsetTop,
    /*number*/ firstViewportRowIndex,
    /*number*/ lastViewportRowIndex)
   {
      var rowPosition = this.$FixedDataTableRowBuffer_bufferSet.getValuePosition(rowIndex);
      var viewportRowsCount = lastViewportRowIndex - firstViewportRowIndex + 1;
      var allowedRowsCount = viewportRowsCount + this.$FixedDataTableRowBuffer_bufferRowsCount * 2;
      if (rowPosition === null &&
          this.$FixedDataTableRowBuffer_bufferSet.getSize() >= allowedRowsCount) {
        rowPosition =
          this.$FixedDataTableRowBuffer_bufferSet.replaceFurthestValuePosition(
            firstViewportRowIndex,
            lastViewportRowIndex,
            rowIndex
          );
      }
      if (rowPosition === null) {
        // We can't reuse any of existing positions for this row. We have to
        // create new position
        rowPosition = this.$FixedDataTableRowBuffer_bufferSet.getNewPositionForValue(rowIndex);
        this.$FixedDataTableRowBuffer_rows[rowPosition] = {
          rowIndex:rowIndex,
          offsetTop:offsetTop,
        };
      } else {
        // This row already is in the table with rowPosition position or it
        // can replace row that is in that position
        this.$FixedDataTableRowBuffer_rows[rowPosition].rowIndex = rowIndex;
        this.$FixedDataTableRowBuffer_rows[rowPosition].offsetTop = offsetTop;
      }
  };

  FixedDataTableRowBuffer.prototype.$FixedDataTableRowBuffer_hideAllRows=function() {
    var i = this.$FixedDataTableRowBuffer_rows.length - 1;
    while (i > -1) {
      this.$FixedDataTableRowBuffer_rows[i].offsetTop = this.$FixedDataTableRowBuffer_viewportHeight;
      i--;
    }
  };


module.exports = FixedDataTableRowBuffer;
