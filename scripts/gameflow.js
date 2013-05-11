define(['./ball', './gameplay', './transition', 'exports'], function (ball
, gameplay, transition, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var nodes = {

    'start': {

      type: 'action'

    , execute: function () {

        return 'gameplay-init'
      }
    }

  , 'gameplay-init': {

      type: 'action'

    , execute: function () {

        gameplay.reset()
        transition.init()

        return 'gameplay-fadein'
      }
    }

  , 'gameplay-fadein': {

      type: 'state'

    , tick: function (frame) {

        gameplay.tick()
        transition.tick()

        if (transition.complete()) {

          ball.activate()
          return 'gameplay'
        }
      }

    , draw: function (frame) {

        gameplay.draw()
        transition.draw()
      }
    }

  , 'gameplay': {

      type: 'state'

    , tick: function () {

        gameplay.tick()
      }

    , draw: function () {

        gameplay.draw()
      }
    }
  }

  var current = nodes['start']

  function tick() {

    while (current.type === 'action') {

      current = nodes[current.execute()]
    }

    current = nodes[current.tick()] || current
    current.draw()
  }
  exports.tick = tick

// ----------------------------------------------------------------------------
})