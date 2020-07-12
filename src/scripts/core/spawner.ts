import { GamePhase } from "../scenes/phase";
import { PRELOADED_KEYS } from "../../utils/dist/preloadedKeyObject";


export abstract class Spawner extends Phaser.GameObjects.GameObject {
    
    public obstacleCategory : number;
    private obstacleGroup : ObstacleGroup;
    private groupLimit = 5;
    private movementLeftSpeed = 15;

    constructor(public scene : GamePhase, public world : Phaser.Physics.Matter.World, gameObjectKey : string){
        super(scene,gameObjectKey); 
        this.obstacleGroup = new ObstacleGroup(this.scene);
        this.obstacleCategory = this.world.nextCategory();
    }


    abstract createObstacle() : Obstacle;
   
    spawn(){
        let o = this.createObstacle();
        o.setCollisionCategory(this.obstacleCategory);
        if (this.obstacleGroup.getChildren().length > this.groupLimit) {
            let deleteMe = this.obstacleGroup.getChildren()[0];
            this.obstacleGroup.remove(deleteMe, true, true);
        }
        this.obstacleGroup.add(o);
    }

    update(){
        this.obstacleGroup.getChildren().forEach((e : any) => {
            e.x -= this.movementLeftSpeed;
        })
    }
}
export class InfinitePlatformSpawner extends Spawner{
    constructor(public scene : GamePhase, public world : Phaser.Physics.Matter.World){
      super(scene, world, 'infinitePlatformSpawner');
      this.scene.time.addEvent({
        delay:1500,
        callback:this.spawn,
        callbackScope:this,
        repeat:-1,
      });
      this.spawn();
    }
    createObstacle(): Obstacle {
        return new InfiniteMatterPlatform(this.scene, this.world, Phaser.Math.Between(1600, 2300), Phaser.Math.Between(800, 1200));
    }
  }
  
  export class ObstacleGroup extends Phaser.GameObjects.Group {
    constructor(public scene : GamePhase){
      super(scene);
    }
  }

  export class Obstacle extends Phaser.Physics.Matter.Sprite {
      constructor(public scene : GamePhase, public world : Phaser.Physics.Matter.World, x : number, y : number, key : string){
          super(world, x, y, key);
          this.scene.add.existing(this);
          this.setStatic(true);
      }
  }
  
  export class InfiniteMatterPlatform extends Obstacle {
    constructor(public scene : GamePhase, public world : Phaser.Physics.Matter.World, x : number, y : number ){
      super(scene, world, x, y, PRELOADED_KEYS.PLATFORM.key);
    }
  }
  
  