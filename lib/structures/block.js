var Structure = require('./structure'),
    Util = require('../utils');

var Block = function(grid, startPos, rotationCount) {
  Structure.call(this, Block.OPTIONS, rotationCount);

  this.render(grid, startPos);
};

Util.inherits(Block, Structure);

Block.OPTIONS = {
  height: 4,
  width : 4,
  liveCellDeltas : [
    [1,1],
    [1,2],
    [2,1],
    [2,2]
  ]
};

module.exports = Block;
