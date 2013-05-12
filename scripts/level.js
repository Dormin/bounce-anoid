define(['./grid', './utilities', 'exports'], function(grid, utilities
, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var random = Math.random

  var integer = utilities.integer

  var charToBrick = {
    ''   : 'none'
  , '.'  : 'none'
  , '#'  : 'solid-0'
  , ')'  : 'solid-1'
  , '('  : 'solid-2'
  , '\\' : 'solid-3'
  , '/'  : 'solid-4'
  , 'V'  : 'fallthrough'
  , 'O'  : 'bounce'
  , 'R'  : 'color-1'
  , 'Y'  : 'color-2'
  , 'G'  : 'color-3'
  , 'B'  : 'color-4'
  , 'P'  : 'color-5'
  , 'X'  : 'glass'
  }

  var charToForce = {
    ''  : 'none'
  , '.' : 'none'
  , '<' : 'left'
  , '>' : 'right'
  }

  function read(string) {

    var i = 0

    grid.forEachCell(function(cell) {

      var brick

      while (!brick) { brick = charToBrick[string.charAt(i++)] }

      cell.brick = brick
    })

    grid.forEachCell(function(cell) {

      var force

      while (!force) { force = charToForce[string.charAt(i++)] }

      cell.force = force
    })
  }
  exports.read = read

  var brickTypes = ['solid-0', 'solid-1', 'solid-2', 'solid-3', 'solid-4'
  , 'fallthrough', 'bounce', 'color-1', 'color-2', 'color-3', 'color-4'
  , 'color-5', 'glass']

  function randomize() {

    grid.forEachCell(function (cell) {

      if (random() > 1/4) {

        cell.brick = 'none'
        
      } else {

        cell.brick = brickTypes[integer(random() * brickTypes.length)]
      }

      if (random() > 1/8) {

        cell.force = 'none'

      } else {

        if (random() > 1/2) {

          cell.force = 'left'

        } else {

          cell.force = 'right'
        }
      }
    })
  }
  exports.randomize = randomize

// ----------------------------------------------------------------------------
})