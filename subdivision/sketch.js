

var circles, rects;

// Vera Molnar - multiple grids

var frameInterval = 4; // how many frames per segment
var numMolnarGridsX = 16;
var numMolnarGridsY = 16;
var gridSizeX = 4;
var gridSizeY = 4;

var molnarGrids1 = [];
var molnarGrids2 = [];
var indexActive = 0;
var followingIndex = 0
var curvedVertices = false;
var symbolColor;
var count = 5;
var outputProb = 0;

var translateX1;
var translateY1;

var translateX2;
var translateY2;

var symbolColor1;
var symbolColor2;

var activated1;
var activated2;

var strokeWidth1;
var strokeWidth2;

// /RAND - GRID
const g12 = Array(50).fill(12);
const g14 = Array(30).fill(14);
const g16 = Array(15).fill(16);
const g20 = Array(3).fill(20);
const g24 = Array(2).fill(24);
const gridProb = g12.concat(g14).concat(g16).concat(g20).concat(g24);

var gridSize;

function setup()
{
  createCanvas(800, 800);
  smooth();
  circles = false;
  rects = true;
  colorMode(random(1) > 0.3 ? (RGB) :  random(1) > 0.5 ? HSL : HSB);

  setupSymbolGrid(molnarGrids1, translateX1, translateY1, symbolColor1, strokeWidth1);
  setupSymbolGrid(molnarGrids2, translateX2, translateY2, symbolColor2, strokeWidth2);

  background(0);

  //RAND
  const boxBaseColors = color(random(255), random(150,255), random(150,255));
  drawBox(10, 0, 0, width, height, boxBaseColors);

  //COLOUR
//  var h2 = floor(hue(boxBaseColors) + 180) % 255;
//  var s2 = floor(saturation(boxBaseColors) + 180) % 255;
//  var b2 = floor(brightness(boxBaseColors) + 180) % 255;
//  const complementaryColor = color(h2, s2, b2);

  var randColor = color(random(255), random(255), random(255));
  symbolColor1 = random(1) > 0.5 ? randColor : random(1) > 0.5 ? 255 : 0;

  randColor = color(random(255), random(255), random(255));
  symbolColor2 = random(1) > 0.5 ? randColor : random(1) > 0.5 ? 255 : 0;

  activated1 = true;
  activated2 = random(1) > 0.8 ? true : false;
}

function draw() {
  drawSymbols(molnarGrids1, translateX1, translateY1, symbolColor1, activated1, strokeWidth1);
  drawSymbols(molnarGrids2, translateX2, translateY2, symbolColor2, activated2, strokeWidth2);
}

function setupSymbolGrid(molnarGrids, translateX, translateY, symbolColor, strokeWidth) {
     var numMolnarGridsX = gridProb[Math.floor(Math.random() * 99)]
      var numMolnarGridsY = gridProb[Math.floor(Math.random() * 99)]
      const xyRatio = numMolnarGridsX/numMolnarGridsY;
      console.log(numMolnarGridsX);
      console.log(numMolnarGridsY);

      const margin = 5;

      //GRID_SIZE_IN_CANVAS
      const actualGridSizeRatio = 2/Math.floor(random(2,5));
      console.log(actualGridSizeRatio);
      const gWidth = min(((width) * actualGridSizeRatio) * xyRatio, width);
      const gHeight = min(((height) * actualGridSizeRatio) / xyRatio, height);

      var ideogramSize = min(gWidth, gHeight) / max(numMolnarGridsX, numMolnarGridsY);
      console.log(ideogramSize)

      for (var y=0; y<numMolnarGridsY; y++) {
        for (var x=0; x<numMolnarGridsX; x++) {
          var mx = map(x, 0, numMolnarGridsX, 0, gWidth);
          var my = map(y, 0, numMolnarGridsY, 0, gHeight);
          var mwidth = ideogramSize;
          var mheight = ideogramSize;

          var m = new MolnarGrid(mx, my, mwidth, mheight, gridSizeX, gridSizeY, margin);
          m.createOrder();
          molnarGrids.push(m);
        }
      }

      strokeWidth = ideogramSize/50;

      translateX = (width - gWidth)/Math.floor(random(0,4));
      translateY = (height - gHeight)/Math.floor(random(0,4));

//      const randColor = color(random(255), random(255), random(255));
////      symbolColor = random(1) > 0.5 ? randColor : random(1) > 0.5 ? 255 : 0;
      symbolColor = 0;
}

function drawSymbols(molnarGrids, translateX, translateY, symbolColor, activated, strokeWidth) {
  if (!activated) return

  translate(translateX, translateY);
  noFill();
  molnarGrids[indexActive].update();

  if (molnarGrids[indexActive].isDone()) {

   if (indexActive === molnarGrids.length - 1) {
            const imageId = makeid(56)
            save(`${imageId}.png`);
            noLoop()
            location.reload();
        }

    const num = Math.floor(Math.random() * 5);
    indexActive = indexActive + 1;
    indexActive = min(indexActive, molnarGrids.length-1);
  }

  for (var i=0; i<molnarGrids.length; i++) {
    molnarGrids[i].draw(symbolColor, strokeWidth);
  }
}

//background
function drawBox(n, x, y, w, h, col)
{
  if (n==0) {
    if (rects) {
      stroke(0, 20);
      fill(col);
      rect(x, y, w, h);
    }
    if (circles) {
      noStroke();
      var alph = 240;
      if (rects) alph = 70;
      fill(perturbColor(col,40,40,40), alph);
      ellipse(x + w/2, y + h/2, w*0.95, h*0.95);
    }
  }
  else {
    var t = random(1);
    var newcol1 = perturbColor(col, n, n*2, n*3);
    var newcol2 = perturbColor(col, n, n*2, n*3);
    var horiz = random(1) > 0.5 ? true : false;
    if (horiz) {
      drawBox(n-1, x, y, w, h*t, newcol1);
      drawBox(n-1, x, y+h*t, w, h*(1-t), newcol2);
    } else {
      drawBox(n-1, x, y, w*t, h, newcol1);
      drawBox(n-1, x+w*t, y, w*(1-t), h, newcol2);
    }
  }
}

function perturbColor(col, h, s, b) {
  var h2 = floor(hue(col) + random(-h, h) + 255) % 255;
  var s2 = floor(saturation(col) + random(-s, s) + 255) % 255;
  var b2 = floor(brightness(col) + random(-b, b) + 255) % 255;
  return color(h2, s2, b2);
}

function complementaryColor(col) {
  var h2 = floor(hue(col) + 180) % 255;
  var s2 = floor(saturation(col)) % 255;
  var b2 = floor(brightness(col)) % 255;
  return color(h2, s2, b2);
}

function mousePressed() {
  if (mouseY < 21) {
    if      (mouseX <  53) { circles = true;  rects = false; }
    else if (mouseX < 146) { circles = false;  rects = true; }
    else if (mouseX < 204) { circles = true;  rects = true; }
  }
  redraw();
}

function drawAmoeba() {
  const randColor = color(random(255), random(255), random(255), 15);
  stroke(randColor);
  noFill();
  translate(width/2, height/2);
  for (var t=0; t<100; t++){
    beginShape();
    for (var i=0; i<200; i++) {
      var ang = TWO_PI * (t/1000 + i/200);
      var rad = 300 * noise(i*0.01, t*0.005);
      var x = rad * cos(ang);
      var y = rad * sin(ang);
      curveVertex(x, y);
    }
    endShape(CLOSE);
  }
}

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
  }
  return result;
}

function MolnarGrid(drawX, drawY, drawWidth, drawHeight, gridSizeX, gridSizeY, margin) {

  this.drawX = drawX;
  this.drawY = drawY;
  this.drawWidth = drawWidth;
  this.drawHeight = drawHeight;

  this.gridSizeX = gridSizeX;
  this.gridSizeY = gridSizeY;

  this.margin = margin;

  this.order=[];   // order is the 16-element array of our 16 corners in order
  this.lastToDraw = 0; // we want to draw the ordered vertices from 0->lastToDraw
  this.frameRemainder = 0;

  // this function will create a permutation of the array
  // of indexes corresponding to our 16 points
  this.getPosition = function(index) {
    var col = index % this.gridSizeX;  // use modulo (remainder) to get column of our index
    var row = floor(index / this.gridSizeX); // floor the division to get row of our index
    var x = map(col, 0, this.gridSizeX-1, this.drawX+this.margin, this.drawX+this.drawWidth-this.margin);
    var y = map(row, 0, this.gridSizeY-1, this.drawY+this.margin, this.drawY+this.drawHeight-this.margin);
    return {x: x, y: y};
  };

  // this function will create a permutation of the array
  // of indexes corresponding to our 16 points
  this.createOrder = function() {
    // order is our final permutation list
    this.order = [];     // clear order if we had filled it before

    // make new array of our indexes to sample from
    var all = [];
    for (var i=0; i<this.gridSizeX*this.gridSizeY; i++) {
      all.push(i);
    }

    for (var i=0; i<this.gridSizeX*this.gridSizeY; i++) {
      var index = floor(random(all.length));  // pick a random index
      this.order.push(all[index]); // append that element from 'all' into 'order'
      all.splice(index, 1); // remove it from 'all' so we don't sample from it again
      //println("all: "+all);   // print all and order to see what we have
      //println("order: "+this.order);
    }
  };

  // in order to be able to control when one grid is being updated we
  // removed the "update" function out of "draw" so we can control a
  // single molnar grid at a time
  this.update = function() {
    // we can add 1 to lastToDraw every 15 frames like so
    this.frameRemainder = frameCount % frameInterval;
    if (this.frameRemainder == 0) {   // this will evaluate to true every 60 frames
      this.lastToDraw = this.lastToDraw + 10000;
      this.lastToDraw = min(this.lastToDraw, this.gridSizeX*this.gridSizeY); // we don't want lastToDraw to exceed the number of vertices we have
    }
  };

  // we need a function to check if we are finished animating
  // this molnar grid. we know it's done when "lastToDraw" is equal to the number of vertices we have
  this.isDone = function() {
    if (this.lastToDraw == this.gridSizeX*this.gridSizeY) {
      return true;
    }
    else {
      return false;
    }
  };

  // draw our grid
  this.draw = function(symbolColor, strokeWidth) {
    console.log(strokeWidth)
    strokeWeight(0.5)
    stroke(symbolColor)
    // this will draw all the current vertices
    beginShape();
    for (var i=0; i<this.lastToDraw; i++) {
      var index = this.order[i];
      var position = this.getPosition(index);
      if (curvedVertices) {
        curveVertex(position.x, position.y);
      }
      else {
        vertex(position.x, position.y);
      }
    }
    endShape();

    // before we reach the end, we can interpolate to the next vertex

    if (this.lastToDraw < this.gridSizeX*this.gridSizeY-1) {

      // we can use lerp (see lerp_101) to interpolate between
      // the last current vertex and the next current vertex.
      // frameRemainder / frameInterval is our amount to interpolate
      var t = this.frameRemainder / frameInterval;
      var indexCurrent = this.order[this.lastToDraw - 10];  // index of our current last vertex
      var indexNext = this.order[min(this.lastToDraw, this.gridSizeX*this.gridSizeY-1)];   // next vertex, but don't exceed how many vertices we have

      // let's interpolate between (x, y) at indexCurrent and (x, y) at indexNext
      var positionCurrent = this.getPosition(indexCurrent);
      var positionNext = this.getPosition(indexNext);

      // now let's get the x, y interpolated between positionCurrent and positionNext
      var xNext = lerp(positionCurrent.x, positionNext.x, 0);
      var yNext = lerp(positionCurrent.y, positionNext.y, 0);

      // draw the line from our last vertex to (xNext, yNext)
      line(positionCurrent.x, positionCurrent.y, xNext, yNext);
    }

  };

};


