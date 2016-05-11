/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Grid = __webpack_require__(1);
	
	document.addEventListener('DOMContentLoaded', function() {
	  window.canvasEl = document.getElementById('canvas');
	  window.ctx = window.canvasEl.getContext('2d');
	  window.grid = new Grid(80, 80);
	
	
	  window.grid.awakenCells([
	    // Block
	    [23,23],
	    [23,24],
	    [24,23],
	    [24,24],
	
	    // Blinker
	    [40,43],
	    [40,44],
	    [40,45],
	
	    //Cross
	    [11, 13],
	    [11, 14],
	    [11, 15],
	    [11, 16],
	    [12, 13],
	    [12, 16],
	    [13, 11],
	    [13, 12],
	    [13, 13],
	    [13, 16],
	    [13, 17],
	    [13, 18],
	    [14, 11],
	    [14, 18],
	    [15, 11],
	    [15, 18],
	    [16, 11],
	    [16, 12],
	    [16, 13],
	    [16, 16],
	    [16, 17],
	    [16, 18],
	    [17, 13],
	    [17, 16],
	    [18, 13],
	    [18, 14],
	    [18, 15],
	    [18, 16],
	
	    // Kok's Galaxy
	    [50, 50],
	    [50, 51],
	    [50, 52],
	    [50, 53],
	    [50, 54],
	    [50, 55],
	    [51, 50],
	    [51, 51],
	    [51, 52],
	    [51, 53],
	    [51, 54],
	    [51, 55],
	
	    [50, 57],
	    [51, 57],
	    [52, 57],
	    [53, 57],
	    [54, 57],
	    [55, 57],
	    [50, 58],
	    [51, 58],
	    [52, 58],
	    [53, 58],
	    [54, 58],
	    [55, 58],
	
	    [57, 53],
	    [57, 54],
	    [57, 55],
	    [57, 56],
	    [57, 57],
	    [57, 58],
	    [58, 53],
	    [58, 54],
	    [58, 55],
	    [58, 56],
	    [58, 57],
	    [58, 58],
	
	    [53, 50],
	    [54, 50],
	    [55, 50],
	    [56, 50],
	    [57, 50],
	    [58, 50],
	    [53, 51],
	    [54, 51],
	    [55, 51],
	    [56, 51],
	    [57, 51],
	    [58, 51],
	
	    // Glider
	    [35, 6],
	    [36, 4],
	    [36, 6],
	    [37, 5],
	    [37, 6],
	  ]);
	
	  setInterval(function() {
	    window.grid.cycle(window.ctx);
	  }, 200);
	
	  // window.grid.render(window.ctx);
	
	
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Cell = __webpack_require__(2);
	
	var Grid = function(numRows, numCols) {
	  this.numRows = numRows;
	  this.numCols = numCols;
	
	  this.generate();
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
	
	Grid.prototype.generate = function () {
	  this.grid = [];
	
	  for (var row = 0; row < this.numRows; row++) {
	    this.grid[row] = [];
	
	    for (var col = 0; col < this.numCols; col++) {
	      var cell = new Cell(col, row);
	
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
	  this.grid.forEach(function(row) {
	    row.forEach(function(cell) {
	      cell.render(ctx);
	    });
	  });
	};
	
	Grid.prototype.cycle = function (ctx) {
	  this.toggleCells();
	  this.render(ctx);
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
	
	Grid.prototype.killCells = function (cells) {
	  var self = this;
	
	  cells.forEach(function(cellPos) {
	    self.grid[cellPos[0]][cellPos[1]].alive = false;
	  });
	};
	
	module.exports = Grid;


/***/ },
/* 2 */
/***/ function(module, exports) {

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
	
	module.exports = Cell;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map