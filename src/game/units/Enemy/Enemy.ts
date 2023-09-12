import Phaser from 'phaser';

import { fragment } from '../../Shaders/fragment';

import { TFolowerType } from './interfaces';

export const ENEMY_SPEED = 1 / 7000;

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  speed = ENEMY_SPEED;
  path!: Phaser.Curves.Path;
  follower: TFolowerType;
  hp = 100;
  healthBar!: Phaser.GameObjects.Graphics;
  wave!: Phaser.GameObjects.Shader;
  explosionValue = 0.0;
  explosion = false;
  explosionSound = this.scene.sound.add('explosion').setVolume(1);
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
  turrets!: Phaser.GameObjects.Group;
  nextTic = 0;
  bullets!: Phaser.GameObjects.Group;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string, path: Phaser.Curves.Path) {
    super(scene, x, y, texture, frame);

    this.scene = scene;
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    this.path = path;
    this.healthBar = this.scene.add.graphics();

    scene.add.existing(this);
  }

  drawHealthBar() {
    const width = 30;
    const height = 4;
    const x = -width / 2;
    const healthPercentage = this.hp / 100;

    this.healthBar.clear();

    this.healthBar.fillStyle(0xff0000);
    // const redWidth = width * healthPercentage;
    this.healthBar.fillRect(x, -30, width, height);

    this.healthBar.fillStyle(0x00ff00);
    const greenWidth = width * healthPercentage;
    this.healthBar.fillRect(x, -30, greenWidth, height);
  }

  getEnemy(x: number, y: number, distance: number) {
    const turrets = this.turrets.getChildren();

    for (let i = 0; i < turrets.length; i++) {
      const turret = turrets[i];
      if (turret.active && Phaser.Math.Distance.Between(x, y, turret.x, turret.y) <= distance) {
        return turret;
      }
    }
  }

  receiveDamage(damage: number) {
    this.hp -= damage;

    if (!this.damageFxTween.isPlaying()) {
      this.damageFxTween.restart();
      this.damageFxTween.play();
    }

    if (this.hp <= 0) {
      this.explosion = true;
      this.explosionValue = 0.0;
      this.healthBar.clear();
      this.explosionSound.play();

      const shader = new Phaser.Display.BaseShader('shader', fragment, undefined, {
        explosion: { type: '1f', value: this.explosionValue },
      });

      this.wave = this.scene.add.shader(shader, this.x, this.y, window.innerWidth * 2, window.innerHeight * 2);

      setTimeout(() => {
        this.explosion = false;
        this.wave.destroy(true);
        this.setActive(false);
      }, 2100);
      this.setVisible(false);
    }
  }

  startOnPath() {
    // set the t parameter at the start of the path
    this.follower.t = 0;

    // get x and y of the given t point
    this.path.getPoint(this.follower.t, this.follower.vec);

    // set the x and y of our enemy to the received from the previous step
    this.setPosition(this.follower.vec.x, this.follower.vec.y);
  }

  fire() {
    const enemy = this.getEnemy(this.x, this.y, 300);

    if (enemy) {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
      const bullet = this.bullets.get();
      bullet.fire(this.x, this.y, angle);
    }
  }

  update(time: number, delta: number) {
    if (this.explosion) {
      this.explosionValue -= 0.01;
    } else {
      this.explosionValue = 0.0;
    }

    this.wave?.setUniform('explosion.value', this.explosionValue);

    // move the t point along the path, 0 is the start and 0 is the end
    this.follower.t += this.speed * delta;
    this.healthBar?.copyPosition(this);

    // get the new x and y coordinates in vec
    this.path.getPoint(this.follower.t, this.follower.vec);
    if (this.visible) {
      this.drawHealthBar();
    }

    if (this.nextTic < time) {
      this.nextTic = time + 2000;

      this.fire();
    }

    // update enemy x and y to the newly obtained x and y
    this.setPosition(this.follower.vec.x, this.follower.vec.y);
    // if we have reached the end of the path, remove the enemy
    if (this.follower.t >= 1) {
      this.setActive(false);
      this.setVisible(false);
      this.healthBar.clear();
      this.scene.points -= Math.floor(this.hp / 2.5);
    }
  }
}

// Phaser.GameObjects.GameObjectFactory.register('enemy', function (x, y, texture, frame) {
//   const sprite = new Enemy(this.scene, x, y, texture, frame, this.path);
//   this.displayList.add(sprite);

//   this.scene.physics.world.enableBody(sprite, Phaser.Physics.Matter.BodyBounds);
//   sprite.setSize(sprite.width * 0.35, sprite.height * 0.34);
//   sprite.scaleX = 1;

//   return sprite;
// });

// declare global {
//   namespace Phaser.GameObjects {
//     interface GameObjectFactory {
//       enemy(x: number, y: number, texture: string, frame?: string | number): Enemy;
//     }
//   }
// }
