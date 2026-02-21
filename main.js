
import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs"
import { load } from "./utils/loader.js"

//import kaboom from "./libs/kaboom.mjs"

kaboom({
    width: 1280,
    height: 720,
    //scale: 0.9
})

scene("fight", () => {
    const background = add([
        sprite("background")
    ])
})

go("fight")




