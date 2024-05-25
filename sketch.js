let img;
let palette;
let y = 0;

function preload() {
  img = loadImage('assets/');
}

function setup() {
  createCanvas(1200, 800);
  img.resize(width, height);

  palette = [
    '#264653', '#2a9d8f',
    '#e9c46a', '#f4a261',
    '#e76f51', '#ff6f61',
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

  let brushSize = random(1, 2);
    stroke(paletteColor);
    strokeWeight(brushSize);
    point(x + random(-brushSize, brushSize), y + random(-brushSize, brushSize));
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