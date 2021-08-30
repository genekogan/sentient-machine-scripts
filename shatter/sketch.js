// parameters
let numRecursions = 9;
let pctMinimum = 0.3; // minimum area for each child, don't go above 0.49
let xh = 2.2; // dispersion hue
let xs = 3; // dispersion saturation
let xb = 3; // dispersion brightness
let minSplitMargin = 0.0;  
let caveIn = 0.07;
let caveInProbability = 0.9;
let lenGradientMin = 50;
let lenGradientMax = 100;


var zone;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB);
  noLoop();

  numRecursions = floor(random(6,10));
  pctMinimum = random(0.1, 0.45); // minimum area for each child, don't go above 0.49
  xh = random(2.0, 3.2); // dispersion hue
  xs = random(1.5, 4); // dispersion saturation
  xb = random(1.5, 4); // dispersion brightness
  minSplitMargin = random(1.0);
  caveIn = random(0.2);
  caveInProbability = random(1);
  lenGradientMin = 50;
  lenGradientMax = 100;
  
  var points = [[0,0], [width, 0], [width, height], [0, height]];
  var baseColor = color(random(360), random(20,80), random(20,80), 0.5);
  zone = new Zone(points, baseColor);
}

function draw() {
  background(0);
  zone.draw(numRecursions);
}

class Zone {
  constructor(pts, col) {
    this.col = col;
    this.pts = pts;
  }

  draw(gen) {
    if (gen==0) {
      push();

      var centroid = getCentroid(this.pts)
      var linReg = linearRegression(this.pts);
      
      var m = linReg[0];
      var b = linReg[1];
      
      var lenGradient = random(lenGradientMin, lenGradientMax);
      var x1 = centroid[0] - lenGradient;
      var x2 = centroid[0] + lenGradient;
      var y1 = height * (m * (x1/width) + b);
      var y2 = height * (m * (x2/width) + b);
      let gradient = drawingContext.createLinearGradient(x1,y1, x2,y2);
      let c1 = perturbColor(this.col, 5, 20, 20);
      let c2 = perturbColor(this.col, 5, 20, 20);
      gradient.addColorStop(0, c1.toString());
      gradient.addColorStop(0.5, c2.toString());
      gradient.addColorStop(1, c1.toString());
      drawingContext.fillStyle = gradient;
      
      for (var i=0; i<this.pts.length; i++) {
        if (random() < caveInProbability) {
          var idxRand = i;//floor(random(this.pts.length));
          var newPt = [lerp(this.pts[idxRand][0], centroid[0], caveIn),
                       lerp(this.pts[idxRand][1], centroid[1], caveIn)]
          this.pts[idxRand] = newPt;
        }      
      }
      
      beginShape();   
      for (var p=0; p<this.pts.length; p++) {
        vertex(this.pts[p][0], this.pts[p][1])
      }
      endShape(CLOSE);
      pop();
      
    }
    
    else {
      
      var z1, z2;
      
      do {
        var n = this.pts.length;

        var i1 = int(random(n))
        do { 
          var i2 = int(random(n));
        } while (i1 == i2);

        var r1 = random(minSplitMargin, 1.0-minSplitMargin);
        var r2 = random(minSplitMargin, 1.0-minSplitMargin);

        var p = this.pts;
        var n = p.length;

        var pt1 = [lerp(p[i1][0], p[(i1+1)%n][0], r1),
                   lerp(p[i1][1], p[(i1+1)%n][1], r1)]
        var pt2 = [lerp(p[i2][0], p[(i2+1)%n][0], r2),
                   lerp(p[i2][1], p[(i2+1)%n][1], r2)]

        var newPts1 = [];
        var newPts2 = [];

        if (i2 > i1) {

          newPts1.push(pt1);
          for (var j=i1+1; j<=i2; j++) {
            newPts1.push(p[j]);
          }
          newPts1.push(pt2);
          newPts2.push(pt2);
          for (var j=i2+1; j<=i1+n; j++) {
            newPts2.push(p[j%n]);
          }
          newPts2.push(pt1);

        } else {

          newPts1.push(pt2);
          for (var j=i2+1; j<=i1; j++) {
            newPts1.push(p[j]);
          }
          newPts1.push(pt1);
          newPts2.push(pt1);
          for (var j=i1+1; j<=i2+n; j++) {
            newPts2.push(p[j%n]);
          }
          newPts2.push(pt2);
        }

        var areaTotal = areaConvexPolygon(this.pts);
        var areaPts1 = areaConvexPolygon(newPts1);
        
        
      }
      
      while (areaPts1/areaTotal < pctMinimum || 
             areaPts1/areaTotal > (1.0-pctMinimum))
        
    
      var newcol1 = perturbColor(this.col, gen*xh, gen*xs, gen*xb);
      var newcol2 = perturbColor(this.col, gen*xh, gen*xs, gen*xb);  

      z1 = new Zone(newPts1, newcol1);
      z2 = new Zone(newPts2, newcol2);

      z1.draw(gen-1);
      z2.draw(gen-1);

    }
  } 
}



function keyPressed() {
  if (key==' ') {
    setup();
  }
}

function perturbColor(col, h, s, b) {
  var h2 = floor(hue(col) + random(-h, h) + 255) % 255;
  var s2 = floor(saturation(col) + random(-s, s) + 255) % 255;
  var b2 = floor(brightness(col) + random(-b, b) + 255) % 255;
  return color(h2, s2, b2);
}


function getCentroid(pts) {
  var n = pts.length;
  var x = 0;
  var y = 0;
  for (var i=0; i<n; i++) {
    x += pts[i][0];
    y += pts[i][1];
  }
  var centroid = [float(x)/n, float(y)/n]
  return centroid
}

function areaConvexPolygon(pts) {
  var n = pts.length;
  var area = 0;
  var centroid = getCentroid(pts);
  for (var i=0; i<n; i++) {
    var p1 = pts[i];
    var p2 = pts[(i+1)%n];
    area += areaTriangle(p1, p2, centroid);
  }
  return area
}

function areaTriangle(A, B, C) {
    return (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1])) / 2
}


function linearRegression(data){
  var xsum = 0;
  var ysum = 0;
  
  for( var i=0; i<data.length; i++){
    xsum += data[i][0]/width;
    ysum += data[i][1]/height;
  }
  
  var xmean = xsum/data.length;
  var ymean = ysum/data.length;
  
  var num = 0;
  var den = 0;
  
  for(var i = 0; i<data.length; i++){
    var x = data[i][0]/width;
    var y = data[i][1]/height;
    num += (x-xmean) * (y-ymean);
    den += (x-xmean) * (x-xmean);
  }
  
  m = num/den;
  b = ymean-m*xmean;
  return [m, b]
}




function drawLine(m, b, centroid){
  var x1 = (centroid[0]-200)/width;
  var y1 = m * x1 + b;
  var x2 = (centroid[0]+200)/width;
  var y2 = m * x2 + b;
  
  
  x1 = map(x1, 0, 1, 0, width);
  y1 = map(y1, 0, 1, 0, height);
  x2 = map(x2, 0, 1, 0, width);
  y2 = map(y2, 0, 1, 0, height);
  
  push();
  //stroke(100, 50, 70);
  strokeWeight(4)
  line(x1, y1, x2, y2);
  console.log("hello "+m+ " "+ b + " ")
    console.log("from "+x1 + " " + y1 + " to " +x2 + " " +y2)
  pop();
}
