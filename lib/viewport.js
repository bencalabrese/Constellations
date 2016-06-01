var Cell = require('./cell');

var Viewport = function(grid, ctx) {
  this.grid = grid;
  this.ctx = ctx;
  this.gridlines = false;

  this.cells = [];

  // ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
  this.generateCells();
};

Viewport.prototype.generateCells = function () {
  for (var row = 0; row < 200; row++) {
    for (var col = 0; col < 200; col++) {
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

  if (this.highlightData) { this.highlightCells(); }
  if (this.gridlines) { this.addGridlines(); }
};

Viewport.prototype.clear = function () {
  var width = this.ctx.canvas.width,
      height = this.ctx.canvas.height;

  this.ctx.fillStyle = 'black';
  this.ctx.fillRect(0, 0, width, height);
};

Viewport.prototype.addGridlines = function () {
  this.ctx.strokeStyle = "gray";
  this.ctx.lineWidth = 0.25;

  for(var i = 0; i < 200; i++) {
    this.ctx.strokeRect(
      0,
      i * 10,
      this.ctx.canvas.width,
      10
    );

    this.ctx.strokeRect(
      i * 10,
      0,
      10,
      this.ctx.canvas.height
    );
  }
};

Viewport.prototype.highlightCells = function () {
  this.ctx.fillStyle = 'yellow';
  this.ctx.fillRect(
    this.highlightData.x,
    this.highlightData.y,
    this.highlightData.width * 10,
    this.highlightData.height * 10
  );
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

Viewport.prototype.setHighlightData = function (data) {
  this.highlightData = data;
};

module.exports = Viewport;
