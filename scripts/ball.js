define(['./utilities', 'exports'], function (utilities, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var max  = Math.max
    , sqrt = Math.sqrt

  var clamp = utilities.clamp

  function reset(data) {

    data.position.x = data.start.x
    data.position.y = data.start.y
    data.position.a = data.start.a

    data.velocity.x = 0
    data.velocity.y = 0
    data.velocity.a = 0
  }
  exports.reset = reset

  function step(data) {

    var g = data.gravity
      , d = data.drag
      , p = data.position
      , v = data.velocity

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

  function pushOut(ballData, collisionData) {

    var p  = ballData.position
      , d  = collisionData.d
      , nx = collisionData.nx
      , ny = collisionData.ny

    p.x += nx * d
    p.y += ny * d
  }
  exports.pushOut = pushOut

  function bounce(ballData, collisionData, elasticity, friction) {

    var v  = ballData.velocity
      , i  = ballData.inertia
      , r  = ballData.radius
      , e  = elasticity
      , u  = friction
      , nx = collisionData.nx
      , ny = collisionData.ny
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

// ----------------------------------------------------------------------------
})