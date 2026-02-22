
import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs"
import { load } from "./utils/loader.js"

//import kaboom from "./libs/kaboom.mjs"

kaboom({
    width: 1280,
    height: 720,
    letterbox: true
})

load.assets()
     
scene("fight", () => {

    const background = add([
        sprite("background"),
        scale(4)
    ])

    background.add([
        sprite("trees"),
    ])

    const groundTiles = addLevel([
        "","","","","","","","","",
        "------#######-----------",
        "dddddddddddddddddddddddd",
        "dddddddddddddddddddddddd"
        ], {
        tileWidth: 16,
        tileHeight: 16,
        tiles: {
            "#": () => [
                sprite("ground-golden"),
                area(),
                body({isStatic: true})
            ],
            "-": () => [
                sprite("ground-silver"),
                area(),
                body({isStatic: true}),
            ],
            "d": () => [
                sprite("deep-ground"),
                area(),
                body({isStatic: true})
            ]
        }
    })
    
    groundTiles.use(scale(4))

    const shop = background.add([
        sprite("shop"),
        pos(170, 15)
    ])

    shop.play("default")

    add([
        rect(16, 720),
        area(),
        body({isStatic: true}),
        pos(-20,0)
    ])

    add([
        rect(16, 720),
        area(),
        body({isStatic: true}),
        pos(1280, 0)
    ])

    background.add([
        sprite("fence"),
        pos(85, 125)
       ])
    
       background.add([
        sprite("fence"),
        pos(10, 125)
       ])
    
       background.add([
        sprite("sign"),
        pos(290, 115)
       ])
    
    
       function makePlayer(posX, posY, width, height, scaleFactor, id) {
        return add([
            pos(posX, posY),
            scale(scaleFactor),
            area({shape: new Rect(vec2(0), width, height)}),
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

    setGravity(1200)

    const player1 = makePlayer(200, 100, 16, 42, 4, "player1")
    player1.use(sprite(player1.sprites.idle))
    player1.play("idle")

    function run(player, speed, flipPlayer) {
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

    function resetPlayerToIdle(player) {
        player.use(sprite(player.sprites.idle))
        player.play("idle")
    }

    onKeyDown("d", () => {
        run(player1, 500, false)
    })
    onKeyRelease("d", () => {
        if (player1.health !== 0) {
            resetPlayerToIdle(player1)
            player1.flipX = false
        }
    })

    onKeyDown("a", () => {
        run(player1, -500, true)
    })

    onKeyRelease("a", () => {
        if(player1.health !== 0) {
            resetPlayerToIdle(player1)
            player1.flipX = true
        }
    })

    function makeJump(player) {
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

    function resetAfterJump(player) {
        if (player.isGrounded() && player.isCurrentlyJumping) {
            player.isCurrentlyJumping = false
            if (player.curAnim() !== "idle") {
                resetPlayerToIdle(player)
            }
        }
    }

    onKeyDown("w", () => {
        makeJump(player1)
    })

    player1.onUpdate(() => resetAfterJump(player1))

    function attack(player, excludedKeys) {
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

    onKeyDown("space", () => {
        attack(player1, ["a", "d", "w"])
    })

})



go("fight")




