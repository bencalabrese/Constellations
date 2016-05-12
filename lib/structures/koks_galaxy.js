var Structure = require('./structure'),
    Util = require('../utils');

var KoksGalaxy = function(grid, startPos) {
  Structure.call(this, KoksGalaxy.OPTIONS);

  this.render(grid, startPos);
};

Util.inherits(KoksGalaxy, Structure);

KoksGalaxy.OPTIONS = {
  height: 11,
  width : 11,
  liveCellDeltas : [

    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],

    [1, 8],
    [2, 8],
    [3, 8],
    [4, 8],
    [5, 8],
    [6, 8],
    [1, 9],
    [2, 9],
    [3, 9],
    [4, 9],
    [5, 9],
    [6, 9],

    [8, 4],
    [8, 5],
    [8, 6],
    [8, 7],
    [8, 8],
    [8, 9],
    [9, 4],
    [9, 5],
    [9, 6],
    [9, 7],
    [9, 8],
    [9, 9],

    [4, 1],
    [5, 1],
    [6, 1],
    [7, 1],
    [8, 1],
    [9, 1],
    [4, 2],
    [5, 2],
    [6, 2],
    [7, 2],
    [8, 2],
    [9, 2]
  ]
};

module.exports = KoksGalaxy;