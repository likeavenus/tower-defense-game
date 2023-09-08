import Phaser from 'phaser';

import Preload from './Scenes/Preload';
import Game from './Scenes/Game';
export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0,
      },
    },
  },
  scene: [Preload, Game],
};
