import Phaser from 'phaser';

import Bullet from '../assets/bullet.png';
import SpritesPng from '../assets/spritesheet.png';
import SpritesJson from '../assets/spritesheet.json';

export default class Preload extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.load.atlas('sprites', SpritesPng, SpritesJson);
    this.load.image('bullet', Bullet);
  }

  create() {
    this.scene.start('Game');
  }
}
