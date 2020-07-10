import { PRELOADED_KEYS } from '../../utils/dist/preloadedKeyObject';
import { StandardKeyboardInput } from 'cm-phaser-library/dist/input/standard';
import {DEFAULT_HEIGHT, DEFAULT_WIDTH} from '../game';
import { PlayerController } from '../core/player';
export default class MainScene extends Phaser.Scene {

  constructor() {
    super({ key: 'MainScene' })
  }
  keys : StandardKeyboardInput;

  player : PlayerController;

  platform : Phaser.Physics.Matter.Image;
  create() {
    this.keys = new StandardKeyboardInput(this);
    this.matter.world.setBounds(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
    this.player = new PlayerController(this, this.matter.world, 400, 0, PRELOADED_KEYS.POINTYPLAYER.key);


    this.platform = this.matter.add.image(1200, 1100, PRELOADED_KEYS.SQUARE.key);
    this.platform.setScale(2, .5);
    this.platform.setIgnoreGravity(true);
  }
}

