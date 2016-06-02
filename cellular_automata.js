var Game = require('./lib/game'),
    bindListeners = require('./lib/listeners');

document.addEventListener('DOMContentLoaded', function() {
  var canvasEl = document.getElementById('canvas');
  var ctx = canvasEl.getContext('2d');
  window.game = new Game(ctx);

  bindListeners(window.game);

  window.game.addStructure('Block', [-18,-18]);
  window.game.addStructure('Cross', [-43,-43]);
  window.game.addStructure('Blinker', [-1,2]);
  window.game.addStructure('KoksGalaxy', [9,9]);
  window.game.addStructure('Glider', [-6,-35]);
  // window.game.addStructure('RPentomino', [100,100]);
});
