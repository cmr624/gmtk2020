import 'phaser'
import PreloadScene from './scenes/preloadScene'
import { JumpPhase } from './scenes/phase'

export const DEFAULT_WIDTH = 1600
export const DEFAULT_HEIGHT = 1200

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, JumpPhase],
  physics: {
    default: 'matter',
    matter: {
      debug: false,
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
