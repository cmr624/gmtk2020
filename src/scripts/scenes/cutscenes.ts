// click the TV to "start" and play the start cutscene
// starting cutscene
// 1. red controller runs away
// 2. white controller loses all buttons 
// 3. white controller gets jump button
// 4. directions for white button

import { PRELOADED_KEYS } from "../../utils/dist/preloadedKeyObject";

// get up / down cutscene
// 1. fade from jump to up / down controller
// 2. directions for up / down

// get left / right cutscene
// 1. fade from up / down to left / right
// 2. directions for WASD

// final cutscene 
// 1. two controllers <3
// 2. restart button

export class JumpInstructionsCutscene extends Phaser.Scene {
    constructor(){
        super('instructionsJump');
    }

    create(){
        this.cameras.main.setBackgroundColor(0x98c1d9);
        this.cameras.main.fadeIn(2000, 152, 193, 217);
        this.add.image(800, 600, PRELOADED_KEYS.SPACEINSTRUCTIONS.key);
        this.time.delayedCall(5000, () => {
            this.scene.start('jump');
        });
    }
}
export class UpDownInstructionsCutscene extends Phaser.Scene {
    constructor(){
        super('instructionsUpDown');
    }

    create(){
        this.cameras.main.setBackgroundColor(0x98c1d9);
        this.cameras.main.fadeIn(2000, 152, 193, 217);
        this.add.image(800, 600, PRELOADED_KEYS.UPDOWNINSTRUCTIONS.key);
        this.time.delayedCall(5000, () => {
            this.scene.start('upDown');
        });
    }
}

export class WASDInstructions extends Phaser.Scene {
    constructor(){
        super('instructionsWasd');
    }

    create(){
        this.cameras.main.setBackgroundColor(0x98c1d9);
        this.cameras.main.fadeIn(2000, 152, 193, 217);
        this.add.image(800, 600, PRELOADED_KEYS.WASDINSTRUCTIONS.key);
        this.time.delayedCall(5000, () => {
            this.scene.start('wasd');
        });
    }
}

export class Payoff extends Phaser.Scene {
    constructor(){
        super('payoff');
    }
    create(){
        this.cameras.main.setBackgroundColor(0x98c1d9);
        let img = this.add.image(800, 600, PRELOADED_KEYS.PAYOFF.key);
        img.setInteractive();
        img.on('pointerdown', () => {
            this.scene.start("PreloadScene");
        })
    }
}