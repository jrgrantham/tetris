const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

const leftButton = document.getElementById("left");
const rotateButton = document.getElementById("rotate");
const rightButton = document.getElementById("right");
const slamButton = document.getElementById("slam");

context.scale(20, 20);

function collide(arena, player) {
  const [m, o] = [player.matrix, player.position];
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function createPiece(type) {
  player.bricks += 1;
  if (type === "T") {
    return [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ];
  } else if (type === "O") {
    return [
      [2, 2],
      [2, 2],
    ];
  } else if (type === "S") {
    return [
      [0, 3, 3],
      [3, 3, 0],
      [0, 0, 0],
    ];
  } else if (type === "Z") {
    return [
      [4, 4, 0],
      [0, 4, 4],
      [0, 0, 0],
    ];
  } else if (type === "L") {
    return [
      [0, 5, 0],
      [0, 5, 0],
      [0, 5, 5],
    ];
  } else if (type === "J") {
    return [
      [0, 6, 0],
      [0, 6, 0],
      [6, 6, 0],
    ];
  } else if (type === "I") {
    return [
      [0, 7, 0, 0],
      [0, 7, 0, 0],
      [0, 7, 0, 0],
      [0, 7, 0, 0],
    ];
  }
}

const colors = [
  null,
  "red",
  "yellow",
  "green",
  "blue",
  "orange",
  "pink",
  "purple",
];

function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.position);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.position.y][x + player.position.x] = value;
      }
    });
  });
}

function arenaSweep() {
  let rowCount = 1;
  outer: for (let y = arena.length - 1; y > 0; y--) {
    for (let x = 0; x < arena[y].length; x++) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    y++;

    player.score += rowCount * 10;
    player.score += player.bricks;
    player.bricks = 1;
    rowCount *= 2;

    if (player.score > player.highScore) {
      player.highScore = player.score;
    }
  }
}

function playerDrop() {
  player.position.y++;
  if (collide(arena, player)) {
    player.position.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
    player.slam = false;
  }
  dropCounter = 0;
}

function updateScore() {
  document.getElementById("score").innerText = `Score: ${player.score}`;
  document.getElementById(
    "highScore"
  ).innerText = `High Score: ${player.highScore}`;
}

function playerMove(direction) {
  player.position.x += direction;
  if (collide(arena, player)) {
    player.position.x -= direction;
  }
}

// function slam() {
//   player.position.y++;
//   if (collide(arena, player)) {
//     player.position.y--;
//     player.position.y--;
//     playerDrop()
//   }
// }

function playerReset() {
  const pieces = "ILJOTSZ";
  player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
  player.position.y = 0;
  player.position.x =
    ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
  if (collide(arena, player)) {
    arena.forEach((row) => row.fill(0));
    player.bricks = 1;
    player.score = 0;
    updateScore();
  }
}

function playerRotate(direction) {
  const position = player.position.x;
  rotate(player.matrix, direction);
  let offset = 1;
  while (collide(arena, player)) {
    player.position.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -direction);
      player.position.x = position;
    }
  }
}

function rotate(matrix, direction) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if (direction > 0) {
    matrix.forEach((row) => row.reverse());
  } else {
    matrix.reverse();
  }
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;

  if (player.slam) {
    playerDrop();
  }

  if (dropCounter > dropInterval) {
    // console.log(leftButton)
    playerDrop();
    // console.log(player.bricks);
  }

  draw();
  requestAnimationFrame(update);
}

const arena = createMatrix(12, 20);
console.table(arena);

const player = {
  position: { x: 0, y: 0 },
  matrix: null,
  bricks: 0,
  score: 0,
  highScore: 0,
  slam: false,
};

// document.getElementById("left").addEventListener("click", console.log("left"));
leftButton.onclick = function () {
  playerMove(-1);
};
rightButton.onclick = function () {
  playerMove(1);
};
rotateButton.onclick = function () {
  playerRotate(-1);
};
slamButton.onclick = function () {
  player.slam = true;
  playerDrop();
};

document.addEventListener("keydown", (event) => {
  if (event.keyCode === 37) {
    playerMove(-1);
  } else if (event.keyCode === 39) {
    playerMove(1);
  } else if (event.keyCode === 40) {
    player.slam = true;
    playerDrop();
  } else if (event.keyCode === 81) {
    playerRotate(-1);
  } else if (event.keyCode === 87) {
    playerRotate(1);
  }
});

playerReset();
updateScore();
update();
