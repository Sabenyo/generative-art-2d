paper.install(window);
window.onload = function() {
  let canvas = document.getElementById('myCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  paper.setup(canvas);

  // Background
  let background = new Path.Rectangle([0,0], view.size);
  background.fillColor = 'black';

  // Determine radius/diameter based on horizontal number of circles
  let nWide = 15;
  let diameter = view.size.width / nWide;
  let radius = diameter / 2;
  let nHigh = view.size.height / diameter;
  let start = new Point(radius, radius);

  let seed = 0;
  let outline = 0;

  // Generate grid of circles
  function generateGrid(base) {
    for(let i = 0; i < nWide; i++) {
      for (let j = 0; j < nHigh; j++) {

        // Determine center
        let center = [start.x + diameter * i, start.y + diameter * j]
        let circle = new Path.Circle(center, radius);

        // Add gradient, modulate color based on location
        circle.fillColor = {
          gradient: {
            stops: [[{hue: base + 10 * i + 20 * j, saturation: 1, brightness: 1}, 0.1],
                    [{hue: base + 90 + 10 * i + 20 * j, saturation: 1, brightness: 1}, 0.4],
                    [{hue: base + 180 + 10 * i + 20 * j, saturation: 1, brightness: 1}, 1]],
            radial: true
          },
          origin: circle.position,
          destination: circle.bounds.rightCenter
        }

        // Outline circle on mouse hover
        circle.onMouseEnter = function(event) {
          this.strokeColor = 'white'
          this.strokeWidth = 10;
        }

        circle.onMouseLeave = function(event) {
          this.strokeWidth = 0;
        }

        // Change color of grid on mouse click
        circle.onClick = function(event) {
          //seed = this.fillColor.hue;
          console.log(this.fillColor.gradient.stops[0].color.components[0]);
          seed = this.fillColor.gradient.stops[0].color.components[0];
          generateGrid(seed);
        }
      }
    }
  }

  generateGrid(seed);











}
