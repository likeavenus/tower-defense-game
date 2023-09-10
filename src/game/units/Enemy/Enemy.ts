import Phaser from 'phaser';

import { TFolowerType } from './interfaces';

const ENEMY_SPEED = 1 / 10000;

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  path!: Phaser.Curves.Path;
  follower: TFolowerType;
  hp = 100;
  healthBar: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string, path: Phaser.Curves.Path) {
    super(scene, x, y, texture, frame);

    this.scene = scene;
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    this.path = path;
    this.healthBar = this.scene.add.graphics().setDepth(2);

    scene.add.existing(this);
  }

  drawHealthBar() {
    const width = 30; // Ширина полоски здоровья
    const height = 4; // Высота полоски здоровья
    const x = -width / 2; // Смещение полоски по оси X

    this.healthBar.clear();

    // Отрисуйте красную полоску полного здоровья
    this.healthBar.fillStyle(0xff0000);
    this.healthBar.fillRect(x, -30, width, height);

    // Отрисуйте зеленую полоску, представляющую текущее здоровье
    const healthPercentage = this.hp / 100;
    const greenWidth = width * healthPercentage;
    this.healthBar.fillStyle(0x00ff00);
    this.healthBar.fillRect(x, -30, greenWidth, height);
  }

  receiveDamage(damage: number) {
    this.hp -= damage;
    // if hp drops below 0 we deactivate this enemy
    if (this.hp <= 0) {
      this.setActive(false);
      this.setVisible(false);
      this.healthBar.clear();
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

  update(time: number, delta: number) {
    // move the t point along the path, 0 is the start and 0 is the end
    this.follower.t += ENEMY_SPEED * delta;
    this.healthBar.copyPosition(this);

    // get the new x and y coordinates in vec
    this.path.getPoint(this.follower.t, this.follower.vec);
    this.drawHealthBar();

    // update enemy x and y to the newly obtained x and y
    this.setPosition(this.follower.vec.x, this.follower.vec.y);
    // if we have reached the end of the path, remove the enemy
    if (this.follower.t >= 1) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register('enemy', function (x, y, texture, frame) {
  const sprite = new Enemy(this.scene, x, y, texture, frame, this.path);
  this.displayList.add(sprite);

  this.scene.physics.world.enableBody(sprite, Phaser.Physics.Matter.BodyBounds);
  sprite.setSize(sprite.width * 0.35, sprite.height * 0.34);
  sprite.scaleX = 1;

  return sprite;
});

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      enemy(x: number, y: number, texture: string, frame?: string | number): Enemy;
    }
  }
}
