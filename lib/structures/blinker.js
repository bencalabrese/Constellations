var Structure = require('./structure'),
    Util = require('../utils');

var Blinker = function(grid, startPos) {
  Structure.call(this, Blinker.OPTIONS);

  this.render(grid, startPos);
};

Util.inherits(Blinker, Structure);

Blinker.OPTIONS = {
  height: 5,
  width : 3,
  liveCellDeltas : [
    [1,1],
    [1,2],
    [1,3]
  ]
};

module.exports = Blinker;