define(['./utilities', 'exports'], function (utilities, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var max  = Math.max
    , sqrt = Math.sqrt

  var clamp = utilities.clamp

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

  function slopeCollision(ballData, x, y, size, nx, ny, d, result) {

    var p  = ballData.position
      , r  = ballData.radius
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

  function slopeCollision1(ballData, x, y, size, result) {

    return slopeCollision(ballData, x, y, size, 1, 1, size, result)
  }

  function slopeCollision2(ballData, x, y, size, result) {

    return slopeCollision(ballData, x, y, size, -1, 1, 0, result)
  }

  function slopeCollision3(ballData, x, y, size, result) {

    return slopeCollision(ballData, x, y, size, 1, -1, 0, result)
  }

  function slopeCollision4(ballData, x, y, size, result) {

    return slopeCollision(ballData, x, y, size, -1, -1, -size, result)
  }

  function fallthroughCollision(ballData, x, y, size, result) {

    var p  = ballData.position
      , v  = ballData.velocity
      , r  = ballData.radius
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

  function doNothing() {

    // Do nothing...
  }

  function flickerAndDestroy(ballData, collisionData, frame) {

    var cell = collisionData.cell

    cell.brick  = 'none'
    cell.effect = 'flicker'
    cell.frame  = frame
  }

  exports.collision = {
    'none'        : noCollision
  , 'solid-0'     : squareCollision
  , 'solid-1'     : slopeCollision1
  , 'solid-2'     : slopeCollision2
  , 'solid-3'     : slopeCollision3
  , 'solid-4'     : slopeCollision4
  , 'fallthrough' : fallthroughCollision
  , 'color-1'     : squareCollision
  , 'color-2'     : squareCollision
  , 'color-3'     : squareCollision
  , 'color-4'     : squareCollision
  , 'color-5'     : squareCollision
  }

  exports.onCollision = {
    'solid-0'     : doNothing
  , 'solid-1'     : doNothing
  , 'solid-2'     : doNothing
  , 'solid-3'     : doNothing
  , 'solid-4'     : doNothing
  , 'fallthrough' : doNothing
  , 'color-1'     : flickerAndDestroy
  , 'color-2'     : flickerAndDestroy
  , 'color-3'     : flickerAndDestroy
  , 'color-4'     : flickerAndDestroy
  , 'color-5'     : flickerAndDestroy
  }

  exports.elasticity = {
    'default' : 0.75
  }

  exports.friction = {
    'default' : 0.0001
  }

// ----------------------------------------------------------------------------
})