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
  index++;


  // to relaunch the animation all the time. It creates a loop
  window.requestAnimationFrame(render);
}

img.onload = render;