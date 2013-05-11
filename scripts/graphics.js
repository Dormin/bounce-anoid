define(['./utilities', 'exports'], function (utilities, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var countOwn = utilities.countOwn
    , forOwn   = utilities.forOwn
    , integer  = utilities.integer

  var context
    , images = {}

  var view = {
    width  : 0
  , height : 0
  }
  exports.view = view

  function setup(canvas) {

    view.width  = canvas.width
    view.height = canvas.height

    context = canvas.getContext('2d')
  }
  exports.setup = setup

  function load(imagefiles, callback) {

    var nLoaded = 0
      , nTotal  = countOwn(imagefiles)

    forOwn(imagefiles, function(name, filename) {

      var image = new Image()

      image.onload = function () {

        images[name] = image
        nLoaded++
        if (nLoaded === nTotal) { callback() }
      }
      image.src = filename
    })
  }
  exports.load = load

  function setAlpha(alpha) {

    context.globalAlpha = alpha
  }
  exports.setAlpha = setAlpha

  function draw(name, align, x, y) {

    var image = images[name]

    if (!image) { return }

    x = x || 0
    y = y || 0

    if (align === 'center') {

      x -= image.width / 2
      y -= image.height / 2
    }

    context.drawImage(image, integer(x), integer(y))
  }
  exports.draw = draw

  function drawRectangle(color, x, y, width, height) {

    context.fillStyle = color
    context.beginPath()
    context.rect(integer(x), integer(y), integer(width), integer(height))
    context.fill()
  }
  exports.drawRectangle = drawRectangle

// ----------------------------------------------------------------------------
})