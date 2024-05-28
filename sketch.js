//We need a variable to hold our image
let img;
let palette;
let y = 0;
//Let's add a variable for the canvas aspect ratio
const originalWidth = 1200;
const originalHeight = 800;
let aspectRatio = originalWidth / originalHeight;

//let's load the image from disk
function preload() {
  img = loadImage('assets/quay.jpg');
}

function setup() {
   //We will make the canvas the same size as the image using its properties
  calculateCanvasSize();
  img.resize(width, height);

  //we use Photoshop to find the color
  palette = [
    '#264653', '#2a9d8f',
    '#e9c46a', '#f4a261',
    '#e76f51', '#ff6f61',
    '#b0824f', '#dd9d51',
    '#58302e', '#ad342e',
    '#f73a28', '#3a669c',
    '#dc7542', '#bd5a42',
    '#d5b171', '#936c4a', 
  ];

  //Let's add a variable of speed
  frameRate(25);
}

function draw() {
  //brush effect
  for (let x = 0; x < width; x++) {
    const imgColor = img.get(x, y);
    
    if (imgColor === undefined) {
      console.log(`Undefined color at (${x}, ${y})`);
      continue;
    }

  const paletteColor = getPaletteColor(imgColor);

    if (paletteColor === undefined) {
      console.log(`Undefined palette color for image color: ${imgColor}`);
      continue;
    }

    //Let's add a variable of brushSize
    let brushSize = (x % 2 === 0) ? 3 : 3;
    
    drawBlurredCircle(x, y, brushSize, paletteColor);
  }

  y++;
  if (y >= height) {
    noLoop();
  }
}

function getPaletteColor(imgColor) {
  const imgR = red(imgColor);
  const imgG = green(imgColor);
  const imgB = blue(imgColor);

  let minDistance = 999999;
  let targetColor;

  for (const c of palette) {
    const paletteR = red(c);
    const paletteG = green(c);
    const paletteB = blue(c);

    const colorDistance =
      dist(imgR, imgG, imgB,
           paletteR, paletteG, paletteB);

    if (colorDistance < minDistance) {
      targetColor = c;
      minDistance = colorDistance;
    }
  }

  return targetColor;
}

function drawBlurredCircle(x, y, size, color) {
  noStroke();
  fill(color);

  let angle = random(TWO_PI);
  let length = random(size * 0.5, size * 1.5);
  let dx = cos(angle) * length;
  let dy = sin(angle) * length;
  for (let i = 0; i < 5; i++) {
    let offsetX = random(-size, size);
    let offsetY = random(-size, size);
    ellipse(x + dx + offsetX, y + dy + offsetY, size, size);
  }
}

function windowResized() {
  calculateCanvasSize();
  img.resize(width, height);
  y = 0; //Restart palette effect
  loop(); // restart the draw loop
}

function calculateCanvasSize() {
   //Calculate the aspect ratio of the canvas
  let canvasWidth = windowWidth;
  let canvasHeight = windowWidth / aspectRatio;
  //Let the canvas maintain proportions
  if (canvasHeight > windowHeight) {
    canvasHeight = windowHeight;
    canvasWidth = windowHeight * aspectRatio;
  }

  createCanvas(canvasWidth, canvasHeight);
}