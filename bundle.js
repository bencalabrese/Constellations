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

	var Game = __webpack_require__(1),
	    bindListeners = __webpack_require__(18);
	
	$(function() {
	  var canvasEl = document.getElementById('canvas');
	  var ctx = canvasEl.getContext('2d');
	  window.game = new Game(ctx);
	
	  bindListeners(window.game);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Grid = __webpack_require__(2),
	    Viewport = __webpack_require__(3),
	    Structure = __webpack_require__(5),
	    Structures = __webpack_require__(6);
	
	var Game = function(ctx) {
	  this.ctx = ctx;
	  this.grid = new Grid();
	  this.viewport = new Viewport(this.grid, this.ctx);
	  this.selectedStructure = new Structure (Structures.SingleCell);
	
	  this.playing = false;
	  this.speed = 1000;
	
	  this.tabFocus = true;
	
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
	
	    if (!this.tabFocus) { this.playing = false; }
	    this.playing ? this.grid.toggleCells() : this.grid.finishCycle();
	
	    this.viewport.setCellStates(this.grid.states);
	  }
	
	  this.viewport.render(percentage);
	
	  requestAnimationFrame(this.render.bind(this, cycleStart));
	};
	
	Game.prototype.togglePlayState = function () {
	  this.playing = !this.playing;
	};
	
	Game.prototype.toggleGridlines = function () {
	  this.viewport.toggleGridlines();
	};
	
	Game.prototype.setZoomLevel = function (newZoom) {
	  this.viewport.setZoomLevel(newZoom);
	};
	
	Game.prototype.setSpeed = function (newSpeed) {
	  this.speed = newSpeed;
	};
	
	Game.prototype.toggleTabFocus = function () {
	  this.tabFocus = this.tabFocus ? false : true;
	};
	
	Game.prototype.highlightCells = function (mousePos) {
	  var data = {
	    mousePos: mousePos,
	    width: this.selectedStructure.width,
	    height: this.selectedStructure.height
	  };
	
	  this.viewport.setHighlightData(data);
	};
	
	Game.prototype.clearHighlightData = function () {
	  this.viewport.setHighlightData(null);
	};
	
	Game.prototype.addStructure = function (structure, startPos) {
	  structure.awaken(this.grid, startPos);
	
	  var posKeys = structure.targetCells(startPos).map(function(pos) {
	    return pos.join(',');
	  });
	
	  this.viewport.setCellStates(this.grid.states);
	};
	
	Game.prototype.addSelectedStructure = function (mousePos) {
	  var pos = this.viewport.calculateGridPos(mousePos);
	
	  this.addStructure(this.selectedStructure, pos);
	};
	
	Game.prototype.setSelectedStructure = function (structure) {
	  this.selectedStructure = structure;
	};
	
	Game.prototype.setOffsets = function (startPos, endPos) {
	  this.viewport.setOffsets(startPos, endPos);
	};
	
	Game.prototype.clearGrid = function () {
	  this.grid.clear();
	  this.viewport.setCellStates(this.grid.states);
	};
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

	var Grid = function() {
	  this.neighborCounts = {};
	  this.livingCells = new Set;
	  this.states = { retained: new Set, awakening: new Set, dying: new Set };
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
	
	  var retained = new Set,
	      awakening = new Set,
	      dying = new Set,
	      newLiveSet = new Set;
	
	  Object.keys(this.neighborCounts).forEach(function(posKey){
	    var neighborCount = self.neighborCounts[posKey],
	        alive = self.livingCells.has(posKey);
	
	    if (neighborCount === 2 && alive) {
	      newLiveSet.add(posKey);
	      retained.add(posKey);
	    } else if (neighborCount === 3) {
	      newLiveSet.add(posKey);
	      alive ? retained.add(posKey) : awakening.add(posKey);
	    } else {
	      if (alive) { dying.add(posKey); }
	    }
	  });
	
	  this.livingCells = newLiveSet;
	  this.neighborCounts = {};
	
	  this.states = {
	    retained: retained,
	    awakening: awakening,
	    dying: dying
	  };
	};
	
	Grid.prototype.finishCycle = function () {
	  this.states = {
	    retained: this.livingCells,
	    awakening: new Set,
	    dying: new Set
	  };
	};
	
	Grid.prototype.incrementNeighbors = function (row, col) {
	  Grid.NEIGHBOR_DELTAS.forEach(function(delta) {
	    var x = delta[0] + row,
	        y = delta[1] + col,
	        posKey = [x,y].join(',');
	
	    this.neighborCounts[posKey] = this.neighborCounts[posKey] || 0;
	    this.neighborCounts[posKey] += 1;
	  }.bind(this));
	
	  var thisPosKey = [row, col].join(',');
	
	  this.neighborCounts[thisPosKey] = this.neighborCounts[thisPosKey] || 0;
	};
	
	Grid.prototype.awakenCells = function (cells) {
	  cells.forEach(function(cellPos) {
	    var posKey = cellPos.join(',');
	    this.livingCells.add(posKey);
	    this.states.retained.add(posKey);
	    this.states.dying.delete(posKey);
	  }.bind(this));
	};
	
	Grid.prototype.killCells = function (cells) {
	  cells.forEach(function(cellPos) {
	    var posKey = cellPos.join(',');
	    this.livingCells.delete(posKey);
	    this.states.retained.delete(posKey);
	    this.states.awakening.delete(posKey);
	  }.bind(this));
	};
	
	Grid.prototype.alive = function (pos) {
	  return this.livingCells.has(pos.join(','));
	};
	
	Grid.prototype.clear = function () {
	  this.livingCells = new Set;
	  this.states = {
	    retained: new Set,
	    awakening: new Set,
	    dying: new Set
	  };
	};
	
	module.exports = Grid;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Cell = __webpack_require__(4);
	
	var Viewport = function(grid, ctx) {
	  this.grid = grid;
	  this.ctx = ctx;
	  this.gridlines = true;
	  this.zoomLevel = 4;
	  this.offsets = [0, 0];
	  this.cellOffsets = [0, 0];
	  this.cellFractionOffsets = [0, 0];
	
	  this.cells = [];
	};
	
	Viewport.prototype.render = function (percentage) {
	  this.recontextualize();
	  this.clear();
	
	  this.cells.forEach(function(cell) {
	    cell.renderOrb(percentage, this.cellOffsets)
	  }.bind(this));
	
	  if (this.highlightData) { this.highlightCells(); }
	  if (this.gridlines) { this.addGridlines(); }
	};
	
	Viewport.prototype.recontextualize = function () {
	  this.ctx.setTransform(
	    this.zoomLevel,
	    0,
	    0,
	    this.zoomLevel,
	    this.ctx.canvas.width / 2 + this.cellFractionOffsets[0] * 5 * this.zoomLevel,
	    this.ctx.canvas.height / 2 + this.cellFractionOffsets[1] * 5 * this.zoomLevel
	  );
	};
	
	Viewport.prototype.clear = function () {
	  var width = this.ctx.canvas.width,
	      height = this.ctx.canvas.height;
	
	  this.ctx.fillStyle = 'black';
	  this.ctx.fillRect(width * -1, height * -1, width * 2, height * 2);
	};
	
	Viewport.prototype.addGridlines = function () {
	  this.ctx.beginPath();
	  for(var i = -80; i < 80; i++) {
	    this.ctx.moveTo(this.ctx.canvas.width / -2, i * 5);
	    this.ctx.lineTo(this.ctx.canvas.width / 2, i * 5);
	
	    this.ctx.moveTo(i * 5, this.ctx.canvas.height / -2);
	    this.ctx.lineTo(i * 5, this.ctx.canvas.height / 2);
	  }
	
	  this.ctx.strokeStyle = "gray";
	  this.ctx.lineWidth = 0.125;
	  this.ctx.stroke();
	};
	
	Viewport.prototype.highlightCells = function () {
	  var pos = this.calculateGridPos(this.highlightData.mousePos),
	      row = pos[0],
	      col = pos[1];
	
	  this.ctx.fillStyle = 'rgba(255,255,0,0.2)';
	  this.ctx.fillRect(
	    (row + this.cellOffsets[0]) * 5,
	    (col + this.cellOffsets[1]) * 5,
	    this.highlightData.width * 5,
	    this.highlightData.height * 5
	  );
	};
	
	Viewport.prototype.calculateGridPos = function (mousePos) {
	  var offsets = [
	    this.ctx.canvas.width / 2 + this.cellFractionOffsets[0] * 5 * this.zoomLevel,
	    this.ctx.canvas.height / 2 + this.cellFractionOffsets[1] * 5 * this.zoomLevel
	  ];
	
	  return mousePos.map(function(dim, idx) {
	    var offset = dim - offsets[idx];
	    return Math.floor(offset / 5 / this.zoomLevel) - this.cellOffsets[idx];
	  }.bind(this));
	};
	
	Viewport.prototype.toggleGridlines = function () {
	  this.gridlines = this.gridlines ? false : true;
	};
	
	Viewport.prototype.setCellStates = function (states) {
	  this.cells = [];
	  var self = this;
	
	  Object.keys(states).forEach(function(state) {
	    states[state].forEach(function(posKey) {
	      var pos = posKey.split(',').map(function(i) { return parseInt(i); });
	
	      self.cells.push(new Cell(...pos, state, self.ctx));
	    });
	  });
	};
	
	Viewport.prototype.setHighlightData = function (data) {
	  this.highlightData = data;
	};
	
	Viewport.prototype.setZoomLevel = function (level) {
	  this.zoomLevel = level;
	};
	
	Viewport.prototype.setOffsets = function (startPos, endPos) {
	  var xOffset = (endPos[0] - startPos[0]) / 5 / this.zoomLevel,
	      yOffset = (endPos[1] - startPos[1]) / 5 / this.zoomLevel,
	      offsets = [this.offsets[0] + xOffset, this.offsets[1] + yOffset];
	
	  this.offsets = offsets;
	  this.calcCellOffsets();
	};
	
	Viewport.prototype.calcCellOffsets = function () {
	  this.cellFractionOffsets = this.offsets.map(offset => offset % 1 );
	  this.cellOffsets = this.offsets.map(offset => Math.floor(offset) );
	};
	
	module.exports = Viewport;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Cell = function(row, col, state, ctx) {
	  this.size = 5;
	
	  this.row = row;
	  this.col = col;
	
	  this.state = state;
	  this.ctx = ctx;
	};
	
	Cell.prototype.renderOrb = function (percentage, offsets) {
	  if (percentage > 1 || this.state === "retained") { percentage = 1; }
	
	  var transitionModifier = this.state === "dying" ?
	    1 - percentage :
	    percentage;
	
	  var displayRadius = this.size / 2 * transitionModifier;
	  var alpha = transitionModifier;
	
	  var radius = this.size / 2;
	  var xPos = (this.row + offsets[0]) * this.size + radius;
	  var yPos = (this.col + offsets[1]) * this.size + radius;
	
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
	
	module.exports = Cell;


/***/ },
/* 5 */
/***/ function(module, exports) {

	var Structure = function(options, rotationCount) {
	  this.height = options.height;
	  this.width = options.width;
	  this.liveCellDeltas = options.liveCellDeltas;
	
	  this.rotationCount = rotationCount || 0;
	  this.rotate();
	};
	
	Structure.prototype.awaken = function (grid, startPos) {
	  this.clearArea(grid, startPos);
	
	  var positions = this.liveCellDeltas.map(function(delta){
	    return [startPos[0] + delta[0], startPos[1] + delta[1]];
	  });
	
	  grid.awakenCells(positions);
	};
	
	Structure.prototype.clearArea = function (grid, startPos) {
	  grid.killCells(this.targetCells(startPos));
	};
	
	Structure.prototype.targetCells = function (startPos) {
	  var targetCells = [];
	
	  for (var y = 0; y < this.height; y++) {
	    for (var x = 0; x < this.width; x++) {
	      targetCells.push([startPos[0] + x, startPos[1] + y]);
	    }
	  }
	
	  return targetCells;
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Structures = {
	  SingleCell: __webpack_require__(7),
	  Eraser: __webpack_require__(8),
	  Block: __webpack_require__(9),
	  Blinker: __webpack_require__(10),
	  Cross: __webpack_require__(11),
	  KoksGalaxy: __webpack_require__(12),
	  Glider: __webpack_require__(13),
	  RPentomino: __webpack_require__(14),
	  GosperGliderGun: __webpack_require__(15),
	  // Halfmax: require('./halfmax'),
	  // BreederOne: require('./breeder_one'),
	  BackrakeOne: __webpack_require__(17)
	};
	
	module.exports = Structures;


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = {
	  name: "Single Cell",
	  height: 1,
	  width : 1,
	  liveCellDeltas : [
	    [0,0],
	  ]
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = {
	  name: "Eraser",
	  height: 1,
	  width : 1,
	  liveCellDeltas : []
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = {
	  name: "Block",
	  imageUrl: "block.png",
	  height: 4,
	  width : 4,
	  liveCellDeltas : [
	    [1,1],
	    [1,2],
	    [2,1],
	    [2,2]
	  ]
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = {
	  name: "Blinker",
	  imageUrl: "blinker.png",
	  height: 5,
	  width : 3,
	  liveCellDeltas : [
	    [1,1],
	    [1,2],
	    [1,3]
	  ]
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = {
	  name: "Cross",
	  imageUrl: "cross.png",
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


/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = {
	  name: "Kok's Galaxy",
	  imageUrl: "koks_galaxy.png",
	  height: 13,
	  width: 13,
	  liveCellDeltas: [
	    [4, 2],
	    [7, 2],
	    [9, 2],
	    [2, 3],
	    [3, 3],
	    [5, 3],
	    [7, 3],
	    [8, 3],
	    [9, 3],
	    [3, 4],
	    [10, 4],
	    [2, 5],
	    [3, 5],
	    [9, 5],
	    [3, 7],
	    [9, 7],
	    [10, 7],
	    [2, 8],
	    [9, 8],
	    [3, 9],
	    [4, 9],
	    [5, 9],
	    [7, 9],
	    [9, 9],
	    [10, 9],
	    [3, 10],
	    [5, 10],
	    [8, 10]
	  ]
	};


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = {
	  name: "Glider",
	  imageUrl: "glider.png",
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


/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = {
	  name: "R Pentomino",
	  imageUrl: "r_pentomino.png",
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


/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = {
	  name: "Gosper Glider Gun",
	  imageUrl: "gosper_glider_gun.png",
	  height: 11,
	  width: 38,
	  liveCellDeltas: [
	    [25, 1],
	    [23, 2],
	    [25, 2],
	    [13, 3],
	    [14, 3],
	    [21, 3],
	    [22, 3],
	    [35, 3],
	    [36, 3],
	    [12, 4],
	    [16, 4],
	    [21, 4],
	    [22, 4],
	    [35, 4],
	    [36, 4],
	    [1, 5],
	    [2, 5],
	    [11, 5],
	    [17, 5],
	    [21, 5],
	    [22, 5],
	    [1, 6],
	    [2, 6],
	    [11, 6],
	    [15, 6],
	    [17, 6],
	    [18, 6],
	    [23, 6],
	    [25, 6],
	    [11, 7],
	    [17, 7],
	    [25, 7],
	    [12, 8],
	    [16, 8],
	    [13, 9],
	    [14, 9]
	  ]
	};


/***/ },
/* 16 */,
/* 17 */
/***/ function(module, exports) {

	module.exports = {
	  name: "Backrake One",
	  imageUrl: "backrake_one.png",
	  height: 20,
	  width: 29,
	  liveCellDeltas: [
	    [6, 1],
	    [7, 1],
	    [8, 1],
	    [20, 1],
	    [21, 1],
	    [22, 1],
	    [5, 2],
	    [9, 2],
	    [19, 2],
	    [23, 2],
	    [4, 3],
	    [5, 3],
	    [10, 3],
	    [18, 3],
	    [23, 3],
	    [24, 3],
	    [3, 4],
	    [5, 4],
	    [7, 4],
	    [8, 4],
	    [10, 4],
	    [11, 4],
	    [17, 4],
	    [18, 4],
	    [20, 4],
	    [21, 4],
	    [23, 4],
	    [25, 4],
	    [2, 5],
	    [3, 5],
	    [5, 5],
	    [10, 5],
	    [12, 5],
	    [13, 5],
	    [15, 5],
	    [16, 5],
	    [18, 5],
	    [23, 5],
	    [25, 5],
	    [26, 5],
	    [1, 6],
	    [6, 6],
	    [10, 6],
	    [13, 6],
	    [15, 6],
	    [18, 6],
	    [22, 6],
	    [27, 6],
	    [13, 7],
	    [15, 7],
	    [1, 8],
	    [2, 8],
	    [10, 8],
	    [11, 8],
	    [13, 8],
	    [15, 8],
	    [17, 8],
	    [18, 8],
	    [26, 8],
	    [27, 8],
	    [13, 9],
	    [15, 9],
	    [7, 10],
	    [8, 10],
	    [9, 10],
	    [19, 10],
	    [20, 10],
	    [21, 10],
	    [7, 11],
	    [11, 11],
	    [21, 11],
	    [7, 12],
	    [9, 12],
	    [14, 12],
	    [15, 12],
	    [16, 12],
	    [13, 13],
	    [16, 13],
	    [21, 13],
	    [22, 13],
	    [16, 14],
	    [12, 15],
	    [16, 15],
	    [12, 16],
	    [16, 16],
	    [16, 17],
	    [13, 18],
	    [15, 18]
	  ]
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var Structure = __webpack_require__(5),
	    Structures = __webpack_require__(6);
	
	var bindListeners = function(game) {
	  // Top Control Panel
	
	  $(window).on("blur focus", function() {
	    game.toggleTabFocus();
	    setPlayButtonText();
	  });
	
	  $('#play-button').click(function(event) {
	    game.togglePlayState();
	    setPlayButtonText();
	  });
	
	  function setPlayButtonText() {
	    $('#play-button').text(function(){
	      return game.playing ? "Pause" : "Play";
	    });
	  }
	
	  $('#gridlines-button').click(game.toggleGridlines.bind(game));
	
	  $('#clear-button').click(game.clearGrid.bind(game));
	
	  $('#speed-slider').slider({
	    min: -100,
	    max: 450,
	    value: 0,
	    slide: function(event, ui) {
	      game.setSpeed(1000 / Math.pow(2, ui.value / 100));
	    }
	  });
	
	  $('#zoom-slider').slider({
	    min: 0,
	    max: 500,
	    value: 200,
	    slide: function(event, ui) {
	      game.setZoomLevel(Math.pow(2, ui.value / 100));
	    }
	  });
	
	  // Canvas Events
	  var panning = false,
	      panStart = null;
	
	  function sendPanData(panEnd) {
	    game.setOffsets(panStart, panEnd);
	  }
	
	  $(window).keydown(event => {
	    if (event.key === "Shift") {
	      panning = true;
	      game.clearHighlightData();
	      $('#canvas').addClass("pan-hover");
	    }
	  });
	
	  $(window).keyup(event => {
	    if (event.key === "Shift") {
	      panning = false;
	      $('#canvas').removeClass("pan-hover pan-grab");
	    }
	  });
	
	  $('#canvas').mousemove(function(event) {
	    var canvas = event.currentTarget,
	        x = event.pageX - canvas.offsetLeft,
	        y = event.pageY - canvas.offsetTop;
	
	    if (panning) {
	      if (panStart) {
	        sendPanData([x,y]);
	        panStart = [x, y];
	      }
	    } else {
	      game.highlightCells([x,y]);
	    }
	  });
	
	  $('#canvas').mouseleave(game.clearHighlightData.bind(game));
	
	  $('#canvas').mousedown(function(event) {
	    var canvas = event.currentTarget,
	        x = event.pageX - canvas.offsetLeft,
	        y = event.pageY - canvas.offsetTop;
	
	    if (panning) {
	      panStart = [x, y];
	      $('#canvas').addClass("pan-grab");
	    } else {
	      game.addSelectedStructure([x,y]);
	    }
	  });
	
	  $('#canvas').mouseup(function(event) {
	    $('#canvas').removeClass("pan-grab");
	    panStart = null;
	  });
	
	  // Structures Panel
	
	  var rotation = 0;
	  var selectedStructure = Structures.SingleCell;
	
	  function select(structure, event) {
	    selectedStructure = structure;
	    game.setSelectedStructure(new Structure(structure, rotation));
	
	    $('.sidebar *').removeClass("selected");
	    $(event.currentTarget).addClass("selected");
	  }
	
	  $('#rotate-button').click(function() {
	    rotation = (rotation + 1) % 4;
	    game.setSelectedStructure(new Structure(selectedStructure, rotation));
	    $('#structures img').css("transform", "rotate(" + rotation * -90  + "deg)");
	  });
	
	  $('#single-cell-button').click(select.bind(null, Structures.SingleCell));
	  $('#eraser-button').click(select.bind(null, Structures.Eraser));
	
	  Object.keys(Structures).forEach(function(key) {
	    var structure = Structures[key];
	    if (!structure.imageUrl) { return; }
	
	    var $structure = $("<img src='./assets/" + structure.imageUrl + "'/></img>");
	    $structure.click(select.bind(null, structure));
	
	    $('#structures').append($structure);
	  });
	};
	
	module.exports = bindListeners;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map