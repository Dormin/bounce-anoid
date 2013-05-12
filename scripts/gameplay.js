define(['./ball', './edges', './graphics', './grid', './pad', './utilities'
, 'exports'], function (ball, edges, graphics, grid, pad, utilities, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var repeat = utilities.repeat

  //
  // Constants
  //

  var STEPS_PER_TICK = 5
    , SHADOW_ALPHA   = 0.25

  //
  // Logic
  //

  function reset() {

    ball.reset()
    pad.reset()

    grid.randomize()
  }
  exports.reset = reset

  function step() {

    pad.step()

    if (ball.isActive()) {

      ball.step()
      
      pad.ballInteraction(ball)
      edges.ballInteraction(ball)
      grid.ballInteraction(ball)
    }
  }

  function tick() {

    ball.tick()
    pad.tick(STEPS_PER_TICK)
    grid.tick()

    repeat(STEPS_PER_TICK, step)
  }
  exports.tick = tick

  function ballIsOut() {

    return ball.position.y - ball.RADIUS > graphics.view.height
  }
  exports.ballIsOut = ballIsOut

  //
  // Visuals
  //

  function draw(data) {

    graphics.draw('background')

    pad.drawArea()

    graphics.setAlpha(SHADOW_ALPHA)
    ball.drawShadow()
    pad.drawShadow()
    grid.drawShadows()
    graphics.setAlpha(1)

    grid.drawForceFields()

    ball.draw()
    pad.draw()
    grid.drawBricks()

    grid.drawEffects()
  }
  exports.draw = draw

// ----------------------------------------------------------------------------
})