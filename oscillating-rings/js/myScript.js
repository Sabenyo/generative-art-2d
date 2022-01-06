
window.share = {}

var numberOfRings = 5;
var ringWidth = 60;
// Radius of first ring
var startRadius = 50;
// Constrains range of color for a single ring, 0 = single color, 1 = full spectrum
var colorRange = 1;

// Object to store ring properies and method to generate ring
function RingContainer(nRing, center, segCount, colorCount, startPos, direction){
  // Primitive types (numerical) for settings
  this.nRing = nRing;
  this.center = center;
  this.radius = startRadius + ringWidth * (nRing + 1);
  this.segCount = segCount;
  this.angle = anglePerSegment(this.segCount);
  this.colorCount = colorsPerRing(colorCount, this.segCount);
  // Color palette is array of Color objects
  this.colorPlt = createColorPalette(this.colorCount);
  // Control parameters for tracking arc segments relative to full circle
  this.currentPos = startPos;
  this.ringDirection = direction;
  this.currentDegree = 0;
  this.currentColorGroupIndex = 0;
  this.currentArcIndex = 0;
  // Array of Group objects for each Color
  this.colorGrps = createColorGroups(this.colorPlt);
  // Single group for entire ring, composed of Color Groups
  this.ringGrp = null;
  this.rotSpeed = 0;
  this.rotDirection = 0;
  this.satDirection = 1;
  this.brightDirection = 1;
  this.widthDirection = 1;
}

RingContainer.prototype = {

  // Generate ring, add same color arcs to color groups.
  // When ring is complete (>=360), add color groups to single ring group
  generateRing: function(){
    if(this.currentDegree < 360){
      var arcSeg = arcDegree(this.center, this.radius, this.currentPos, this.angle, this.ringDirection);
      arcSeg.strokeColor = this.colorPlt[this.currentColorGroupIndex];
      arcSeg.strokeWidth = ringWidth;
      // Add arcSeg to corresponding color group
      this.colorGrps[this.currentColorGroupIndex].addChild(arcSeg);
      // Increment controls for arc relative to full circle
      this.currentDegree += this.angle;
      this.currentPos += this.angle;
      this.currentArcIndex++;
      this.currentColorGroupIndex = this.currentArcIndex % this.colorCount;
    }
    else if(this.currentDegree >= 360 && this.ringGrp == null)
      this.ringGrp = createSingleRingGroup(this.colorGrps);
  },

  // Rotate ring via speed and direction (1 = clockwise, -1 = counterclockwise)
  rotateRing: function(speed, direction){
    this.rotSpeed = speed;
    this.rotDirection = direction;
    if(this.ringGrp)
      this.ringGrp.rotate(speed * direction);
  },

  // Modulation for HSB, mod = rate, low = lower limit
  modulateColor: function(modH, modS, modB, lowS, lowB){
    if(this.ringGrp){
      for(var i = 0; i < this.colorGrps.length; i++){
        // Hue
        this.colorGrps[i].strokeColor.hue += modH;

        // Saturation
        if(this.satDirection > 0){
          if(this.colorGrps[i].strokeColor.saturation < 1)
            this.colorGrps[i].strokeColor.saturation += modS;
          else
            this.satDirection = -1;
        }
        else{
          if(this.colorGrps[i].strokeColor.saturation > lowS)
            this.colorGrps[i].strokeColor.saturation -= modS;
          else
            this.satDirection = 1;
        }

        // Brightness
        if(this.brightDirection > 0){
          if(this.colorGrps[i].strokeColor.brightness < 1)
            this.colorGrps[i].strokeColor.brightness += modB;
          else
            this.brightDirection = -1;
        }
        else{
          if(this.colorGrps[i].strokeColor.brightness > lowB)
            this.colorGrps[i].strokeColor.brightness -= modB;
          else
            this.brightDirection = 1;
        }
      }
    }
  },

    // Modulate width based on rate of change and amount of change (flux)
    modulateWidth: function(rate, flux){
      var currentWidth = this.colorGrps[0].strokeWidth;
      var min = ringWidth - ringWidth * flux;
      var max = ringWidth + ringWidth * flux;
      if(this.ringGrp){
        if(currentWidth < max && currentWidth > min){
          for(var i = 0; i < this.colorGrps.length; i++){
            // Oscillate direction of change based on even/odd ith group value
            this.colorGrps[i].strokeWidth += rate * this.widthDirection * (i % 2 == 0 ? 1: -1);
          } // for
        } // if(curr..)
        else{
          for(var i = 0; i < this.colorGrps.length; i++){
            this.colorGrps[i].strokeWidth += rate * this.widthDirection *-1;
          } // for
          this.widthDirection *= -1;
        } //else




      } //if ringGrp
    } //modulewidth
} //prototype


var testing = new RingContainer(0, view.center, 16, 2, 90, -1);
var testing2 = new RingContainer(1, view.center, 16, 2, 90+(1/32*360), -1);




function onFrame(event){

  testing.generateRing();
  testing.rotateRing(0.3, -1);
  testing.modulateColor(0.2, 0.002, 0.001, 0.8, 0.8);
  testing.modulateWidth(0.2, 0.2);
  testing2.generateRing();
  testing2.rotateRing(0.3, 1);
  testing2.modulateColor(0.2, 0.002, 0.001, 0.8, 0.8);
  testing2.modulateWidth(0.2, 0.2);
  if(testing.ringGrp)
    testing.ringGrp.bringToFront();

}

// window.share.center = testing.center;
// window.share.radius = testing.radius;
// window.share.segCount = testing.segCount;
// window.share.angle = testing.angle;
// window.share.colorCount = testing.colorCount;
// window.share.colorPlt = testing.colorPlt;
// window.share.colorGrps = testing.colorGrps;
// window.share.currentPos = testing.currentPos;
// window.share.direction = testing.ringDirection;
// window.share.currentArcIndex = testing.currentArcIndex;
// window.share.currentColorGroupIndex = testing.currentColorGroupIndex;
// window.share.currentDegree = testing.currentDegree;
// window.share.ringGrp = testing.ringGrp;
// window.share.tester = ringWidth;


// Angle per segment from number of segments in ring
function anglePerSegment(segmentsPerRing){
  return 360 / segmentsPerRing;
}


// Number of different colors per ring based on segment count. Must be even.
function colorsPerRing(colors, segmentsPerRing){
  var colorCount = colors;
  while(segmentsPerRing % colorCount != 0)
    colorCount--;

  return colorCount;
}

// Generate random hue for color obejct, initialize saturation and brightness to 0.9
function createColorPalette(colorCount){
  var diff = 360 / colorCount * colorRange;
  var colorPlt = [];
  var color = Math.floor(1 + Math.random() * 360);
  colorPlt[0] = {hue: color, saturation: 0.9, brightness: 0.9}

  for(var i = 1; i < colorCount; i++){
    if(i % 2 == 1)
      color = colorPlt[i-1].hue + 180;
    else
      color = colorPlt[i-2].hue + diff;

    colorPlt[i] = {hue: color, saturation: 0.9, brightness: 0.9}
  }

  return colorPlt;
}


// Generate groups based on number of colors, add color from palette to each group
function createColorGroups(colorPalette){
  colorGrps = [];
  for(var i = 0; i < colorPalette.length; i++)
    colorGrps[i] = new Group();

  return colorGrps;
}

// Add color groups to single ring group
function createSingleRingGroup(colorGroups){
  var singleRingGrp = new Group();
  for(var i = 0; i < colorGroups.length; i++)
    singleRingGrp.addChild(colorGroups[i]);

  return singleRingGrp;
}


// createColorPalettes arc from center (Point object), radius, angle in degrees, start angle position, and direction
// Direction clockwise = positive, Direction counter-clockwise = negative
function arcDegree(center, radius, start, angle, direction){
  if(direction > 0){
    var angStart = start * Math.PI/180;
    var angStop = (start + angle) * Math.PI/180;
    var angStep = angle/2 * Math.PI/180;
  }
  else{
    var angStart = -start * Math.PI/180;
    var angStop = (-start - angle) * Math.PI/180;
    var angStep = -angle/2 * Math.PI/180;
  }

  var from = new Point(Math.cos(angStart), Math.sin(angStart)) * radius + center;
  var through = new Point(Math.cos(angStart + angStep), Math.sin(angStart + angStep)) * radius + center;
  var to = new Point(Math.cos(angStop), Math.sin(angStop)) * radius + center;
  var arc = new Path.Arc(from, through, to);

  return arc;
}































// // Sets arc stroke width. Sets strokeColor from h, s, b.
// function arcColor(arc, h, s, b){
//   arc.strokeColor = {hue: h, saturation: s, brightness: b};
// }


// // Modulate hue, saturation, and brightness for a given group (object)
// function modulateColor(groupCont, modH, modS, modB){
//   groupCont.group.strokeColor.hue += modH;
//   if(groupCont.colorDirection > 0 && groupCont.group.strokeColor.saturation < 1){
//     groupCont.group.strokeColor.saturation += modS;
//     groupCont.group.strokeColor.brightness += modB;
//     if(groupCont.group.strokeColor.saturation >= 1)
//       groupCont.colorDirection = -1;
//   }
//   else{
//     groupCont.group.strokeColor.saturation -= modS;
//     groupCont.group.strokeColor.brightness -= modB;
//     if(groupCont.group.strokeColor.saturation <= 0.5)
//       groupCont.colorDirection = 1;
//   }
// }
//
// //
// // // Sets arc width
// // function arcWidth(arc, width){
// //   arc.strokeWidth = width;
// // }
//
//
// // Modulate width of stroke for a given group (object)
// function modulateWidth(groupCont, percentFlux, modW){
//   var widthOrg = groupCont.widthOrg;
//   var flux = widthOrg * percentFlux;
//   var minWidth = widthOrg - flux;
//   var maxWidth = widthOrg + flux;
//   var currentWidth = groupCont.group.strokeWidth;
//   if(groupCont.widthDirection > 0 && currentWidth < maxWidth){
//     groupCont.group.strokeWidth += modW;
//   }
//   else if(groupCont.widthDirection > 0 && currentWidth > maxWidth){
//     groupCont.group.strokeWidth -= modW;
//     groupCont.widthDirection = -1;
//   }
//   else if(groupCont.widthDirection < 0 && currentWidth > minWidth){
//     groupCont.group.strokeWidth -= modW;
//   }
//   else if(groupCont.widthDirection < 0 && currentWidth < minWidth){
//     groupCont.group.strokeWidth += modW;
//     groupCont.widthDirection = 1;
//   }
// }
//
//
// // Object to hold Group object and control values
// function GroupContainer(group, colorDirection, widthOrg, widthDirection){
//   this.group = group;
//   this.colorDirection = colorDirection;
//   this.widthOrg = widthOrg;
//   this.widthDirection = widthDirection;
// }

// var circleState = 0;
// var circlePos = 90;
// var angleStep = 10;
// var colorState = 1;
// var h;
// var styleMod = 1;
// var g1 = new Group();
// var g1Cont = new GroupContainer(g1, 1, 80, 1);
// var g2 = new Group();
// var g2Cont = new GroupContainer(g2, -1, 80, -1);
// var gParent = new Group();
//
//
// function onFrame(event){
//   if(circleState <= 360){
//     var circleSegment = arcDegree(view.center, 150, circlePos, angleStep, -1);
//     if(colorState > 0){
//       h = 50;
//       arcColor(circleSegment ,h, 0.9, 0.9);
//       arcWidth(circleSegment, 80);
//       g1.addChild(circleSegment);
//       gParent.addChild(g1);
//     }
//     else{
//       h = 200;
//       arcColor(circleSegment ,h , 0.9, 0.9);
//       arcWidth(circleSegment, 80);
//       g2.addChild(circleSegment);
//       gParent.addChild(g2);
//     }
//
//     // adjust controls
//     colorState *= -1;
//     circleState += angleStep;
//     circlePos += angleStep;
//   }
//   else{
//     modulateColor(g1Cont, .5, 0.01, 0.01);
//     modulateWidth(g1Cont, 0.2, 0.1);
//     modulateColor(g2Cont, .5, 0.01, 0.01);
//     modulateWidth(g2Cont, 0.6, 0.1);
//     gParent.rotate(0.4);
//   }
// }
