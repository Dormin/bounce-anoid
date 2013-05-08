define(['./utilities', 'exports'], function (utilities, exports) {
// ----------------------------------------------------------------------------

  "use strict"

  var floor  = Math.floor
    , max    = Math.max
    , min    = Math.min
    , random = Math.random

  var forRange = utilities.forRange
    , integer  = utilities.integer
    , repeat   = utilities.repeat

  function forEachCell(gridData, iterator) {

    var cells = gridData.cells
      , size  = gridData.cellSize

    repeat(gridData.nCells.y, function (j) {

      repeat(gridData.nCells.x, function (i) {

        iterator(cells[j][i], i * size, j * size)
      })
    })
  }
  exports.forEachCell = forEachCell

  function forEachCellIn(gridData, left, right, top, bottom, iterator) {

    var cells = gridData.cells
      , size  = gridData.cellSize

    left   = max(floor((left) / size), 0)
    right  = min(floor((right) / size), gridData.nCells.x - 1)
    top    = max(floor((top) / size), 0)
    bottom = min(floor((bottom) / size), gridData.nCells.y - 1)

    forRange(top, bottom, function (j) {

      forRange(left, right, function (i) {

        iterator(cells[j][i], i * size, j * size)
      })
    })
  }
  exports.forEachCellIn = forEachCellIn

  function reset(gridData) {

    forEachCell(gridData, function (cell) {

      cell.brick = 'none'
      cell.force = 'none'
      cell.fx    = 'none'
      cell.frame = 0
    })
  }
  exports.reset = reset

  var brickTypes = ['solid-0', 'solid-1', 'solid-2', 'solid-3', 'solid-4'
  , 'fallthrough', 'bounce', 'color-1', 'color-2', 'color-3', 'color-4'
  , 'color-5', 'glass']

  function randomize(gridData) {

    forEachCell(gridData, function (cell) {

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

      cell.fx    = 'none'
      cell.frame = 0
    })
  }
  exports.randomize = randomize

// ----------------------------------------------------------------------------
})