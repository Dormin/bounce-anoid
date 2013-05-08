define(['./ball', './brick', './edge', './effect', './grid', './pad'
, './utilities', 'exports'], function (ball, brick, edge, effect, grid, pad
, utilities, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var clamp    = utilities.clamp
    , forEach  = utilities.forEach
    , integer  = utilities.integer
    , repeat   = utilities.repeat

  var stepsPerTick = 5

  //
  // Ball pad interaction
  //

  function handleBallPadInteraction(ballData, padData) {

    var v      = ballData.velocity
      , f      = padData.force
      , result = {}

    // Does the ball and the pad overlap?
    if (pad.collision(padData, ballData, result)) {

      ball.pushOut(ballData, result)

      // Bounce ball off pad
      v.x -= f.x
      v.y -= f.y

      ball.bounce(ballData, result, padData.elasticity, padData.friction)

      v.x += f.x
      v.y += f.y
    }
  }

  //
  // Ball edges interaction
  //

  function handleBallEdgeInteraction(ballData, edgeData) {

    var result = {}

    // Does the ball and the wall overlap?
    if (edge.collision(edgeData, ballData, result)) {

      ball.pushOut(ballData, result)
      ball.bounce(ballData, result, edgeData.elasticity, edgeData.friction)
    }
  }

  function handleBallEdgesInteraction(ballData, edgeList) {

    forEach(edgeList, function (edgeData) {

      handleBallEdgeInteraction(ballData, edgeData)
    })
  }

  //
  // Ball bricks interaction
  //

  function handleBallBrickCollision(ballData, collisionData, frame) {

    var type

    if (collisionData.d >= 0) {

      type = collisionData.cell.brick

      brick.onCollision[type](ballData, collisionData, frame)

      ball.pushOut(ballData, collisionData)

      ball.bounce(
        ballData
      , collisionData
      , brick.elasticity[type] || brick.elasticity['default']
      , brick.friction[type] || brick.friction['default']
      )
    }
  }

  function handleBallBricksInteraction(ballData, gridData, frame) {

    var p             = ballData.position
      , r             = ballData.radius
      , size          = gridData.cellSize
      , left          = p.x - r
      , right         = p.x + r
      , top           = p.y - r
      , bottom        = p.y + r
      , collisionData = { d: -1 }
      , result        = {}

    grid.forEachCellIn(gridData, left, right, top, bottom
        , function(cell, x, y) {

      if (brick.collision[cell.brick](ballData, x, y, size, result)) {

        if (result.d > collisionData.d) {

          collisionData.d    = result.d
          collisionData.nx   = result.nx
          collisionData.ny   = result.ny
          collisionData.cell = cell
        }
      }
    })

    handleBallBrickCollision(ballData, collisionData, frame)
  }

  //
  // Ball force interaction
  //

  function handleBallForceInteraction(ballData, gridData) {

    var x = integer(ballData.position.x / gridData.cellSize)
      , y = integer(ballData.position.y / gridData.cellSize)

    if (x >= 0 && x < gridData.nCells.x && y >= 0 && y < gridData.nCells.y) {

      switch (gridData.cells[y][x].force) {
        case 'left':
          ballData.velocity.x -= gridData.forceMagnitude
          break
        case 'right':
          ballData.velocity.x += gridData.forceMagnitude
          break
      }
    }
  }

  //
  // Gameplay
  //

  function reset(data) {

    data.frame = 0

    ball.reset(data.ball)
    pad.reset(data.pad)

    grid.randomize(data.grid)
  }
  exports.reset = reset

  function step(data, frame) {

    ball.step(data.ball)
    pad.step(data.pad)

    handleBallPadInteraction(data.ball, data.pad)
    handleBallEdgesInteraction(data.ball, data.edges)
    handleBallBricksInteraction(data.ball, data.grid, frame)
    handleBallForceInteraction(data.ball, data.grid)
  }

  function tick(data, input) {

    var frame = data.frame

    pad.handleInput(data.pad, stepsPerTick, input)

    grid.forEachCell(data.grid, function(cell) {

      effect.tick(cell, frame)
    })

    repeat(stepsPerTick, function () {

      step(data, frame)
    })

    data.frame = frame + 1
  }
  exports.tick = tick

// ----------------------------------------------------------------------------
})