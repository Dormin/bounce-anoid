define(['./graphics', './utilities', 'exports'], function (graphics, utilities
, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var cos = Math.cos
    , sin = Math.sin

  var repeat = utilities.repeat

  var dotAlpha     = 0.25
    , lineAlpha    = 0.25
    , padAreaAlpha = 0.15
    , shadowAlpha  = 0.25
    , shadowOffset = { x: 2, y: 2 }

  function drawBall(ballData) {

    var r = ballData.radius
      , x = ballData.position.x
      , y = ballData.position.y
      , a = ballData.position.a

    graphics.draw('ball', 'center', x, y)

    x += cos(a) * r / 2
    y += sin(a) * r / 2
    graphics.draw('dot', 'center', x, y, dotAlpha)
  }

  function drawBallShadow(ballData) {

    graphics.draw(
      'shadow-ball'
    , 'center'
    , ballData.position.x + shadowOffset.x
    , ballData.position.y + shadowOffset.y
    , shadowAlpha
    )
  }

  function drawPad(padData) {

    graphics.draw('pad', 'center', padData.position.x, padData.position.y)
  }

  function drawPadShadow(padData) {

    graphics.draw(
      'shadow-pad'
    , 'center'
    , padData.position.x + shadowOffset.x
    , padData.position.y + shadowOffset.y
    , shadowAlpha
    )
  }

  function drawPadArea(padData) {

    var x = padData.boundary.left
      , y = padData.boundary.top - padData.radius

    graphics.draw('pad-area', 'top-left', x, y, padAreaAlpha)
    graphics.draw('line', 'top-left', x, y, lineAlpha)
  }

  var brickImage = {
    'empty'       : ''
  , 'solid-0'     : 'brick-solid-0'
  , 'solid-1'     : 'brick-solid-1'
  , 'solid-2'     : 'brick-solid-2'
  , 'solid-3'     : 'brick-solid-3'
  , 'solid-4'     : 'brick-solid-4'
  , 'fallthrough' : 'brick-fallthrough'
  }

  var brickShadow = {
    'empty'       : ''
  , 'solid-0'     : 'shadow-brick-0'
  , 'solid-1'     : 'shadow-brick-1'
  , 'solid-2'     : 'shadow-brick-2'
  , 'solid-3'     : 'shadow-brick-3'
  , 'solid-4'     : 'shadow-brick-4'
  , 'fallthrough' : 'shadow-fallthrough'
  }

  function forEachCell(gridData, iterator) {

    repeat(gridData.nCells.y, function (y) {

      repeat(gridData.nCells.x, function (x) {

        iterator(x, y)
      })
    })
  }

  function drawBricks(gridData) {

    var brickGrid = gridData.brick
      , size      = gridData.cellSize

    forEachCell(gridData, function (x, y) {

      var type = brickGrid[y][x].type

      graphics.draw(brickImage[type], 'top-left', x * size, y * size)
    })
  }

  function drawBrickShadows(gridData) {

    var brickGrid = gridData.brick
      , size      = gridData.cellSize

    forEachCell(gridData, function (x, y) {

      var type = brickGrid[y][x].type

      graphics.draw(
        brickShadow[type]
      , 'top-left'
      , x * size + shadowOffset.x
      , y * size + shadowOffset.y
      , shadowAlpha
      )
    })
  }

  function drawGameplay(gameplayData) {

    var ballData = gameplayData.ball
      , gridData = gameplayData.grid
      , padData  = gameplayData.pad

    graphics.draw('background')

    drawPadArea(padData)

    drawBallShadow(ballData)
    drawPadShadow(padData)
    drawBrickShadows(gridData)

    drawBall(ballData)
    drawPad(padData)
    drawBricks(gridData)
  }
  exports.gameplay = drawGameplay

// ----------------------------------------------------------------------------
})