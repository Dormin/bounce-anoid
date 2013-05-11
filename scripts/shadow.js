define(['./graphics', 'exports'], function (graphics, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var shadowOffset = { x: 2, y: 2 }

  function draw(image, align, x, y) {

    graphics.draw(
      image
    , align
    , x + shadowOffset.x
    , y + shadowOffset.y
    )
  }
  exports.draw = draw

// ----------------------------------------------------------------------------
})