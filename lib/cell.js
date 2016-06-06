var Cell = function(row, col, state, ctx) {
  this.size = 5;

  this.row = row;
  this.col = col;

  this.state = state;
  this.ctx = ctx;
  // this.alive = false;
};

Cell.prototype.renderOrb = function (percentage) {
  if (percentage > 1 || this.state === "retained") { percentage = 1; }

  var transitionModifier = this.state === "dying" ?
    1 - percentage :
    percentage;

  var displayRadius = this.size / 2 * transitionModifier;
  var alpha = transitionModifier;

  var radius = this.size / 2;
  var xPos = this.row * this.size + (radius);
  var yPos = this.col * this.size + (radius);

  var gradient = this.ctx.createRadialGradient(
    xPos,
    yPos,
    displayRadius,
    xPos,
    yPos,
    0
  );
  gradient.addColorStop(0, "black");
  gradient.addColorStop(1, "rgba(8, 146, 208, " + alpha + ")");

  this.ctx.beginPath();
  this.ctx.arc(xPos, yPos, radius, 0, 2*Math.PI);
  this.ctx.fillStyle = gradient;
  this.ctx.fill();
};

// Cell.prototype.receiveLiveState = function (liveState) {
//   this.transitioning = liveState !== this.alive;
//   this.alive = liveState;
// };

module.exports = Cell;
