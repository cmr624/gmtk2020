import { PRELOADED_KEYS } from '../../utils/dist/preloadedKeyObject';
import { StandardKeyboardInput } from 'cm-phaser-library/dist/input/standard';
import {DEFAULT_HEIGHT, DEFAULT_WIDTH} from '../game';
import { PlayerController } from '../core/player';
export default class MainScene extends Phaser.Scene {

  constructor() {
    super({ key: 'MainScene' })
  }

  player : PlayerController;

  platformSpawner : InfinitePlatformSpawner;
  // this.platform = new InfiniteMatterPlatform(this, this.matter.world, 400, 1000, PRELOADED_KEYS.SQUARE.key);
  create() {
    this.cameras.main.setBackgroundColor(0x98c1d9);
    this.player = new PlayerController(this, this.matter.world, 800, 0, PRELOADED_KEYS.JUMP.key);
    this.platformSpawner = new InfinitePlatformSpawner(this, this.matter.world);
    let playerCategory = this.matter.world.nextCategory();
    this.player.setCollisionCategory(playerCategory);

    this.player.setCollidesWith(this.platformSpawner.platformCategory);

    this.matter.world.on('collisionstart', (event : Phaser.Physics.Matter.Events.CollisionStartEvent) => {
      console.log('collision detected');
      let player : PlayerController = event.pairs[0].bodyA.gameObject;
      player.resetJumps();
    });

    
  }

  

  update(){
    // this.player.applyMovement();
    this.platformSpawner.update();
  }
}

export class InfinitePlatformSpawner extends Phaser.GameObjects.GameObject{
  // has a platform group
  // spawns them at a random distance
  // destroys them when they leave the screen 
  // reuses old 

  public platformCategory : number;
  private platformGroup : PlatformGroup;
  private groupLimit : number = 5;
  constructor(public scene : MainScene, public world : Phaser.Physics.Matter.World){
    super(scene, 'infinitePlatformSpawner');
    this.platformGroup = new PlatformGroup(this.scene);
    this.platformCategory = this.world.nextCategory();
    this.scene.time.addEvent({
      delay:1500,
      callback:this.spawnPlatform,
      callbackScope:this,
      repeat:-1,
    });
    this.spawnPlatform();
  }


  spawnPlatform(){
    let plat = new InfiniteMatterPlatform(this.scene, this.world, Phaser.Math.Between(1600, 2300), Phaser.Math.Between(800, 1200));
    plat.setCollisionCategory(this.platformCategory);
    if (this.platformGroup.getChildren().length > this.groupLimit) {
      let deleteMe = this.platformGroup.getChildren()[0];
      this.platformGroup.remove(deleteMe, true, true);
      console.log(this.platformGroup.getChildren().length);
    }
    this.platformGroup.add(plat);
  }
  
  update(){
    this.platformGroup.getChildren().forEach((e : any) => {
      e.x -= 15;
    }); 
  }
}

export class PlatformGroup extends Phaser.GameObjects.Group {
  constructor(public scene : MainScene){
    super(scene);

  }

}

export class InfiniteMatterPlatform extends Phaser.Physics.Matter.Image {
  constructor(public scene : MainScene, public world : Phaser.Physics.Matter.World, x : number, y : number ){
    super(world, x, y, PRELOADED_KEYS.PLATFORM.key);
    this.scene.add.existing(this);
    this.setStatic(true);
  }
}


