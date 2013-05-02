define(['./data', './draw', './gameplay', './graphics', './input', './resources'
, './utilities', 'exports'], function (data, draw, gameplay, graphics, input
, resources, utilities, exports) {
// ----------------------------------------------------------------------------

  var eachFrame = utilities.eachFrame

  function tick() {

    gameplay.tick(data.gameplay, input.read())
    draw.gameplay(data.gameplay)
  }

  function run(canvas) {

    input.setup(canvas)
    graphics.setup(canvas)

    graphics.load(resources.images, function () {

      gameplay.reset(data.gameplay)
      eachFrame(tick)
    })
  }
  exports.run = run

// ----------------------------------------------------------------------------
})