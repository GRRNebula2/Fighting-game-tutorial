
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



})



go("fight")




