import { PlayerController } from "../core/player";
import { PRELOADED_KEYS } from "../../utils/dist/preloadedKeyObject";
import { GameControlPhases } from "../core/const";
import { Spawner, InfinitePlatformSpawner } from "../core/spawner";

export abstract class GamePhase extends Phaser.Scene {
    
    numberOfSeconds : number;
    nextPhaseString : string;
    playerController : PlayerController;
    spawner : Spawner;
    constructor(key : string){
        super(key);
    }
    create(){
        this.cameras.main.setBackgroundColor(0x98c1d9);
    }

    update(){
        this.spawner.update();
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
        this.playerController = new PlayerController(this, this.matter.world, 800, 0, PRELOADED_KEYS.JUMP.key, GameControlPhases.JUMP);
        this.spawner = new InfinitePlatformSpawner(this, this.matter.world);
        let playerCategory = this.matter.world.nextCategory();
        this.playerController.setCollisionCategory(playerCategory);
        this.matter.world.on('collisionstart', (event : Phaser.Physics.Matter.Events.CollisionStartEvent) => {
            console.log('collision detected');
            let player : PlayerController = event.pairs[0].bodyA.gameObject;
            player.resetJumps();
        });
    }

    // update(){
    //     // super.update();
    // }
}