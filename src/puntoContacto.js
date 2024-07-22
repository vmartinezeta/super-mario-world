export function createContactos(scene) {
    return scene.add.group()    
    .add(create(scene, 220, 490))
    .add(create(scene, 690, 490))
}


function create(scene, x, y) {    
    const contacto = scene.add.rectangle(x, y, 40, 40).setOrigin(0.5, 1)
    scene.physics.add.existing(contacto);
    contacto.body.allowGravity = false;
    contacto.body.immovable = true;
    return contacto
}

export function collideContactos(koopa) {
    koopa.dx *= -1
}