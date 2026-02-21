
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

    setGravity(3200)

    const player1 = makePlayer(200, 100, 16, 42, 4, "player1")
    player1.use(sprite(player1.sprites.idle))
    player1.play("idle")

})



go("fight")




