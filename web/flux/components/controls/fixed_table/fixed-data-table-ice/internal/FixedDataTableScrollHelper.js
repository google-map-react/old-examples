/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableScrollHelper
 * @typechecks
 */
'use strict';

var PrefixIntervalTree = require('./PrefixIntervalTree');
var clamp = require('./clamp');

var BUFFER_ROWS = 5;


  function FixedDataTableScrollHelper(
rowCount,
    /*number*/ defaultRowHeight,
    /*number*/ viewportHeight,
    /*?function*/ rowHeightGetter)
   {
    this.$FixedDataTableScrollHelper_rowOffsets = new PrefixIntervalTree(rowCount, defaultRowHeight);
    this.$FixedDataTableScrollHelper_storedHeights = new Array(rowCount);
    for (var i = 0; i < rowCount; ++i) {
      this.$FixedDataTableScrollHelper_storedHeights[i] = defaultRowHeight;
    }
    this.$FixedDataTableScrollHelper_rowCount = rowCount;
    this.$FixedDataTableScrollHelper_position = 0;
    this.$FixedDataTableScrollHelper_contentHeight = rowCount * defaultRowHeight;
    this.$FixedDataTableScrollHelper_defaultRowHeight = defaultRowHeight;
    this.$FixedDataTableScrollHelper_rowHeightGetter = rowHeightGetter ?
      rowHeightGetter :
      function()  {return defaultRowHeight;};
    this.$FixedDataTableScrollHelper_viewportHeight = viewportHeight;
    this.scrollRowIntoView = this.scrollRowIntoView.bind(this);
    this.setViewportHeight = this.setViewportHeight.bind(this);
    this.scrollBy = this.scrollBy.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.scrollToRow = this.scrollToRow.bind(this);
    this.setRowHeightGetter = this.setRowHeightGetter.bind(this);
    this.getContentHeight = this.getContentHeight.bind(this);

    this.$FixedDataTableScrollHelper_updateHeightsInViewport(0, 0);
  }

  FixedDataTableScrollHelper.prototype.setRowHeightGetter=function(rowHeightGetter) {
    this.$FixedDataTableScrollHelper_rowHeightGetter = rowHeightGetter;
  };

  FixedDataTableScrollHelper.prototype.setViewportHeight=function(viewportHeight) {
    this.$FixedDataTableScrollHelper_viewportHeight = viewportHeight;
  };

  FixedDataTableScrollHelper.prototype.getContentHeight=function()  {
    return this.$FixedDataTableScrollHelper_contentHeight;
  };

  FixedDataTableScrollHelper.prototype.$FixedDataTableScrollHelper_updateHeightsInViewport=function(
firstRowIndex,
    /*number*/ firstRowOffset)
   {
    var top = firstRowOffset;
    var index = firstRowIndex;
    while (top <= this.$FixedDataTableScrollHelper_viewportHeight && index < this.$FixedDataTableScrollHelper_rowCount) {
      this.$FixedDataTableScrollHelper_updateRowHeight(index);
      top += this.$FixedDataTableScrollHelper_storedHeights[index];
      index++;
    }
  };

  FixedDataTableScrollHelper.prototype.$FixedDataTableScrollHelper_updateHeightsAboveViewport=function(firstRowIndex) {
    var index = firstRowIndex - 1;
    while (index >= 0 && index >= firstRowIndex - BUFFER_ROWS) {
      var delta = this.$FixedDataTableScrollHelper_updateRowHeight(index);
      this.$FixedDataTableScrollHelper_position += delta;
      index--;
    }
  };

  FixedDataTableScrollHelper.prototype.$FixedDataTableScrollHelper_updateRowHeight=function(rowIndex)  {
    if (rowIndex < 0 || rowIndex >= this.$FixedDataTableScrollHelper_rowCount) {
      return 0;
    }
    var newHeight = this.$FixedDataTableScrollHelper_rowHeightGetter(rowIndex);
    if (newHeight !== this.$FixedDataTableScrollHelper_storedHeights[rowIndex]) {
      var change = newHeight - this.$FixedDataTableScrollHelper_storedHeights[rowIndex];
      this.$FixedDataTableScrollHelper_rowOffsets.set(rowIndex, newHeight);
      this.$FixedDataTableScrollHelper_storedHeights[rowIndex] = newHeight;
      this.$FixedDataTableScrollHelper_contentHeight += change;
      return change;
    }
    return 0;
  };

  FixedDataTableScrollHelper.prototype.scrollBy=function(delta)  {
    var firstRow = this.$FixedDataTableScrollHelper_rowOffsets.upperBound(this.$FixedDataTableScrollHelper_position);
    var firstRowPosition =
      firstRow.value - this.$FixedDataTableScrollHelper_storedHeights[firstRow.index];
    var rowIndex = firstRow.index;
    var position = this.$FixedDataTableScrollHelper_position;

    var rowHeightChange = this.$FixedDataTableScrollHelper_updateRowHeight(rowIndex);
    if (firstRowPosition !== 0) {
      position += rowHeightChange;
    }
    var visibleRowHeight = this.$FixedDataTableScrollHelper_storedHeights[rowIndex] -
      (position - firstRowPosition);

    if (delta >= 0) {

      while (delta > 0 && rowIndex < this.$FixedDataTableScrollHelper_rowCount) {
        if (delta < visibleRowHeight) {
          position += delta;
          delta = 0;
        } else {
          delta -= visibleRowHeight;
          position += visibleRowHeight;
          rowIndex++;
        }
        if (rowIndex < this.$FixedDataTableScrollHelper_rowCount) {
          this.$FixedDataTableScrollHelper_updateRowHeight(rowIndex);
          visibleRowHeight = this.$FixedDataTableScrollHelper_storedHeights[rowIndex];
        }
      }
    } else if (delta < 0) {
      delta = -delta;
      var invisibleRowHeight = this.$FixedDataTableScrollHelper_storedHeights[rowIndex] - visibleRowHeight;

      while (delta > 0 && rowIndex >= 0) {
        if (delta < invisibleRowHeight) {
          position -= delta;
          delta = 0;
        } else {
          position -= invisibleRowHeight;
          delta -= invisibleRowHeight;
          rowIndex--;
        }
        if (rowIndex >= 0) {
          var change = this.$FixedDataTableScrollHelper_updateRowHeight(rowIndex);
          invisibleRowHeight = this.$FixedDataTableScrollHelper_storedHeights[rowIndex];
          position += change;
        }
      }
    }

    var maxPosition = this.$FixedDataTableScrollHelper_contentHeight - this.$FixedDataTableScrollHelper_viewportHeight;
    position = clamp(0, position, maxPosition);
    this.$FixedDataTableScrollHelper_position = position;
    var firstVisibleRow = this.$FixedDataTableScrollHelper_rowOffsets.upperBound(position);
    var firstRowIndex = firstVisibleRow.index;
    firstRowPosition =
      firstVisibleRow.value - this.$FixedDataTableScrollHelper_rowHeightGetter(firstRowIndex);
    var firstRowOffset = firstRowPosition - position;

    this.$FixedDataTableScrollHelper_updateHeightsInViewport(firstRowIndex, firstRowOffset);
    this.$FixedDataTableScrollHelper_updateHeightsAboveViewport(firstRowIndex);

    return {
      index: firstRowIndex,
      offset: firstRowOffset,
      position: this.$FixedDataTableScrollHelper_position,
      contentHeight: this.$FixedDataTableScrollHelper_contentHeight,
    };
  };

  FixedDataTableScrollHelper.prototype.$FixedDataTableScrollHelper_getRowAtEndPosition=function(rowIndex)  {
    // We need to update enough rows above the selected one to be sure that when
    // we scroll to selected position all rows between first shown and selected
    // one have most recent heights computed and will not resize
    this.$FixedDataTableScrollHelper_updateRowHeight(rowIndex);
    var currentRowIndex = rowIndex;
    var top = this.$FixedDataTableScrollHelper_storedHeights[currentRowIndex];
    while (top < this.$FixedDataTableScrollHelper_viewportHeight && currentRowIndex >= 0) {
      currentRowIndex--;
      if (currentRowIndex >= 0) {
        this.$FixedDataTableScrollHelper_updateRowHeight(currentRowIndex);
        top += this.$FixedDataTableScrollHelper_storedHeights[currentRowIndex];
      }
    }
    var position = this.$FixedDataTableScrollHelper_rowOffsets.get(rowIndex).value - this.$FixedDataTableScrollHelper_viewportHeight;
    if (position < 0) {
      position = 0;
    }
    return position;
  };

  FixedDataTableScrollHelper.prototype.scrollTo=function(position)  {
    if (position <= 0) {
      // If position less than or equal to 0 first row should be fully visible
      // on top
      this.$FixedDataTableScrollHelper_position = 0;
      this.$FixedDataTableScrollHelper_updateHeightsInViewport(0, 0);

      return {
        index: 0,
        offset: 0,
        position: this.$FixedDataTableScrollHelper_position,
        contentHeight: this.$FixedDataTableScrollHelper_contentHeight,
      };
    } else if (position >= this.$FixedDataTableScrollHelper_contentHeight - this.$FixedDataTableScrollHelper_viewportHeight) {
      // If position is equal to or greater than max scroll value, we need
      // to make sure to have bottom border of last row visible.
      var rowIndex = this.$FixedDataTableScrollHelper_rowCount - 1;
      position = this.$FixedDataTableScrollHelper_getRowAtEndPosition(rowIndex);
    }
    this.$FixedDataTableScrollHelper_position = position;

    var firstVisibleRow = this.$FixedDataTableScrollHelper_rowOffsets.upperBound(position);
    var firstRowIndex = Math.max(firstVisibleRow.index, 0);
    var firstRowPosition =
      firstVisibleRow.value - this.$FixedDataTableScrollHelper_rowHeightGetter(firstRowIndex);
    var firstRowOffset = firstRowPosition - position;

    this.$FixedDataTableScrollHelper_updateHeightsInViewport(firstRowIndex, firstRowOffset);
    this.$FixedDataTableScrollHelper_updateHeightsAboveViewport(firstRowIndex);

    return {
      index: firstRowIndex,
      offset: firstRowOffset,
      position: this.$FixedDataTableScrollHelper_position,
      contentHeight: this.$FixedDataTableScrollHelper_contentHeight,
    };
  };

  /**
   * Allows to scroll to selected row with specified offset. It always
   * brings that row to top of viewport with that offset
   */
  FixedDataTableScrollHelper.prototype.scrollToRow=function(rowIndex, /*number*/ offset)  {
    rowIndex = clamp(0, rowIndex, this.$FixedDataTableScrollHelper_rowCount - 1);
    offset = clamp(-this.$FixedDataTableScrollHelper_storedHeights[rowIndex], offset, 0);
    var firstRow = this.$FixedDataTableScrollHelper_rowOffsets.get(rowIndex);
    return this.scrollTo(
      firstRow.value - this.$FixedDataTableScrollHelper_storedHeights[rowIndex] - offset
    );
  };

  /**
   * Allows to scroll to selected row by bringing it to viewport with minimal
   * scrolling. This that if row is fully visible, scroll will not be changed.
   * If top border of row is above top of viewport it will be scrolled to be
   * fully visible on the top of viewport. If the bottom border of row is
   * below end of viewport, it will be scrolled up to be fully visible on the
   * bottom of viewport.
   */
  FixedDataTableScrollHelper.prototype.scrollRowIntoView=function(rowIndex)  {
    rowIndex = clamp(0, rowIndex, this.$FixedDataTableScrollHelper_rowCount - 1);
    var rowEnd = this.$FixedDataTableScrollHelper_rowOffsets.get(rowIndex).value;
    var rowBegin = rowEnd - this.$FixedDataTableScrollHelper_storedHeights[rowIndex];
    if (rowBegin < this.$FixedDataTableScrollHelper_position) {
      return this.scrollTo(rowBegin);
    } else if (rowEnd > this.$FixedDataTableScrollHelper_position + this.$FixedDataTableScrollHelper_viewportHeight) {
      var position = this.$FixedDataTableScrollHelper_getRowAtEndPosition(rowIndex);
      return this.scrollTo(position);
    }
    return this.scrollTo(this.$FixedDataTableScrollHelper_position);
  };


module.exports = FixedDataTableScrollHelper;
