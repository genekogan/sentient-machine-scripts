var circles, rects;

// Vera Molnar - multiple grids

var frameInterval; // how many frames per segment
var numMolnarGridsX;
var numMolnarGridsY;
var gridSizeX;
var gridSizeY;

var molnarGrids = [];
var indexActive = 0;
var followingIndex = 0
var curvedVertices = false;
var symbolColor;
var count = 5;
var outputProb = 0;

var translateX;
var translateY;

///RAND - GRID
const g10 = Array(50).fill(8);
const g16 = Array(30).fill(12);
const g24 = Array(15).fill(16);
const g1 = Array(3).fill(20);
const g34 = Array(2).fill(24);
const gridProb = g1.concat(g24).concat(g16).concat(g10).concat(g34);

const strokeWidth = {
  1: 5,
  10: 3,
  16: 2,
  24: 2,
  34: 1
};

const margins = {
  1: 30,
  10: 20,
  16: 15,
  24: 10,
  30: 5
};

var gridSize;

function setup()
{
  createCanvas(800, 800);
  smooth();

  circles = false;
  rects = true;

  colorMode(random(1) > 0.3 ? (HSB) :  random(1) > 0.5 ? HSL : RGB);
  const index = Math.floor(Math.random() * 100);
  gridSize = gridProb[index];

  const xRatio = 1;//Math.floor(Math.random() * 4);
  const yRatio = 1;//Math.floor(Math.random() * 4);
  const xyRatio = xRatio/yRatio;

  //GRID_IDEOGRAMS
  var numMolnarGridsX = gridSize * xyRatio
  var numMolnarGridsY = gridSize / xyRatio
  console.log(numMolnarGridsX);

  //GRID_SIZE_IN_CANVAS
//  const randGridSizeRatio = Math.floor(Math.random() * 3);
  const actualGridSizeRatio = 1//1/randGridSizeRatio;
  const gWidth = (width * actualGridSizeRatio) * xyRatio;
  const gHeight = (height * actualGridSizeRatio) / xyRatio;

  var ideogramSize = gWidth / numMolnarGridsX;
  console.log(ideogramSize);

  for (var y=0; y<numMolnarGridsY; y++) {
    for (var x=0; x<numMolnarGridsX; x++) {
      var mx = map(x, 0, numMolnarGridsX, 0, gWidth);
      var my = map(y, 0, numMolnarGridsY, 0, gHeight);
      var mwidth = ideogramSize;
      var mheight = ideogramSize;
      var margin = 10;

      var m = new MolnarGrid(mx, my, mwidth, mheight, gridSizeX, gridSizeY, margin);
      m.createOrder();
      molnarGrids.push(m);
    }
  }

  background(0);

  //RAND
   const boxBaseColors = color( random(255), random(255), random(255));
//  const boxBaseColors = color(random(255), random(150,255), random(150,255));
  drawBox(10, 0, 0, width, height, boxBaseColors);

  //COLOUR
  var h2 = floor(hue(boxBaseColors) + 180) % 255;
  var s2 = floor(saturation(boxBaseColors) + 180) % 255;
  var b2 = floor(brightness(boxBaseColors) + 180) % 255;
  // colorMode(HSL);
  const complementaryColor = color(h2, s2, b2);

  //BOX
  console.log(boxBaseColors, complementaryColor);
  const randColor = color(random(255), random(255), random(255));
  symbolColor = random(1) > 0.5 ? complementaryColor : random(1) > 0.5 ? 255 : 0;
  strokeWeight(strokeWidth[gridSize]);
  colorMode(RGB);
  noLoop();
  drawAmoeba();
  translateX = (width - gWidth)/2;
  translateY = (height - gHeight)/2;
}

function draw() {
  drawSymbols();
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

function drawSymbols () {
  // translate(width/(1- random(1)), height/(1 - random(1)));
//  translate(translateX, translateY);
  noFill();
  molnarGrids[indexActive].update();

  // check if it's done... if it is, set to update the next molnar grid
  if (molnarGrids[indexActive].isDone()) {

    //
    // RAND
    //
    if ((followingIndex % numMolnarGridsX) === 0) {
      indexActive = indexActive + 1;
      followingIndex ++;
    }
    else {
      // const num = gridProb[index]
      const num = Math.floor(Math.random() * 4);
      indexActive = indexActive + num;
      followingIndex ++;
    }

    indexActive = min(indexActive, molnarGrids.length-1);
    //
    // FULL DISPLAYING
    //
    // indexActive = indexActive + 1;
    // indexActive = min(indexActive, molnarGrids.length-1);

    if (indexActive === molnarGrids.length - 1 ) {
        console.log(count)
        noLoop()
        const imageId = makeid(56)
        save(`${imageId}.png`);
        count --;
        // location.reload();
    }
  }

  for (var i=0; i<molnarGrids.length; i++) {
    molnarGrids[i].draw(symbolColor);
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
