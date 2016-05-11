var Grid = window.Grid;

document.addEventListener('DOMContentLoaded', function() {
  var canvasEl = document.getElementById('canvas');
  var ctx = canvasEl.getContext('2d');
  var grid = new Grid(80, 80);

  grid.render(ctx);
  console.log('hello world');
});
