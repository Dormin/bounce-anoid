define(['./brick', './effect', './force', './graphics', './shadow'
, './utilities', 'exports'], function (brick, effect, force, graphics, shadow
, utilities, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var floor  = Math.floor
    , max    = Math.max
    , min    = Math.min
    , random = Math.random
    , sin    = Math.sin

  var forRange = utilities.forRange
    , integer  = utilities.integer
    , repeat   = utilities.repeat

  //
  // Constants
  //

  var NUM_CELLS_X = 8
    , NUM_CELLS_Y = 6
    , CELL_SIZE   = 24

  var FORCE_ANIM_DIST  = 2
    , FORCE_ANIM_SPEED = 0.1

  //
  // Variables
  //

  var frame = 0

  var grid =
      [ [ { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 } ]
      , [ { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 } ]
      , [ { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 } ]
      , [ { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 } ]
      , [ { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 } ]
      , [ { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 } ] ]

  //
  // Utility functions
  //

  function forEachCell(iterator) {

    repeat(NUM_CELLS_Y, function (j) {

      repeat(NUM_CELLS_X, function (i) {

        iterator(grid[j][i], i * CELL_SIZE, j * CELL_SIZE)
      })
    })
  }

  function forEachCellIn(left, right, top, bottom, iterator) {

    left   = max(floor((left) / CELL_SIZE), 0)
    right  = min(floor((right) / CELL_SIZE), NUM_CELLS_X - 1)
    top    = max(floor((top) / CELL_SIZE), 0)
    bottom = min(floor((bottom) / CELL_SIZE), NUM_CELLS_Y - 1)

    forRange(top, bottom, function (j) {

      forRange(left, right, function (i) {

        iterator(grid[j][i], i * CELL_SIZE, j * CELL_SIZE)
      })
    })
  }

  //
  // Logic
  //

  function reset() {

    forEachCell(function (cell) {

      cell.brick = 'none'
      cell.force = 'none'
      cell.fx    = 'none'
      cell.frame = 0
    })
  }
  exports.reset = reset

  var brickTypes = ['solid-0', 'solid-1', 'solid-2', 'solid-3', 'solid-4'
  , 'fallthrough', 'bounce', 'color-1', 'color-2', 'color-3', 'color-4'
  , 'color-5', 'glass']

  function randomize() {

    forEachCell(function (cell) {

      if (random() > 1/4) {

        cell.brick = 'none'
        
      } else {

        cell.brick = brickTypes[integer(random() * brickTypes.length)]
      }

      if (random() > 1/8) {

        cell.force = 'none'

      } else {

        if (random() > 1/2) {

          cell.force = 'left'

        } else {

          cell.force = 'right'
        }
      }

      cell.fx    = 'none'
      cell.frame = 0
    })
  }
  exports.randomize = randomize

  function tick() {

    forEachCell(function (cell) {

      effect.tick(cell)
    })

    frame++
  }
  exports.tick = tick

  function ballBrickInteraction(ball) {

    var p         = ball.position
      , r         = ball.RADIUS
      , left      = p.x - r
      , right     = p.x + r
      , top       = p.y - r
      , bottom    = p.y + r
      , collision = { d: -1 }
      , result    = {}

    forEachCellIn(left, right, top, bottom, function(cell, x, y) {

      if (brick.collision(cell.brick, x, y, CELL_SIZE, ball, result)) {

        if (result.d > collision.d) {

          collision.d    = result.d
          collision.nx   = result.nx
          collision.ny   = result.ny
          collision.cell = cell
        }
      }
    })

    if (collision.d >= 0) {

      brick.handleCollision(collision.cell.brick, ball, collision)
    }
  }

  function ballForceInteraction(ball) {

    var x = integer(ball.position.x / CELL_SIZE)
      , y = integer(ball.position.y / CELL_SIZE)

    if (x >= 0 && x < NUM_CELLS_X && y >= 0 && y < NUM_CELLS_Y) {

      ball.applyForce(force.magnitude(grid[y][x].force), 0)
    }
  }

  function ballInteraction(ball) {

    ballBrickInteraction(ball)
    ballForceInteraction(ball)
  }
  exports.ballInteraction = ballInteraction

  //
  // Visuals
  //

  function drawBricks() {

    forEachCell(function (cell, x, y) {

      brick.draw(cell.brick, x, y)
    })
  }
  exports.drawBricks = drawBricks

  function drawShadows() {

    forEachCell(function (cell, x, y) {

      brick.drawShadow(cell.brick, x, y)
    })
  }
  exports.drawShadows = drawShadows

  function drawForceFields() {

    var offset = floor(sin(frame * FORCE_ANIM_SPEED) * FORCE_ANIM_DIST)

    graphics.setAlpha(0.5)

    forEachCell(function (cell, x, y) {

      force.draw(cell.force, x, y, offset)
    })

    graphics.setAlpha(1)
  }
  exports.drawForceFields = drawForceFields

  function drawEffects() {

    forEachCell(function (cell, x, y) {

      effect.draw(cell.effect, cell.frame, x, y, CELL_SIZE)
    })
  }
  exports.drawEffects = drawEffects

// ----------------------------------------------------------------------------
})