
import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs"
import { load } from "./utils/loader.js"
import { Piirto } from "./utils/Piirto.js"

//import kaboom from "./libs/kaboom.mjs"

kaboom({
    width: 1280,
    height: 720,
    //scale: 0.9
    //letterbox: true
})

load.assets()

//loadSprite("background", "assets/background/background_layer_1.png"),
        
scene("fight", () => {


    const piirtoTausta = new Piirto()

    piirtoTausta.drawBackground("background")

    /*const background = add([
        sprite("background")
    ]) */
})

go("fight")




