paper.install(window);
window.onload = function() {
  let canvas = document.getElementById('myCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  paper.setup(canvas);

  // Background
  let background = new Path.Rectangle([0,0], view.size);
  background.fillColor = 'black';

  // Parameters
  let nDivisions = 5;
  let ratio = 0.5;

  // Generate divisions
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

  xLeft.push(xFirst);
  xRight.push(xLast);
  yTop.push(yFirst);
  yBottom.push(yLast)

  let xHorizontal = [];
  let yVertical = [];

  // Generate horizontal and vertical divisions
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

  // Reverse right-side, combine with left-side
  xRight.reverse();
  xHorizontal.push(...xLeft);
  xHorizontal.push(...xRight);
  yBottom.reverse();
  yVertical.push(...yTop);
  yVertical.push(...yBottom);

  for (let element of xHorizontal) {
    console.log("x ", element);
  }

  for (let element of yVertical) {
    console.log("y ", element);
  }

}
