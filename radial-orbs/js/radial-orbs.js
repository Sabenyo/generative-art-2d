paper.install(window);
window.onload = function() {
  let canvas = document.getElementById('myCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  paper.setup(canvas);

  // Background
  let background = new Path.Rectangle([0, 0], view.size);
  background.fillColor = 'black';

  // Parameters
  let nLevels = 5;
  let nArms = 14;
  let armAngle = 2 * Math.PI / nArms;
  let centerRadius = 100;
  let centralOrb = {};
  let arms = [];
  let orbitalGroup = new Group();

  // Central orb
  let base = 0;

  class Orb {
    constructor(radius, distance, angle, color) {
      this.radius = radius;
      this.distance = distance;
      this.angle = angle;
      this.color = color;
      this.center = view.center.add([distance * Math.cos(angle), distance * Math.sin(angle)]);
      this.orb = new Path.Circle(this.center, this.radius);
    }

    setGradient() {
      this.orb.fillColor = {
        gradient: {
          stops: [[{hue: this.color, saturation: 1, brightness: 1}, 0.8],
            [{hue: this.color, saturation: 1, brightness: 0.3}, 1]],
          radial: true
        },
        origin: this.orb.position,
        destination: this.orb.bounds.rightCenter
      };
    }
  }

  function generateBaseOrbs() {
    for (let angle = 0; angle < 2 * Math.PI; angle += armAngle) {
      let arm = []
      let orb = new Orb(0.2 * centerRadius, centerRadius, angle, 200);
      orb.setGradient();
      arm.push(orb);
      arms.push(arm);
    }
  }

  function generateOrbArms() {
    for (let arm of arms) {
      for (let level = 1; level <= nLevels; level++) {
        let nextRadius = arm[level - 1].radius * 1.3;
        let nextDistance = arm[level - 1].distance + nextRadius;
        let nextColor = arm[level - 1].color - 10;
        let orb = new Orb(nextRadius, nextDistance, arm[level - 1].angle, nextColor);
        orb.setGradient();
        arm.push(orb);
      }
    }
  }

  function generateCentralOrb() {
    centralOrb = new Path.Circle(view.center, centerRadius)
    centralOrb.fillColor = {
      gradient: {
        stops: [[{hue: base + 10, saturation: 1, brightness: 1}, 0.2],
          [{hue: base + 90, saturation: 1, brightness: 1}, 0.4],
          [{hue: base + 220, saturation: 1, brightness: 0.7}, 1]],
        radial: true
      },
      origin: centralOrb.position,
      destination: centralOrb.bounds.rightCenter
    }
  }

  function modulateGradient() {
    for (let arm of arms) {
      for (let level = 0; level <= nLevels; level++) {
        let newColor = arm[level].color;
        arm[level].color = newColor + 1;
        arm[level].setGradient();

      }
    }
  }

  generateBaseOrbs();
  generateOrbArms();
  generateCentralOrb();



  view.onFrame = function(event) {
    modulateGradient();
  }

}
