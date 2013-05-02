define(['exports'], function (exports) {
// ----------------------------------------------------------------------------

  "use strict"

  //
  // Various utility functions
  //

  //
  // Clamp a number to the given range
  //
  function clamp(n, min, max) {

    return Math.min(Math.max(n, min), max)
  }
  exports.clamp = clamp

  //
  // Returns the number of own properties on an object
  //
  function countOwn(object) {

    var n = 0
      , property

    for (property in object) {

      if (object.hasOwnProperty(property)) { n++ }
    }

    return n
  }
  exports.countOwn = countOwn

  //
  // Triggers the callback function each frame
  //
  function eachFrame(callback) {

    var requestFrame = window.requestAnimationFrame
                    || window.webkitRequestAnimationFrame
                    || window.mozRequestAnimationFrame
                    || window.oRequestAnimationFrame
                    || window.msRequestAnimationFrame
                    || function (callback) { setTimeout(callback, 1000/60) }

    function onFrame() {

      requestFrame(onFrame)
      callback()
    }

    requestFrame(onFrame)
  }
  exports.eachFrame = eachFrame

  //
  // Calls the iterator function for each element in an array
  //
  function forEach(array, iterator) {

    var i
      , n = array.length

    for (i = 0; i < n; i++) {

      iterator(array[i])
    }
  }
  exports.forEach = forEach

  //
  // Calls the iterator function for each own property on an object
  //
  function forOwn(object, iterator) {

    var property

    for (property in object) {

      if (object.hasOwnProperty(property)) {

        iterator(property, object[property])
      }
    }
  }
  exports.forOwn = forOwn

  //
  // Calls the iterator function for each integer in the range [start, end]
  //
  function forRange(start, end, iterator) {

    var i

    for (i = start; i <= end; i++) {

      iterator(i)
    }
  }
  exports.forRange = forRange

  //
  // Returns the integer part of a number
  //
  function integer(n) {

    return (n < 0)? Math.ceil(n) : Math.floor(n)
  }
  exports.integer = integer

  //
  // Calls the iterator function n times
  //
  function repeat(n, iterator) {

    var i

    for (i = 0; i < n; i++) {

      iterator(i)
    }
  }
  exports.repeat = repeat

// ----------------------------------------------------------------------------
})