define(['exports'], function (exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var state = {
    x: 0
  , y: 0
  , pressed: false
  }
  exports.state = state

  function setup(canvas) {

    window.onmousemove = function (event) {

      var rect
      
      event = event || window.event

      rect = canvas.getBoundingClientRect()

      state.x = event.clientX - rect.left
      state.y = event.clientY - rect.top
    }

    window.onmousedown = function () {

      state.pressed = true
    }

    window.onmouseup = function () {

      state.pressed = false
    }
  }
  exports.setup = setup

// ----------------------------------------------------------------------------
})