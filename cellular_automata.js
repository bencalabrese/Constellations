var Game = require('./lib/game');

document.addEventListener('DOMContentLoaded', function() {
  var canvasEl = document.getElementById('canvas');
  var ctx = canvasEl.getContext('2d');
  window.game = new Game(ctx);

  // window.game.addStructure('Block', [22,22]);
  // window.game.addStructure('Cross', [-3,-3]);
  // window.game.addStructure('Blinker', [39,42]);
  // window.game.addStructure('KoksGalaxy', [49,49]);
  // window.game.addStructure('Glider', [34,5]);
  // window.game.addStructure('RPentomino', [100,100]);
});
