import Phaser from 'phaser';

import { fragment } from '../Shaders/fragment';

export default class Game extends Phaser.Scene {
  bullet!: Phaser.GameObjects.Image;
  targetWave: number = 0;
  velocity: number = 0;
  force: number = 0;
  height: number = 90;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  path!: Phaser.Curves.Path;
  wave!: Phaser.GameObjects.Shader;

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
    const shader = new Phaser.Display.BaseShader('shader', fragment);

    this.input.on('pointerdown', (pointer) => {
      this.wave = this.add
        .shader(shader, pointer.x, pointer.y, window.innerWidth * 2, window.innerHeight * 2)
        .setOrigin(0.5)
        .setDepth(20);
    });

    // this.wave = this.add.shader(shader, 0, 0, window.innerWidth, window.innerHeight).setOrigin(0).setDepth(20);

    // this.add.shader('shader', 0, 0, 800, 600).setOrigin(0);
    this.targetWave = this.bullet.y + 80;
    this.height = this.bullet.y;

    const graphics = this.add.graphics();

    this.path = this.add.path(96, -32);

    this.path.lineTo(96, 164);
    this.path.lineTo(850, 164);
    this.path.lineTo(850, window.innerHeight + 32);
    graphics.lineStyle(3, 0xffffff, 1);

    this.path.draw(graphics);

    // const shader = this.add.shader('shader', 500, 500, 500, 500);
    // shader.setShader('shader');
    // this.bullet.setPipeline(shader);

    // console.log('shader: ', shader);
  }

  update(t: number) {
    this.makeWave();
  }
}
