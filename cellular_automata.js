var Grid = require('./lib/grid');
var Viewport = require('./lib/viewport');
var Structures = require('./lib/structures/structures');

document.addEventListener('DOMContentLoaded', function() {
  window.canvasEl = document.getElementById('canvas');
  window.ctx = window.canvasEl.getContext('2d');
  window.grid = new Grid(80, 80);
  window.viewport = new Viewport(window.grid, window.ctx);
  window.Structures = Structures;
  //
  // new Structures.Block(window.grid, [22,22]);
  // new Structures.Blinker(window.grid, [39,42]);
  // new Structures.Cross(window.grid, [-3,-3]);
  // new Structures.KoksGalaxy(window.grid, [49,49]);
  // new Structures.Glider(window.grid, [34,5]);
  new Structures.RPentomino(window.grid, [40, 40]);

  setInterval(function() {
    window.grid.toggleCells();
    window.viewport.render();
  }, 100);

  // window.viewport.render(window.ctx);
});
