var Cell = require('./cell');

var Viewport = function(grid, ctx) {
  this.grid = grid;
  this.ctx = ctx;
  this.displaySize = 80;
};

Viewport.prototype.render = function () {
  for (var row = 0; row < this.displaySize; row++) {
    for (var col = 0; col < this.displaySize; col++) {
      var alive = this.grid.livingCells.has(row + ',' + col);

      new Cell(row, col, alive).renderOrb(this.ctx);
    }
  }
};

module.exports = Viewport;
