import generateCassette from './ring-cassette.js';
import Ring from './ring-single.js'

paper.install(window);
window.onload = () => {
  let canvas = document.getElementById('myCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  paper.setup(canvas);

  let background = new Shape.Rectangle(new Point(0, 0), new Size(canvas.width, canvas.height));
  background.fillColor = 'black';


console.log(canvas.width);
console.log(canvas.height);
// Input: (center, minRad, sectors, ringWidth, widthStep, colorA, colorB, colorStep)
let ringCassette = generateCassette(view.center, 10, 64, 5, 2, 0, 90, 10);
console.log(ringCassette.children.length);

let frames = 0;

let URL;

view.onFrame = function(event) {
  for (let i = 0; i < ringCassette.children.length; i++) {
    ringCassette.children[i].rotate(0.05 * i);
    ringCassette.children[i].children[0].strokeColor.hue += 0.5;
    ringCassette.children[i].children[1].strokeColor.hue += 0.5;
  }
  ringCassette.rotate(-0.3)

  while (frames < 1) {
    URL = canvas.toDataURL('image/jpeg', 0.5);
    console.log(URL);
    frames++;
  }
}

// end
}
