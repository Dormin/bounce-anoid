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

        return 'gameplay-fade-in'
      }
    }

  , 'gameplay-fade-in': {

      type: 'state'

    , tick: function (frame) {

        gameplay.tick()
        transition.tick()

        if (transition.complete()) { return 'gameplay-spawn-ball' }
      }

    , draw: function (frame) {

        gameplay.draw()
        transition.draw()
      }
    }

  , 'gameplay-spawn-ball': {

      type: 'action'

    , execute: function () {

        ball.reset()
        ball.activate()

        return 'gameplay'
      }
    }

  , 'gameplay': {

      type: 'state'

    , tick: function () {

        gameplay.tick()

        if (gameplay.ballIsOut()) { return 'gameplay-spawn-ball' }
      }

    , draw: function () {

        gameplay.draw()
      }
    }
  }

  var current = nodes['start']

  function tick() {

    var next

    while (current.type === 'action') {

      current = nodes[current.execute()]
    }

    next = current.tick()
    current.draw()
    current = nodes[next] || current
  }
  exports.tick = tick

// ----------------------------------------------------------------------------
})