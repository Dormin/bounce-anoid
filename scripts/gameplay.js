define(['./utilities', 'exports'], function (utilities, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var max  = Math.max
    , sqrt = Math.sqrt

  var clamp   = utilities.clamp
    , forEach = utilities.forEach
    , repeat  = utilities.repeat

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

  function resetBall(ball) {

    ball.p.x = ball.start.x
    ball.p.y = ball.start.y
    ball.p.a = ball.start.a

    ball.v.x = 0
    ball.v.y = 0
    ball.v.a = 0
  }

  function stepBall(ball) {

    var g = ball.gravity
      , d = ball.drag
      , p = ball.p
      , v = ball.v

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

  function resetPad(pad) {

    pad.p.x = pad.start.x
    pad.p.y = pad.start.y

    pad.v.x = 0
    pad.v.y = 0

    pad.f.x = 0
    pad.f.y = 0
  }

  function handlePadInput(pad, input) {

    var boundary     = pad.boundary
      , response     = pad.response
      , p            = pad.p
      , v            = pad.v
      , tx           = clamp(input.x, boundary.left, boundary.right)
      , ty           = clamp(input.y, boundary.top, boundary.bottom)

    v.x = (tx - p.x) * response / stepsPerTick
    v.y = (ty - p.y) * response / stepsPerTick
  }

  function stepPad(pad) {

    var feedback = pad.feedback
      , p        = pad.p
      , v        = pad.v
      , f        = pad.f

    f.x = (f.x * feedback + v.x) / (feedback + 1)
    f.y = (f.y * feedback + v.y) / (feedback + 1)

    p.x += v.x
    p.y += v.y
  }

  //
  // Ball pad interaction
  //

  function handleBallPadInteraction(ball, pad) {

    var dx = ball.p.x - pad.p.x
      , dy = ball.p.y - pad.p.y
      , r  = ball.radius + pad.radius
      , d  = sqrt(dx * dx + dy * dy)
      , nx = dx / d
      , ny = dy / d

    // Does the ball and the pad overlap?
    if (d <= r) {

      d = r - d // How much the objects overlap

      // Push ball out of pad
      ball.p.x += nx * d
      ball.p.y += ny * d

      // Bounce ball off pad
      ball.v.x -= pad.f.x
      ball.v.y -= pad.f.y

      bounce(
        ball.v
      , nx
      , ny
      , ball.inertia
      , ball.radius
      , pad.elasticity
      , pad.friction
      )

      ball.v.x += pad.f.x
      ball.v.y += pad.f.y
    }
  }

  //
  // Ball wall interaction
  //

  function handleBallWallInteraction(ball, wall) {

    var p = ball.p
      , n = wall.halfspace.n
      , d = p.x * n.x + p.y * n.y - wall.halfspace.d - ball.radius

    // Does the ball and the wall overlap?
    if (d <= 0) {

      d = -d // How much the objects overlap

      // Push ball out of wall
      p.x += n.x * d
      p.y += n.y * d

      // Bounce ball off wall
      bounce(
        ball.v
      , n.x
      , n.y
      , ball.inertia
      , ball.radius
      , wall.elasticity
      , wall.friction
      )
    }
  }

  //
  // Gameplay
  //

  function init(gameplay) {

    resetBall(gameplay.ball)
    resetPad(gameplay.pad)
  }
  exports.init = init

  function step(gameplay) {

    var ball  = gameplay.ball
      , pad   = gameplay.pad
      , walls = gameplay.walls

    stepBall(ball)
    stepPad(pad)

    handleBallPadInteraction(ball, pad)

    forEach(walls, function (wall) {

      handleBallWallInteraction(ball, wall)
    })
  }

  function tick(gameplay, input) {

    var pad  = gameplay.pad

    handlePadInput(pad, input)

    repeat(stepsPerTick, function () {

      step(gameplay)
    })
  }
  exports.tick = tick

// ----------------------------------------------------------------------------
})