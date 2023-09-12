import Phaser from 'phaser';

import Bullet from '/tower-defense-assets/bullet.png';
import SpritesPng from '/tower-defense-assets/spritesheet.png';
import SpritesJson from '../assets/spritesheet.json';
// import Shader from '../Shaders/fragment.glsl';
import ExplosionMp3 from '/tower-defense-assets/explosion.mp3';
import ShootMp3 from '/tower-defense-assets/shoot.mp3';
import TurretDead from '/tower-defense-assets/turret-dead.wav';
import EnemyDamage from '/tower-defense-assets/enemy-damage.wav';

export default class Preload extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.load.atlas('sprites', SpritesPng, SpritesJson);
    this.load.image('bullet', Bullet);
    this.load.audio('explosion', ExplosionMp3);
    this.load.audio('turret_shoot', ShootMp3);
    this.load.audio('turret_dead', TurretDead);
    this.load.audio('enemy_damage', EnemyDamage);

    // this.load.glsl('shader', Shader);
  }

  create() {
    this.scene.start('Game');
  }
}
