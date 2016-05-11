var Cell = window.Cell;

var Grid = function(numRows, numCols) {
  this.numRows = numRows;
  this.numCols = numCols;

  this.generate();
};

Grid.COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'pink'];

Grid.randomColor = function() {
  var idx = Math.floor(Math.random() * Grid.COLORS.length);

  return Grid.COLORS[idx];
};

Grid.prototype.generate = function () {
  this.grid = [];

  for (var row = 0; row < this.numRows; row++) {
    this.grid[row] = [];

    for (var col = 0; col < this.numCols; col++) {
      var cell = new Cell(row, col, Grid.randomColor());

      this.grid[row][col] = cell;
    }
  }
};

Grid.prototype.render = function (ctx) {
  this.grid.forEach(function(row) {
    row.forEach(function(cell) {
      cell.render(ctx);
    });
  });
};

window.Grid = Grid;
