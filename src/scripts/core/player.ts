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
  

    private jumpSpeed = -10;
    private movementForce = .009;
    constructor(public scene : MainScene, public world : Phaser.Physics.Matter.World, x : number, y : number, key : string){
      super(world, x, y, key);
      this.scene.add.existing(this);
      this.setFixedRotation();
      this.setupControls();
    //   this.setIgnoreGravity(true);
    }
  
    setupControls(){
      this.space = this.scene.input.keyboard.addKey("SPACE", true, false);
      this.space.on('down', () => this.jump());
  
      this.up = this.scene.input.keyboard.addKey("W");
  
      this.left = this.scene.input.keyboard.addKey("A");
      
      this.down = this.scene.input.keyboard.addKey("S");
      
      this.right = this.scene.input.keyboard.addKey("D");
    }
    
    public applyMovement() : void{
        let v = diagonalVelocity(this.movementForce);
        // TOP RIGHT
        if (this.right.isDown && this.up.isDown)
        {
            this.applyForce(new Phaser.Math.Vector2(v, -v));
        }
        // BOT RIGHT
        else if (this.right.isDown && this.down.isDown)
        {
            this.applyForce(new Phaser.Math.Vector2(v, v));
        }
        // BOT LEFT
        else if (this.left.isDown && this.down.isDown) {
            this.applyForce(new Phaser.Math.Vector2(-v, v));
        }
        // TOP LEFT
        else if (this.left.isDown && this.up.isDown)
        {
            this.applyForce(new Phaser.Math.Vector2(-v, -v));
        }
        else if (this.left.isDown) {
            this.applyForce(new Phaser.Math.Vector2(-this.movementForce, 0));
        }
        else if (this.right.isDown)
        {
            this.applyForce(new Phaser.Math.Vector2(this.movementForce, 0));
        }
        else if (this.down.isDown) {
            this.applyForce(new Phaser.Math.Vector2(0,this.movementForce));
        }
        else if (this.up.isDown) {
            this.setVelocity(0, -this.movementForce);
        }
    }

    jump(){
      if (this.numJumps >= this.jumpLimit)
      {
        console.log("jump limit exceeded");
        return;
      }
      else {
        this.setVelocityY(this.jumpSpeed);
        this.numJumps++;
      }
    }

    public resetJumps(){
        this.numJumps = 0;
    }
  }

  export function diagonalVelocity(speed : number) : number{
    return speed * Math.SQRT1_2;
}