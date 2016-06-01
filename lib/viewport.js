var Cell = require('./cell');

var Viewport = function(grid, ctx) {
  this.grid = grid;
  this.ctx = ctx;

  this.cells = [];

  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
  this.generateCells();
};

Viewport.prototype.generateCells = function () {
  for (var row = -100; row < 100; row++) {
    for (var col = -100; col < 100; col++) {
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
  this.ctx.fillRect(width / -2, height / -2, width, height);
};

Viewport.prototype.setCellStates = function () {
  this.cells.forEach(function(cell){
    var liveState = this.grid.alive([cell.row, cell.col]);

    cell.receiveLiveState(liveState);
  }.bind(this));
};

module.exports = Viewport;
