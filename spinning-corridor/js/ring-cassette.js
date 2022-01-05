import Ring from './ring-single.js'

const generateCassette = (center, minRad, sectors, ringWd, wdStep, clrA, clrB, clrStep) => {

  const radiusOffset = 0;

  const maxRadius = (() => {
    let wd = window.innerWidth;
    let ht = window.innerHeight;
    let radius  = (wd > ht ? ht : wd) / 2 - radiusOffset;
    return radius;
  })();

  // Initial radius and width, edge is distance to outer arc
  let radius= minRad;
  let width= ringWd;
  let edge = 0;

  // Create individual ring and insert it into ring group, containing all rings
  const ringCassette = new Group();
  for (let i = 0; edge <= maxRadius; i++) {
    let ringObj = new Ring(center, radius, sectors);
    ringObj.subRingA.strokeColor = {hue:clrA + clrStep * i , saturation:1, brightness:1};
    ringObj.subRingB.strokeColor = {hue:clrB + clrStep * i, saturation:1, brightness:1};
    ringObj.subRingA.strokeWidth = width;
    ringObj.subRingB.strokeWidth = width;
    ringCassette.addChild(ringObj.fullRing);

    // Update radius and ring width
    radius = radius + 0.5*width + 0.5*(width + wdStep);
    width= width + wdStep;
    edge = radius + 0.5*width;

  }
  console.log(maxRadius);
  console.log(window.innerWidth, window.innerHeight);
  return ringCassette;
}

export default generateCassette
