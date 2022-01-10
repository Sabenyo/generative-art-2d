paper.install(window);
window.onload = () => {
  let canvas = document.getElementById('myCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  paper.setup(canvas);

  // Load original image. Scale and reposition to upper-left corner
  let raster = new Raster('wolf');
  raster.onLoad = inkify;

  function inkify() {

    let scale = 0.6;
    raster.setSize(raster.size.width*scale, raster.size.height*scale);
    raster.position = [raster.size.width*0.5, raster.size.height*0.5];
    raster.visible = false;

    let grayMatrix = []
    let maxGray = 0;
    let minGray = 1;
    let maxGrayScaled = 0;
    let minGrayScaled = 1;
    let yT, yB;
    let inc = 4;
    let size = new Size(inc, inc);

    // Collect average color value based on rectangular-area units
    let x = inc, y = inc;
    while (y < raster.size.height - inc) {
      let xArray = [];
      while (x < raster.size.width - inc) {
        let rect = new Rectangle([x, y], size);
        let color = raster.getAverageColor(rect);
        xArray.push(color.gray);
        // Track max gray value for normalization
        if (color.gray > maxGray)
          maxGray = color.gray;
        if (color.gray < minGray)
          minGray = color.gray;
        x += inc;
      }
      grayMatrix.push(xArray);
      x = inc;
      y += inc;
    }

    // Scale color values: domain(original values), range (0, 1)
    function scaleGray(x) {
      let m = 1 / (maxGray - minGray);
      let b = -(m * minGray);
      return m * x + b;
    }

    // Apply scale to matrix
    let grayMatrixScaled = [];
    for (let array = 0; array < grayMatrix.length; array++) {
      let arrayScaled = []
      for (let element = 0; element < grayMatrix[array].length; element++) {
        let elementScaled = scaleGray(grayMatrix[array][element]);
        arrayScaled.push(elementScaled);

        // Confirm scaled values
        if (elementScaled > maxGrayScaled)
          maxGrayScaled = elementScaled;
        if (elementScaled < minGrayScaled)
          minGrayScaled = elementScaled;

      }
      grayMatrixScaled.push(arrayScaled);
    }

    // Draw paths with width based on gray value
    x = inc;
    y = inc;
    for (let i = 0; i < grayMatrixScaled.length; i++) {
      let path = new Path();
      for (let j = 0; j < grayMatrixScaled[i].length; j++) {
        yT = y - grayMatrixScaled[i][j] * inc*0.5;
        yB = y + grayMatrixScaled[i][j] * inc*0.5;
        path.add([x, yT]);
        path.insert(0, [x, yB]);
        path.fillColor = 'blue';
        x += inc;
      }
      x = inc;
      y += inc;
    }

    console.log(grayMatrix);
    console.log(grayMatrixScaled);
    console.log(maxGray);
    console.log(minGray);
    console.log(maxGrayScaled);
    console.log(minGrayScaled);

  // end raster onload
  }



// end window onload
}
