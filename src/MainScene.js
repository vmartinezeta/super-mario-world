import { config } from "./game.js"

export class MainScene {
    constructor() {
        this.keys = "scene-2"
    }

    preload() {
        this.load.spritesheet(
            "block-2",
            "assets/blocks/overworld/customBlock.png",
            { frameWidth: 16, frameHeight: 16 }
        )

        this.load.spritesheet(
            "goomba",
            "assets/entities/underground/goomba.png",
            { frameWidth: 16, frameHeight: 16 }
        )

        this.load.image(
            'floorbricks-2',
            'assets/scenery/underground/floorbricks.png'
        )

        this.load.spritesheet(
            'mario', // <--- id
            'assets/entities/mario.png',
            { frameWidth: 18, frameHeight: 16 }
        )

        this.load.audio('gameover', 'assets/sound/music/gameover.mp3')
    }

    create() {
        this.floor = this.createFloor(config.height - 40)

        this.mario = this.physics.add.sprite(30, 450, 'mario')
        this.mario.setOrigin(0.5)
        this.mario.setScale(1.6)
        this.mario.setCollideWorldBounds(true)
        this.mario.immovable = true
        this.mario.isDead = false

        this.goombas = this.add.group()
            .add(this.createGoomba(220, 450, 75))
            .add(this.createGoomba(310, 450, 75))
            .add(this.createGoomba(380, 450, -75))
            .add(this.createGoomba(460, 450, -75))

        this.createAnimations()


        this.puntosContacto = this.add.group()
        .add(this.createContact(0, 465))
        .add(this.createContact(760, 465))


        this.blocks = this.add.group()
        .add(this.createBlock(1180, 360))
        .add(this.createBlock(1206, 360))
        .add(this.createBlock(1232, 360))
        .add(this.createBlock(1258, 360))

        this.blocks.playAnimation("block-active")

        this.physics.world.setBounds(0, 0, 2000, config.height)
        this.physics.add.collider(this.mario, this.floor)

        this.cameras.main.setBounds(0, 0, 2000, config.height)
        this.cameras.main.startFollow(this.mario)

        this.physics.add.collider(this.goombas, undefined, this.rotarGoomba, null, this)

        this.physics.add.collider(this.goombas, this.puntosContacto, this.rotarGoomba, null, this)

        this.physics.add.collider(this.blocks, this.mario, this.romperBlock, null, this)

        this.physics.add.collider(this.mario, this.goombas, this.morirMario, null, this)

        this.keys = this.input.keyboard.createCursorKeys()
        this.sound.add('gameover', { volume: 0.2 })
    }


    morirMario (mario) {
        mario.isDead = true
    }

    romperBlock(block) {
        block.destroy()
    }

    createFloor(height) {
        const floor = this.physics.add.staticGroup()
        let i = 0

        floor
            .create(0, height, 'floorbricks-2')
            .setOrigin(0, 0.5)
            .refreshBody()

        for (; i < 6; i++) {
            floor
                .create(128 * i, height, 'floorbricks-2')
                .setOrigin(0, 0.5)
                .refreshBody()
        }

        for (; i < 10; i++) {
            floor
                .create(200 + 128 * i, height, 'floorbricks-2')
                .setOrigin(0, 0.5)
                .refreshBody()
        }

        for (; i < 20; i++) {
            floor
                .create(400 + 128 * i, height, 'floorbricks-2')
                .setOrigin(0, 0.5)
                .refreshBody()
        }
        return floor
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

        if (this.keys.up.isDown && this.mario.body.touching.down) {
            this.mario.setVelocityY(-300)
            this.mario.anims.play('mario-jump', true)
        }


        if (this.mario.y >= config.height - 40) {
            this.mario.isDead = true
            this.mario.anims.play('mario-dead')
            this.mario.setCollideWorldBounds(false)
            this.sound.play("gameover")

            setTimeout(() => {
                this.mario.setVelocityY(-350)
            }, 100)

            setTimeout(() => {
                this.scene.restart()
            }, 2000)
        }


        this.goombas.getChildren().forEach(goomba => {
            goomba.setVelocityX(goomba.dx)
        })
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
            key: 'goomba-walk',
            frames: this.anims.generateFrameNumbers(
                'koopa',
                { start: 0, end: 1 }
            ),
            frameRate: 12,
            repeat: -1
        })


        this.anims.create({
            key: 'block-active',
            frames: this.anims.generateFrameNumbers(
                'block-2',
                { start: 0, end: 2 }
            ),
            frameRate: 12,
            repeat: -1
        })        
    }

    createGoomba(x, y, dx) {
        const goomba = this.physics.add.sprite(x, y, 'goomba')
        goomba.setOrigin(0.5)
        goomba.setScale(1.6)
        goomba.body.allowGravity = false
        goomba.immovable = true
        goomba.dx = dx
        goomba.setCollideWorldBounds(true)
        return goomba
    }

    createContact(x, y) {
        const contacto = this.add.rectangle(x, y, 40, 40).setOrigin(0.5, 1)
        this.physics.add.existing(contacto);
        contacto.body.allowGravity = false;
        contacto.body.immovable = true;
        return contacto
    }

    rotarGoomba(izq, der) {
        izq.dx *= -1
        der.dx *= -1
    }

    createBlock(x, y) {
        const block = this.physics.add.sprite(x, y, 'block-2')
        block.setOrigin(0.5)
        block.setScale(1.6)
        block.body.allowGravity = false
        block.body.immovable = true
        return block
    }

}