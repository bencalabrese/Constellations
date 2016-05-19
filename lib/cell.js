var Cell = function(row, col) {
  this.size = 10;

  this.row = row;
  this.col = col;

  this.alive = false;
};

Cell.prototype.renderChecker = function (ctx) {
  var color = this.alive ? 'black' : 'yellow';

  ctx.fillStyle = color;

  ctx.fillRect(
    this.row * this.size,
    this.col * this.size,
    this.size,
    this.size
  );

  ctx.strokeStyle = "gray";
  ctx.lineWidth   = 1;
  ctx.strokeRect(
    this.row * this.size,
    this.col * this.size,
    this.size,
    this.size
  );
};

Cell.prototype.renderOrb = function (ctx, percentage) {
  if (percentage > 1 || this.transitioning) { percentage = 1; }

  var transitionModifier = this.alive ? percentage : 1 - percentage;

  var displayRadius = this.size / 2 * transitionModifier;
  var alpha = transitionModifier;

  var radius = this.size / 2;
  var xPos = this.row * this.size + (radius);
  var yPos = this.col * this.size + (radius);

  var gradient = ctx.createRadialGradient(
    xPos,
    yPos,
    displayRadius,
    xPos,
    yPos,
    0
  );
  gradient.addColorStop(0, "black");
  gradient.addColorStop(1, "rgba(8, 146, 208, " + alpha + ")");

  ctx.beginPath();
  ctx.arc(xPos, yPos, radius, 0, 2*Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();
};

Cell.prototype.receiveLiveState = function (liveState) {
  this.transitioning = liveState === this.alive;
  this.alive = liveState;
};

module.exports = Cell;
