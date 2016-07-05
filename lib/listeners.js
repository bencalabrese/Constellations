var Structure = require('./structures/structure'),
    Structures = require('./structures/structures');

var bindListeners = function(game) {
  // Top Control Panel

  $('#play-button').click(function(event) {
    game.togglePlayState();
    setPlayButtonText();
  });

  function setPlayButtonText() {
    $('#play-button').text(function(){
      return game.playing ? "Pause" : "Play";
    });
  }

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

  // Canvas Events
  var panning = false,
      panStart = null;

  function sendPanData(panEnd) {
    game.setOffsets(panStart, panEnd);
  }

  function resetPanData() {
    $('#canvas').removeClass("pan-grab");
    panStart = null;
  }

  function calcMousePos(event) {
    var canvas = event.currentTarget,
        x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;

    var pos = [x, y];

    // adjust for media query
    if ($(window).height() < 900) {
      pos = pos.map(val => val * 4 / 3);
    }

    return pos;
  }

  $(window).keydown(event => {
    if (event.key === "Alt") {
      panning = true;
      game.clearHighlightData();
      $('#canvas').addClass("pan-hover");
    }
  });

  $(window).keyup(event => {
    if (event.key === "Alt") {
      panning = false;
      $('#canvas').removeClass("pan-hover pan-grab");
    }
  });

  $('#canvas').mousemove(function(event) {
    var pos = calcMousePos(event);

    if (panning) {
      if (panStart) {
        sendPanData(pos);
        panStart = pos;
      }
    } else {
      game.highlightCells(pos);
    }
  });

  $('#canvas').mouseleave(function () {
    game.clearHighlightData();
    resetPanData();
  });

  $('#canvas').mousedown(function(event) {
    var pos = calcMousePos(event);

    if (panning) {
      panStart = pos;
      $('#canvas').addClass("pan-grab");
    } else {
      game.addSelectedStructure(pos);
    }
  });

  $('#canvas').mouseup(resetPanData);

  // Structures Panel

  var rotation = 0;
  var selectedStructure = Structures.BackrakeOne;

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

    if (key === "BackrakeOne") { $structure.addClass("selected") }

    $structure.click(select.bind(null, structure));

    $('#structures').append($structure);
  });
};

module.exports = bindListeners;
