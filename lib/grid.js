var Grid = function() {
  this.neighborCounts = {};
  this.livingCells = new Set;
};

Grid.NEIGHBOR_DELTAS = [
  [-1, -1],
  [-1,  0],
  [-1,  1],
  [ 0, -1],
  [ 0,  1],
  [ 1, -1],
  [ 1,  0],
  [ 1,  1]
];

Grid.prototype.toggleCells = function (ctx) {
  var self = this;

  this.livingCells.forEach(function(posKey){
    var pos = posKey.split(','),
        row = parseInt(pos[0]),
        col = parseInt(pos[1]);

    self.incrementNeighbors(row, col);
  });

  var newSet = new Set;

  Object.keys(this.neighborCounts).forEach(function(posKey){
    var neighborCount = self.neighborCounts[posKey];

    if (neighborCount === 2 && self.livingCells.has(posKey)) {
      newSet.add(posKey);
    }
    if (neighborCount === 3) { newSet.add(posKey); }
  });

  this.livingCells = newSet;
  this.neighborCounts = {};
};

Grid.prototype.incrementNeighbors = function (row, col) {
  var self = this;

  Grid.NEIGHBOR_DELTAS.forEach(function(delta) {
    var x = delta[0] + row,
        y = delta[1] + col,
        posKey = [x,y].join(',');

    self.neighborCounts[posKey] = self.neighborCounts[posKey] || 0;
    self.neighborCounts[posKey] += 1;
  });
};

Grid.prototype.awakenCells = function (cells) {
  var self = this;

  cells.forEach(function(cellPos) {
    self.livingCells.add(cellPos.join(','));
  });
};

Grid.prototype.killCells = function (cells) {
  var self = this;

  cells.forEach(function(cellPos) {
    self.livingCells.delete(cellPos.join(','));
  });
};

Grid.prototype.alive = function (pos) {
  return this.livingCells.has(pos.join(','));
};

module.exports = Grid;
