var Grid = require('./grid');
var Viewport = require('./viewport');
var Structures = require('./structures/structures');

var Game = function(ctx) {
  this.ctx = ctx;
  this.grid = new Grid();
  this.viewport = new Viewport(this.grid, this.ctx);

  this.speed = 800;
};

Game.prototype.render = function () {
  this.viewport.render(1);
};

Game.prototype.play = function () {
  var cycleStart = new Date().getTime();

  setInterval(function() {
    var currentTime = new Date().getTime() - cycleStart;
    var percentage = currentTime / this.speed;

    if (percentage >= 1) {
      percentage %= 1;
      cycleStart += this.speed;

      this.grid.toggleCells();
      this.viewport.setCellStates();
    }

    this.viewport.render(percentage);
  }.bind(this), 10);
};

Game.prototype.addStructure = function (structureName, pos, rotation) {
  new Structures[structureName](this.grid, pos, rotation);
};


module.exports = Game;
