define(['./gameflow', './graphics', './input', './resources', './utilities'
, 'exports'], function (gameflow, graphics, input, resources, utilities
, exports) {
// ----------------------------------------------------------------------------

  "use strict"
  
  var eachFrame = utilities.eachFrame

  function run(canvas) {

    input.setup(canvas)
    graphics.setup(canvas)

    graphics.load(resources.images, function () {

      eachFrame(gameflow.tick)
    })
  }
  exports.run = run

// ----------------------------------------------------------------------------
})