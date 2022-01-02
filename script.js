const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const img = new Image();
img.src = './media/ocm-assets.png';

// general settings

let gamePlaying = false;

const gravity = .5;
const speed = 6.2;
const size = [51, 36];
const jump = -11.5;
const cTenth = (canvas.width / 10);

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
  index++;
  // background
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);

  // second element to make the background run smoothly
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width), 0, canvas.width, canvas.height);


  // birds actions when the game is launched
  if (gamePlaying) {

    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);

  } else {
      // draw bird

  ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, (canvas.width / 2) - size[0] / 2, flyHeight, ...size);
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
      if ([
        pipe[0] <= cTenth + size[0],
        pipe[0] + pipeWidth >= cTenth,
        pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
      ].every(elem => elem)) {
        gamePlaying = false;
        setup();
      }
    })
  }

  document.getElementById('bestScore').innerHTML = `Best: ${bestScore}`;
  document.getElementById('currentScore').innerHTML = `Current: ${currentScore}`;

  window.requestAnimationFrame(render);
}

setup();
img.onload = render;

// launch the game
document.addEventListener('click', () => gamePlaying = true);
document.addEventListener('keydown', () => gamePlaying = true);


window.onclick = () => flight = jump;
window.onkeyup = () => flight = jump;
