import { PRELOADED_KEYS } from './../../utils/dist/preloadedKeyObject';
export default class PreloadScene extends Phaser.Scene {
  constructor() {
  
    super({ key: 'PreloadScene' });
  }
  preload() {
    Object.keys(PRELOADED_KEYS).forEach((e) => {
      this.load.image(PRELOADED_KEYS[e]['key'], PRELOADED_KEYS[e]['path']);
    })
  }
  create() {
    this.scene.start('MainScene');
  }
}
