var Cell = require('./cell');

var Viewport = function(grid, ctx) {
  this.grid = grid;
  this.ctx = ctx;
  this.gridlines = false;

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

  if (this.gridlines) { this.addGridlines(); }
};

Viewport.prototype.clear = function () {
  var width = this.ctx.canvas.width * 2.5,
      height = this.ctx.canvas.height * 2.5;

  this.ctx.fillStyle = 'black';
  this.ctx.fillRect(width / -2, height / -2, width, height);
};

Viewport.prototype.addGridlines = function () {
  this.ctx.strokeStyle = "gray";
  this.ctx.lineWidth = 0.25;

  for(var i = -100; i < 100; i++) {
    this.ctx.strokeRect(
      -100 * 10,
      i * 10,
      this.ctx.canvas.width * 2.5,
      10
    );

    this.ctx.strokeRect(
      i * 10,
      -100 * 10,
      10,
      this.ctx.canvas.height * 2.5
    );
  }
};

Viewport.prototype.toggleGridlines = function () {
  this.gridlines = this.gridlines ? false : true;
};

Viewport.prototype.setCellStates = function () {
  this.cells.forEach(function(cell){
    var liveState = this.grid.alive([cell.row, cell.col]);

    cell.receiveLiveState(liveState);
  }.bind(this));
};

module.exports = Viewport;
