paper.install(window);
window.onload = function() {
  let canvas = document.getElementById('myCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  paper.setup(canvas);

  // Values for polygon side # and radius
  let radius = 200;
  let startSides = 3;
  let endSides = 10;
  let polygons = [];
  // Control values
  let rotStep = 2;
  let currRot = 0;
  let startRot = 0;
  let stopRot = 720;
  let currPoly = startSides;

  // Generate polygons
  for(let sides = startSides; sides <= endSides; sides++){
    polyPath = new Path.RegularPolygon(view.center, sides, radius);
    polyPath.strokeColor = new Color({hue: sides, saturation: 1, brightness: 0});
    polyPath.strokeWidth = 1;
    polyPath.visible = true;
    polygons[sides] = polyPath;
  }

}
