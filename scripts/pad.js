define(['./utilities', 'exports'], function (utilities, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var sqrt = Math.sqrt

  var clamp = utilities.clamp

  function reset(data) {

    data.position.x = data.start.x
    data.position.y = data.start.y

    data.velocity.x = 0
    data.velocity.y = 0

    data.force.x = 0
    data.force.y = 0
  }
  exports.reset = reset

  function handleInput(data, stepsPerTick, input) {

    var boundary = data.boundary
      , response = data.response
      , p        = data.position
      , v        = data.velocity
      , tx       = clamp(input.x, boundary.left, boundary.right)
      , ty       = clamp(input.y, boundary.top, boundary.bottom)

    v.x = (tx - p.x) * response / stepsPerTick
    v.y = (ty - p.y) * response / stepsPerTick
  }
  exports.handleInput = handleInput

  function step(data) {

    var feedback = data.feedback
      , p        = data.position
      , v        = data.velocity
      , f        = data.force

    f.x = (f.x * feedback + v.x) / (feedback + 1)
    f.y = (f.y * feedback + v.y) / (feedback + 1)

    p.x += v.x
    p.y += v.y
  }
  exports.step = step

  function collision(padData, ballData, result) {

    var dx = ballData.position.x - padData.position.x
      , dy = ballData.position.y - padData.position.y
      , r  = ballData.radius + padData.radius
      , d  = dx * dx + dy * dy
      , nx = dx / d
      , ny = dy / d

    if (d <= r * r) {

      d = sqrt(d)

      result.d  = r - d
      result.nx = dx / d
      result.ny = dy / d

      return true
    }

    return false
  }
  exports.collision = collision

// ----------------------------------------------------------------------------
})