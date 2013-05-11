define(['./graphics', 'exports'], function (graphics, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  //
  // Constants
  //

  var FORCE_MAGNITUDE = 0.001

  //
  // Logic
  //

  function magnitude(type) {

    switch (type) {
      case 'left'  : return -FORCE_MAGNITUDE
      case 'right' : return FORCE_MAGNITUDE
      default      : return 0
    }
  }
  exports.magnitude = magnitude

  //
  // Visuals
  //

  function draw(type, x, y, offset) {

    switch (type) {
      case 'left':
        x = x - offset
        graphics.draw('force-left', 'top-left', x, y)
        break
      case 'right':
        x = x + offset
        graphics.draw('force-right', 'top-left', x, y)
        break
    }
  }
  exports.draw = draw

// ----------------------------------------------------------------------------
})