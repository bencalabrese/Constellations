var bindListeners = function(game) {
  $('#play-button').click(function(event) {
    game.togglePlayState();

    $(event.currentTarget).text(function(){
      return game.playing ? "Pause" : "Play";
    });
  });

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
    value: 100,
    slide: function(event, ui) {
      game.setZoomLevel(Math.pow(2, ui.value / 100));
    }
  });

  $('#canvas').mousemove(function(event) {
    var canvas = event.currentTarget,
        x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;

    game.highlightCells([x,y]);
  });

  $('#canvas').mouseleave(game.clearHighlightData.bind(game));

  $('#canvas').click(function(event) {
    var canvas = event.currentTarget,
        x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;

    game.addSelectedStructure([x,y]);
  });
};

module.exports = bindListeners;
