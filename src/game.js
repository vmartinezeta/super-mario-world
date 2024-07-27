import { WelcomeScene } from "./WelcomeScene.js"

export const config = {
  width: 800,
  height: 520,
}

const mainConfig = {
  type: Phaser.AUTO,
  ...config,
  backgroundColor: '#049cd8',
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: WelcomeScene
}

new Phaser.Game(mainConfig)