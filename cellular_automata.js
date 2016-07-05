var Game = require('./lib/game'),
    bindListeners = require('./lib/listeners'),
    startTour = require('./lib/tour');

$(function() {
  var canvasEl = document.getElementById('canvas');
  var ctx = canvasEl.getContext('2d');
  window.game = new Game(ctx);

  bindListeners(window.game);
  startTour();
});
