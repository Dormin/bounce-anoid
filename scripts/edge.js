define(['exports'], function (exports) {
// ----------------------------------------------------------------------------

  "use strict"

  function collision(edgeData, ballData, result) {

    var p = ballData.position
      , n = edgeData.halfspace.n
      , d = p.x * n.x + p.y * n.y - edgeData.halfspace.d - ballData.radius

    if (d <= 0) {

      result.d  = -d
      result.nx = n.x
      result.ny = n.y

      return true
    }

    return false
  }
  exports.collision = collision

// ----------------------------------------------------------------------------
})