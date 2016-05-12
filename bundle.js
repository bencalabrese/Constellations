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
	var Structures = __webpack_require__(6);
	
	document.addEventListener('DOMContentLoaded', function() {
	  window.canvasEl = document.getElementById('canvas');
	  window.ctx = window.canvasEl.getContext('2d');
	  window.grid = new Grid(80, 80);
	  window.Structures = Structures;
	
	  new Structures.Block(window.grid, [22,22]);
	  new Structures.Blinker(window.grid, [39,42]);
	  new Structures.Cross(window.grid, [10,12]);
	  new Structures.KoksGalaxy(window.grid, [49,49]);
	  new Structures.Glider(window.grid, [34,5]);
	
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
	    self.grid[cellPos[1]][cellPos[0]].alive = true;
	  });
	};
	
	Grid.prototype.killCells = function (cells) {
	  var self = this;
	
	  cells.forEach(function(cellPos) {
	    self.grid[cellPos[1]][cellPos[0]].alive = false;
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Structure = __webpack_require__(4),
	    Util = __webpack_require__(5);
	
	var Block = function(grid, startPos) {
	  Structure.call(this, Block.OPTIONS);
	
	  this.render(grid, startPos);
	};
	
	Util.inherits(Block, Structure);
	
	Block.OPTIONS = {
	  height: 4,
	  width : 4,
	  liveCellDeltas : [
	    [1,1],
	    [1,2],
	    [2,1],
	    [2,2]
	  ]
	};
	
	module.exports = Block;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Structure = function(options, grid, startPos) {
	  this.height = options.height;
	  this.width = options.width;
	  this.liveCellDeltas = options.liveCellDeltas;
	};
	
	Structure.prototype.render = function (grid, startPos) {
	  this.clearArea(grid, startPos);
	
	  var positions = this.liveCellDeltas.map(function(delta){
	    return [startPos[0] + delta[0], startPos[1] + delta[1]];
	  });
	
	  grid.awakenCells(positions);
	};
	
	Structure.prototype.clearArea = function (grid, startPos) {
	  var targetCells = [];
	
	  for (var y = 0; y < this.height; y++) {
	    for (var x = 0; x < this.width; x++) {
	      targetCells.push([startPos[0] + x, startPos[1] + y]);
	    }
	  }
	
	  grid.killCells(targetCells);
	};
	
	module.exports = Structure;


/***/ },
/* 5 */
/***/ function(module, exports) {

	var Util = {
	  inherits: function (ChildClass, ParentClass) {
	    function Surrogate () {}
	    Surrogate.prototype = ParentClass.prototype;
	    ChildClass.prototype = new Surrogate();
	    ChildClass.prototype.constructor = ChildClass;
	  }
	};
	
	module.exports = Util;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(3),
	    Blinker = __webpack_require__(7),
	    Cross = __webpack_require__(8),
	    KoksGalaxy = __webpack_require__(9),
	    Glider = __webpack_require__(10);
	
	var Structures = {
	  Block: Block,
	  Blinker: Blinker,
	  Cross: Cross,
	  KoksGalaxy: KoksGalaxy,
	  Glider: Glider
	};
	
	module.exports = Structures;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Structure = __webpack_require__(4),
	    Util = __webpack_require__(5);
	
	var Blinker = function(grid, startPos) {
	  Structure.call(this, Blinker.OPTIONS);
	
	  this.render(grid, startPos);
	};
	
	Util.inherits(Blinker, Structure);
	
	Blinker.OPTIONS = {
	  height: 5,
	  width : 3,
	  liveCellDeltas : [
	    [1,1],
	    [1,2],
	    [1,3]
	  ]
	};
	
	module.exports = Blinker;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Structure = __webpack_require__(4),
	    Util = __webpack_require__(5);
	
	var Cross = function(grid, startPos) {
	  Structure.call(this, Cross.OPTIONS);
	
	  this.render(grid, startPos);
	};
	
	Util.inherits(Cross, Structure);
	
	Cross.OPTIONS = {
	  height: 10,
	  width : 10,
	  liveCellDeltas : [
	    [1, 3],
	    [1, 4],
	    [1, 5],
	    [1, 6],
	    [2, 3],
	    [2, 6],
	    [3, 1],
	    [3, 2],
	    [3, 3],
	    [3, 6],
	    [3, 7],
	    [3, 8],
	    [4, 1],
	    [4, 8],
	    [5, 1],
	    [5, 8],
	    [6, 1],
	    [6, 2],
	    [6, 3],
	    [6, 6],
	    [6, 7],
	    [6, 8],
	    [7, 3],
	    [7, 6],
	    [8, 3],
	    [8, 4],
	    [8, 5],
	    [8, 6]
	  ]
	};
	
	module.exports = Cross;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Structure = __webpack_require__(4),
	    Util = __webpack_require__(5);
	
	var KoksGalaxy = function(grid, startPos) {
	  Structure.call(this, KoksGalaxy.OPTIONS);
	
	  this.render(grid, startPos);
	};
	
	Util.inherits(KoksGalaxy, Structure);
	
	KoksGalaxy.OPTIONS = {
	  height: 11,
	  width : 11,
	  liveCellDeltas : [
	
	    [1, 1],
	    [1, 2],
	    [1, 3],
	    [1, 4],
	    [1, 5],
	    [1, 6],
	    [2, 1],
	    [2, 2],
	    [2, 3],
	    [2, 4],
	    [2, 5],
	    [2, 6],
	
	    [1, 8],
	    [2, 8],
	    [3, 8],
	    [4, 8],
	    [5, 8],
	    [6, 8],
	    [1, 9],
	    [2, 9],
	    [3, 9],
	    [4, 9],
	    [5, 9],
	    [6, 9],
	
	    [8, 4],
	    [8, 5],
	    [8, 6],
	    [8, 7],
	    [8, 8],
	    [8, 9],
	    [9, 4],
	    [9, 5],
	    [9, 6],
	    [9, 7],
	    [9, 8],
	    [9, 9],
	
	    [4, 1],
	    [5, 1],
	    [6, 1],
	    [7, 1],
	    [8, 1],
	    [9, 1],
	    [4, 2],
	    [5, 2],
	    [6, 2],
	    [7, 2],
	    [8, 2],
	    [9, 2]
	  ]
	};
	
	module.exports = KoksGalaxy;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Structure = __webpack_require__(4),
	    Util = __webpack_require__(5);
	
	var Glider = function(grid, startPos) {
	  Structure.call(this, Glider.OPTIONS);
	
	  this.render(grid, startPos);
	};
	
	Util.inherits(Glider, Structure);
	
	Glider.OPTIONS = {
	  height: 5,
	  width : 5,
	  liveCellDeltas : [
	    [1, 3],
	    [2, 1],
	    [2, 3],
	    [3, 2],
	    [3, 3]
	  ]
	};
	
	module.exports = Glider;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map