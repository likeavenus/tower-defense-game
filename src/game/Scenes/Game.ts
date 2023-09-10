import Phaser from 'phaser';

import { fragment } from '../Shaders/fragment';
import { Enemy } from '../units/Enemy';
import { Turret } from '../units/Turret/Turret';
import { drawGrid, canPlaceTurret } from '../helpers';
import { Bullet } from '../units/Enemy/Bullet';
import { BULLET_DAMAGE } from '../constants';

export default class Game extends Phaser.Scene {
  bullet!: Phaser.GameObjects.Image;
  targetWave: number = 0;
  velocity: number = 0;
  force: number = 0;
  height: number = 0;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  path!: Phaser.Curves.Path;
  wave!: Phaser.GameObjects.Shader;
  enemies!: Phaser.GameObjects.Group;
  enemy!: Enemy;
  turrets!: Phaser.GameObjects.Group;
  bullets!: Phaser.GameObjects.Group;
  pointsText!: Phaser.GameObjects.Text;
  points = 250;

  constructor() {
    super('Game');
  }

  preload() {
    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  makeWave() {
    let loss = -0.02 * this.velocity;
    this.height = this.bullet.y;
    const x = this.height - this.targetWave;
    this.force = -0.015 * x + loss;
    this.velocity += this.force;
    this.bullet.y += this.velocity;
  }

  createPath() {
    const graphics = this.add.graphics();

    this.path = this.add.path(96, -32);
    this.path.lineTo(96, 164);
    this.path.lineTo(480, 164);
    this.path.lineTo(480, 544);

    // this.path.lineTo(96, 164);
    // this.path.lineTo(850, 164);
    // this.path.lineTo(850, window.innerHeight - 50);
    // this.path.lineTo(0, window.innerHeight - 50);
    graphics.lineStyle(3, 0xffffff, 1);

    this.path.draw(graphics);

    return this.path;
  }

  placeTurret(pointer) {
    var i = Math.floor(pointer.y / 64);
    var j = Math.floor(pointer.x / 64);

    if (canPlaceTurret(i, j)) {
      if (this.points >= 100) {
        this.points -= 50;

        const turret = this.turrets.get();
        if (turret) {
          turret.setActive(true);
          turret.setVisible(true);
          turret.place(i, j);
        }
      }
    }
  }

  damageEnemy = (enemy: Enemy, bullet: Bullet) => {
    // only if both enemy and bullet are alive
    if (enemy.active && bullet.active) {
      // we remove the bullet right away
      bullet.setActive(false);
      bullet.setVisible(false);

      // decrease the enemy hp with BULLET_DAMAGE
      enemy.receiveDamage(BULLET_DAMAGE);

      if (enemy.hp <= 0) {
        this.points += 10;

        const shader = new Phaser.Display.BaseShader('shader', fragment, undefined);
        this.wave = this.add
          .shader(shader, enemy.x, enemy.y, window.innerWidth * 2, window.innerHeight * 2)
          .setOrigin(0.5)
          .setDepth(20);
        this.wave.setUniform('iTime', 0.0);

        // cancelAnimationFrame(animationId);
        // this.wave = this.add
        //   .shader(shader, enemy.x, enemy.y, window.innerWidth * 2, window.innerHeight * 2)
        //   .setOrigin(0.5)
        //   .setDepth(20);

        // setTimeout(() => {
        //   this.wave.destroy();
        // }, 1000);

        // this.input.on('pointerdown', (pointer) => {
        //   this.wave = this.add
        //     .shader(shader, pointer.x, pointer.y, window.innerWidth * 2, window.innerHeight * 2)
        //     .setOrigin(0.5);

        //   setTimeout(() => {
        //     this.wave.destroy(true);
        //   }, 2000);
        // });
        enemy.hp = 100;
      }
    }
  };

  create() {
    const graphics = this.add.graphics();
    drawGrid(graphics);
    this.path = this.createPath();
    this.pointsText = this.add.text(10, 10, this.points.toString());

    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });

    this.enemies = this.physics.add.group({
      defaultKey: 'sprites',
      classType: Enemy,
      runChildUpdate: true,
      createCallback: (enemy) => {
        enemy.path = this.path;
      },
    });

    this.turrets = this.physics.add.group({
      defaultKey: 'sprites',
      defaultFrame: 'turret',
      classType: Turret,
      runChildUpdate: true,
      createCallback: (turret) => {
        turret.enemies = this.enemies;
        turret.bullets = this.bullets;
      },
    });

    this.physics.add.overlap(this.enemies, this.bullets, this.damageEnemy);

    // this.enemies.create(96, 0, 'sprites', undefined);
    // this.enemies.create(0, 0, 'sprites', this.path);

    this.nextEnemy = 0;

    // const shader = new Phaser.Display.BaseShader('shader', fragment, undefined);
    // this.wave = this.add
    //   .shader(shader, this.bullet.x, this.bullet.y, window.innerWidth * 2, window.innerHeight * 2)
    //   .setOrigin(0.5)
    //   .setDepth(20);

    // this.input.on('pointerdown', (pointer) => {
    //   this.wave = this.add
    //     .shader(shader, pointer.x, pointer.y, window.innerWidth * 2, window.innerHeight * 2)
    //     .setOrigin(0.5);

    //   setTimeout(() => {
    //     this.wave.destroy(true);
    //   }, 2000);
    // });

    this.input.on('pointerdown', (pointer) => this.placeTurret(pointer));
    // this.targetWave = this.bullet.y + 100;
    // this.height = this.bullet.y;
  }

  update(time: number, delta: number) {
    // console.log('this.points: ', this.points);

    this.pointsText.text = `Points: ${this.points}`;
    if (this.points < 100) {
      this.pointsText.setColor('red');
    } else {
      this.pointsText.setColor('#ffffff');
    }
    if (time > this.nextEnemy) {
      const enemy = this.enemies.get();
      if (enemy) {
        // place the enemy at the start of the path
        enemy.startOnPath();

        this.nextEnemy = time + 2000;

        enemy.setActive(true);
        enemy.setVisible(true);
      }
    }
  }
}
