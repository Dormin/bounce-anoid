define(['./graphics', './utilities', 'exports'], function (graphics, utilities
, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var clamp  = utilities.clamp
    , repeat = utilities.repeat

  //
  // Constants
  //

  var DURATION    = 60
    , NUM_CELLS_X = 6
    , NUM_CELLS_Y = 8
    , CELL_SIZE   = 32

  //
  // Variables
  //

  var frame = 0

  //
  // Logic
  //

  function init() {

    frame = 0
  }
  exports.init = init

  function tick() {

    frame++
  }
  exports.tick = tick

  function complete() {

    return frame >= DURATION
  }
  exports.complete = complete

  //
  // Visuals
  //

  function drawTransitionCell(x, y, ratio) {

    var offset = CELL_SIZE * ratio / 2
      , size   = CELL_SIZE * (1 - ratio)

    graphics.drawRectangle('black', x + offset, y + offset, size, size)
  }

  function draw() {

    repeat(NUM_CELLS_Y, function (y) {

      repeat(NUM_CELLS_X, function (x) {

        var offset = (x + y) / (NUM_CELLS_X + NUM_CELLS_Y) * DURATION / 2
          , ratio  = clamp((frame - offset) / DURATION * 2, 0, 1)

        drawTransitionCell(x * CELL_SIZE, y * CELL_SIZE, ratio)
      })
    })
  }
  exports.draw = draw

// ----------------------------------------------------------------------------
})