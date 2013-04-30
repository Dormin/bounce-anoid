define({

  gameplay: {

    ball: {
      
      // Physics
      inertia : 2/5
    , gravity : 0.003
    , drag    : 0.002

      // Properties
    , radius  : 6
    , start   : { x: 96, y: 156, a: 0 }

      // Variable
    , p: { x: 0, y: 0, a: 0 } // Position and angle
    , v: { x: 0, y: 0, a: 0 } // Linear and angular velocity
    }

  , pad: {

      // Physics
      elasticity : 0.5
    , friction   : 0.0001

      // Movement
    , feedback : 1.0
    , response : 0.5
    , boundary: {
        left   : 0
      , right  : 192
      , top    : 192
      , bottom : 256
      }

      // Properties
    , radius   : 24
    , start    : { x: 96, y: 208 }

      // Variable
    , p: { x: 0, y: 0 } // Position
    , v: { x: 0, y: 0 } // Velocity
    , f: { x: 0, y: 0 } // "Force" (but not really)
    }

  , walls: [

      // Left
      { elasticity : 0.75
      , friction   : 0.0001
      , halfspace  : { n: { x: 1, y: 0 }, d: 0 } }

      // Right
    , { elasticity : 0.75
      , friction   : 0.0001
      , halfspace  : { n: { x: -1, y: 0 }, d: -192 } }

      // Top
    , { elasticity : 0.75
      , friction   : 0.0001
      , halfspace  : { n: { x: 0, y: 1 }, d: 0 } }
    ]

  , grid: [
      [ { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 } ]
    , [ { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 } ]
    , [ { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 } ]
    , [ { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 } ]
    , [ { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 } ]
    , [ { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 }
      , { brick: 'empty', force: 'none', frame: 0 } ]
    ]
  }
})