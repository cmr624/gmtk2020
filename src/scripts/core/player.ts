import MainScene from "../scenes/mainScene";

export interface PlayerControls {
    space : Phaser.Input.Keyboard.Key;
    up : Phaser.Input.Keyboard.Key;
    down : Phaser.Input.Keyboard.Key;
    left : Phaser.Input.Keyboard.Key;
    right : Phaser.Input.Keyboard.Key;
  }
  
  export class PlayerController extends Phaser.Physics.Matter.Sprite implements PlayerControls{
    
    // player data
    private numJumps = 0;
    public jumpLimit = 2;
    
    // player controls interface
    up : Phaser.Input.Keyboard.Key;
    down : Phaser.Input.Keyboard.Key;
    left : Phaser.Input.Keyboard.Key;
    right : Phaser.Input.Keyboard.Key;
    space : Phaser.Input.Keyboard.Key;
  
    constructor(public scene : MainScene, public world : Phaser.Physics.Matter.World, x : number, y : number, key : string){
      super(world, x, y, key);
      this.scene.add.existing(this);
      this.setupControls();
    }
  
    setupControls(){
      this.space = this.scene.input.keyboard.addKey("SPACE", true, false);
      this.space.on('down', () => this.jump());
  
      // this.up = this.scene.input.keyboard.addKey("W");
      // this.up.on('down', () => console.log('up'));
      // this.up.on('up', () => console.log('doneUp'));
  
      // this.left = this.scene.input.keyboard.addKey("A");
      // this.left.on('down', () => console.log('left'));
      // this.left.on('up', () => console.log('doneLeft'));
      
      // this.down = this.scene.input.keyboard.addKey("S");
      // this.down.on('down', () => console.log('down'));
      // this.down.on('up', () => console.log('doneDown'));
      
      // this.right = this.scene.input.keyboard.addKey("D");
      // this.right.on('down', () => console.log('right'));
      // this.right.on('up', () => console.log('doneRight'));
  
  
  
    }
  
    jump(){
      if (this.numJumps >= this.jumpLimit)
      {
        console.log("jump limit exceeded");
        return;
      }
      else {
        this.setVelocityY(-10);
        this.numJumps++;
      }
    }
  }
  
  