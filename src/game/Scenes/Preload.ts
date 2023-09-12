import Phaser from 'phaser';

import Bullet from '../assets/bullet.png';
import SpritesPng from '../assets/spritesheet.png';
import SpritesJson from '../assets/spritesheet.json';
// import Shader from '../Shaders/fragment.glsl';
import ExplosionMp3 from '../assets/explosion.mp3';
import ShootMp3 from '../assets/shoot.mp3';

export default class Preload extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.load.atlas('sprites', SpritesPng, SpritesJson);
    this.load.image('bullet', Bullet);
    this.load.audio('explosion', ExplosionMp3);
    this.load.audio('turret_shoot', ShootMp3);

    // this.load.glsl('shader', Shader);
  }

  create() {
    this.scene.start('Game');
  }
}
