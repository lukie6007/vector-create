//try to use less AI, document more, and use typescript

//used in stage resizing
enum displayType {
    wideScreen,
    fill
}

//used for position and size
class Vector2 {
    x: number
    y: number

    constructor(x?: number, y?: number) {
        this.x = x || 0
        this.y = y || 0
    }

}

//tiles, actors, etc...
class WorldObject {
    position: Vector2
    imgSrc: HTMLImageElement

    constructor(position: Vector2, imgSrc: HTMLImageElement) {
        this.position = position;
        this.imgSrc = imgSrc
    }

    render(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        const canvasPercent = {
            width: canvas.width / 1280,
            height: canvas.height / 720
        }
        const renderObject = {
            x: this.position.x * canvasPercent.width,
            y: this.position.y * canvasPercent.height,
            width: this.imgSrc.width * canvasPercent.width,
            height: this.imgSrc.height * canvasPercent.height
        }

        context.drawImage(this.imgSrc, renderObject.x, renderObject.y, renderObject.width, renderObject.height)
    }
}

//stages can change... will add later
class Stage {
    world: WorldObject[]
    displayType: displayType
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    aspect_ratio: number

    constructor(canvas: HTMLCanvasElement, displayType: displayType, aspect_ratio) {
        this.world = []
        this.displayType = displayType
        this.canvas = canvas || document.createElement('canvas')
        this.context = canvas.getContext('2d') as CanvasRenderingContext2D
        this.aspect_ratio = aspect_ratio || 9 / 16
    }

    setCanvasDimensions() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = this.displayType === displayType.fill
            ? window.innerHeight
            : window.innerWidth * this.aspect_ratio;
    }

    render() {
        this.setCanvasDimensions();

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.world.forEach(object => {
            if (typeof object.render === 'function') {
                object.render(this.context, this.canvas);
            } else {
                console.warn('Object does not have a render method:', object);
            }
        });
    }

    stepPhysics() {

    }

    newObject(position: Vector2, image: HTMLImageElement) {
        this.world.push(new WorldObject(position, image))
    }
}

let canvas: HTMLCanvasElement = document.getElementById('main') as HTMLCanvasElement
let main = new Stage(canvas, displayType.wideScreen, 9 / 16)

//main loop
function loop() {
    main.render()
    main.stepPhysics()

    requestAnimationFrame(loop)
}

let image = new Image()
image.src = "./assets/player.svg"

main.newObject(new Vector2(0, 0), image)

loop()