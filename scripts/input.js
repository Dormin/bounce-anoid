define(['exports'], function (exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var input = { x: 0, y: 0 }

  function setup(canvas) {

    window.onmousemove = function (event) {

      var rect
      
      event = event || window.event

      rect = canvas.getBoundingClientRect()

      input.x = event.clientX - rect.left
      input.y = event.clientY - rect.top
    }
  }
  exports.setup = setup

  function read() {

    return input
  }
  exports.read = read

// ----------------------------------------------------------------------------
})