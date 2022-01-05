paper.install(window);
window.onload = function() {
  let canvas = document.getElementById('myCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  paper.setup(canvas);

  let bkgrnd = new Path.Rectangle(new Point(0, 0), new Size(window.innerWidth, window.innerHeight));
  bkgrnd.fillColor = 'black';
  bkgrnd.sendToBack();

  let circles = [];
  for(let i = 0; i < 80; i++) {
    circles[i] = new Path.Circle(view.center, 30 + 5*i);
    circles[i].fillColor = new Color({hue: 10 + 10*i, saturation: 1, brightness: 1});
    circles[i].sendToBack();
    circles[i].onMouseDown = function(event) {
      if(this.fillColor.brightness == 0)
        this.fillColor.brightness = 1;
      else
        this.fillColor.brightness = 0;
    }
  }

let posit_y = 1;
let percent = 0;
let max_y = window.innerHeight;
document.onmousemove = function(event) {

  posit_y = event.pageY;
  percent = posit_y / max_y;

  console.log(new_hue);
}

let new_hue = 0;

  view.onFrame = function(event) {
    bkgrnd.sendToBack();
    circles.forEach(function(circle) {
      new_hue = percent * 400;
      circle.fillColor.hue += new_hue;

    })
  }



}
