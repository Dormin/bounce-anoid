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
    'empty': ''
  , 'solid': 'brick-solid'
  }

  var brickShadow = {
    'empty': ''
  , 'solid': 'shadow-brick'
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

    var bd = gameplayData.ball
      , gd = gameplayData.grid
      , pd = gameplayData.pad

    graphics.draw('background')

    drawPadArea(pd)

    drawBallShadow(bd)
    drawPadShadow(pd)
    drawBrickShadows(gd)

    drawBall(bd)
    drawPad(pd)
    drawBricks(gd)
  }
  exports.gameplay = drawGameplay

// ----------------------------------------------------------------------------
})