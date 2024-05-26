let img;
let palette;
let y = 0;

function preload() {
  img = loadImage('assets/quay.jpg');
}

function setup() {
  createCanvas(1200, 800);
  img.resize(width, height);

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

  image(img, 0, 0);
  frameRate(30);
}

function draw() {
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

    let brushSize;
    if (x % 2 === 0) { 
      brushSize = 3; 
    } else {
      brushSize = 1; 
    }
    
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