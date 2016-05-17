var Cell = function(row, col, alive) {
  this.height = 10;
  this.width = 10;

  this.row = row;
  this.col = col;

  this.alive = alive;
};

Cell.prototype.render = function (ctx) {
  var color = this.alive ? 'black' : 'yellow';

  ctx.fillStyle = color;

  ctx.fillRect(
    this.row * this.width,
    this.col * this.height,
    this.width,
    this.height
  );

  ctx.strokeStyle = "gray";
  ctx.lineWidth   = 1;
  ctx.strokeRect(
    this.row * this.width,
    this.col * this.height,
    this.width,
    this.height
  );
};

module.exports = Cell;
