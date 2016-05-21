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

	var Game = __webpack_require__(1);
	
	document.addEventListener('DOMContentLoaded', function() {
	  var canvasEl = document.getElementById('canvas');
	  var ctx = canvasEl.getContext('2d');
	  window.game = new Game(ctx);
	
	  // window.game.addStructure('Block', [22,22]);
	  // window.game.addStructure('Cross', [-3,-3]);
	  // window.game.addStructure('Blinker', [39,42]);
	  // window.game.addStructure('KoksGalaxy', [49,49]);
	  // window.game.addStructure('Glider', [34,5]);
	  window.game.addStructure('RPentomino', [100,100]);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Grid = __webpack_require__(2);
	var Viewport = __webpack_require__(3);
	var Structures = __webpack_require__(5);
	
	var Game = function(ctx) {
	  this.ctx = ctx;
	  this.grid = new Grid();
	  this.viewport = new Viewport(this.grid, this.ctx);
	
	  this.playing = false;
	  this.speed = 1000;
	
	  this.cycle();
	};
	
	Game.prototype.cycle = function () {
	  var cycleStart = new Date().getTime();
	
	  this.render(cycleStart);
	};
	
	Game.prototype.render = function (cycleStart) {
	  var currentTime = new Date().getTime() - cycleStart;
	  var percentage = currentTime / this.speed;
	
	  if (percentage >= 1) {
	    percentage %= 1;
	    cycleStart += this.speed;
	
	    if (this.playing) { this.grid.toggleCells(); }
	
	    this.viewport.setCellStates();
	  }
	
	  this.viewport.render(percentage);
	
	  requestAnimationFrame(this.render.bind(this, cycleStart));
	};
	
	Game.prototype.togglePlayState = function () {
	  this.playing = !this.playing;
	};
	
	Game.prototype.setSpeed = function (newSpeed) {
	  this.speed = newSpeed;
	};
	
	Game.prototype.addStructure = function (structureName, pos, rotation) {
	  new Structures[structureName](this.grid, pos, rotation);
	};
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Cell = __webpack_require__(4);
	
	var Viewport = function(grid, ctx) {
	  this.grid = grid;
	  this.ctx = ctx;
	
	  this.displaySize = 200;
	  this.cells = [];
	
	  this.generateCells();
	};
	
	Viewport.prototype.generateCells = function () {
	  for (var row = 0; row < this.displaySize; row++) {
	    for (var col = 0; col < this.displaySize; col++) {
	      this.cells.push(new Cell(row, col));
	    }
	  }
	};
	
	Viewport.prototype.render = function (percentage) {
	  this.clear();
	
	  this.cells.forEach(function(cell){
	    if (cell.alive || cell.transitioning) {
	      cell.renderOrb(this.ctx, percentage);
	    }
	  }.bind(this));
	};
	
	Viewport.prototype.clear = function () {
	  var width = this.ctx.canvas.width,
	      height = this.ctx.canvas.height;
	
	  this.ctx.fillStyle = 'black';
	  this.ctx.fillRect(0, 0, width, height);
	};
	
	Viewport.prototype.setCellStates = function () {
	  this.cells.forEach(function(cell){
	    var liveState = this.grid.alive([cell.row, cell.col]);
	
	    cell.receiveLiveState(liveState);
	  }.bind(this));
	};
	
	module.exports = Viewport;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Cell = function(row, col) {
	  this.size = 4;
	
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
	  if (percentage > 1 || !this.transitioning) { percentage = 1; }
	
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
	  this.transitioning = liveState !== this.alive;
	  this.alive = liveState;
	};
	
	module.exports = Cell;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(6),
	    Blinker = __webpack_require__(9),
	    Cross = __webpack_require__(10),
	    KoksGalaxy = __webpack_require__(11),
	    Glider = __webpack_require__(12),
	    RPentomino = __webpack_require__(13);
	
	var Structures = {
	  Block: Block,
	  Blinker: Blinker,
	  Cross: Cross,
	  KoksGalaxy: KoksGalaxy,
	  Glider: Glider,
	  RPentomino: RPentomino
	};
	
	module.exports = Structures;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Structure = __webpack_require__(7),
	    Util = __webpack_require__(8);
	
	var Block = function(grid, startPos, rotationCount) {
	  Structure.call(this, Block.OPTIONS, rotationCount);
	
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
/* 7 */
/***/ function(module, exports) {

	var Structure = function(options, rotationCount) {
	  this.height = options.height;
	  this.width = options.width;
	  this.liveCellDeltas = options.liveCellDeltas;
	
	  this.rotationCount = rotationCount || 0;
	};
	
	Structure.prototype.render = function (grid, startPos) {
	  this.rotate();
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
	
	Structure.prototype.rotate = function () {
	  for (var i = 0; i < this.rotationCount % 4; i++) {
	    this.rotateNinetyDegrees();
	  }
	};
	
	Structure.prototype.rotateNinetyDegrees = function () {
	  var temp = this.height;
	  this.height = this.width;
	  this.width = temp;
	
	  var offset = this.height - 1;
	
	  this.liveCellDeltas = this.liveCellDeltas.map(function(delta){
	    return [delta[1], (delta[0] * -1) + offset];
	  });
	};
	
	module.exports = Structure;


/***/ },
/* 8 */
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Structure = __webpack_require__(7),
	    Util = __webpack_require__(8);
	
	var Blinker = function(grid, startPos, rotationCount) {
	  Structure.call(this, Blinker.OPTIONS, rotationCount);
	
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Structure = __webpack_require__(7),
	    Util = __webpack_require__(8);
	
	var Cross = function(grid, startPos, rotationCount) {
	  Structure.call(this, Cross.OPTIONS, rotationCount);
	
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Structure = __webpack_require__(7),
	    Util = __webpack_require__(8);
	
	var KoksGalaxy = function(grid, startPos, rotationCount) {
	  Structure.call(this, KoksGalaxy.OPTIONS, rotationCount);
	
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var Structure = __webpack_require__(7),
	    Util = __webpack_require__(8);
	
	var Glider = function(grid, startPos, rotationCount) {
	  Structure.call(this, Glider.OPTIONS, rotationCount);
	
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


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Structure = __webpack_require__(7),
	    Util = __webpack_require__(8);
	
	var RPentomino = function(grid, startPos, rotationCount) {
	  Structure.call(this, RPentomino.OPTIONS, rotationCount);
	
	  this.render(grid, startPos);
	};
	
	Util.inherits(RPentomino, Structure);
	
	RPentomino.OPTIONS = {
	  height: 5,
	  width : 5,
	  liveCellDeltas : [
	    [1, 2],
	    [1, 3],
	    [2, 1],
	    [2, 2],
	    [3, 2]
	  ]
	};
	
	module.exports = RPentomino;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map