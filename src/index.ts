//try to use less AI, document more, and use typescript
class Runtime {
    private updateCallbacks: (() => void)[] = [];

    constructor() { }

    loop = () => {
        this.update()
        requestAnimationFrame(() => this.loop()) // Use an arrow function to preserve 'this'

    };

    onUpdate(callback: () => void) {
        // Attach the callback function to the update event
        this.updateCallbacks.push(callback)
    }

    update() {
        // Call all registered update callbacks
        for (const callback of this.updateCallbacks) {
            callback()
        }

        main.render()
        main.stepPhysics()
    }
}

const runtime = new Runtime()

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
    orientation: number
    imgSrc: HTMLImageElement
    stage: Stage

    constructor(position: Vector2, orientation: number, imgSrc: HTMLImageElement, stage: Stage, name: string) {
        super(name)
        this.position = position;
        this.orientation = orientation
        this.imgSrc = imgSrc
        this.stage = stage
    }

    render() {
        let canvas = this.stage.canvas;
        let context = canvas.getContext('2d') as CanvasRenderingContext2D
        const canvasPercent = {
            width: canvas.width / 1280,
            height: canvas.height / 720
        };
        const renderObject = {
            x: this.position.x * canvasPercent.width,
            y: this.position.y * canvasPercent.height,
            width: this.imgSrc.width * canvasPercent.width,
            height: this.imgSrc.height * canvasPercent.height
        };
        context.save();

        // Adjust the translation to the center of the rotated image
        context.translate(renderObject.x, renderObject.y);
        context.rotate((this.orientation * Math.PI) / 180);
        context.drawImage(this.imgSrc, -renderObject.width / 2, -renderObject.height / 2, renderObject.width, renderObject.height);

        context.restore();
    }

    update() {
        this.render()
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
            if (typeof object.update === 'function') {
                object.update();
            } else {
                console.warn('Object does not have a update method:', object);
            }
        });
    }

    stepPhysics() {

    }
}

//services
class InputService {
    keyState: { [key: string]: boolean };
    mouse: { x: number; y: number };

    constructor() {
        this.keyState = {};
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.mouse = { x: 0, y: 0 };

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        document.addEventListener('mousemove', this.getMouse.bind(this)); // Bind getMouse to the current instance
    }

    handleKeyDown(event: KeyboardEvent) {
        this.keyState[event.key] = true;
    }

    handleKeyUp(event: KeyboardEvent) {
        this.keyState[event.key] = false;
    }

    isKeyDown(key: string): boolean {
        return this.keyState[key] || false;
    }

    getMouse(event: MouseEvent) {
        this.mouse.x = event.clientX;
        this.mouse.y = -event.clientY;
    }

    // Add a method to remove event listeners when no longer needed
    removeEventListeners() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        document.removeEventListener('mousemove', this.getMouse.bind(this)); // Unbind getMouse
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

    constructor(position: Vector2, orientation: number, imgSrc: HTMLImageElement, stage: Stage, name: string, script: string = 'console.log("Hello World!")') {
        super(position, orientation, imgSrc, stage, name)
        this.script = script
        this.health = 100
        this.maxHealth = 100
        this.runScript()
    }

    runScript() {

        const libraries = {
            console,
            actor: this,
            inputService: new InputService(),
            onUpdate: runtime.onUpdate.bind(runtime)
        }

        const sandbox = { private: libraries }

        const script = new Function(`with(this.private) { ${this.script} }`) as () => void;
        script.call(sandbox)

    }

    update() {
        this.render()
    }
}



let canvas: HTMLCanvasElement = document.getElementById('main') as HTMLCanvasElement
let main = new Stage(canvas, DisplayType.wideScreen, 9 / 16)

let image = new Image()
image.src = "./assets/player.svg"

let script = `
let xv = 0
let yv = 0
onUpdate(() => {
    console.log('test')

    yv += -1
    yv *= 0.95
    xv *= 0.90

    if (actor.position.y > 500) {
        actor.position.y = 500
        yv = 0
        
    }
if (inputService.isKeyDown('ArrowUp')) {
            yv = 15

        }
    actor.position.x += xv
    actor.position.y += -yv
    actor.orientation += yv
})
`

let newactor = new Actor(new Vector2(Math.random() * canvas.width, 100), Math.random() * 360, image, main, "player", script)
main.world.push(newactor)



runtime.loop()