import Phaser from 'phaser';

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
  points = 150;
  explosion = 0;
  level = 1;
  customEnemy!: Enemy;
  customTurret!: Turret;

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
    const i = Math.floor(pointer.y / 64);
    const j = Math.floor(pointer.x / 64);

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
    if (enemy.visible && bullet.active) {
      // we remove the bullet right away
      bullet.setActive(false);
      bullet.setVisible(false);

      // decrease the enemy hp with BULLET_DAMAGE
      enemy.receiveDamage(BULLET_DAMAGE);

      if (enemy.hp <= 0) {
        this.points += 40;
        enemy.hp = 100;
      }
    }
    // only if both enemy and bullet are alive
  };

  damageTurret = (enemy: Turret, bullet: Bullet) => {
    if (enemy.active && bullet.active) {
      // we remove the bullet right away
      bullet.setActive(false);
      bullet.setVisible(false);

      // decrease the enemy hp with BULLET_DAMAGE
      enemy.receiveDamage(BULLET_DAMAGE);

      if (enemy.hp <= 0) {
        this.points += 40;
        enemy.hp = 100;
      }
    }
  };

  create() {
    const graphics = this.add.graphics();
    drawGrid(graphics);
    this.path = this.createPath();
    this.pointsText = this.add.text(530, 10, this.points.toString());

    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });

    this.enemyBullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });
    const step = 32;

    this.enemies = this.physics.add.group({
      defaultKey: 'sprites',
      classType: Enemy,
      repeat: 8,
      runChildUpdate: true,
      createCallback: (enemy) => {
        enemy.path = this.path;
        enemy.x = 96;
        enemy.y = -32;
        enemy.turrets = this.turrets;
        enemy.bullets = this.enemyBullets;
      },
    });

    // this.enemies.create(0, 0, 'sprites', 'enemy', true, true);

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
    // this.turrets.create(step * 7, step * 11, 'sprites', 'turret', true, true);
    // this.customTurret = this.turrets.get(step * 7, step * 11, 'sprites', 'turret', true);

    this.physics.add.overlap(this.enemies, this.bullets, this.damageEnemy);
    this.physics.add.overlap(this.turrets, this.enemyBullets, this.damageTurret);

    this.nextEnemy = 0;

    this.input.on('pointerdown', (pointer) => this.placeTurret(pointer));
  }

  update(time: number, delta: number) {
    // const customTurret = this.turrets.getChildren()[0] as Turret;
    this.pointsText.text = `Points: ${this.points}`;
    if (this.points < 100) {
      this.pointsText.setColor('red');
    } else {
      this.pointsText.setColor('#ffffff');
    }

    if (time > this.nextEnemy) {
      const enemy: Enemy = this.enemies.get();

      // enemy.update();
      if (enemy) {
        // place the enemy at the start of the path
        enemy.startOnPath();

        this.nextEnemy = time + 900;
        enemy.setActive(true);
        enemy.setVisible(true);
      }
    }

    if (this.points <= 0) {
      this.scene.stop();
      this.scene.launch('Preloader');
      this.turrets.clear(true);
      this.points = 150;
    }
  }
}
