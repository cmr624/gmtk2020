import { GamePhase } from "../scenes/phase";
import { GameControlPhases } from "./const";
import { StandardKeyboardInput } from "cm-phaser-library/dist/input/standard";

export interface PlayerControls {
    space : Phaser.Input.Keyboard.Key;
    // up : Phaser.Input.Keyboard.Key;
    // down : Phaser.Input.Keyboard.Key;
    // left : Phaser.Input.Keyboard.Key;
    // right : Phaser.Input.Keyboard.Key;
  }
  
  export class PlayerController extends Phaser.Physics.Matter.Sprite implements PlayerControls{
    
    // player data
    private numJumps = 0;
    public jumpLimit = 2;
    
    // player controls interface
    // up : Phaser.Input.Keyboard.Key;
    // down : Phaser.Input.Keyboard.Key;
    // left : Phaser.Input.Keyboard.Key;
    // right : Phaser.Input.Keyboard.Key;
    space : Phaser.Input.Keyboard.Key;
  
    keys : StandardKeyboardInput;
    private jumpSpeed = -12;
    private movementForce = .09;
    constructor(public scene : GamePhase, public world : Phaser.Physics.Matter.World, x : number, y : number, key : string, public myPhase : GameControlPhases){
      super(world, x, y, key);
      this.scene.add.existing(this);
      this.setFixedRotation();
      this.setupControls();
      console.log('creating player controller');
      this.keys = new StandardKeyboardInput(this.scene);
    }
  
    setupControls(){

      if (this.myPhase === GameControlPhases.JUMP) {
        this.space = this.scene.input.keyboard.addKey("SPACE", true, false);
        this.space.removeAllListeners();
        this.space.on('down', () => this.jump());
      }
      else if (this.myPhase === GameControlPhases.UPDOWN){
        this.setIgnoreGravity(true);
      } 
      else if (this.myPhase === GameControlPhases.WASD){
        this.setIgnoreGravity(true);
      }
    }
    
    public applyUpDownMovement() : void {
        if (this.keys.downPressed()) {
            this.setVelocityY(-this.jumpSpeed);
        }
        else if (this.keys.upPressed()) {
            this.setVelocityY(this.jumpSpeed);
        }
        else {
            this.setVelocity(0);
        }
    }

    public applyWasdMovement() : void{
        let v = diagonalVelocity(this.movementForce);
        // TOP RIGHT
        if (this.keys.rightPressed()&& this.keys.upPressed())
        {
            this.applyForce(new Phaser.Math.Vector2(v, -v));
        }
        // BOT RIGHT
        else if (this.keys.rightPressed() && this.keys.downPressed())
        {
            this.applyForce(new Phaser.Math.Vector2(v, v));
        }
        // BOT LEFT
        else if (this.keys.leftPressed() && this.keys.downPressed()) {
            this.applyForce(new Phaser.Math.Vector2(-v, v));
        }
        // TOP LEFT
        else if (this.keys.leftPressed() && this.keys.upPressed())
        {
            this.applyForce(new Phaser.Math.Vector2(-v, -v));
        }
        else if (this.keys.leftPressed()) {
            this.applyForce(new Phaser.Math.Vector2(-this.movementForce, 0));
        }
        else if (this.keys.rightPressed())
        {
            this.applyForce(new Phaser.Math.Vector2(this.movementForce, 0));
        }
        else if (this.keys.downPressed()) {
            this.applyForce(new Phaser.Math.Vector2(0,this.movementForce));
        }
        else if (this.keys.upPressed()) {
            this.applyForce(new Phaser.Math.Vector2(0, -this.movementForce));
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