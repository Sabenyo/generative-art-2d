paper.install(window);
window.onload = function() {
  let canvas = document.getElementById('myCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  paper.setup(canvas);

  // Parameters
  let nDivisions = 5;
  let ratio = 0.4;

  // Divisions
  let xCenter = view.center.x;
  let xFirst = 0;
  let xLast = view.size.width;
  let yCenter = view.center.y;
  let yFirst = 0;
  let yLast = view.size.height;
  let xLeft = [];
  let xRight = [];
  let yTop = [];
  let yBottom = [];
  let xHorizontal = [];
  let yVertical = [];

  generateDivisions();
  renderScene();


  function generateDivisions() {
    // Clear arrays and initialize starting point
    xLeft = [];
    xRight = [];
    yTop = [];
    yBottom = [];
    xHorizontal = [];
    yVertical = [];
    xLeft.push(xFirst);
    xRight.push(xLast);
    yTop.push(yFirst);
    yBottom.push(yLast)
    // Iterate division size based on ratio value
    for (let i = 1; i <= nDivisions; i++) {
      let prevXLeft = xLeft[i - 1];
      let nextXLeft = prevXLeft + ratio * (xCenter - prevXLeft);
      xLeft.push(nextXLeft);
      let prevXRight = xRight[i - 1];
      let nextXRight = prevXRight - ratio * (prevXRight - xCenter);
      xRight.push(nextXRight);
      let prevYTop = yTop[i - 1];
      let nextYTop = prevYTop + ratio * (yCenter - prevYTop);
      yTop.push(nextYTop);
      let prevYBottom = yBottom[i - 1];
      let nextYBottom = prevYBottom - ratio * (prevYBottom - yCenter);
      yBottom.push(nextYBottom);
    }
    // Combine left and right to horizontal, top and bottom to vertical
    xRight.reverse();
    xHorizontal.push(...xLeft);
    xHorizontal.push(...xRight);
    yBottom.reverse();
    yVertical.push(...yTop);
    yVertical.push(...yBottom);
  }

  function renderScene() {
    // Clear view
    project.activeLayer.clear();
    // Create background
    let background = new Path.Rectangle([0,0], view.size);
    background.fillColor = 'black';
    // Create rectangle for each x,y coordinate
    for (let i = 0; i < xHorizontal.length - 1; i++) {
      for (let j = 0; j < yVertical.length - 1; j++) {
        let from = new Point(xHorizontal[i], yVertical[j]);
        let to = new Point(xHorizontal[i + 1], yVertical[j + 1]);
        let rectangle = new Path.Rectangle(from, to);
        // Modulate color based on odd/even position
        if ((i + j) % 2 == 0) {
          rectangle.fillColor = 'red';
        }
        else {
          rectangle.fillColor = 'blue';
        }
        rectangle.strokeColor = 'green';
      }
    }
  }


  // Change center point based on mouse movement
  view.onMouseMove = function(event) {
    xCenter = event.point.x;
    yCenter = event.point.y;
    console.log(xCenter, " - ", yCenter);
    generateDivisions();
    renderScene();
  }






}
