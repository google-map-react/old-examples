/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactWheelHandler
 * @typechecks
 */

"use strict";

var normalizeWheel = require('./normalizeWheel');
var requestAnimationFramePolyfill = require('./requestAnimationFramePolyfill');


  /**
   * onWheel is the callback that will be called with right frame rate if
   * any wheel events happened
   * onWheel should is to be called with two arguments: deltaX and deltaY in
   * this order
   */
  function ReactWheelHandler(
onWheel,
    /*boolean*/ handleScrollX,
    /*boolean*/ handleScrollY,
    /*?boolean*/ stopPropagation)
   {
    this.$ReactWheelHandler_animationFrameID = null;
    this.$ReactWheelHandler_deltaX = 0;
    this.$ReactWheelHandler_deltaY = 0;
    this.$ReactWheelHandler_didWheel = this.$ReactWheelHandler_didWheel.bind(this);
    this.$ReactWheelHandler_handleScrollX = handleScrollX;
    this.$ReactWheelHandler_handleScrollY = handleScrollY;
    this.$ReactWheelHandler_stopPropagation = !!stopPropagation;
    this.$ReactWheelHandler_onWheelCallback = onWheel;
    this.onWheel = this.onWheel.bind(this);
  }

  ReactWheelHandler.prototype.onWheel=function(event) {
    if (this.$ReactWheelHandler_handleScrollX || this.$ReactWheelHandler_handleScrollY) {
      event.preventDefault();
    }
    var normalizedEvent = normalizeWheel(event);

    this.$ReactWheelHandler_deltaX += this.$ReactWheelHandler_handleScrollX ? normalizedEvent.pixelX : 0;
    this.$ReactWheelHandler_deltaY += this.$ReactWheelHandler_handleScrollY ? normalizedEvent.pixelY : 0;

    var changed;
    if (this.$ReactWheelHandler_deltaX !== 0 || this.$ReactWheelHandler_deltaY !== 0) {
      if (this.$ReactWheelHandler_stopPropagation) {
        event.stopPropagation();
      }
      changed = true;
    }

    if (changed === true && this.$ReactWheelHandler_animationFrameID === null) {
      this.$ReactWheelHandler_animationFrameID = requestAnimationFramePolyfill(this.$ReactWheelHandler_didWheel);
    }
  };

  ReactWheelHandler.prototype.$ReactWheelHandler_didWheel=function() {
    this.$ReactWheelHandler_animationFrameID = null;
    this.$ReactWheelHandler_onWheelCallback(this.$ReactWheelHandler_deltaX, this.$ReactWheelHandler_deltaY);
    this.$ReactWheelHandler_deltaX = 0;
    this.$ReactWheelHandler_deltaY = 0;
  };


module.exports = ReactWheelHandler;
