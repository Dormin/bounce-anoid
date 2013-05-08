define(['./effect', './graphics', './grid', 'exports'], function (effect
, graphics, grid, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var cos = Math.cos
    , sin = Math.sin

  var dotAlpha     = 0.25
    , forceAlpha   = 0.5
    , lineAlpha    = 0.25
    , padAreaAlpha = 0.15
    , shadowAlpha  = 0.25
    , shadowOffset = { x: 2, y: 2 }

  function drawShadow(image, align, x, y) {

    graphics.draw(
      image
    , align
    , x + shadowOffset.x
    , y + shadowOffset.y
    , shadowAlpha
    )
  }

  function drawBall(data) {

    var r = data.radius
      , x = data.position.x
      , y = data.position.y
      , a = data.position.a

    graphics.draw('ball', 'center', x, y)

    x += cos(a) * r / 2
    y += sin(a) * r / 2
    graphics.draw('dot', 'center', x, y, dotAlpha)
  }

  function drawBallShadow(data) {

    var p = data.position

    drawShadow('shadow-ball', 'center', p.x, p.y)
  }

  function drawPad(data) {

    var p = data.position

    graphics.draw('pad', 'center', p.x, p.y)
  }

  function drawPadShadow(data) {

    var p = data.position

    drawShadow('shadow-pad', 'center', p.x, p.y)
  }

  function drawPadArea(data) {

    var x = data.boundary.left
      , y = data.boundary.top - data.radius

    graphics.draw('pad-area', 'top-left', x, y, padAreaAlpha)
    graphics.draw('line', 'top-left', x, y, lineAlpha)
  }

  function drawForceFields(data, frame) {

    var offset = sin(frame / 8) * 2

    grid.forEachCell(data, function (cell, x, y) {

      if (cell.force !== 'none') {

        if (cell.force === 'left') {

          x = x - offset
          graphics.draw('force-left', 'top-left', x, y, forceAlpha)

        } else {

          x = x + offset
          graphics.draw('force-right', 'top-left', x, y, forceAlpha)
        }
      }
    })
  }

  var brickImage = {
    'none'        : ''
  , 'solid-0'     : 'brick-solid-0'
  , 'solid-1'     : 'brick-solid-1'
  , 'solid-2'     : 'brick-solid-2'
  , 'solid-3'     : 'brick-solid-3'
  , 'solid-4'     : 'brick-solid-4'
  , 'fallthrough' : 'brick-fallthrough'
  , 'bounce'      : 'brick-bounce'
  , 'color-1'     : 'brick-color-1'
  , 'color-2'     : 'brick-color-2'
  , 'color-3'     : 'brick-color-3'
  , 'color-4'     : 'brick-color-4'
  , 'color-5'     : 'brick-color-5'
  , 'glass'       : 'brick-glass'
  }

  var brickShadow = {
    'none'        : ''
  , 'solid-0'     : 'shadow-brick-0'
  , 'solid-1'     : 'shadow-brick-1'
  , 'solid-2'     : 'shadow-brick-2'
  , 'solid-3'     : 'shadow-brick-3'
  , 'solid-4'     : 'shadow-brick-4'
  , 'fallthrough' : 'shadow-fallthrough'
  , 'bounce'      : 'shadow-bounce'
  , 'color-1'     : 'shadow-brick-0'
  , 'color-2'     : 'shadow-brick-0'
  , 'color-3'     : 'shadow-brick-0'
  , 'color-4'     : 'shadow-brick-0'
  , 'color-5'     : 'shadow-brick-0'
  , 'glass'       : 'shadow-brick-0'
  }

  function drawBricks(data) {

    grid.forEachCell(data, function (cell, x, y) {

      graphics.draw(brickImage[cell.brick], 'top-left', x, y)
    })
  }

  function drawBrickShadows(data) {

    grid.forEachCell(data, function (cell, x, y) {

      drawShadow(brickShadow[cell.brick], 'top-left', x, y)
    })
  }

  function drawNothing() {

    // Do nothing...
  }

  function drawBounce(x, y, size, frame) {

    if (frame < effect.lifespan['bounce'] / 2) {

      graphics.draw('effect-bounce-0', 'top-left', x - 2, y - 2)

    } else {

      graphics.draw('effect-bounce-1', 'top-left', x - 1, y - 1)
    }
  }

  function drawFlicker(x, y, size, frame) {

    var alpha

    if (frame % 4 === 0) {

      alpha = 0.5 - frame / effect.lifespan['flicker'] * 0.5

      y = y - frame / 5 + frame * frame / 40

      graphics.draw('effect-flicker', 'top-left', x, y, alpha)
    }
  }

  function drawScatter(x, y, size, frame) {

    var alpha, gx, gy

    if (frame % 4 === 0) {

      alpha = 0.5 - frame / effect.lifespan['scatter'] * 0.5

      gy = y - frame / 3 + frame * frame / 40
      gx = x - frame / 8
      graphics.draw('effect-scatter', 'top-left', gx, gy, alpha)

      gx = x + frame / 8 + size / 2
      graphics.draw('effect-scatter', 'top-left', gx, gy, alpha)

      gy = y + frame * frame / 40 + size / 2
      gx = x - frame / 6
      graphics.draw('effect-scatter', 'top-left', gx, gy, alpha)

      gx = x + frame / 6 + size / 2
      graphics.draw('effect-scatter', 'top-left', gx, gy, alpha)
    }
  }

  var drawEffect = {
    'none'    : drawNothing
  , 'bounce'  : drawBounce
  , 'flicker' : drawFlicker
  , 'scatter' : drawScatter
  }

  function drawEffects(data, frame) {

    grid.forEachCell(data, function (cell, x, y) {

      drawEffect[cell.effect](x, y, data.cellSize, frame - cell.frame)
    })
  }

  function drawGameplay(data) {

    graphics.draw('background')

    drawPadArea(data.pad)

    drawBallShadow(data.ball)
    drawPadShadow(data.pad)
    drawBrickShadows(data.grid)

    drawForceFields(data.grid, data.frame)

    drawBall(data.ball)
    drawPad(data.pad)
    drawBricks(data.grid)

    drawEffects(data.grid, data.frame)
  }
  exports.gameplay = drawGameplay

// ----------------------------------------------------------------------------
})