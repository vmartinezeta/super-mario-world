import { config } from "./game.js"
import { MainScene } from "./MainScene.js"

export class WelcomeScene {
    constructor() {
        this.keys = "start"
    }

    preload() {

        this.load.image("level-end", "assets/scenery/horizontal-tube.png")

        this.load.image("logo", "assets/scenery/sign.png")

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

    create() {
        this.add.image(100, 50, 'cloud1')
            .setOrigin(0, 0)
            .setScale(0.15)

        this.add.image(100, 200, "logo")

        this.floor = this.createFloor(config.height - 16)

        this.mario = this.physics.add.sprite(40, 476, 'mario')
        this.mario.setOrigin(0.5)
        this.mario.setScale(1.6)
        this.mario.setCollideWorldBounds(true)
        this.mario.immovable = true

        this.portalGoomba = this.physics.add.sprite(784, 472, 'level-end')
        this.portalGoomba.body.allowGravity = false
        this.portalGoomba.setOrigin(0.5)

        this.createAnimations()

        this.physics.world.setBounds(0, 0, 2000, config.height)
        this.physics.add.collider(this.mario, this.floor)

        this.cameras.main.setBounds(0, 0, 2000, config.height)

        const coins = this.add.group()
            .add(this.createCoin(460, 400))
            .add(this.createCoin(490, 394))
            .add(this.createCoin(520, 400))

        coins.playAnimation("coin-active")

        this.physics.add.collider(coins, this.mario, this.collideCoin, null, this)


        this.koopa = this.physics.add.sprite(260, 468, 'koopa')
        this.koopa.setOrigin(0.5)
        this.koopa.setScale(1.6)
        this.koopa.body.allowGravity = false
        this.koopa.immovable = true
        this.koopa.dx = 75

        this.koopa.anims.play("koopa-walk", true)

        const contactos = this.add.group()
            .add(this.createContacto(0, 490))
            .add(this.createContacto(690, 490))

        this.physics.add.collider(this.koopa, this.floor)
        this.physics.add.collider(this.koopa, contactos, this.rotarKoopa, null, this)


        this.physics.add.collider(this.koopa, this.mario, (koopa, mario) => {
            koopa.setVelocity(0)
            mario.setVelocity(0)
            mario.y = koopa.y
            mario.isDead = true
        })

        const manager = this.scene.manager
        this.physics.add.collider(this.mario, this.portalGoomba, () => {
            manager.remove(this)
            if (!manager.getScene("scene-2")) {
                manager.add("scene-2", MainScene, true)
            }
        })

        this.keys = this.input.keyboard.createCursorKeys()
        this.sound.add('gameover', { volume: 0.2 })
    }

    rotarKoopa(koopa) {
        koopa.dx *= -1
    }

    createContacto(x, y) {
        const contacto = this.add.rectangle(x, y, 40, 40).setOrigin(0.5, 1)
        this.physics.add.existing(contacto)
        contacto.body.allowGravity = false
        contacto.body.immovable = true
        return contacto
    }

    createCoin(x, y) {
        const coin = this.physics.add.sprite(x, y, "coin")
        coin.setOrigin(0, 0)
        coin.refreshBody()
        coin.setScale(1.4)
        coin.body.allowGravity = false
        this.physics.add.existing(coin)
        return coin
    }

    collideCoin(coin) {
        coin.destroy()
    }

    update() {
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


        if (this.mario.x <= this.koopa.x) {
            this.koopa.dx = -75
        } else if (this.mario.x > this.koopa.x && this.mario.x < 670) {
            this.koopa.dx = 75
        }

        if (this.keys.up.isDown && this.mario.body.touching.down) {
            this.mario.setVelocityY(-300)
            this.mario.anims.play('mario-jump', true)
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

    createFloor(height) {
        const floor = this.physics.add.staticGroup()
        let i = 0

        floor
            .create(0, height, 'floorbricks')
            .setOrigin(0, 0.5)
            .refreshBody()

        for (; i < 16; i++) {
            floor
                .create(128 * i, height, 'floorbricks')
                .setOrigin(0, 0.5)
                .refreshBody()
        }
        return floor
    }

    createAnimations() {
        this.anims.create({
            key: 'mario-walk',
            frames: this.anims.generateFrameNumbers(
                'mario',
                { start: 1, end: 3 }
            ),
            frameRate: 12,
            repeat: -1
        })

        this.anims.create({
            key: 'mario-idle',
            frames: [{ key: 'mario', frame: 0 }]
        })

        this.anims.create({
            key: 'mario-jump',
            frames: [{ key: 'mario', frame: 5 }]
        })

        this.anims.create({
            key: 'mario-dead',
            frames: [{ key: 'mario', frame: 4 }]
        })

        this.anims.create({
            key: 'koopa-walk',
            frames: this.anims.generateFrameNumbers(
                'koopa',
                { start: 0, end: 1 }
            ),
            frameRate: 12,
            repeat: -1
        })

        this.anims.create({
            key: 'coin-active',
            frames: this.anims.generateFrameNumbers(
                'coin',
                { start: 0, end: 3 }
            ),
            frameRate: 12,
            repeat: -1
        })



    }
}