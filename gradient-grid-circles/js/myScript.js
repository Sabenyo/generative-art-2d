paper.install(window);
window.onload = function() {
  let canvas = document.getElementById('myCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  paper.setup(canvas);

  // Background
  let topLeft = [0, 0];
  let bottomRight = [canvas.width, canvas.height];
  let background = new Path.Rectangle(topLeft, bottomRight);
  background.fillColor = 'black';

  // Geometric parameters for circle
  let radius = 10;
  let diameter = radius * 2;
  let widthTotal = canvas.width / (radius * 2);
  let heightTotal = canvas.height / (radius * 2);

  // Grid of gradient filled circles
  for (let widthCount = 0; widthCount < widthTotal; widthCount++){
    for (let heightCount = 0; heightCount < heightTotal; heightCount++){
      // Calculate new center
      let center = [radius + diameter * widthCount, radius + diameter * heightCount];
      // Create circle
      let circle = new Path.Circle(center, radius);
      // Modulate gradient colors based on width and height
      circle.fillColor = {
        gradient: {
          stops: [[{hue: 180 + (widthCount * 20) + (heightCount * 30), saturation: 1, brightness: 1}, 0.3],
                  [{hue: 330 + (widthCount * 20) + (heightCount * 30), saturation: 1, brightness: 1}, 1]],
          radial: true
          },
          origin: center,
          destination: circle.bounds.rightCenter
      };

    }
  }

}
