// export function playerDrop() {
//   player.position.y++;
//   if (collide(arena, player)) {
//     player.position.y--;
//     merge(arena, player);
//     playerReset();
//     arenaSweep();
//     updateScore();
//   }
//   dropCounter = 0;
// }
// export function playerMove(direction) {
//   player.position.x += direction;
//   if (collide(arena, player)) {
//     player.position.x -= direction;
//   }
// }
// export function slam() {
//   player.position.y++;
//   if (collide(arena, player)) {
//     player.position.y--;
//     player.position.y--;
//     playerDrop();
//   }
//   slam();
// }
// export function playerReset() {
//   const pieces = "ILJOTSZ";
//   player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
//   player.position.y = 0;
//   player.position.x =
//     ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
//   if (collide(arena, player)) {
//     arena.forEach((row) => row.fill(0));
//     player.score = 0;
//     updateScore();
//   }
// }
// export function playerRotate(direction) {
//   const position = player.position.x;
//   rotate(player.matrix, direction);
//   let offset = 1;
//   while (collide(arena, player)) {
//     player.position.x += offset;
//     offset = -(offset + (offset > 0 ? 1 : -1));
//     if (offset > player.matrix[0].length) {
//       rotate(player.matrix, -direction);
//       player.position.x = position;
//     }
//   }
// }
// export function rotate(matrix, direction) {
//   for (let y = 0; y < matrix.length; y++) {
//     for (let x = 0; x < y; x++) {
//       [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
//     }
//   }
//   if (direction > 0) {
//     matrix.forEach((row) => row.reverse());
//   }
//   else {
//     matrix.reverse();
//   }
// }
