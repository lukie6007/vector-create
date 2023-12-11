//try to use less AI, document more, and use typescript

class Instance {
    name: string;
    id: number;

    constructor(name: string = "Instance", id: number = Math.floor(Math.random() * 1000)) {
        this.name = name;
        this.id = id;
    }

}

//tiles, actors, etc...
class WorldObject extends Instance {
    position: Vector2
    imgSrc: HTMLImageElement

    constructor(position: Vector2, imgSrc: HTMLImageElement) {
        super()
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
    displayType: DisplayType
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    aspect_ratio: number

    constructor(canvas: HTMLCanvasElement, DisplayType: DisplayType, aspect_ratio: number) {
        this.world = []
        this.displayType = DisplayType
        this.canvas = canvas || document.createElement('canvas')
        this.context = canvas.getContext('2d') as CanvasRenderingContext2D
        this.aspect_ratio = aspect_ratio || 9 / 16
    }

    setCanvasDimensions() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = this.displayType === DisplayType.fill
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

//data types
class Vector2 {
    //used for positioning and sizing
    x: number
    y: number

    constructor(x?: number, y?: number) {
        this.x = x || 0
        this.y = y || 0
    }

}

enum DisplayType {
    //used in stage resizing
    wideScreen,
    fill
}

//world object types
class Actor extends WorldObject {
    //moving character
    health: number
    maxHealth: number
    script: string

    constructor(position: Vector2, imgSrc: HTMLImageElement, script: string = 'console.log("Hello World!")') {
        super(position, imgSrc)
        this.script = script
        this.health = 100
        this.maxHealth = 100

        this.runScript()
    }

    runScript() {
        const script = new Function(this.script)
        const sandboxedObject = {
            console,
            actor: this
        }
        script.call(sandboxedObject)
    }
}

let canvas: HTMLCanvasElement = document.getElementById('main') as HTMLCanvasElement
let main = new Stage(canvas, DisplayType.wideScreen, 9 / 16)

//main loop
function loop() {
    main.render()
    main.stepPhysics()

    requestAnimationFrame(loop)
}

let image = new Image()
image.src = "./assets/player.svg"

new Actor(new Vector2(100, 100), image, 'alert("hello")')

loop()