var Cell = require('./cell');

var Viewport = function(grid, ctx) {
  this.grid = grid;
  this.ctx = ctx;

  this.displaySize = 200;
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

Viewport.prototype.render = function (percentage) {
  this.clear();

  this.cells.forEach(function(cell){
    if (cell.transitioning || cell.alive) {
      cell.renderOrb(this.ctx, percentage);
    }
  }.bind(this));
};

Viewport.prototype.clear = function () {
  var width = this.ctx.canvas.width,
      height = this.ctx.canvas.height;

  this.ctx.fillStyle = 'black';
  this.ctx.fillRect(0, 0, width, height);
};

Viewport.prototype.setCellStates = function () {
  this.cells.forEach(function(cell){
    var liveState = this.grid.alive([cell.row, cell.col]);

    cell.receiveLiveState(liveState);
  }.bind(this));
};

module.exports = Viewport;
