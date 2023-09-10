import { MAP } from './constants';

export function drawGrid(graphics) {
  graphics.lineStyle(1, 0x0000ff, 0.8);
  for (var i = 0; i < 8; i++) {
    graphics.moveTo(0, i * 64);
    graphics.lineTo(640, i * 64);
  }
  for (var j = 0; j < 10; j++) {
    graphics.moveTo(j * 64, 0);
    graphics.lineTo(j * 64, 512);
  }
  graphics.strokePath();
}

// export function drawGrid(graphics: Phaser.GameObjects.Graphics) {
//   graphics.lineStyle(1, 0x0000ff, 0.8);
//   for (let i = 0; i < window.innerWidth / 64; i++) {
//     graphics.moveTo(0, i * 64);
//     graphics.lineTo(window.innerWidth, i * 64);
//   }
//   for (let j = 0; j < window.innerWidth / 64; j++) {
//     graphics.moveTo(j * 64, 0);
//     graphics.lineTo(j * 64, window.innerHeight);
//   }
//   graphics.strokePath();
// }

export function canPlaceTurret(i: number, j: number) {
  return MAP[i][j] === 0;
}
