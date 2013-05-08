define(['./data', './draw', './gameplay', './graphics', './input'
, './resources', 'exports'], function (data, draw, gameplay, graphics, input
, resources, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var state = {
    'load-resources': {
      once: function () {

        graphics.load(resources.images, function () {

          set('init-gameplay')
        })
      }
    , tick: function () {}
    , render: function () {}
    }
  , 'init-gameplay': {
      once: function () {

        gameplay.reset(data.gameplay)
        set('gameplay')
      }
    , tick: function () {}
    , render: function () {}
    }
  , 'gameplay': {
      once: function () {}
    , tick: function () {

        gameplay.tick(data.gameplay, input.read())
      }
    , render: function () {

        draw.gameplay(data.gameplay)
      }
    }
  }

  var current

  function set(name) {

    current = name
    state[current].once()
  }
  exports.set = set

  function tick() {

    state[current].tick()
  }
  exports.tick = tick

  function render() {

    state[current].render()
  }
  exports.render = render

// ----------------------------------------------------------------------------
})