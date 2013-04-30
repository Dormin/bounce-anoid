define(['./graphics','exports'], function (graphics, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var cos = Math.cos
    , sin = Math.sin

  var dotAlpha     = 0.25
    , lineAlpha    = 0.25
    , padAreaAlpha = 0.15
    , shadowAlpha  = 0.25
    , shadowOffset = { x: 2, y: 2 }

  function drawBall(ball) {

    var r = ball.radius
      , x = ball.p.x
      , y = ball.p.y
      , a = ball.p.a

    graphics.draw('ball', 'center', x, y)

    x += cos(a) * r / 2
    y += sin(a) * r / 2
    graphics.draw('dot', 'center', x, y, dotAlpha)
  }

  function drawBallShadow(ball) {

    graphics.draw(
      'shadow-ball'
    , 'center'
    , ball.p.x + shadowOffset.x
    , ball.p.y + shadowOffset.y
    , shadowAlpha
    )
  }

  function drawPad(pad) {

    graphics.draw('pad', 'center', pad.p.x, pad.p.y)
  }

  function drawPadShadow(pad) {

    graphics.draw(
      'shadow-pad'
    , 'center'
    , pad.p.x + shadowOffset.x
    , pad.p.y + shadowOffset.y
    , shadowAlpha
    )
  }

  function drawPadArea(pad) {

    var x = pad.boundary.left
      , y = pad.boundary.top - pad.radius

    graphics.draw('pad-area', 'top-left', x, y, padAreaAlpha)
    graphics.draw('line', 'top-left', x, y, lineAlpha)
  }

  function drawGameplay(gameplay) {

    graphics.draw('background')

    drawPadArea(gameplay.pad)

    drawBallShadow(gameplay.ball)
    drawPadShadow(gameplay.pad)

    drawBall(gameplay.ball)
    drawPad(gameplay.pad)
  }
  exports.gameplay = drawGameplay

// ----------------------------------------------------------------------------
})