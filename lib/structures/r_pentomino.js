var Structure = require('./structure'),
    Util = require('../utils');

var RPentomino = function(grid, startPos, rotationCount) {
  Structure.call(this, RPentomino.OPTIONS, rotationCount);

  this.render(grid, startPos);
};

Util.inherits(RPentomino, Structure);

RPentomino.OPTIONS = {
  height: 5,
  width : 5,
  liveCellDeltas : [
    [1, 2],
    [1, 3],
    [2, 1],
    [2, 2],
    [3, 2]
  ]
};

module.exports = RPentomino;
