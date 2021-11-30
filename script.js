const canvas = document.getElementById('canvas');
// ctx = context
const ctx = canvas.getContext('2d');
// getContext('2d') allow to call Js methods  for 2D methods
// JS Object named image
const img = new Image();
img.src = './media/flappy-bird-set.png'

// general settings

// to know if we are playing or not
let gamePlaying = false;
// games parameters for difficulty settings
const gravity = .5;
const speed = 6.2;
// bird size: [width, height]
const size = [51, 36];
const jump = -11.5;
// constant equal to a tenth of the canvas to do what?
const cTenth = (canvas.width / 10);

// the variables, evolving during the game

// creating the paralax effect, background moving slower than obstacles
let index = 0,
    bestScore = 0,
    currentScore = 0,
    // array of obstacles
    pipes = [],
    flight,
    flyHeight;

const render = () => {
  // the index is controlling the elements
  // make the pipe and bird moving
  index++;

  // background
  // negative value because the index is adding at each loop so it will create the moving
  // background illusion
  // ((index * (speed / 2)) % canvas.width => create the move, modulo to limit the move
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);

  // draw bird

// starts at 432 because it is the end of the background image and beginning of bird
// ... is used as spread operator, see here: https://dev.to/sagar/three-dots---in-javascript-26ci

// first version, with no apparent animation
  // ctx.drawImage(img, 432, 0, ...size, (canvas.width / 2) - size[0] / 2, flyHeight, ...size)

// now I animate
// Math.floor((index % 9) / 3 * size[1] => to select one of the 3 birds to animate
  ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, (canvas.width / 2) - size[0] / 2, flyHeight, ...size)
  // this is the position of the bird. We center it with these operations
  // set initial flyHeight (middle of screen - size of the bird)
  flyHeight = (canvas.height / 2 - (size[1] / 2))


  // to relaunch the animation all the time. It creates a loop
  window.requestAnimationFrame(render);
}

img.onload = render;