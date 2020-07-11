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

  platformGroup : PlatformGroup;
  platformCategory : number;
  // this.platform = new InfiniteMatterPlatform(this, this.matter.world, 400, 1000, PRELOADED_KEYS.SQUARE.key);
  create() {
    this.keys = new StandardKeyboardInput(this);
    this.player = new PlayerController(this, this.matter.world, 400, 0, PRELOADED_KEYS.POINTYPLAYER.key);

    let playerCategory = this.matter.world.nextCategory();
    this.player.setCollisionCategory(playerCategory);

    this.platformGroup = new PlatformGroup(this);
    this.platformCategory = this.matter.world.nextCategory();
    
    this.spawnPlatform();

    this.time.addEvent({
      delay:2000,
      callback:this.spawnPlatform,
      callbackScope:this,
      repeat:-1,
    })

    this.player.setCollidesWith(this.platformCategory);

    this.matter.world.on('collisionstart', (event : Phaser.Physics.Matter.Events.CollisionStartEvent) => {
      console.log('collision detected');
      let player : PlayerController = event.pairs[0].bodyA.gameObject;
      player.resetJumps();
    });
  }

  spawnPlatform(){

    let plat = new InfiniteMatterPlatform(this, this.matter.world, 1600, 1000, PRELOADED_KEYS.SQUARE.key);
    plat.setCollisionCategory(this.platformCategory);
    this.platformGroup.add(plat);
  }

  update(){
    this.player.applyMovement();
    this.platformGroup.getChildren().forEach((e : any) => {
      e.x -= 5;
    });
  }
}


export class PlatformGroup extends Phaser.GameObjects.Group {
  constructor(public scene : MainScene){
    super(scene);

  }
}

export class InfiniteMatterPlatform extends Phaser.Physics.Matter.Image {
  constructor(public scene : MainScene, public world : Phaser.Physics.Matter.World, x : number, y : number, key : string){
    super(world, x, y, key);
    this.scene.add.existing(this);
    this.setScale(4, .5);
    this.setStatic(true);
  }
}