/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule PrefixIntervalTree
 * @typechecks
 */

"use strict";

/**
 * An interval tree that allows to set a number at index and given the value
 * find the largest index for which prefix sum is greater than or equal to value
 * (lower bound) or greater than value (upper bound)
 * Complexity:
 *   construct: O(n)
 *   query: O(log(n))
 *   memory: O(log(n)),
 * where n is leafCount from the constructor
 */

  function PrefixIntervalTree(leafCount, /*?number*/ initialLeafValue) {
    var internalLeafCount = this.getInternalLeafCount(leafCount);
    this.$PrefixIntervalTree_leafCount = leafCount;
    this.$PrefixIntervalTree_internalLeafCount = internalLeafCount;
    var nodeCount = 2 * internalLeafCount;
    var Int32Array = global.Int32Array || Array;
    this.$PrefixIntervalTree_value = new Int32Array(nodeCount);
    this.$PrefixIntervalTree_initTables(initialLeafValue || 0);

    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
    this.lowerBound = this.lowerBound.bind(this);
    this.upperBound = this.upperBound.bind(this);
  }

  PrefixIntervalTree.prototype.getInternalLeafCount=function(leafCount)  {
    var internalLeafCount = 1;
    while (internalLeafCount < leafCount) {
      internalLeafCount *= 2;
    }
    return internalLeafCount;
  };

  PrefixIntervalTree.prototype.$PrefixIntervalTree_initTables=function(initialLeafValue) {
    var firstLeaf = this.$PrefixIntervalTree_internalLeafCount;
    var lastLeaf = this.$PrefixIntervalTree_internalLeafCount + this.$PrefixIntervalTree_leafCount - 1;
    var i;
    for (i = firstLeaf; i <= lastLeaf; ++i) {
      this.$PrefixIntervalTree_value[i] = initialLeafValue;
    }
    var lastInternalNode = this.$PrefixIntervalTree_internalLeafCount - 1;
    for (i = lastInternalNode; i > 0; --i) {
      this.$PrefixIntervalTree_value[i] =  this.$PrefixIntervalTree_value[2 * i] + this.$PrefixIntervalTree_value[2 * i + 1];
    }
  };

  PrefixIntervalTree.prototype.set=function(position, /*number*/ value) {
    var nodeIndex = position + this.$PrefixIntervalTree_internalLeafCount;
    this.$PrefixIntervalTree_value[nodeIndex] = value;
    nodeIndex = Math.floor(nodeIndex / 2);
    while (nodeIndex !== 0) {
      this.$PrefixIntervalTree_value[nodeIndex] =
        this.$PrefixIntervalTree_value[2 * nodeIndex] + this.$PrefixIntervalTree_value[2 * nodeIndex + 1];
      nodeIndex = Math.floor(nodeIndex / 2);
    }
  };

  /**
   * Returns an object {index, value} for given position (including value at
   * specified position), or the same for last position if provided position
   * is out of range
   */
  PrefixIntervalTree.prototype.get=function(position)  {
    position = Math.min(position, this.$PrefixIntervalTree_leafCount);
    var nodeIndex = position + this.$PrefixIntervalTree_internalLeafCount;
    var result = this.$PrefixIntervalTree_value[nodeIndex];
    while (nodeIndex > 1) {
      if (nodeIndex % 2 === 1) {
        result = this.$PrefixIntervalTree_value[nodeIndex - 1] + result;
      }
      nodeIndex = Math.floor(nodeIndex / 2);
    }
    return {index: position, value: result};
  };

  /**
   * Returns an object {index, value} where index is index of leaf that was
   * found by upper bound algorithm. Upper bound finds first element for which
   * value is greater than argument
   */
  PrefixIntervalTree.prototype.upperBound=function(value)  {
    var result = this.$PrefixIntervalTree_upperBoundImpl(1, 0, this.$PrefixIntervalTree_internalLeafCount - 1, value);
    if (result.index > this.$PrefixIntervalTree_leafCount - 1) {
      result.index = this.$PrefixIntervalTree_leafCount - 1;
    }
    return result;
  };

  /**
   * Returns result in the same format as upperBound, but finds first element
   * for which value is greater than or equal to argument
   */
  PrefixIntervalTree.prototype.lowerBound=function(value)  {
    var result = this.upperBound(value);
    if (result.value > value && result.index > 0) {
      var previousValue =
        result.value - this.$PrefixIntervalTree_value[this.$PrefixIntervalTree_internalLeafCount + result.index];
      if (previousValue === value) {
        result.value = previousValue;
        result.index--;
      }
    }
    return result;
  };

  PrefixIntervalTree.prototype.$PrefixIntervalTree_upperBoundImpl=function(
nodeIndex,
    /*number*/ nodeIntervalBegin,
    /*number*/ nodeIntervalEnd,
    /*number*/ value)
    {
    if (nodeIntervalBegin === nodeIntervalEnd) {
      return {
        index: nodeIndex - this.$PrefixIntervalTree_internalLeafCount,
        value: this.$PrefixIntervalTree_value[nodeIndex],
      };
    }

    var nodeIntervalMidpoint =
      Math.floor((nodeIntervalBegin + nodeIntervalEnd + 1) / 2);
    if (value < this.$PrefixIntervalTree_value[nodeIndex * 2]) {
      return this.$PrefixIntervalTree_upperBoundImpl(
        2 * nodeIndex,
        nodeIntervalBegin,
        nodeIntervalMidpoint - 1,
        value
      );
    } else {
      var result = this.$PrefixIntervalTree_upperBoundImpl(
        2 * nodeIndex + 1,
        nodeIntervalMidpoint,
        nodeIntervalEnd,
        value - this.$PrefixIntervalTree_value[2 * nodeIndex]
      );
      result.value += this.$PrefixIntervalTree_value[2 * nodeIndex];
      return result;
    }
  };


module.exports = PrefixIntervalTree;
