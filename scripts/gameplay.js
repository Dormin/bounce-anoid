define(['./utilities', 'exports'], function (utilities, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var floor = Math.floor
    , max   = Math.max
    , min   = Math.min
    , sqrt  = Math.sqrt

  var clamp    = utilities.clamp
    , forEach  = utilities.forEach
    , forRange = utilities.forRange
    , repeat   = utilities.repeat

  var stepsPerTick = 5

  //
  // Physics
  //

  // v  - velocity to change
  // nx - surface normal x
  // ny - surface normal y
  // i  - inertia
  // r  - radius
  // e  - elasticity
  // u  - friction
  function bounce(v, nx, ny, i, r, e, u) {

    var vx = v.x * nx + v.y * ny  // Transformed velocity x
      , vy = v.x * -ny + v.y * nx // Transformed velocity y
      , ff = clamp((v.a * r - vy) / (1 + 1 / i / r), -u, u) // Frictional force

    // Do elastic collision
    vx = max(-vx * e, 0)

    // Linear velocity along surface
    vy -= ff

    // Angular velocity
    v.a -= ff * r / i

    // Transform velocity back to "regular space"
    v.x = vx * nx + vy * -ny
    v.y = vx * ny + vy * nx
  }

  //
  // Ball
  //

  function resetBall(ballData) {

    ballData.position.x = ballData.start.x
    ballData.position.y = ballData.start.y
    ballData.position.a = ballData.start.a

    ballData.velocity.x = 0
    ballData.velocity.y = 0
    ballData.velocity.a = 0
  }

  function stepBall(ballData) {

    var g = ballData.gravity
      , d = ballData.drag
      , p = ballData.position
      , v = ballData.velocity

    // Apply gravity
    v.y += g

    // Apply drag
    d = d * sqrt(v.x * v.x + v.y * v.y)
    v.x -= v.x * d
    v.y -= v.y * d

    // Move
    p.x += v.x
    p.y += v.y
    p.a += v.a
  }

  //
  // Pad
  //

  function resetPad(padData) {

    padData.position.x = padData.start.x
    padData.position.y = padData.start.y

    padData.velocity.x = 0
    padData.velocity.y = 0

    padData.force.x = 0
    padData.force.y = 0
  }

  function handlePadInput(padData, input) {

    var boundary = padData.boundary
      , response = padData.response
      , p        = padData.position
      , v        = padData.velocity
      , tx       = clamp(input.x, boundary.left, boundary.right)
      , ty       = clamp(input.y, boundary.top, boundary.bottom)

    v.x = (tx - p.x) * response / stepsPerTick
    v.y = (ty - p.y) * response / stepsPerTick
  }

  function stepPad(padData) {

    var feedback = padData.feedback
      , p        = padData.position
      , v        = padData.velocity
      , f        = padData.force

    f.x = (f.x * feedback + v.x) / (feedback + 1)
    f.y = (f.y * feedback + v.y) / (feedback + 1)

    p.x += v.x
    p.y += v.y
  }

  //
  // Ball pad interaction
  //

  function handleBallPadInteraction(ballData, padData) {

    var p  = ballData.position
      , v  = ballData.velocity
      , f  = padData.force
      , dx = p.x - padData.position.x
      , dy = p.y - padData.position.y
      , r  = ballData.radius + padData.radius
      , d  = sqrt(dx * dx + dy * dy)
      , nx = dx / d
      , ny = dy / d

    // Does the ball and the pad overlap?
    if (d <= r) {

      d = r - d // How much the objects overlap

      // Push ball out of pad
      p.x += nx * d
      p.y += ny * d

      // Bounce ball off pad
      v.x -= f.x
      v.y -= f.y

      bounce(
        v
      , nx
      , ny
      , ballData.inertia
      , ballData.radius
      , padData.elasticity
      , padData.friction
      )

      v.x += f.x
      v.y += f.y
    }
  }

  //
  // Ball walls interaction
  //

  function handleBallWallInteraction(ballData, wallData) {

    var p = ballData.position
      , n = wallData.halfspace.n
      , d = p.x * n.x + p.y * n.y - wallData.halfspace.d - ballData.radius

    // Does the ball and the wall overlap?
    if (d <= 0) {

      d = -d // How much the objects overlap

      // Push ball out of wall
      p.x += n.x * d
      p.y += n.y * d

      // Bounce ball off wall
      bounce(
        ballData.velocity
      , n.x
      , n.y
      , ballData.inertia
      , ballData.radius
      , wallData.elasticity
      , wallData.friction
      )
    }
  }

  function handleBallWallsInteraction(ballData, wallList) {

    // wd - wall data
    forEach(wallList, function (wallData) {

      handleBallWallInteraction(ballData, wallData)
    })
  }

  //
  // Ball bricks interaction
  //

  function doNothing() {

    // Do nothing...
  }

  function noCollision() {

    return false
  }

  function squareCollision(ballData, x, y, size, result) {

    var p  = ballData.position
      , r  = ballData.radius
      , dx = p.x - clamp(p.x, x, x + size)
      , dy = p.y - clamp(p.y, y, y + size)
      , d  = dx * dx + dy * dy

    if (d <= r * r) {

      d = sqrt(d)

      result.d  = r - d
      result.nx = dx / d
      result.ny = dy / d

      return true
    }

    return false
  }

  var brickCollision = {
    'empty': noCollision
  , 'solid': squareCollision
  }

  var brickOnCollision = {
    'solid': doNothing
  }

  var brickElasticity = {
    'solid': 0.75
  }

  var brickFriction = {
    'solid': 0.0001
  }

  function handleBallBrickCollision(ballData, collisionData) {

    var type

    if (collisionData.d >= 0) {

      type = collisionData.brick.type

      brickOnCollision[type](ballData, collisionData)

      // Push ball out of the brick
      ballData.position.x += collisionData.nx * collisionData.d
      ballData.position.y += collisionData.ny * collisionData.d

      // Bounce ball off the brick
      bounce(
        ballData.velocity
      , collisionData.nx
      , collisionData.ny
      , ballData.inertia
      , ballData.radius
      , brickElasticity[type]
      , brickFriction[type]
      )
    }
  }

  function handleBallBricksInteraction(ballData, gridData) {

    var p             = ballData.position
      , r             = ballData.radius
      , brickGrid     = gridData.brick // Brick grid
      , cellSize      = gridData.cellSize
      , left          = max(floor((p.x - r) / cellSize), 0)
      , right         = min(floor((p.x + r) / cellSize), gridData.nCells.x - 1)
      , top           = max(floor((p.y - r) / cellSize), 0)
      , bottom        = min(floor((p.y + r) / cellSize), gridData.nCells.y - 1)
      , collisionData = { d: -1 }
      , result        = {}

    forRange(top, bottom, function (j) {

      forRange(left, right, function (i) {

        var type = brickGrid[j][i].type
          , x    = i * cellSize
          , y    = j * cellSize

        if (brickCollision[type](ballData, x, y, cellSize, result)) {

          if (result.d > collisionData.d) {

            collisionData.d     = result.d
            collisionData.nx    = result.nx
            collisionData.ny    = result.ny
            collisionData.brick = brickGrid[j][i]
          }
        }
      })
    })

    handleBallBrickCollision(ballData, collisionData)
  }

  //
  // Gameplay
  //

  function reset(gameplayData) {

    gameplayData.frame = 0

    resetBall(gameplayData.ball)
    resetPad(gameplayData.pad)
  }
  exports.reset = reset

  function step(gameplayData) {

    var bd = gameplayData.ball
      , gd = gameplayData.grid
      , pd = gameplayData.pad
      , wl = gameplayData.walls

    stepBall(bd)
    stepPad(pd)

    handleBallPadInteraction(bd, pd)
    handleBallWallsInteraction(bd, wl)
    handleBallBricksInteraction(bd, gd)
  }

  function tick(gameplayData, input) {

    handlePadInput(gameplayData.pad, input)

    repeat(stepsPerTick, function () {

      step(gameplayData)
    })

    gameplayData.frame++
  }
  exports.tick = tick

// ----------------------------------------------------------------------------
})