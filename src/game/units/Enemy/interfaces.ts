import Phaser from 'phaser';

export type TFolowerType = {
  t: number;
  vec: Phaser.Math.Vector2;
};

export interface IEnemyProps {
  path: Phaser.Curves.Path;
  follower: TFolowerType;
}
