paper.install(window);
window.onload = function() {
  let canvas = document.getElementById('myCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  paper.setup(canvas);

  // Background
  let background = new Path.Rectangle([0,0], view.size);
  background.fillColor = 'black';

  // Group to contain all the orbs
  let orbs = new Group();

  // Central orb
  let base = 0;
  let centerRadius = 300;
  let centralOrb = new Path.Circle(view.center, centerRadius)
  centralOrb.fillColor = {
    gradient: {
      stops: [[{hue: base + 10, saturation: 1, brightness: 1}, 0.2],
              [{hue: base + 90 + 10, saturation: 1, brightness: 1}, 0.4],
              [{hue: base + 180 + 10, saturation: 1, brightness: 1}, 1]],
      radial: true
    },
    origin: centralOrb.position,
    destination: centralOrb.bounds.rightCenter
  }




}
