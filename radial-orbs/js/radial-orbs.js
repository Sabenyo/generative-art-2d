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
  let nLevels = 5;
  let nArms = 8;
  let armAngle = 2 * Math.PI / nArms;
  let centerRadius = 100;

  // Central orb
  let base = 0;
  let centralOrb = new Path.Circle(view.center, centerRadius)
  centralOrb.fillColor = {
    gradient: {
      stops: [[{hue: base + 10, saturation: 1, brightness: 1}, 0.2],
              [{hue: base + 90, saturation: 1, brightness: 1}, 0.4],
              [{hue: base + 180, saturation: 1, brightness: 1}, 1]],
      radial: true
    },
    origin: centralOrb.position,
    destination: centralOrb.bounds.rightCenter
  }

  class Orb {
    constructor(radius, distance, angle, color) {
      this.radius = radius;
      this.distance = distance;
      this.angle = angle;
      this.color = color;
      this.center = view.center.add([distance * Math.cos(angle),distance * Math.sin(angle)]);
      this.orb = new Path.Circle(this.center, this.radius);

      this.orb.fillColor = {
        gradient: {
          stops: [[{hue: color, saturation: 1, brightness: 1}, 0.8],
                 [{hue: color, saturation: 1, brightness: 0.3}, 1]],
          radial: true
        },
        origin: this.orb.position,
        destination: this.orb.bounds.rightCenter
      }
    }
  }

  // Generate first level/ring of orbs
  let arms = [];
  for(let angle = 0; angle < 2 * Math.PI; angle += armAngle) {
    let arm = []
    let orb = new Orb(0.2 * centerRadius, centerRadius, angle, 200);
    arm.push(orb);
    arms.push(arm);
  }

  // Generate remaining orbs for each level/ring, for each arm
  for(let arm of arms) {
    for(let level = 1; level <= nLevels; level++) {
      let nextRadius = arm[level - 1].radius * 1.3;
      let nextDistance = arm[level - 1].distance + nextRadius;
      let nextColor = arm[level - 1].color - 10;
      let orb = new Orb(nextRadius, nextDistance, arm[level - 1].angle, nextColor);
      arm.push(orb);
    }
  }

  centralOrb.bringToFront();
}
