var Structure = require('./structure'),
    Util = require('../utils');

var Glider = function(grid, startPos, rotationCount) {
  Structure.call(this, Glider.OPTIONS, rotationCount);

  this.render(grid, startPos);
};

Util.inherits(Glider, Structure);

Glider.OPTIONS = {
  height: 5,
  width : 5,
  liveCellDeltas : [
    [1, 3],
    [2, 1],
    [2, 3],
    [3, 2],
    [3, 3]
  ]
};

module.exports = Glider;
