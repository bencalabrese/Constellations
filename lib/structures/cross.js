var Structure = require('./structure'),
    Util = require('../utils');

var Cross = function(grid, startPos) {
  Structure.call(this, Cross.OPTIONS);

  this.render(grid, startPos);
};

Util.inherits(Cross, Structure);

Cross.OPTIONS = {
  height: 10,
  width : 10,
  liveCellDeltas : [
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [2, 3],
    [2, 6],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 6],
    [3, 7],
    [3, 8],
    [4, 1],
    [4, 8],
    [5, 1],
    [5, 8],
    [6, 1],
    [6, 2],
    [6, 3],
    [6, 6],
    [6, 7],
    [6, 8],
    [7, 3],
    [7, 6],
    [8, 3],
    [8, 4],
    [8, 5],
    [8, 6]
  ]
};

module.exports = Cross;