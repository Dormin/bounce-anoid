define({

  gameplay: {

    frame: 0

  , ball: {
      
      // Physics
      inertia : 2/5
    , gravity : 0.003
    , drag    : 0.002

      // Properties
    , radius  : 6
    , start   : { x: 96, y: 156, a: 0 }

      // Variable
    , position : { x: 0, y: 0, a: 0 } // Position and angle
    , velocity : { x: 0, y: 0, a: 0 } // Linear and angular velocity
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
    , position : { x: 0, y: 0 }
    , velocity : { x: 0, y: 0 }
    , force    : { x: 0, y: 0 } // "Force" (but not really)
    }

  , edges: [

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

  , grid: {

      nCells   : { x: 8, y: 6 }
    , cellSize : 24

    , cells:
      [ [ { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 } ]
      , [ { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 } ]
      , [ { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 } ]
      , [ { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 } ]
      , [ { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 } ]
      , [ { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 }
        , { brick: 'none', force: 'none', effect: 'none', frame: 0 } ] ]
    }
  }
})