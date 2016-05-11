var Grid = window.Grid;

document.addEventListener('DOMContentLoaded', function() {
  window.canvasEl = document.getElementById('canvas');
  window.ctx = window.canvasEl.getContext('2d');
  window.grid = new Grid(80, 80);


  window.grid.awakenCells([
    [3,3],
    [3,4],
    [4,3],
    [4,4],

    [10,3],
    [10,4],
    [10,5]
  ]);

  setInterval(function() {
    window.grid.render(window.ctx);
  }, 250);

  

});
