/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule IntegerBufferSet
 * @typechecks
 */

"use strict";

var Heap = require('./Heap');

var invariant = require('./invariant');

// Data structure that allows to store values and assign positions to them
// in a way to minimize changing positions of stored values when new ones are
// added or when some values are replaced. Stored elements are alwasy assigned
// a consecutive set of positoins startin from 0 up to count of elements less 1
// Following actions can be executed
// * get position assigned to given value (null if value is not stored)
// * create new entry for new value and get assigned position back
// * replace value that is furthest from specified value range with new value
//   and get it's position back
// All operations take amortized log(n) time where n is number of elements in
// the set.

  function IntegerBufferSet() {
    this.$IntegerBufferSet_valueToPositionMap = {};
    this.$IntegerBufferSet_size = 0;
    this.$IntegerBufferSet_smallValues = new Heap(
      [], // Initial data in the heap
      this.$IntegerBufferSet_smallerComparator
    );
    this.$IntegerBufferSet_largeValues = new Heap(
      [], // Initial data in the heap
      this.$IntegerBufferSet_greaterComparator
    );

    this.getNewPositionForValue = this.getNewPositionForValue.bind(this);
    this.getValuePosition = this.getValuePosition.bind(this);
    this.getSize = this.getSize.bind(this);
    this.replaceFurthestValuePosition =
      this.replaceFurthestValuePosition.bind(this);
  }

  IntegerBufferSet.prototype.getSize=function()  {
    return this.$IntegerBufferSet_size;
  };

  IntegerBufferSet.prototype.getValuePosition=function(value)  {
    if (this.$IntegerBufferSet_valueToPositionMap[value] === undefined) {
      return null;
    }
    return this.$IntegerBufferSet_valueToPositionMap[value];
  };

  IntegerBufferSet.prototype.getNewPositionForValue=function(value)  {
    invariant(
      this.$IntegerBufferSet_valueToPositionMap[value] === undefined,
      "Shouldn't try to find new position for value already stored in BufferSet"
    );
    var newPosition = this.$IntegerBufferSet_size;
    this.$IntegerBufferSet_size++;
    this.$IntegerBufferSet_pushToHeaps(newPosition, value);
    this.$IntegerBufferSet_valueToPositionMap[value] = newPosition;
    return newPosition;
  };

  IntegerBufferSet.prototype.replaceFurthestValuePosition=function(
lowValue,
    /*number*/ highValue,
    /*number*/ newValue)
    {
    invariant(
      this.$IntegerBufferSet_valueToPositionMap[newValue] === undefined,
      "Shouldn't try to replace values with value already stored value in " +
      "BufferSet"
    );

    this.$IntegerBufferSet_cleanHeaps();
    if (this.$IntegerBufferSet_smallValues.empty() || this.$IntegerBufferSet_largeValues.empty()) {
      // Threre are currently no values stored. We will have to create new
      // position for this value.
      return null;
    }

    var minValue = this.$IntegerBufferSet_smallValues.peek().value;
    var maxValue = this.$IntegerBufferSet_largeValues.peek().value;
    if (minValue >= lowValue && maxValue <= highValue) {
      // All values currently stored are necessary, we can't reuse any of them.
      return null;
    }

    var valueToReplace;
    if (lowValue - minValue > maxValue - highValue) {
      // minValue is further from provided range. We will reuse it's position.
      valueToReplace = minValue;
      this.$IntegerBufferSet_smallValues.pop();
    } else {
      valueToReplace = maxValue;
      this.$IntegerBufferSet_largeValues.pop();
    }
    var position = this.$IntegerBufferSet_valueToPositionMap[valueToReplace];
    delete this.$IntegerBufferSet_valueToPositionMap[valueToReplace];
    this.$IntegerBufferSet_valueToPositionMap[newValue] = position;
    this.$IntegerBufferSet_pushToHeaps(position, newValue);

    return position;
  };

  IntegerBufferSet.prototype.$IntegerBufferSet_pushToHeaps=function(position, /*number*/ value) {
    var element = {
      position:position,
      value:value,
    };
    // We can reuse the same object in both heaps, because we don't mutate them
    this.$IntegerBufferSet_smallValues.push(element);
    this.$IntegerBufferSet_largeValues.push(element);
  };

  IntegerBufferSet.prototype.$IntegerBufferSet_cleanHeaps=function() {
    // We not usually only remove object from one heap while moving value.
    // Here we make sure that there is no stale data on top of heaps.
    this.$IntegerBufferSet_cleanHeap(this.$IntegerBufferSet_smallValues);
    this.$IntegerBufferSet_cleanHeap(this.$IntegerBufferSet_largeValues);
    var minHeapSize =
      Math.min(this.$IntegerBufferSet_smallValues.size(), this.$IntegerBufferSet_largeValues.size());
    var maxHeapSize =
      Math.max(this.$IntegerBufferSet_smallValues.size(), this.$IntegerBufferSet_largeValues.size());
    if (maxHeapSize > 10 * minHeapSize) {
      // There are many old values in one of heaps. We nned to get rid of them
      // to not use too avoid memory leaks
      this.$IntegerBufferSet_recreateHeaps();
    }
  };

  IntegerBufferSet.prototype.$IntegerBufferSet_recreateHeaps=function() {
    var sourceHeap = this.$IntegerBufferSet_smallValues.size() < this.$IntegerBufferSet_largeValues.size() ?
      this.$IntegerBufferSet_smallValues :
      this.$IntegerBufferSet_largeValues;
    var newSmallValues = new Heap(
      [], // Initial data in the heap
      this.$IntegerBufferSet_smallerComparator
    );
    var newLargeValues = new Heap(
      [], // Initial datat in the heap
      this.$IntegerBufferSet_greaterComparator
    );
    while (!sourceHeap.empty()) {
      var element = sourceHeap.pop();
      // Push all stil valid elements to new heaps
      if (this.$IntegerBufferSet_valueToPositionMap[element.value] !== undefined) {
        newSmallValues.push(element);
        newLargeValues.push(element);
      }
    }
    this.$IntegerBufferSet_smallValues = newSmallValues;
    this.$IntegerBufferSet_largeValues = newLargeValues;
  };

  IntegerBufferSet.prototype.$IntegerBufferSet_cleanHeap=function(heap) {
    while (!heap.empty() &&
        this.$IntegerBufferSet_valueToPositionMap[heap.peek().value] === undefined) {
      heap.pop();
    }
  };

  IntegerBufferSet.prototype.$IntegerBufferSet_smallerComparator=function(lhs, /*object*/ rhs)  {
    return lhs.value < rhs.value;
  };

  IntegerBufferSet.prototype.$IntegerBufferSet_greaterComparator=function(lhs, /*object*/ rhs)  {
    return lhs.value > rhs.value;
  };



module.exports = IntegerBufferSet;
