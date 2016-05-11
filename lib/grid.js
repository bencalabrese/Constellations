var Cell = window.Cell;

var Grid = function(numRows, numCols) {
  this.numRows = numRows;
  this.numCols = numCols;

  this.generate();
};

// Grid.COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'pink'];

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
//
// Grid.randomColor = function() {
//   var idx = Math.floor(Math.random() * Grid.COLORS.length);
//
//   return Grid.COLORS[idx];
// };

Grid.prototype.generate = function () {
  this.grid = [];

  for (var row = 0; row < this.numRows; row++) {
    this.grid[row] = [];

    for (var col = 0; col < this.numCols; col++) {
      var cell = new Cell(row, col);

      this.grid[row][col] = cell;
    }
  }
};

Grid.prototype.toggleCells = function (ctx) {
  var self = this;

  this.grid.forEach(function(row, rowNum) {
    row.forEach(function(cell, colNum) {
      var liveNeighborCount = self.liveNeighborCount(rowNum, colNum);

      cell.receiveLiveNeighborCount(liveNeighborCount);
    });
  });
};

Grid.prototype.render = function (ctx) {
  this.toggleCells();

  this.grid.forEach(function(row) {
    row.forEach(function(cell) {
      cell.render(ctx);
    });
  });
};

Grid.prototype.liveNeighborCount = function (row, col) {
  var count = 0;
  var self = this;

  Grid.NEIGHBOR_DELTAS.forEach(function(delta) {
    var x = delta[0] + row,
        y = delta[1] + col;

    if (self.grid[x] && self.grid[x][y] && self.grid[x][y].alive) {
      count += 1;
    }
  });

  return count;
};

Grid.prototype.accessCell = function (row, col) {
  return this.grid[row][col];
};

Grid.prototype.awakenCells = function (cells) {
  var self = this;

  cells.forEach(function(cellPos) {
    self.grid[cellPos[0]][cellPos[1]].alive = true;
  });
};

window.Grid = Grid;
