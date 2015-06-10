/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DOMMouseMoveTracker
 * @typechecks
 */

"use strict";

var EventListener = require('./EventListener');

var cancelAnimationFramePolyfill = require('./cancelAnimationFramePolyfill');
var requestAnimationFramePolyfill = require('./requestAnimationFramePolyfill');


  /**
   * onMove is the callback that will be called on every mouse move.
   * onMoveEnd is called on mouse up when movement has ended.
   */
  function DOMMouseMoveTracker(
onMove,
    /*function*/ onMoveEnd,
    /*DOMElement*/ domNode) {
    this.$DOMMouseMoveTracker_isDragging = false;
    this.$DOMMouseMoveTracker_animationFrameID = null;
    this.$DOMMouseMoveTracker_domNode = domNode;
    this.$DOMMouseMoveTracker_onMove = onMove;
    this.$DOMMouseMoveTracker_onMoveEnd = onMoveEnd;
    this.$DOMMouseMoveTracker_onMouseMove = this.$DOMMouseMoveTracker_onMouseMove.bind(this);
    this.$DOMMouseMoveTracker_onMouseUp = this.$DOMMouseMoveTracker_onMouseUp.bind(this);
    this.$DOMMouseMoveTracker_didMouseMove = this.$DOMMouseMoveTracker_didMouseMove.bind(this);
  }

  /**
   * This is to set up the listeners for listening to mouse move
   * and mouse up signaling the movement has ended. Please note that these
   * listeners are added at the document.body level. It takes in an event
   * in order to grab inital state.
   */
  DOMMouseMoveTracker.prototype.captureMouseMoves=function(event) {
    if (!this.$DOMMouseMoveTracker_eventMoveToken && !this.$DOMMouseMoveTracker_eventUpToken) {
      this.$DOMMouseMoveTracker_eventMoveToken = EventListener.listen(
        this.$DOMMouseMoveTracker_domNode,
        'mousemove',
        this.$DOMMouseMoveTracker_onMouseMove
      );
      this.$DOMMouseMoveTracker_eventUpToken = EventListener.listen(
        this.$DOMMouseMoveTracker_domNode,
        'mouseup',
        this.$DOMMouseMoveTracker_onMouseUp
      );
    }

    if (!this.$DOMMouseMoveTracker_isDragging) {
      this.$DOMMouseMoveTracker_deltaX = 0;
      this.$DOMMouseMoveTracker_deltaY = 0;
      this.$DOMMouseMoveTracker_isDragging = true;
      this.$DOMMouseMoveTracker_x = event.clientX;
      this.$DOMMouseMoveTracker_y = event.clientY;
    }
    event.preventDefault();
  };

  /**
   * These releases all of the listeners on document.body.
   */
  DOMMouseMoveTracker.prototype.releaseMouseMoves=function() {
    if (this.$DOMMouseMoveTracker_eventMoveToken && this.$DOMMouseMoveTracker_eventUpToken) {
      this.$DOMMouseMoveTracker_eventMoveToken.remove();
      this.$DOMMouseMoveTracker_eventMoveToken = null;
      this.$DOMMouseMoveTracker_eventUpToken.remove();
      this.$DOMMouseMoveTracker_eventUpToken = null;
    }

    if (this.$DOMMouseMoveTracker_animationFrameID !== null) {
      cancelAnimationFramePolyfill(this.$DOMMouseMoveTracker_animationFrameID);
      this.$DOMMouseMoveTracker_animationFrameID = null;
    }

    if (this.$DOMMouseMoveTracker_isDragging) {
      this.$DOMMouseMoveTracker_isDragging = false;
      this.$DOMMouseMoveTracker_x = null;
      this.$DOMMouseMoveTracker_y = null;
    }
  };

  /**
   * Returns whether or not if the mouse movement is being tracked.
   */
  DOMMouseMoveTracker.prototype.isDragging=function() {
    return this.$DOMMouseMoveTracker_isDragging;
  };

  /**
   * Calls onMove passed into constructor and updates internal state.
   */
  DOMMouseMoveTracker.prototype.$DOMMouseMoveTracker_onMouseMove=function(event) {
    var x = event.clientX;
    var y = event.clientY;

    this.$DOMMouseMoveTracker_deltaX += (x - this.$DOMMouseMoveTracker_x);
    this.$DOMMouseMoveTracker_deltaY += (y - this.$DOMMouseMoveTracker_y);

    if (this.$DOMMouseMoveTracker_animationFrameID === null) {
      // The mouse may move faster then the animation frame does.
      // Use `requestAnimationFramePolyfill` to avoid over-updating.
      this.$DOMMouseMoveTracker_animationFrameID =
        requestAnimationFramePolyfill(this.$DOMMouseMoveTracker_didMouseMove);
    }

    this.$DOMMouseMoveTracker_x = x;
    this.$DOMMouseMoveTracker_y = y;
    event.preventDefault();
  };

  DOMMouseMoveTracker.prototype.$DOMMouseMoveTracker_didMouseMove=function() {
    this.$DOMMouseMoveTracker_animationFrameID = null;
    this.$DOMMouseMoveTracker_onMove(this.$DOMMouseMoveTracker_deltaX, this.$DOMMouseMoveTracker_deltaY);
    this.$DOMMouseMoveTracker_deltaX = 0;
    this.$DOMMouseMoveTracker_deltaY = 0;
  };

  /**
   * Calls onMoveEnd passed into constructor and updates internal state.
   */
  DOMMouseMoveTracker.prototype.$DOMMouseMoveTracker_onMouseUp=function() {
    if (this.$DOMMouseMoveTracker_animationFrameID) {
      this.$DOMMouseMoveTracker_didMouseMove();
    }
    this.$DOMMouseMoveTracker_onMoveEnd();
  };


module.exports = DOMMouseMoveTracker;
