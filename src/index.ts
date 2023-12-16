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

    }
}

const runtime = new Runtime()

class Instance {
    name: string;
    id: number;
    children: WorldObject[]

    constructor(options: any) {
        options = options || {}
        this.name = options.name || 'Instance';
        this.id = options.id || Math.floor(Math.random() * 1000);
        this.children = options.children || []
    }

}


//tiles, actors, etc...
class WorldObject extends Instance {
    position: Vector2;
    orientation: number;
    img: HTMLImageElement;
    stage: Stage;
    colliding: WorldObject[]

    constructor(options: any) {
        super(options);
        let placeholder = new Image()
        placeholder.src = "./assets/notexture.png"
        this.position = options.position || new Vector2();
        this.orientation = options.orientation || 0;
        this.img = options.img || placeholder;
        this.stage = options.stage || new Stage({
            canvas: document.createElement('canvas'), DisplayType: DisplayType.fill, aspect_ratio: 9 / 16
        });
        this.stage.children.push(this)
        this.colliding = []
    }

    render() {
        let canvas = this.stage.canvas;
        let context = canvas.getContext('2d') as CanvasRenderingContext2D

        let canvasPercent = {
            width: 1,
            height: 1
        }

        if (this.stage.displayType === DisplayType.wideScreen || this.stage.displayType === DisplayType.stretch) {
            canvasPercent.width = canvas.width / 1280;
            canvasPercent.height = canvas.height / 720;
        }

        const renderObject = {
            x: (this.position.x - this.stage.camera.position.x) * canvasPercent.width,
            y: (this.position.y - this.stage.camera.position.y) * canvasPercent.height,
            width: this.img.width * canvasPercent.width,
            height: this.img.height * canvasPercent.height
        };
        context.save();

        // Adjust the translation to the center of the rotated image
        context.translate(renderObject.x, renderObject.y);
        context.rotate((this.orientation * Math.PI) / 180);
        context.drawImage(this.img, -renderObject.width / 2, -renderObject.height / 2, renderObject.width, renderObject.height);

        context.restore();
    }

    update() {
        this.render()
    }

    stepCollision(rect: collisionRectangle, stage: Stage, id: number) {
        this.colliding = []
        const otherRectangles = stage.children;

        let rect1 = rect;

        for (const object of otherRectangles) {
            // Skip the current rectangle if it has the same ID as rect
            if (object.id === id) {
                continue;
            }

            let rect2 = new collisionRectangle(object.position, new Vector2(object.img.width, object.img.height));

            if (
                rect1.position.x < rect2.position.x + rect2.size.x &&
                rect1.position.x + rect1.size.x > rect2.position.x &&
                rect1.position.y < rect2.position.y + rect2.size.y &&
                rect1.position.y + rect1.size.y > rect2.position.y
            ) {
                this.colliding.push(object)


                // Calculate overlap along the X-axis
                const overlapX = Math.min(rect1.position.x + rect1.size.x, rect2.position.x + rect2.size.x) - Math.max(rect1.position.x, rect2.position.x);

                // Calculate overlap along the Y-axis
                const overlapY = Math.min(rect1.position.y + rect1.size.y, rect2.position.y + rect2.size.y) - Math.max(rect1.position.y, rect2.position.y);

                // Determine the direction of the overlap for both X and Y axes
                const overlapDirectionX = Math.sign(rect1.position.x - rect2.position.x);
                const overlapDirectionY = Math.sign(rect1.position.y - rect2.position.y);

                // Move rect1 based on the minimum overlap along each axis
                if (Math.abs(overlapX) < Math.abs(overlapY)) {
                    rect1.position.x += overlapX * overlapDirectionX;
                } else {
                    rect1.position.y += overlapY * overlapDirectionY;
                }

                // You can use the overlapX and overlapY values for further calculations or actions
            }
        }

        return rect1;
    }
}

class Camera extends Instance {
    position: Vector2
    constructor(options: any) {
        super(options)
        this.position = options.position || new Vector2()
    }
}

//stages can change... will add later
class Stage extends Instance {
    displayType: DisplayType
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    aspect_ratio: number
    tile_size: number
    camera: Camera

    constructor(options: any) {
        options = options || {}
        super(options)
        this.displayType = options.DisplayType
        this.canvas = options.canvas || document.createElement('canvas')
        this.context = options.canvas.getContext('2d') as CanvasRenderingContext2D
        this.aspect_ratio = options.aspect_ratio || 9 / 16
        this.tile_size = options.tile_size || 100
        this.camera = new Camera({})
    }

    setCanvasDimensions() {
        if (this.displayType === DisplayType.stretch) {
            this.canvas.style.width = window.innerWidth + 'px';
            this.canvas.style.height = window.innerHeight + 'px';
        } else {
            this.canvas.width = window.innerWidth;

            if (this.displayType === DisplayType.fill) {
                this.canvas.height = window.innerHeight;
            } else {
                // Default to DisplayType.widescreen
                this.canvas.height = window.innerWidth * this.aspect_ratio;
            }
        }
    }



    render() {
        this.setCanvasDimensions();

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.children.forEach(object => {
            if (typeof object.update === 'function') {
                object.update();
            } else {
                console.warn('Object does not have a update method:', object);
            }
        });
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

        this.mouse.x = event.clientX * 4 / 3;
        this.mouse.y = event.clientY * 4 / 3;
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
    wideScreen,
    fill,
    stretch
}

class collisionRectangle {
    position: Vector2
    size: Vector2
    constructor(position: Vector2, size: Vector2) {
        this.position = position
        this.size = size
    }
}

//world object types
class Actor extends WorldObject {
    //moving character
    health: number
    maxHealth: number
    script: string

    constructor(options: any) {
        super(options)
        this.script = options.script || ''
        this.health = 100
        this.maxHealth = 100
        this.runScript()
    }

    runScript() {

        const libraries = {
            console,
            actor: this,
            inputService: new InputService(),
            onUpdate: runtime.onUpdate.bind(runtime),
            camera: this.stage.camera
        }

        const sandbox = { private: libraries }

        const script = new Function(`with(this.private) { ${this.script} }`) as () => void;
        script.call(sandbox)

    }

    update(): void {

        this.render()

    }


}

class Tile extends WorldObject {
    tile_size: number
    tilePosition: Vector2
    constructor(options: any) {
        super(options)
        this.tile_size = options.tile_size || this.stage.tile_size
        this.tilePosition = options.tilePosition || new Vector2()
    }

    update(): void {

        this.position = new Vector2(this.tilePosition.x * this.tile_size, this.tilePosition.y * this.tile_size)
        this.img.width = this.tile_size + 1
        this.img.height = this.tile_size + 1
        this.render()
    }
}

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

runtime.loop()