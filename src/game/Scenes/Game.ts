import Phaser from 'phaser';

export default class Game extends Phaser.Scene {
  bullet!: Phaser.GameObjects.Image;
  targetWave: number = 0;
  velocity: number = 0;
  force: number = 0;
  height: number = 90;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  path!: Phaser.Curves.Path;

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

  create() {
    this.bullet = this.physics.add.image(100, 100, 'bullet');
    this.targetWave = this.bullet.y + 80;
    this.height = this.bullet.y;

    const graphics = this.add.graphics();

    this.path = this.add.path(96, -32);

    this.path.lineTo(96, 164);
    this.path.lineTo(850, 164);
    this.path.lineTo(850, window.innerHeight + 32);
    graphics.lineStyle(3, 0xffffff, 1);

    this.path.draw(graphics);
  }

  update(t: number) {
    this.makeWave();
  }
}
