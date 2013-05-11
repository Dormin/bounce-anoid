define(['./graphics', 'exports'], function (graphics, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var BOUNCE_DURATION  = 4
    , GRAVITY          = 0.05
    , FLICKER_DURATION = 20
    , FLICKER_SPACING  = 4
    , FLICKER_ALPHA    = 0.5
    , FLICKER_V0_Y     = 0.5
    , SCATTER_DURATION = 30
    , SCATTER_ALPHA    = 0.5
    , SCATTER_V0_X     = 0.2
    , SCATTER_V0_Y     = 1.0


  //
  // Logic
  //

  var duration = {
    'bounce'  : BOUNCE_DURATION
  , 'flicker' : FLICKER_DURATION
  , 'scatter' : SCATTER_DURATION
  }

  function tick(cell) {

    if (cell.effect !== 'none') {

      if (cell.frame >= duration[cell.effect]) {

        cell.effect = 'none'
      }

      cell.frame++
    }
  }
  exports.tick = tick

  //
  // Visuals
  //

  function drawNothing() {

    // Do nothing...
  }

  function drawBounce(frame, x, y) {

    if (frame < BOUNCE_DURATION / 2) {

      graphics.draw('effect-bounce-0', 'top-left', x - 2, y - 2)

    } else {

      graphics.draw('effect-bounce-1', 'top-left', x - 1, y - 1)
    }
  }

  function drawFlicker(frame, x, y) {

    var alpha

    if (frame % FLICKER_SPACING === 0) {

      alpha = (1 - frame / FLICKER_DURATION) * FLICKER_ALPHA

      y = y - frame * FLICKER_V0_Y + frame * frame * GRAVITY

      graphics.setAlpha(alpha)
      graphics.draw('effect-flicker', 'top-left', x, y)
      graphics.setAlpha(1)
    }
  }

  function drawScatter(frame, x, y, size) {

    var alpha, gx, gy

    if (frame % FLICKER_SPACING === 0) {

      alpha = (1 - frame / SCATTER_DURATION) * SCATTER_ALPHA
      graphics.setAlpha(alpha)

      gy = y - frame * SCATTER_V0_Y + frame * frame * GRAVITY
      gx = x - frame * SCATTER_V0_X
      graphics.draw('effect-scatter', 'top-left', gx, gy)

      gx = x + frame * SCATTER_V0_X + size / 2
      graphics.draw('effect-scatter', 'top-left', gx, gy)

      gy = y - frame * SCATTER_V0_Y / 2 + frame * frame * GRAVITY + size / 2
      gx = x - frame * SCATTER_V0_X
      graphics.draw('effect-scatter', 'top-left', gx, gy)

      gx = x + frame * SCATTER_V0_X + size / 2
      graphics.draw('effect-scatter', 'top-left', gx, gy)

      graphics.setAlpha(1)
    }
  }

  var drawEffect = {
    'none'    : drawNothing
  , 'bounce'  : drawBounce
  , 'flicker' : drawFlicker
  , 'scatter' : drawScatter
  }

  function draw(type, frame, x, y, size) {

    drawEffect[type](frame, x, y, size)
  }
  exports.draw = draw

// ----------------------------------------------------------------------------
})