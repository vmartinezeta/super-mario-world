/* global Phaser */

import { createAnimations } from "./animations.js"
import { collideCoin, createArcCoin } from "./coins.js"
import { createFloor } from "./floor.js"
import { collideContactos, createContactos } from "./puntoContacto.js"

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 520,
  backgroundColor: '#049cd8',
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

new Phaser.Game(config)

function preload() {

  this.load.image("contacto", "assets/scenery/emptyBlock.png")

  this.load.spritesheet(
    "koopa",
    "assets/scenery/koopa.png",
    { frameWidth: 16, frameHeight: 24 }
  )

  this.load.spritesheet(
    'coin',
    'assets/collectibles/coin.png',
    { frameWidth: 16, frameHeight: 16 }
  )

  this.load.image(
    'cloud1',
    'assets/scenery/overworld/cloud1.png'
  )

  this.load.image(
    'floorbricks',
    'assets/scenery/overworld/floorbricks.png'
  )

  this.load.spritesheet(
    'mario', // <--- id
    'assets/entities/mario.png',
    { frameWidth: 18, frameHeight: 16 }
  )

  this.load.audio('gameover', 'assets/sound/music/gameover.mp3')
}

function create() {
  this.add.image(100, 50, 'cloud1')
    .setOrigin(0, 0)
    .setScale(0.15)


  this.floor = createFloor(this, config.height - 16)


  this.mario = this.physics.add.sprite(30, 100, 'mario')
  this.mario.setOrigin(0.5)
  this.mario.setScale(1.6)
  this.mario.setCollideWorldBounds(true)
  this.mario.immovable = true


  createAnimations(this)


  this.physics.world.setBounds(0, 0, 2000, config.height)
  this.physics.add.collider(this.mario, this.floor)

  this.cameras.main.setBounds(0, 0, 2000, config.height)
  this.cameras.main.startFollow(this.mario)

  const coins = createArcCoin(this)
  this.physics.add.collider(coins, this.mario, collideCoin, null, this)


  this.koopa = this.physics.add.sprite(260, 50, 'koopa')
  this.koopa.setOrigin(0, 1)
  this.koopa.setScale(1.6)
  this.koopa.setCollideWorldBounds(true)
  this.koopa.immovable = true
  this.koopa.dx = 75

  this.koopa.anims.play("koopa-walk", true)

  const contactos = createContactos(this)
  this.physics.add.collider(this.koopa, this.floor)
  this.physics.add.collider(this.koopa, contactos, collideContactos, null, this)


  this.physics.add.collider(this.koopa, this.mario, (koopa, mario)=>{
    koopa.setVelocity(0)
    mario.setVelocity(0)
    mario.isDead = true
  })

  this.keys = this.input.keyboard.createCursorKeys()
}



function update() {
  if (this.mario.isDead) return

  if (this.keys.left.isDown) {
    this.mario.anims.play('mario-walk', true)
    this.mario.x -= 2
    this.mario.flipX = true
  } else if (this.keys.right.isDown) {
    this.mario.anims.play('mario-walk', true)
    this.mario.x += 2
    this.mario.flipX = false
  } else {
    this.mario.anims.play('mario-idle', true)
  }

  if (this.keys.up.isDown && this.mario.body.touching.down) {
    this.mario.setVelocityY(-300)
    this.mario.anims.play('mario-jump', true)
  }


  if (this.mario.y >= config.height-40) {

    this.mario.isDead = true
    this.mario.anims.play('mario-dead')
    this.mario.setCollideWorldBounds(false)
    this.sound.add('gameover', { volume: 0.2 }).play()

    setTimeout(() => {
      this.mario.setVelocityY(-350)
    }, 100)

    setTimeout(() => {
      this.scene.restart()
    }, 2000)
  }



  this.koopa.setVelocityX(this.koopa.dx)
  if (this.koopa.dx > 0) {
    this.koopa.flipX = true
    this.koopa.anims.play("koopa-walk", true)
  } else {
    this.koopa.flipX = false
    this.koopa.anims.play("koopa-walk", true)
  }
}