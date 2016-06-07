var Grid = require('./grid'),
    Viewport = require('./viewport'),
    Structure = require('./structures/structure'),
    Structures = require('./structures/structures');

var Game = function(ctx) {
  this.ctx = ctx;
  this.grid = new Grid();
  this.viewport = new Viewport(this.grid, this.ctx);
  this.selectedStructure = new Structure (Structures.SingleCell);

  this.playing = false;
  this.speed = 1000;

  this.cycle();
};

Game.prototype.cycle = function () {
  var cycleStart = new Date().getTime();

  this.render(cycleStart);
};

Game.prototype.render = function (cycleStart) {
  var currentTime = new Date().getTime() - cycleStart;
  var percentage = currentTime / this.speed;

  if (percentage >= 1) {
    percentage %= 1;
    cycleStart += this.speed;

    this.playing ? this.grid.toggleCells() : this.grid.finishCycle();

    this.viewport.setCellStates(this.grid.states);
  }

  this.viewport.render(percentage);

  requestAnimationFrame(this.render.bind(this, cycleStart));
};

Game.prototype.togglePlayState = function () {
  this.playing = !this.playing;
};

Game.prototype.toggleGridlines = function () {
  this.viewport.toggleGridlines();
};

Game.prototype.setZoomLevel = function (newZoom) {
  this.viewport.setZoomLevel(newZoom);
};

Game.prototype.setSpeed = function (newSpeed) {
  this.speed = newSpeed;
};

Game.prototype.highlightCells = function (mousePos) {
  var data = {
    mousePos: mousePos,
    width: this.selectedStructure.width,
    height: this.selectedStructure.height
  };

  this.viewport.setHighlightData(data);
};

Game.prototype.clearHighlightData = function () {
  this.viewport.setHighlightData(null);
};

Game.prototype.addStructure = function (structure, startPos) {
  structure.awaken(this.grid, startPos);

  var posKeys = structure.targetCells(startPos).map(function(pos) {
    return pos.join(',');
  });

  this.viewport.setCellStates(this.grid.states);
};

Game.prototype.addSelectedStructure = function (mousePos) {
  var pos = this.viewport.calculateGridPos(mousePos);

  this.addStructure(this.selectedStructure, pos);
};

Game.prototype.setSelectedStructure = function (structure) {
  this.selectedStructure = structure;
};

Game.prototype.clearGrid = function () {
  this.grid.clear();
  this.viewport.setCellStates(this.grid.states);
};

module.exports = Game;
