paper.install(window);
window.onload = function() {
  let canvas = document.getElementById('myCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  paper.setup(canvas);

  // Class to contain ring components and modulation methods
  class Ring {
    constructor(center, radius, segments) {
      this.fullRing = createRing(center, radius, segments);
      this.subRingA = this.fullRing.children[0];
      this.subRingB = this.fullRing.children[1];
    }
  }

  // Creates arc segment based angle in degrees
  function createArc(center, radius, start, angle) {
    let degRad = Math.PI / 180;

    let fromX = radius * Math.cos(start * degRad);
    let fromY = radius * Math.sin(start * degRad);
    let from = new Point(fromX, fromY).add(view.center);

    let thruX = radius * Math.cos((start + angle / 2) * degRad);
    let thruY = radius * Math.sin((start + angle / 2) * degRad);
    let thru = new Point(thruX, thruY).add(view.center);

    let toX = radius * Math.cos((start + angle) * degRad);
    let toY = radius * Math.sin((start + angle) * degRad);
    let to = new Point(toX, toY).add(view.center);

    return new Path.Arc(from, thru, to);
  }

  // Creates single ring (group), composed of two sub-groups, composed of alternating arcs
  function createRing(center, radius, segments) {
    let angle = 360 / segments;
    let arcA = [];
    let arcB = [];

    // Push arc intro array (for group), alternating between two arrays.
    for (let position = 0, color = 1; position < 360; position += angle, color *= -1) {
      if (color == 1)
        arcA.push(createArc(center, radius, position, angle));
      else if (color == -1)
        arcB.push(createArc(center, radius, position, angle));
    }

    // Add arc-arrays into two array-groups. Add array-groups into single group for full ring
    let groupA = new Group(arcA);
    let groupB = new Group(arcB);
    let groupAB = new Group([groupA, groupB]);

    return groupAB;
  }

  class Control {
    constructor(color, width, rotation) {
      this.color = color;
      this.width = width;
      this.rotation = rotation;
    }

    changeColor(ringObj, nextColor){
      this.color = nextColor;
      ringObj.subRingA.strokeColor = {hue: nextColor, saturation: 1, brightness: 1};
      this.update();
    }

    update() {
      ;
    }
  }



  // testing
  let control = new Control(1, 0, 0.2);
  let ringCasette = new Group();
  let setOfRings = [];
  for (let i = 0; i < 5; i++) {
    let ringObj = new Ring(view.center, 50*i + 50, 16);
    ringObj.subRingA.strokeColor = {hue: 30+(i*6), saturation: 1, brightness: 1};
    ringObj.subRingB.strokeColor = {hue: 180+(i*6), saturation: 1, brightness: 1};
    ringObj.subRingA.strokeWidth = 50+(i*10);
    ringObj.subRingB.strokeWidth = 50-(10/(i+1));
    // Add ring object to array. Add ring-group to casette-group
    setOfRings.push(ringObj);
    ringCasette.addChild(ringObj.fullRing);

    //control.changeColor(ringObj, 0)
  }


view.onFrame = function(event) {
  for (let i = 0; i < 5; i++) {
    setOfRings[i].subRingA.strokeColor.hue += control.color;
    setOfRings[i].subRingB.strokeColor.hue += control.color;
    setOfRings[i].fullRing.rotate((control.rotation*i));
    // if (i == 3) {
    //   control.changeColor(setOfRings[i], 1);
    //   setOfRings[i].fullRing.rotate(control.rotation);
    // }
  }
  ringCasette.rotate(-0.5, view.center);
}

// end
}
