var Cell = require('./cell');

var Viewport = function(grid, ctx) {
  this.grid = grid;
  this.ctx = ctx;

  this.displaySize = 80;
  this.cells = [];

  this.generateCells();
};

Viewport.prototype.generateCells = function () {
  for (var row = 0; row < this.displaySize; row++) {
    for (var col = 0; col < this.displaySize; col++) {
      this.cells.push(new Cell(row, col));
    }
  }
};

Viewport.prototype.render = function () {
  // this.clear();

  this.cells.forEach(function(cell){
    cell.alive = this.grid.livingCells.has(cell.row + ',' + cell.col);
    cell.renderOrb(this.ctx);
  });
};
//
// Viewport.prototype.clear = function () {
//   this.ctx.fillStyle = 'black';
//   this.ctx.fill();
// };


module.exports = Viewport;
