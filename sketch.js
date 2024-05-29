//We need a variable to hold our image
let img;

let palette;

let y = 0;

//Let's make an object to hold the draw properties of the image
let imgDrwPrps = {aspect: 0, width: 0, height: 0, xOffset: 0, yOffset: 0};

//And a variable for the canvas aspect ratio
let canvasAspectRatio = 1200 / 800;
const originalWidth = 1200;
const originalHeight = 800;
let aspectRatio = originalWidth / originalHeight;

//let's load the image from disk
function preload() {
  img = loadImage('/assets/quay.jpg');
}

function setup() {
  //We will make the canvas the same size as the image using its properties
  let canvasSize = calculateCanvasSize();
  createCanvas(canvasSize.canvasWidth, canvasSize.canvasHeight);
  //let's calculate the aspect ratio of the image - this will never change so we only need to do it once
  img.resize(canvasSize.canvasWidth, canvasSize.canvasHeight);
  imgDrwPrps.aspect = img.width / img.height;
  //now let's calculate the draw properties of the image using the function we made
  calculateImageDrawProps(canvasSize.canvasWidth, canvasSize.canvasHeight);
  
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
    const imgColor = img.get(floor(x * (img.width / width)), floor(y * (img.height / height)));

    if (imgColor === undefined) {
      console.log(`Undefined color at (${x}, ${y})`);
      continue;
    }

  const paletteColor = getPaletteColor(imgColor);

    if (paletteColor === undefined) {
      console.log(`Undefined palette color for image color: ${imgColor}`);
      continue;
    }

    let brushSize = (x % 1 === 0) ? 3 : 3;
    
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
  let canvasSize = calculateCanvasSize();
  resizeCanvas(canvasSize.canvasWidth, canvasSize.canvasHeight);
  calculateImageDrawProps(canvasSize.canvasWidth, canvasSize.canvasHeight);
  y = 0; //Restart palette effect
  loop(); // restart the draw loop
}

function calculateCanvasSize() {
  let canvasWidth = windowWidth;
  let canvasHeight = windowWidth / aspectRatio;
  
  if (canvasHeight > windowHeight) {
    canvasHeight = windowHeight;
    canvasWidth = windowHeight * aspectRatio;
  }

  return { canvasWidth, canvasHeight };
}

function calculateImageDrawProps(canvasWidth, canvasHeight) {
  //Calculate the aspect ratio of the canvas
  canvasAspectRatio = canvasWidth / canvasHeight;
  //if the image is wider than the canvas
  if (imgDrwPrps.aspect > canvasAspectRatio) {
    //then we will draw the image to the width of the canvas
    imgDrwPrps.width = canvasWidth;
    //and calculate the height based on the aspect ratio
    imgDrwPrps.height = canvasWidth / imgDrwPrps.aspect;
    imgDrwPrps.yOffset = (canvasHeight - imgDrwPrps.height) / 2;
    imgDrwPrps.xOffset = 0;
  } else if (imgDrwPrps.aspect < canvasAspectRatio) {
    //otherwise we will draw the image to the height of the canvas
    imgDrwPrps.height = canvasHeight;
    //and calculate the width based on the aspect ratio
    imgDrwPrps.width = canvasHeight * imgDrwPrps.aspect;
    imgDrwPrps.xOffset = (canvasWidth - imgDrwPrps.width) / 2;
    imgDrwPrps.yOffset = 0;
  } else {
    imgDrwPrps.width = canvasWidth;
    imgDrwPrps.height = canvasHeight;
    imgDrwPrps.xOffset = 0;
    imgDrwPrps.yOffset = 0;
  }
}

function keyPressed() {
  if (key == " ") {
    showPaletteEffect = !showPaletteEffect;
  }
}