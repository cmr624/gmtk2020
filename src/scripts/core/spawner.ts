import { GamePhase } from "../scenes/phase";
import { PRELOADED_KEYS } from "../../utils/dist/preloadedKeyObject";


export abstract class Spawner extends Phaser.GameObjects.GameObject {
    
    public obstacleCategory : number;
    private obstacleGroup : ObstacleGroup;
    private groupLimit = 5;
    private movementLeftSpeed = 15;
    public timerEvent : Phaser.Time.TimerEvent;
    constructor(public scene : GamePhase, public world : Phaser.Physics.Matter.World, gameObjectKey : string){
        super(scene,gameObjectKey); 
        this.obstacleGroup = new ObstacleGroup(this.scene);
        this.obstacleCategory = this.world.nextCategory();
    }

    destroyGroup(){
      this.timerEvent.destroy();
      this.obstacleGroup.destroy(true);
    }

    abstract createObstacle() : Obstacle;
   
    spawn(){
      if (this.timerEvent.getOverallProgress() === 1) {
        this.emit('levelComplete');
        return;
      }
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
      });
   }
        
}
export class InfinitePlatformSpawner extends Spawner{
    constructor(public scene : GamePhase, public world : Phaser.Physics.Matter.World, public numberOfSeconds : number){
      super(scene, world, 'infinitePlatformSpawner');
      this.timerEvent = this.scene.time.addEvent({
        delay:1500,
        callback:this.spawn,
        callbackScope:this,
        repeat:Math.ceil((this.numberOfSeconds * 1000) / 1500),
      });
      this.spawn();
    }
    createObstacle(): Obstacle {
        return new InfiniteMatterPlatform(this.scene, this.world, Phaser.Math.Between(1600, 2300), Phaser.Math.Between(800, 1100));
    }
}

export class PipeSpawner extends Spawner{

  constructor(public scene : GamePhase, public world : Phaser.Physics.Matter.World, public numberOfSeconds : number){
    super(scene, world, 'pipeSpawner');
    this.timerEvent = this.scene.time.addEvent({
      delay : 1000,
      callback : this.spawn,
      callbackScope:this,
      repeat:Math.ceil((this.numberOfSeconds * 1000) / 1000)
    });
    this.spawn();
  }

  createObstacle(): Obstacle {
    return new Pipe(this.scene, this.world, Phaser.Math.Between(1600, 2300), Phaser.Math.Between(0, 1200));
  }
}

export class AsteroidSpawner extends Spawner {
  constructor(public scene : GamePhase, public world : Phaser.Physics.Matter.World, public numberOfSeconds : number){
    super(scene, world, 'asteroidSpawner');
    this.timerEvent = this.scene.time.addEvent({
      delay : 800,
      callback : this.spawn,
      callbackScope : this,
      repeat : Math.ceil((this.numberOfSeconds * 1000) / 800)
    });
    this.spawn();
  }

  createObstacle() : Obstacle {
    return new Asteroid(this.scene, this.world, Phaser.Math.Between(1600, 2200), Phaser.Math.Between(100, 1100));
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
  
export class Pipe extends Obstacle {
  constructor(public scene : GamePhase, public world : Phaser.Physics.Matter.World, x : number, y : number) {
    super(scene, world, x, y, PRELOADED_KEYS.VERTICALPLATFORM.key);
  }
}

export class Asteroid extends Obstacle {
  constructor(public scene : GamePhase, public world : Phaser.Physics.Matter.World, x : number, y : number) {
    super(scene, world, x, y, PRELOADED_KEYS.ASTEROID.key);
  }
}