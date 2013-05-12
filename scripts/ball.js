define(['./graphics', './shadow', './utilities', 'exports'], function (graphics
, shadow, utilities, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var cos  = Math.cos
    , max  = Math.max
    , sin  = Math.sin
    , sqrt = Math.sqrt

  var clamp = utilities.clamp

  //
  // Constants
  //

  var GRAVITY = 0.003
    , DRAG    = 0.002
    , INERTIA = 2/5
    , RADIUS  = 6
    , START   = { x: 96, y: 156, a: 0 }

  exports.RADIUS = RADIUS

  var APPEAR_DURATION = 40
    , DOT_ALPHA       = 0.25

  //
  // Variables
  //

  var state    = 'inactive'
    , frame    = 0
    , position = { x: 0, y: 0, a: 0 } // Position and angle
    , velocity = { x: 0, y: 0, a: 0 } // Linear and angular velocity

  exports.position = position
  exports.velocity = velocity

  //
  // Logic
  //

  function reset() {

    state = 'inactive'
    frame = 0

    position.x = START.x
    position.y = START.y
    position.a = START.a

    velocity.x = 0
    velocity.y = 0
    velocity.a = 0
  }
  exports.reset = reset


  function step() {

    var g = GRAVITY
      , d = DRAG
      , p = position
      , v = velocity

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
  exports.step = step

  function tick() {

    if (state === 'appearing') {

      if (frame >= APPEAR_DURATION) {

        state = 'active'
      }

      frame++
    }
  }
  exports.tick = tick

  function pushOut(collision) {

    var p  = position
      , d  = collision.d
      , nx = collision.nx
      , ny = collision.ny

    p.x += nx * d
    p.y += ny * d
  }
  exports.pushOut = pushOut

  function bounce(collision, elasticity, friction) {

    var i  = INERTIA
      , r  = RADIUS
      , e  = elasticity
      , u  = friction
      , v  = velocity
      , nx = collision.nx
      , ny = collision.ny
      , vx = v.x * nx + v.y * ny  // Transformed velocity x
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
  exports.bounce = bounce

  function isActive() {

    return state === 'active'
  }
  exports.isActive = isActive

  function activate() {

    state = 'appearing'
    frame = 0
  }
  exports.activate = activate

  function applyForce(fx, fy) {

    velocity.x += fx
    velocity.y += fy
  }
  exports.applyForce = applyForce

  //
  // Visuals
  //

  function drawBall() {

    var r = RADIUS
      , x = position.x
      , y = position.y
      , a = position.a

    graphics.draw('ball', 'center', x, y)

    x += cos(a) * r / 2
    y += sin(a) * r / 2
    graphics.setAlpha(DOT_ALPHA)
    graphics.draw('dot', 'center', x, y)
    graphics.setAlpha(1)
  }

  function drawAppearing() {

    if (frame > APPEAR_DURATION / 4 * 3) { drawBall() }

    if (frame % 4 === 0) {

      graphics.setAlpha(frame / APPEAR_DURATION)
      graphics.draw('ball-light', 'center', position.x, position.y)
      graphics.setAlpha(1)
    }

    if (frame % 16 === 0) {

      graphics.draw('ball-light', 'center', position.x, position.y)
    }
  }

  function draw() {

    switch (state) {
      case 'active':
        drawBall()
        break
      case 'appearing':
        drawAppearing()
        break
    }
  }
  exports.draw = draw

  function drawShadow() {

    if (state === 'active') {

      shadow.draw('shadow-ball', 'center', position.x, position.y)
    }
  }
  exports.drawShadow = drawShadow

// ----------------------------------------------------------------------------
})