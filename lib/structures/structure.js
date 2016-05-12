var Structure = function(options, grid, startPos) {
  this.height = options.height;
  this.width = options.width;
  this.liveCellDeltas = options.liveCellDeltas;
};

Structure.prototype.render = function (grid, startPos) {
  this.clearArea(grid, startPos);

  var positions = this.liveCellDeltas.map(function(delta){
    return [startPos[0] + delta[0], startPos[1] + delta[1]];
  });

  grid.awakenCells(positions);
};

Structure.prototype.clearArea = function (grid, startPos) {
  var targetCells = [];

  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      targetCells.push([startPos[0] + x, startPos[1] + y]);
    }
  }

  grid.killCells(targetCells);
};

module.exports = Structure;
