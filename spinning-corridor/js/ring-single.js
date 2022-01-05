// Creates arc segment based angle in degrees
const createArc = (center, radius, start, angle) => {
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
const createRing = (center, radius, segments) => {
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

// Class to contain ring components
const Ring = class {
  constructor(center, radius, segments) {
    this.fullRing = createRing(center, radius, segments);
    this.subRingA = this.fullRing.children[0];
    this.subRingB = this.fullRing.children[1];
  }
}

export default Ring
