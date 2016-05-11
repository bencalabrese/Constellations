var Cell = function(xPos, yPos) {
  this.height = 10;
  this.width = 10;

  this.xPos = xPos;
  this.yPos = yPos;

  this.alive = false;
  this.shouldToggle = false;
};

Cell.prototype.render = function (ctx) {
  if (this.shouldToggle) { this.toggle(); }

  var color = this.alive ? 'black' : 'yellow';

  ctx.fillStyle = color;

  ctx.fillRect(
    this.xPos * this.width,
    this.yPos * this.height,
    this.width,
    this.height
  );

  ctx.strokeStyle = "gray";
  ctx.lineWidth   = 1;
  ctx.strokeRect(
    this.xPos * this.width,
    this.yPos * this.height,
    this.width,
    this.height
  );

};

Cell.prototype.receiveLiveNeighborCount = function (liveNeighborCount) {
  if (this.alive) {
    if (liveNeighborCount < 2 || liveNeighborCount > 3) {
      this.shouldToggle = true;
    }
  } else {
    if (liveNeighborCount === 3) { this.shouldToggle = true; }
  }
};

Cell.prototype.toggle = function () {
  this.shouldToggle = false;
  this.alive = this.alive ? false : true;
};

window.Cell = Cell;
