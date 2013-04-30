define(['./draw', './gameplay', './graphics', './input', './resources'
, './state', './utilities', 'exports'], function (draw, gameplay, graphics
, input, resources, state, utilities, exports) {
// ----------------------------------------------------------------------------

  var eachFrame = utilities.eachFrame

  function tick() {

    gameplay.tick(state.gameplay, input.read())
    draw.gameplay(state.gameplay)
  }

  function run(canvas) {

    input.setup(canvas)
    graphics.setup(canvas)

    graphics.load(resources.images, function () {

      gameplay.init(state.gameplay)
      eachFrame(tick)
    })
  }
  exports.run = run

// ----------------------------------------------------------------------------
})