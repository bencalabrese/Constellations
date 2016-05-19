var Cell = function(row, col) {
  this.height = 10;
  this.width = 10;
  this.size = 10;

  this.row = row;
  this.col = col;

  this.alive = false;
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

Cell.prototype.renderOrb = function (ctx) {
  ctx.fillStyle = 'black';

  ctx.fillRect(
    this.row * this.width,
    this.col * this.height,
    this.width,
    this.height
  );

  if (this.alive) {
    var radius = this.size / 2;
    var xPos = this.row * this.size + (radius);
    var yPos = this.col * this.size + (radius);

    var grd = ctx.createRadialGradient(xPos, yPos, radius, xPos, yPos, 0);
    grd.addColorStop(0, "black");
    grd.addColorStop(1, "rgba(8, 146, 208, 1)");

    ctx.beginPath();
    ctx.arc(xPos, yPos, radius, 0, 2*Math.PI);
    ctx.fillStyle = grd;
    ctx.fill();
  }
};

module.exports = Cell;
