define(['./utilities', 'exports'], function (utilities, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var forEach = utilities.forEach

  var edges = [

    // Left
    { elasticity : 0.75
    , friction   : 0.0001
    , halfspace  : { n: { x: 1, y: 0 }, d: 0 } }

    // Right
  , { elasticity : 0.75
    , friction   : 0.0001
    , halfspace  : { n: { x: -1, y: 0 }, d: -192 } }

    // Top
  , { elasticity : 0.75
    , friction   : 0.0001
    , halfspace  : { n: { x: 0, y: 1 }, d: 0 } }
  ]

  function collision(edge, ball, result) {

    var p = ball.position
      , n = edge.halfspace.n
      , d = p.x * n.x + p.y * n.y - edge.halfspace.d - ball.RADIUS

    if (d <= 0) {

      result.d  = -d
      result.nx = n.x
      result.ny = n.y

      return true
    }

    return false
  }

  function ballInteraction(ball) {

    var result = {}

    forEach(edges, function (edge) {

      if (collision(edge, ball, result)) {

        ball.pushOut(result)
        ball.bounce(result, edge.elasticity, edge.friction)
      }
    })
  }
  exports.ballInteraction = ballInteraction

// ----------------------------------------------------------------------------
})