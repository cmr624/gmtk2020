import { PlayerController } from "../core/player";

export abstract class GamePhase extends Phaser.Scene {
    
    numberOfSeconds : number;
    nextPhaseString : string;
    playerController : PlayerController;
    constructor(key : string){
        super(key);
    }
    create(){
        this.cameras.main.setBackgroundColor(0x98c1d9);
    }
}

// a phase is defined by 
// a number of seconds you must stay alive
// a dead zone where the player is killed 
// a game over screen with a restart button
// a string that refers to the next phase that occurs after the number of seconds passes

export class JumpPhase extends GamePhase {
    constructor(){
        super('jump');
        this.numberOfSeconds = 30;
        this.nextPhaseString = "upDown";
    }

    create(){
        super.create();
        this.player = new PlayerController(this, this.matter.world, 800, )
    }
}