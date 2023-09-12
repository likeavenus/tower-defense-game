import Phaser from 'phaser';

import { MAP } from '../../constants';
import { getRandomIntFromRange } from '../../helpers';

export class Turret extends Phaser.Physics.Arcade.Sprite {
  nextTic = 0;
  bullets!: Phaser.GameObjects.Group;
  enemies!: Phaser.GameObjects.Group;
  shootSound = this.scene.sound.add('turret_shoot').setVolume(0.5);
  isCustom = false;
  hp = 100;
  healthBar = this.scene.add.graphics();
  shield = 1000;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string) {
    super(scene, x, y, texture, frame);
    this.scene = scene;

    scene.add.existing(this);
  }

  drawHealthBar() {
    const width = 50;
    const height = 4;
    const x = -width / 2;
    const healthPercentage = this.hp / 100;
    const shieldPercentage = this.shield / 1000;
    this.healthBar.clear();

    this.healthBar.fillStyle(0xff0000);
    this.healthBar.fillRect(x, -39, width, height);

    this.healthBar.fillStyle(0x00ff00);
    this.healthBar.fillRect(x, -39, width * healthPercentage, height);

    this.healthBar.fillStyle(0x00ffff);
    this.healthBar.fillRect(x, -45, width * shieldPercentage, height);
  }

  receiveDamage(damage: number) {
    this.shield -= damage;
    if (this.shield <= 0) {
      this.hp -= damage;

      if (this.hp <= 0) {
        this.destroy(true);
        this.setActive(false);
        this.healthBar.clear();
      }
    }
  }

  addBullet(x: number, y: number, angle: number) {
    const bullet = this.bullets.get();
    if (bullet) {
      bullet.fire(x, y, angle);
    }
  }

  getEnemy(x: number, y: number, distance: number) {
    const enemyUnits = this.enemies.getChildren();

    for (let i = 0; i < enemyUnits.length; i++) {
      if (enemyUnits[i].visible && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <= distance)
        return enemyUnits[i];
    }

    return false;
  }

  fire() {
    const enemy = this.getEnemy(this.x, this.y, 250);
    if (enemy) {
      const randomInt = getRandomIntFromRange(400, 850);
      this.shootSound.setDetune(randomInt);
      this.shootSound.play();
      const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
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
      this.nextTic = time + 1000;
    }
    this.healthBar.copyPosition(this);

    if (this.active) {
      this.drawHealthBar();
    }
  }
}
