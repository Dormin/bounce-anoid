define(['./effect', './graphics', './grid', 'exports'], function (effect
, graphics, grid, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var cos = Math.cos
    , sin = Math.sin

  var dotAlpha     = 0.25
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

  var brickImage = {
    'none'        : ''
  , 'solid-0'     : 'brick-solid-0'
  , 'solid-1'     : 'brick-solid-1'
  , 'solid-2'     : 'brick-solid-2'
  , 'solid-3'     : 'brick-solid-3'
  , 'solid-4'     : 'brick-solid-4'
  , 'fallthrough' : 'brick-fallthrough'
  , 'color-1'     : 'brick-color-1'
  , 'color-2'     : 'brick-color-2'
  , 'color-3'     : 'brick-color-3'
  , 'color-4'     : 'brick-color-4'
  , 'color-5'     : 'brick-color-5'
  }

  var brickShadow = {
    'none'        : ''
  , 'solid-0'     : 'shadow-brick-0'
  , 'solid-1'     : 'shadow-brick-1'
  , 'solid-2'     : 'shadow-brick-2'
  , 'solid-3'     : 'shadow-brick-3'
  , 'solid-4'     : 'shadow-brick-4'
  , 'fallthrough' : 'shadow-fallthrough'
  , 'color-1'     : 'shadow-brick-0'
  , 'color-2'     : 'shadow-brick-0'
  , 'color-3'     : 'shadow-brick-0'
  , 'color-4'     : 'shadow-brick-0'
  , 'color-5'     : 'shadow-brick-0'
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

  function drawFlicker(x, y, frame) {

    var a
      , life = effect.lifespan['flicker']

    if (frame % 4 === 0) {

      a = 0.5 - frame / life * 0.5

      y = y - frame / 5 + frame * frame / 40

      graphics.draw('effect-flicker', 'top-left', x, y, a)
    }
  }

  var drawEffect = {
    'none'    : drawNothing
  , 'flicker' : drawFlicker
  }

  function drawEffects(data, frame) {

    grid.forEachCell(data, function (cell, x, y) {

      drawEffect[cell.effect](x, y, frame - cell.frame)
    })
  }

  function drawGameplay(data) {

    graphics.draw('background')

    drawPadArea(data.pad)

    drawBallShadow(data.ball)
    drawPadShadow(data.pad)
    drawBrickShadows(data.grid)

    drawBall(data.ball)
    drawPad(data.pad)
    drawBricks(data.grid)

    drawEffects(data.grid, data.frame)
  }
  exports.gameplay = drawGameplay

// ----------------------------------------------------------------------------
})