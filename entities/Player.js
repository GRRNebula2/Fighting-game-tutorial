export class Player {

constructor(
    positionX,
    positionY,
    speed,
    left,
    right,
    jump,
    attackKey,
    id
    ) {
    this.positionX = positionX,
    this.positionY = positionY,
    this.speed = speed
    this.left = left,
    this.right = right,
    this.jump = jump,
    this.attackKey = attackKey,
    this.id = id
    this.makePlayer(positionX, positionY, id)
}

makePlayer(posX, posY, id) {
    add([
        pos(posX, posY),
        scale(4),
        area({shape: new Rect(vec2(0), 16, 42)}),
        anchor("center"),
        body({stickToPlatform: true}),
        {
            isCurrentlyJumping: false,
            health: 500,
            sprites: {
                run: "run-" + id,
                idle: "idle-" + id,
                jump: "jump-" + id,
                attack: "attack-" + id,
                death: "death-" + id
            }
        }
    ])
}

run(speed, flipPlayer) {
    if (player.health === 0) {
        return
    }

    if (player.curAnim() !== "run"
    && !player.isCurrentlyJumping) {
        player.use(sprite(player.sprites.run))
        player.play("run")
    }
    player.move(speed, 0)
    player.flipX = flipPlayer
}

resetPlayerToIdle() {
    player.use(sprite(player.sprites.idle))
    player.play("idle")
}

onKeyDown(this.right, () => {
    run(this.speed, false)
})

onKeyRelease(this.right, () => {
    if (player.health !== 0) {
        resetPlayerToIdle()
        player.flipX = false
    }
})

onKeyDown(this.left, () => {
    run(-this.speed, true)
})

onKeyRelease(this.left, () => {
    if(player.health !== 0) {
        resetPlayerToIdle(player1)
        player.flipX = true
    }
})

makeJump() {
    if (player.health === 0) {
        return
    }

    if (player.isGrounded()) {
        const currentFlip = player.flipX
        player.jump()
        player.use(sprite(player.sprites.jump))
        player.flipX = currentFlip
        player.play("jump")
        player.isCurrentlyJumping = true
    }
}

resetAfterJump() {
    if (player.isGrounded() && player.isCurrentlyJumping) {
        player.isCurrentlyJumping = false
        if (player.curAnim() !== "idle") {
            resetPlayerToIdle(player)
        }
    }
}

onKeyDown(this.up, () => {
    makeJump()
})


onUpdate(() => resetAfterJump())

function attack(excludedKeys) {
    if (player.health === 0) {
        return
    }

    for (const key of excludedKeys) {
        if (isKeyDown(key)) {
            return
        }
    }

    const currentFlip = player.flipX
    if (player.curAnim() !== "attack") {
        player.use(sprite(player.sprites.attack))
        player.flipX = currentFlip
        const slashX = player.pos.x + 30
        const slashXFlipped = player.pos.x - 350
        const slashY = player.pos.y - 200

        add([
            rect(300, 300),
            area(),
            pos(currentFlip ? slashXFlipped: slashX, slashY),
            opacity(0),
            player.id +"attackHitbox"
        ])
        
        player.play("attack", {
            onEnd: () => {
                resetPlayerToIdle(player)
                player.flipX = currentFlip
            }
        })
    }

}

onKeyPress(this.attackKey, () => {
    attack([this.left, this.right, this.jump])
})

onKeyRelease(this.attackKey, () => {
    destroyAll(player.id + "attackHitbox")
})

}
