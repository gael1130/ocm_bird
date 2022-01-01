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

// 34mn: adding obstacles
// pipe settings
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * (canvas.height - (pipeGap + pipeWidth) - pipeWidth)) + pipeWidth;


// the variables, evolving during the game

// creating the paralax effect, background moving slower than obstacles
let index = 0,
    bestScore = 0,
    currentScore = 0,
    // array of obstacles
    pipes = [],
    flight,
    flyHeight;


// setup for the beginning of the game
const setup = () => {
  currentScore = 0;
  flight = jump;
  flyHeight = (canvas.height / 2) - (size[1] / 2);

  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
  console.log(pipes);
}

const render = () => {
  // the index is controlling the elements
  // make the pipe and bird moving
  index++;

  // background
  // negative value because the index is adding at each loop so it will create the moving
  // background illusion
  // ((index * (speed / 2)) % canvas.width => create the move, modulo to limit the move
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);

  // second element to make the background run smoothly (23mn11)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width), 0, canvas.width, canvas.height);


  // birds actions when the game is launched
  if (gamePlaying) {
    // cTenth => c for canvas and Tenth for 1/10th of the screen for the position
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
    flight += gravity;
    // the fly height is now the minimum of those 2 arguments
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);

  } else {
      // draw bird

// starts at 432 because it is the end of the background image and beginning of bird
// ... is used as spread operator, see here: https://dev.to/sagar/three-dots---in-javascript-26ci

// first version, with no apparent animation
  // ctx.drawImage(img, 432, 0, ...size, (canvas.width / 2) - size[0] / 2, flyHeight, ...size)

// now I animate
// Math.floor((index % 9) / 3 * size[1] => to select one of the 3 birds to animate
  ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, (canvas.width / 2) - size[0] / 2, flyHeight, ...size);
  // this is the position of the bird. We center it with these operations
  // set initial flyHeight (middle of screen - size of the bird)
  flyHeight = (canvas.height / 2 - (size[1] / 2));

  // write in the canvas
  ctx.fillText(`Best Score: ${bestScore}🍌`, 55, 245);
  ctx.fillText(`Click to play`, 48, 535);
  ctx.font = "bold 30px courier";

  }

  // pipe display
  if (gamePlaying) {
    pipes.map(pipe => {
      pipe[0] -= speed;

      // top pipe
      ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      // bottom pipe
      ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);

        // remove pipe + create new pipe
        pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
        console.log(pipes);
      }

      // if hit pipe, end game
      // cTenth is the location of the bird
      if ([
        pipe[0] <= cTenth + size[0],
        pipe[0] + pipeWidth >= cTenth,
        pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
      ].every(elem => elem)) {
        gamePlaying = false;
        setup();
      }
      // .every allows to test every condition
    })
  }

  document.getElementById('bestScore').innerHTML = `Best: ${bestScore}`;
  document.getElementById('currentScore').innerHTML = `Current: ${currentScore}`;


  // to relaunch the animation all the time. It creates a loop
  window.requestAnimationFrame(render);
}

setup();
img.onload = render;

// launch the game on click
document.addEventListener('click', () => gamePlaying = true);

// also when a button is hit, request from yostaibibi#1734
document.addEventListener('keyup', () => gamePlaying = true);

// to make the bird appear when I click and play the game
window.onclick = () => flight = jump;

// also when a key is pressed, request from yostaibibi#1734
window.onkeyup = () => flight = jump;
