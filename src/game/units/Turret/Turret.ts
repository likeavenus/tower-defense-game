import Phaser from 'phaser';

import { MAP } from '../../constants';
import { getRandomIntFromRange } from '../../helpers';

export class Turret extends Phaser.Physics.Arcade.Sprite {
  nextTic = 0;
  bullets!: Phaser.GameObjects.Group;
  enemies!: Phaser.GameObjects.Group;
  shootSound = this.scene.sound.add('turret_shoot').setVolume(0.7);
  deadSound = this.scene.sound.add('turret_dead').setVolume(7);
  isCustom = false;
  hp = 100;
  healthBar = this.scene.add.graphics();
  shield = 300;
  damageFx = this.postFX.addBloom(0xffffff, 1, 1, 0, 2);
  damageFxTween = this.scene.tweens.add({
    targets: this.damageFx,
    blurStrength: 2,
    yoyo: true,
    duration: 100,
    paused: true,
    onComplete: () => {
      this.damageFxTween.restart();
      this.damageFxTween.pause();
    },
  });
  barrelFx = this.preFX?.addBarrel(1);
  barrelFxTween = this.scene.tweens.add({
    targets: this.barrelFx,
    amount: 0,
    yoyo: true,
    loop: -1,
    duration: 800,
    ease: 'sine.inout',
    paused: true,
  });

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
    const shieldPercentage = this.shield / 300;
    this.healthBar.clear();

    this.healthBar.fillStyle(0xff0000);
    this.healthBar.fillRect(x, -39, width, height);

    this.healthBar.fillStyle(0x00ff00);
    this.healthBar.fillRect(x, -39, width * healthPercentage, height);

    this.healthBar.fillStyle(0xff00ff);
    this.healthBar.fillRect(x, -45, width, height);
    if (this.shield > 0) {
      this.healthBar.fillStyle(0x00ffff);
      this.healthBar.fillRect(x, -45, width * shieldPercentage, height);
    }
  }

  receiveDamage(damage: number) {
    if (!this.damageFxTween.isPlaying()) {
      this.damageFxTween.restart();
      this.damageFxTween.play();
    }
    this.shield -= damage;
    if (this.shield <= 0) {
      this.hp -= damage;

      if (this.hp <= 0) {
        this.healthBar.clear();
        if (!this.barrelFxTween.isPlaying()) {
          this.barrelFxTween.play();
        }
        this.setActive(false);
        setTimeout(() => {
          this.destroy(true);
        }, 1000);
        this.deadSound.play();
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
      const randomInt = getRandomIntFromRange(1600, 1700);
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
