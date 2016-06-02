var Game = require('./lib/game'),
    bindListeners = require('./lib/listeners'),
    Structure = require('./lib/structures/structure'),
    Structures = require('./lib/structures/structures');

$(function() {
  var canvasEl = document.getElementById('canvas');
  var ctx = canvasEl.getContext('2d');
  window.game = new Game(ctx);
  window.Structures = Structures;
  window.Structure = Structure;

  bindListeners(window.game);

  window.game.addStructure(new Structure(Structures.Block), [-18,-18]);
  window.game.addStructure(new Structure(Structures.Cross), [-43,-43]);
  window.game.addStructure(new Structure(Structures.Blinker), [-1,2]);
  window.game.addStructure(new Structure(Structures.KoksGalaxy), [9,9]);
  window.game.addStructure(new Structure(Structures.Glider), [-6,-35]);
  // window.game.addStructure(new Structure(Structures.RPentomino), [100,100]);
});
