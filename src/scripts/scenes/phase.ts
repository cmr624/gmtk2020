import { PlayerController } from "../core/player";
import { PRELOADED_KEYS } from "../../utils/dist/preloadedKeyObject";
import { GameControlPhases } from "../core/const";
import { Spawner, InfinitePlatformSpawner } from "../core/spawner";
import * as cm from 'cm-phaser-library';
export abstract class GamePhase extends Phaser.Scene {
    
    thisPhase : GameControlPhases;
    numberOfSeconds : number;
    nextPhaseString : string;
    playerController : PlayerController;
    spawner : Spawner;
    dead : boolean = false;
    constructor(public key : string){
        super(key);
    }
    create(){
        this.matter.world.resetCollisionIDs();
        this.cameras.main.setBackgroundColor(0x98c1d9);
    }

    death(){
        this.dead = true;
        this.spawner.timerEvent.destroy();
        this.add.image(800, 1000, PRELOADED_KEYS.RESTARTTEXT.key);
        let img = this.add.image(800, 500, PRELOADED_KEYS.HEARTBREAK.key);
        img.setInteractive();
        img.on('pointerdown', () => {
            this.dead = false;
            this.scene.restart();
        });
        this.add.tween({
            targets:[img],
            scale:1.2,
            yoyo:true,
            duration:800,
            loop:-1,
        });
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

    update(){
        super.update();
        if ((this.playerController.y > 1300 || this.playerController.x < 0) && !this.dead) {
            this.death();
        }
    }
   
}