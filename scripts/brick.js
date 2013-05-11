define(['./graphics', './shadow', './utilities', 'exports'], function (graphics
, shadow, utilities, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var max  = Math.max
    , sqrt = Math.sqrt

  var clamp = utilities.clamp

  //
  // Constants
  //

  var ELASTICITY   = 0.75
    , FRICTION     = 0.0001
    , BOUNCE_FORCE = 0.5

  //
  // Collision detection
  //

  function noCollision() {

    return false
  }

  function squareCollision(x, y, size, ball, result) {

    var p  = ball.position
      , r  = ball.RADIUS
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

  function slopeCollision(x, y, size, nx, ny, d, ball, result) {

    var p  = ball.position
      , r  = ball.RADIUS
      , tx = p.x - x
      , ty = p.y - y
      , t  = max((tx * nx + ty * ny - d) / 2, 0)
      , dx = p.x - clamp(p.x - t * nx, x, x + size)
      , dy = p.y - clamp(p.y - t * ny, y, y + size)
      , d2 = dx * dx + dy * dy

    if (d2 <= r * r) {

      d2 = sqrt(d2)

      result.d  = r - d2
      result.nx = dx / d2
      result.ny = dy / d2

      return true
    }

    return false
  }

  function slopeCollision1(x, y, size, ball, result) {

    return slopeCollision(x, y, size, 1, 1, size, ball, result)
  }

  function slopeCollision2(x, y, size, ball, result) {

    return slopeCollision(x, y, size, -1, 1, 0, ball, result)
  }

  function slopeCollision3(x, y, size, ball, result) {

    return slopeCollision(x, y, size, 1, -1, 0, ball, result)
  }

  function slopeCollision4(x, y, size, ball, result) {

    return slopeCollision(x, y, size, -1, -1, -size, ball, result)
  }

  function fallthroughCollision(x, y, size, ball, result) {

    var p  = ball.position
      , v  = ball.velocity
      , r  = ball.RADIUS
      , dx = p.x - clamp(p.x, x, x + size)
      , dy = p.y - (y + size)
      , d  = dx * dx + dy * dy

    if (d <= r * r && dy > 0 && v.y < 0) {

      d = sqrt(d)

      result.d  = r - d
      result.nx = dx / d
      result.ny = dy / d

      return true
    }

    return false
  }

  var brickCollision = {
    'none'        : noCollision
  , 'solid-0'     : squareCollision
  , 'solid-1'     : slopeCollision1
  , 'solid-2'     : slopeCollision2
  , 'solid-3'     : slopeCollision3
  , 'solid-4'     : slopeCollision4
  , 'fallthrough' : fallthroughCollision
  , 'bounce'      : squareCollision
  , 'color-1'     : squareCollision
  , 'color-2'     : squareCollision
  , 'color-3'     : squareCollision
  , 'color-4'     : squareCollision
  , 'color-5'     : squareCollision
  , 'glass'       : squareCollision
  }

  function collision(type, x, y, size, ball, result) {

    return brickCollision[type](x, y, size, ball, result)
  }
  exports.collision = collision

  //
  // Collision response
  //

  function solidHandleCollision(ball, collision) {

    ball.pushOut(collision)
    ball.bounce(collision, ELASTICITY, FRICTION)
  }

  function bounceHandleCollision(ball, collision) {

    var cell = collision.cell
      , fx   = collision.nx * BOUNCE_FORCE
      , fy   = collision.ny * BOUNCE_FORCE

    cell.effect = 'bounce'
    cell.frame  = 0

    ball.pushOut(collision)
    ball.bounce(collision, ELASTICITY, FRICTION)
    ball.applyForce(fx, fy)
  }

  function colorHandleCollision(ball, collision) {

    var cell = collision.cell

    cell.brick  = 'none'
    cell.effect = 'flicker'
    cell.frame  = 0

    ball.pushOut(collision)
    ball.bounce(collision, ELASTICITY, FRICTION)
  }

  function glassHandleCollision(ball, collision) {

    var cell = collision.cell
      , v    = ball.velocity
      , nx   = collision.nx
      , ny   = collision.ny

    if (v.x * nx + v.y * ny <= -1) {

      cell.brick  = 'none'
      cell.effect = 'scatter'
      cell.frame  = 0
    }

    ball.pushOut(collision)
    ball.bounce(collision, ELASTICITY, FRICTION)
  }

  var brickHandleCollision = {
    'solid-0'     : solidHandleCollision
  , 'solid-1'     : solidHandleCollision
  , 'solid-2'     : solidHandleCollision
  , 'solid-3'     : solidHandleCollision
  , 'solid-4'     : solidHandleCollision
  , 'fallthrough' : solidHandleCollision
  , 'bounce'      : bounceHandleCollision
  , 'color-1'     : colorHandleCollision
  , 'color-2'     : colorHandleCollision
  , 'color-3'     : colorHandleCollision
  , 'color-4'     : colorHandleCollision
  , 'color-5'     : colorHandleCollision
  , 'glass'       : glassHandleCollision
  }

  function handleCollision(type, ball, collision) {

    brickHandleCollision[type](ball, collision)
  }
  exports.handleCollision = handleCollision

  //
  // Visuals
  //

  var brickImage = {
    'none'        : ''
  , 'solid-0'     : 'brick-solid-0'
  , 'solid-1'     : 'brick-solid-1'
  , 'solid-2'     : 'brick-solid-2'
  , 'solid-3'     : 'brick-solid-3'
  , 'solid-4'     : 'brick-solid-4'
  , 'fallthrough' : 'brick-fallthrough'
  , 'bounce'      : 'brick-bounce'
  , 'color-1'     : 'brick-color-1'
  , 'color-2'     : 'brick-color-2'
  , 'color-3'     : 'brick-color-3'
  , 'color-4'     : 'brick-color-4'
  , 'color-5'     : 'brick-color-5'
  , 'glass'       : 'brick-glass'
  }

  function draw(type, x, y) {

    graphics.draw(brickImage[type], 'top-left', x, y)
  }
  exports.draw = draw

  var shadowImage = {
    'none'        : ''
  , 'solid-0'     : 'shadow-brick-0'
  , 'solid-1'     : 'shadow-brick-1'
  , 'solid-2'     : 'shadow-brick-2'
  , 'solid-3'     : 'shadow-brick-3'
  , 'solid-4'     : 'shadow-brick-4'
  , 'fallthrough' : 'shadow-fallthrough'
  , 'bounce'      : 'shadow-bounce'
  , 'color-1'     : 'shadow-brick-0'
  , 'color-2'     : 'shadow-brick-0'
  , 'color-3'     : 'shadow-brick-0'
  , 'color-4'     : 'shadow-brick-0'
  , 'color-5'     : 'shadow-brick-0'
  , 'glass'       : 'shadow-brick-0'
  }

  function drawShadow(type, x, y) {

    shadow.draw(shadowImage[type], 'top-left', x, y)
  }
  exports.drawShadow = drawShadow

// ----------------------------------------------------------------------------
})