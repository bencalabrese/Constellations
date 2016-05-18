var Cell = function(row, col, alive) {
  this.height = 10;
  this.width = 10;
  this.size = 10;

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

Cell.prototype.renderOrb = function (ctx) {
  if (this.alive) {
    var radius = this.size / 2;
    var xPos = this.row * this.size + (radius);
    var yPos = this.col * this.size + (radius);

    var grd = ctx.createRadialGradient(xPos, yPos, radius, xPos, yPos, 0);
    grd.addColorStop(0, "white");
    grd.addColorStop(1, "rgba(0, 0, 200, 0.8)");

    ctx.beginPath();
    ctx.arc(xPos, yPos, radius, 0, 2*Math.PI);
    ctx.fillStyle = grd;
    ctx.fill();
  } else {
    ctx.fillStyle = 'white';

    ctx.fillRect(
      this.row * this.width,
      this.col * this.height,
      this.width,
      this.height
    );
  }
};

module.exports = Cell;
