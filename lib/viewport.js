var Cell = require('./cell');

var Viewport = function(grid, ctx) {
  this.grid = grid;
  this.ctx = ctx;
  this.gridlines = false;
  this.zoomLevel = 2;

  this.cells = {};

  this.generateCells();
};

Viewport.prototype.generateCells = function () {
  for (var row = -80; row < 80; row++) {
    for (var col = -80; col < 80; col++) {
      this.cells[[row, col].join(',')] = new Cell(row, col);
    }
  }
};

Viewport.prototype.render = function (percentage) {
  this.recontextualize();
  this.clear();

  Object.keys(this.cells).forEach(function(key){
    var cell = this.cells[key];

    if (cell.transitioning || cell.alive) {
      cell.renderOrb(this.ctx, percentage);
    }
  }.bind(this));

  if (this.highlightData) { this.highlightCells(); }
  if (this.gridlines) { this.addGridlines(); }
};

Viewport.prototype.recontextualize = function () {
  this.ctx.setTransform(
    this.zoomLevel,
    0,
    0,
    this.zoomLevel,
    this.ctx.canvas.height / 2,
    this.ctx.canvas.width / 2
  );
};

Viewport.prototype.clear = function () {
  var width = this.ctx.canvas.width,
      height = this.ctx.canvas.height;

  this.ctx.fillStyle = 'black';
  this.ctx.fillRect(width / -2, height / -2, width, height);
};

Viewport.prototype.addGridlines = function () {
  for(var i = -80; i < 80; i++) {
    this.ctx.moveTo(this.ctx.canvas.width / -2, i * 5);
    this.ctx.lineTo(this.ctx.canvas.width / 2, i * 5);

    this.ctx.moveTo(i * 5, this.ctx.canvas.width / -2);
    this.ctx.lineTo(i * 5, this.ctx.canvas.width / 2);
  }

  this.ctx.strokeStyle = "gray";
  this.ctx.lineWidth = 0.125;
  this.ctx.stroke();
};

Viewport.prototype.highlightCells = function () {
  var pos = this.calculateGridPos(this.highlightData.mousePos),
      row = pos[0],
      col = pos[1];

  this.ctx.fillStyle = 'rgba(255,255,0,0.2)';
  this.ctx.fillRect(
    row * 5,
    col * 5,
    this.highlightData.width * 5,
    this.highlightData.height * 5
  );
};

Viewport.prototype.calculateGridPos = function (mousePos) {
  var offsets = [this.ctx.canvas.width / 2, this.ctx.canvas.height / 2];

  return mousePos.map(function(dim, idx) {
    var offset = dim - offsets[idx];
    return Math.floor(offset / 5 / this.zoomLevel);
  }.bind(this));
};

Viewport.prototype.toggleGridlines = function () {
  this.gridlines = this.gridlines ? false : true;
};

Viewport.prototype.setCellStates = function (posKeys) {
  posKeys.forEach(function(key){
    var cell = this.cells[key];

    var liveState = this.grid.alive([cell.row, cell.col]);

    cell.receiveLiveState(liveState);
  }.bind(this));
};

Viewport.prototype.setAllCellStates = function (cell) {
  this.setCellStates(Object.keys(this.cells));
};

Viewport.prototype.setHighlightData = function (data) {
  this.highlightData = data;
};

Viewport.prototype.setZoomLevel = function (level) {
  this.zoomLevel = level;
};

module.exports = Viewport;
