var Game = require('./lib/game'),
    bindListeners = require('./lib/listeners'); 

$(function() {
  var canvasEl = document.getElementById('canvas');
  var ctx = canvasEl.getContext('2d');
  var game = new Game(ctx);

  bindListeners(game);
});
