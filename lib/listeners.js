var Structure = require('./structures/structure'),
    Structures = require('./structures/structures');

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
    value: 200,
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
