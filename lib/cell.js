var Cell = function(xPos, yPos, color) {
  this.height = 10;
  this.width = 10;

  this.xPos = xPos;
  this.yPos = yPos;

  this.color = color;
};

Cell.prototype.render = function (ctx) {
  ctx.fillStyle = this.color;

  ctx.fillRect(
    this.xPos * this.width,
    this.yPos * this.height,
    this.width,
    this.height
  );
};

window.Cell = Cell;
