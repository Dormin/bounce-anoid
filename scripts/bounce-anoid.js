define(['./graphics', './input', './state', './utilities', 'exports']
, function (graphics, input, state, utilities, exports) {
// ----------------------------------------------------------------------------

  var eachFrame = utilities.eachFrame

  function tick() {

    state.tick()
    state.render()
  }

  function run(canvas) {

    input.setup(canvas)
    graphics.setup(canvas)

    state.set('load-resources')

    eachFrame(tick)
  }
  exports.run = run

// ----------------------------------------------------------------------------
})