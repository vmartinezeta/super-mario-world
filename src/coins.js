export function createArcCoin(scene) {
    return scene.add.group()

    .add(create(scene, 460, 400))

    .add(create(scene, 490, 394))

    .add(create(scene, 520, 400))
}


function create(scene, x, y) {
    const coin = scene.physics.add.sprite(x, y, "coin")
    coin.setOrigin(0, 0)
    coin.refreshBody()
    coin.body.allowGravity = false
    scene.physics.add.existing(coin)
    return coin
}


export function collideCoin(coin) {
    coin.destroy()
  }