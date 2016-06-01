var Grid = require('./grid');
var Viewport = require('./viewport');
var Structures = require('./structures/structures');

var Game = function(ctx) {
  this.ctx = ctx;
  this.grid = new Grid();
  this.viewport = new Viewport(this.grid, this.ctx);

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

    if (this.playing) { this.grid.toggleCells(); }

    this.viewport.setCellStates();
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

Game.prototype.setSpeed = function (newSpeed) {
  this.speed = newSpeed;
};

Game.prototype.addStructure = function (structureName, pos, rotation) {
  new Structures[structureName](this.grid, pos, rotation);
};

module.exports = Game;
