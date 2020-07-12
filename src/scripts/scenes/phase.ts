import { PlayerController } from "../core/player";
import { PRELOADED_KEYS } from "../../utils/dist/preloadedKeyObject";
import { GameControlPhases } from "../core/const";
import { Spawner, InfinitePlatformSpawner, PipeSpawner } from "../core/spawner";
import * as cm from 'cm-phaser-library';
export abstract class GamePhase extends Phaser.Scene {
    
    thisPhase : GameControlPhases;
    numberOfSeconds : number;
    nextPhaseString : string;
    playerController : PlayerController;
    spawner : Spawner;
    dead = false;
    levelComplete = false;
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

    onLevelComplete() {
        this.levelComplete = true;
        this.cameras.main.fadeOut(1000, 152, 193, 217);
        this.time.delayedCall(1500, () => {
            this.scene.start(this.nextPhaseString);
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
        this.numberOfSeconds = 15;
        this.nextPhaseString = "upDown";
    }

    create(){
        super.create();
        this.playerController = new PlayerController(this, this.matter.world, 800, 0, PRELOADED_KEYS.JUMP.key, GameControlPhases.JUMP);
        this.spawner = new InfinitePlatformSpawner(this, this.matter.world, this.numberOfSeconds);
        let playerCategory = this.matter.world.nextCategory();
        this.playerController.setCollisionCategory(playerCategory);
        this.matter.world.on('collisionstart', (event : Phaser.Physics.Matter.Events.CollisionStartEvent) => {
            console.log('collision detected');
            let player : PlayerController = event.pairs[0].bodyA.gameObject;
            player.resetJumps();
        });

        this.spawner.on('levelComplete', () => this.onLevelComplete());
    }


    update(){
        super.update();
        if ((this.playerController.y > 1300 || this.playerController.x < 0) && !this.dead && !this.levelComplete) {
            this.death();
        }
    }
}

export class UpDownPhase extends GamePhase {
    constructor(){
        super('upDown');
        this.numberOfSeconds = 20;
        this.nextPhaseString = "wasd";
    }

    create(){
        super.create();
        this.playerController = new PlayerController(this, this.matter.world, 600, 400, PRELOADED_KEYS.UPDOWN.key, GameControlPhases.UPDOWN);
        this.spawner = new PipeSpawner(this, this.matter.world, this.numberOfSeconds);
        let playerCategory = this.matter.world.nextCategory();
        this.playerController.setCollisionCategory(playerCategory);
        this.spawner.on('levelComplete', () => this.onLevelComplete());
    }

    update(){
        super.update();
        this.playerController.applyUpDownMovement();
        if ((this.playerController.y > 1300 || this.playerController.x < 0 || this.playerController.y < -200) && !this.dead && !this.levelComplete) {
            this.death();
            this.playerController.up.removeAllListeners();
            this.playerController.down.removeAllListeners();
        } 
    }
}

export class WasdPhase extends GamePhase{
    constructor(){
        super('wasd');
        this.numberOfSeconds = 30;
        this.nextPhaseString = "final";
    }

    create(){
        super.create();
        this.playerController = new PlayerController(this, this.matter.world, 600, 800, PRELOADED_KEYS.FULL.key, GameControlPhases.WASD);
        
    }
}