define(['./graphics', './input', './shadow', './utilities', 'exports']
, function (graphics, input, shadow, utilities, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var sqrt = Math.sqrt

  var clamp = utilities.clamp

  //
  // Constants
  //

  var ELASTICITY = 0.5
    , FRICTION   = 0.0001
    , FEEDBACK   = 1.0
    , RESPONSE   = 0.5
    , BOUNDARY   = { left: 0, right: 192, top: 192, bottom: 256 }
    , RADIUS     = 24
    , START      = { x: 96, y: 208 }

  var AREA_ALPHA = 0.15
    , LINE_ALPHA = 0.25

  //
  // Variable
  //

  var position = { x: 0, y: 0 }
    , velocity = { x: 0, y: 0 }
    , force    = { x: 0, y: 0 } // "Force" (but not really)

  //
  // Logic
  //

  function reset() {

    position.x = START.x
    position.y = START.y

    velocity.x = 0
    velocity.y = 0

    force.x = 0
    force.y = 0
  }
  exports.reset = reset

  function tick(stepsPerTick) {

    var p  = position
      , v  = velocity
      , tx = clamp(input.state.x, BOUNDARY.left, BOUNDARY.right)
      , ty = clamp(input.state.y, BOUNDARY.top, BOUNDARY.bottom)

    v.x = (tx - p.x) * RESPONSE / stepsPerTick
    v.y = (ty - p.y) * RESPONSE / stepsPerTick
  }
  exports.tick = tick

  function step() {

    var p = position
      , v = velocity
      , f = force

    f.x = (f.x * FEEDBACK + v.x) / (FEEDBACK + 1)
    f.y = (f.y * FEEDBACK + v.y) / (FEEDBACK + 1)

    p.x += v.x
    p.y += v.y
  }
  exports.step = step

  function collision(ball, result) {

    var dx = ball.position.x - position.x
      , dy = ball.position.y - position.y
      , r  = ball.RADIUS + RADIUS
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

  function ballInteraction(ball) {

    var result = {}

    if (collision(ball, result)) {

      ball.pushOut(result)

      ball.velocity.x -= force.x
      ball.velocity.y -= force.y

      ball.bounce(result, ELASTICITY, FRICTION)

      ball.velocity.x += force.x
      ball.velocity.y += force.y
    }
  }
  exports.ballInteraction = ballInteraction

  //
  // Visuals
  //

  function draw() {

    graphics.draw('pad', 'center', position.x, position.y)
  }
  exports.draw = draw

  function drawShadow(data) {

    shadow.draw('shadow-pad', 'center', position.x, position.y)
  }
  exports.drawShadow = drawShadow

  function drawArea(data) {

    var x      = BOUNDARY.left
      , y      = BOUNDARY.top - RADIUS
      , width  = BOUNDARY.right - x
      , height = BOUNDARY.bottom - y

    graphics.setAlpha(AREA_ALPHA)
    graphics.drawRectangle('white', x, y, width, height)
    graphics.setAlpha(LINE_ALPHA)
    graphics.draw('line', 'top-left', x, y)
    graphics.setAlpha(1)
  }
  exports.drawArea = drawArea

// ----------------------------------------------------------------------------
})