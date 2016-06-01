var bindControlPanel = function(game) {
  $('#play-button').click(function(event) {
    game.togglePlayState();

    $(event.currentTarget).text(function(){
      return game.playing ? "Pause" : "Play";
    });
  });

  $('#gridlines-button').click(game.toggleGridlines.bind(game));

  $('#speed-slider').slider({
    min: -100,
    max: 450,
    value: 0,
    slide: function(event, ui) {
      game.setSpeed(1000 / Math.pow(2, ui.value / 100));
    }
  });
};

module.exports = bindControlPanel;
