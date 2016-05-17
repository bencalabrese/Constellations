var Grid = require('./lib/grid');
var Structures = require('./lib/structures/structures');

document.addEventListener('DOMContentLoaded', function() {
  window.canvasEl = document.getElementById('canvas');
  window.ctx = window.canvasEl.getContext('2d');
  window.grid = new Grid(80, 80);
  window.Structures = Structures;

  new Structures.Block(window.grid, [22,22]);
  new Structures.Blinker(window.grid, [39,42]);
  new Structures.Cross(window.grid, [-3,-3]);
  new Structures.KoksGalaxy(window.grid, [49,49]);
  new Structures.Glider(window.grid, [34,5]);

  setInterval(function() {
    window.grid.cycle(window.ctx);
  }, 250);

  // window.grid.render(window.ctx);


});
