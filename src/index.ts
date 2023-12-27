import { Vector2, DisplayType, Instance } from './common';
import { InputService, Runtime } from './service';
import { Tile, Actor, Stage } from './game-objects';

let canvas: HTMLCanvasElement = document.getElementById('main') as HTMLCanvasElement
let main = new Stage({
    canvas: document.getElementById('main'), DisplayType: DisplayType.wideScreen, aspect_ratio: 9 / 16
})

let image = new Image()
image.src = "./assets/player.svg"

let script = `
let xv = 0
let yv = 0
onUpdate(() => {
   let rect = actor.stepCollision(new collisionRectangle(actor.position, new Vector2(actor.img.width, actor.img.height)), actor.stage, actor.id)
        actor.position = rect.position
    if (inputService.isKeyDown('ArrowRight')) {
        xv += 1
    }

    if (inputService.isKeyDown('ArrowLeft')) {
        xv += -1
    }

    yv += -1
    yv *= 0.95
    xv *= 0.90

    if (actor.position.y > 720) {
        actor.position.y = 720
        yv = 0
        if (inputService.isKeyDown('ArrowUp')) {
            yv = 15
        }
    }

    if (actor.colliding.length > 0) {
        let hityv = yv
        yv = 0
        if (inputService.isKeyDown('ArrowUp') && hityv <= 0) {
            yv = 15
        }
    }
    actor.position.x += xv
    actor.position.y += -yv
    actor.orientation += xv
    camera.position.x = actor.position.x - 500

    let mouse = inputService.mouse
    
    
})
`
new Actor({ img: image, script: script, stage: main })

script = `
let xv = 0
let yv = 0
onUpdate(() => {

    if (inputService.isKeyDown('d')) {
        xv += 1
    }

    if (inputService.isKeyDown('a')) {
        xv += -1
    }

    yv += -1
    yv *= 0.95
    xv *= 0.90

    if (actor.position.y > 720) {
        actor.position.y = 720
        yv = 0
        if (inputService.isKeyDown('w')) {
            yv = 15
        }
    }

    if (actor.colliding.length > 0) {
        yv = 0
        if (inputService.isKeyDown('w')) {
            yv = 15
        }
    }
    actor.position.x += xv
    actor.position.y += -yv
    actor.orientation += xv

    let mouse = inputService.mouse
    
    
})
`

image = new Image(25, 25)
image.src = "./assets/player2.svg"
new Actor({ img: image, script: script, stage: main, position: new Vector2(100, 200) })

new Tile({ tilePosition: new Vector2(12, 14), tile_size: 50, stage: main })
new Tile({ tilePosition: new Vector2(13, 14), tile_size: 50, stage: main })
new Tile({ tilePosition: new Vector2(14, 14), tile_size: 50, stage: main })
new Tile({ tilePosition: new Vector2(10, 10), tile_size: 50, stage: main })
new Tile({ tilePosition: new Vector2(10, 11), tile_size: 50, stage: main })
new Tile({ tilePosition: new Vector2(10, 12), tile_size: 50, stage: main })
new Tile({ tilePosition: new Vector2(10, 13), tile_size: 50, stage: main })

const runtime = new Runtime(main)
runtime.loop()