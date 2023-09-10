import Phaser from 'phaser';

import { MAP } from '../../constants';

export class Turret extends Phaser.Physics.Arcade.Sprite {
  nextTic = 0;
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string) {
    super(scene, x, y, texture, frame);
    this.scene = scene;

    scene.add.existing(this);
  }

  addBullet(x: number, y: number, angle: number) {
    const bullet = this.bullets.get();
    if (bullet) {
      bullet.fire(x, y, angle);
    }
  }

  getEnemy(x: number, y: number, distance: number) {
    const enemyUnits = this.enemies.getChildren();

    for (var i = 0; i < enemyUnits.length; i++) {
      if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <= distance)
        return enemyUnits[i];
    }

    return false;
  }

  fire() {
    const enemy = this.getEnemy(this.x, this.y, 200);
    if (enemy) {
      var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
      this.addBullet(this.x, this.y, angle);
      this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
    }
  }

  place(i: number, j: number) {
    this.y = i * 64 + 64 / 2;
    this.x = j * 64 + 64 / 2;
    MAP[i][j] = 1;
  }
  update(time: number, delta: number) {
    if (time > this.nextTic) {
      this.fire();
      this.nextTic = time + 700;
    }
  }
}
