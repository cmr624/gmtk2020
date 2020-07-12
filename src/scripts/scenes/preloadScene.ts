import { PRELOADED_KEYS } from './../../utils/dist/preloadedKeyObject';
export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }
  preload() {
    this.cameras.main.setBackgroundColor(0x98c1d9);
    Object.keys(PRELOADED_KEYS).forEach((e) => {
      this.load.image(PRELOADED_KEYS[e]['key'], PRELOADED_KEYS[e]['path']);
    })
  }
  create() {

    let tv = this.add.image(1149.0482905811339,379.50219619326504, PRELOADED_KEYS.TV.key);
    let console = this.add.image(696.2957382471191,806.0322108345534, PRELOADED_KEYS.CONSOLE.key);
    let title = this.add.image(451.53732519778504,200, PRELOADED_KEYS.TITLE.key);
    let white = this.add.image(403.4260520337206,965.8945827232797, PRELOADED_KEYS.WHITE.key);
    let red = this.add.image(685.2122833740707,1103.367496339678, PRELOADED_KEYS.RED.key); 
    
    let tvTween = this.add.tween({
      targets:[tv],
      scale:1.05,
      loop:-1,
      yoyo:true,
      duration:700,
      ease:Phaser.Math.Easing.Cubic.InOut
    });
    
    tv.setInteractive();
    tv.on('pointerdown', () => {
      tv.disableInteractive();
      tvTween.stop();
      this.add.tween({
        targets:[tv],
        duration:500,
        scale:1,
        onComplete:() => {
          this.cutscene(red, white, tv, console, title);
        }
      });
    })
  }

  cutscene(red : Phaser.GameObjects.Image, white : Phaser.GameObjects.Image, tv : Phaser.GameObjects.Image, console : Phaser.GameObjects.Image, title : Phaser.GameObjects.Image){
    this.add.tween({
      targets:[red],
      x:red.x + 1200,
      duration:2000,
      rotation:-.1,
      ease:Phaser.Math.Easing.Quadratic.Out,
      onComplete:() => {
        this.add.tween({
          targets:[tv, console, title],
          alpha:0,
          duration:2500,
          onComplete:() => {
            this.cameras.main.fadeOut(1000, 152, 193, 217);
            this.time.delayedCall(2000, () => {
              white.destroy();
              this.cameras.main.fadeIn(2000, 152, 193, 217);
              this.add.image(800, 600, PRELOADED_KEYS.OPENER.key);
              this.time.delayedCall(2000, () => {
                let none= this.add.image(802, 700, PRELOADED_KEYS.OPENERNONE.key);
                none.setAlpha(0);
                this.add.tween({
                  targets:[none],
                  alpha:1,
                  duration:3000,
                  onComplete:() => {
                    this.time.delayedCall(2000, () => {
                      this.cameras.main.fadeOut(2000, 152, 193, 217);
                      this.time.delayedCall(2000, () => {
                        this.scene.start('instructionsJump');
                      })
                    })                  
                  }
                })
              }) 
            })
          }
        })
      }
    })
  }
}
