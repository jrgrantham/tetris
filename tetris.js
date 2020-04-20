const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

context.scale(20, 20);

const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0],
];

function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(player.matrix, player.position);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = "red";
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;

  if (dropCounter > dropInterval) {
    console.log(dropCounter);
    player.position.y++;
    dropCounter = 0;
  }

  draw();
  requestAnimationFrame(update);
}

const player = {
  position: { x: 6, y: 5 },
  matrix: matrix,
};

document.addEventListener("keydown", (event) => {
  if (event.keyCode === 37) {
    player.position.x--;
  } else if (event.keyCode === 39) {
    player.position.x++;
  } else if (event.keyCode === 40) {
    player.position.y++;
    dropCounter = 0;
  }
});

update();
