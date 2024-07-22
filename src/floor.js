export const createFloor = (scene, height) => {
    const floor = scene.physics.add.staticGroup()
    let i = 0

    floor
        .create(0, height, 'floorbricks')
        .setOrigin(0, 0.5)
        .refreshBody()

    for (; i < 4; i++) {
        floor
            .create(200 + 128 * i, height, 'floorbricks')
            .setOrigin(0, 0.5)
            .refreshBody()
    }

    for (; i < 8; i++) {
        floor
            .create(200 + 128 * i + 67, height, 'floorbricks')
            .setOrigin(0, 0.5)
            .refreshBody()
    }

    for (; i < 13; i++) {
        floor
            .create(200 + 128 * i + 167, height, 'floorbricks')
            .setOrigin(0, 0.5)
            .refreshBody()
    }

    return floor
}