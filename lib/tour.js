var startTour = function() {
  $('.structures').attr("data-intro", "Select a structure. Then click on the grid to make it come alive.");
  $('.structures').attr("data-position", "right");
  $('.structures').attr("data-step", 1);

  $('#play-button').attr("data-intro", "Press play to see how it develops.");
  $('#play-button').attr("data-step", 2);

  $('nav').attr("data-intro", "Use these controls to manipulate gameflow.</br></br>Try zooming in!");
  $('nav').attr("data-step", 3);

  $('#canvas').attr("data-intro", "Hold down ALT and drag to pan to different areas of the grid.");
  $('#canvas').attr("data-position", "right");
  $('#canvas').attr("data-step", 4);

  $('h1').attr("data-intro", "Zoom in and slow down for an up-close view of how cells transition.</br></br>Try adding more structures to see how they interact!");
  $('h1').attr("data-step", 5);

  introJs().start();
};

module.exports = startTour;
