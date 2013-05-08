define(['exports'], function (exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var lifespan = {
    'bounce'  : 4
  , 'flicker' : 20
  , 'scatter' : 30
  }
  exports.lifespan = lifespan

  function tick(data, frame) {

    if (data.effect !== 'none') {

      if (frame - data.frame >= lifespan[data.effect]) {

        data.effect = 'none'
      }
    }
  }
  exports.tick = tick

// ----------------------------------------------------------------------------
})