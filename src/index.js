
//try to use less AI, document more, and use typescript
class Runtime {
    updateCallbacks = [];
    constructor() { }
    loop = () => {
        this.update();
        requestAnimationFrame(() => this.loop()); // Use an arrow function to preserve 'this'
    };
    onUpdate(callback) {
        // Attach the callback function to the update event
        this.updateCallbacks.push(callback);
    }
    update() {
        // Call all registered update callbacks
        for (const callback of this.updateCallbacks) {
            callback();
        }
        main.render();
        main.stepPhysics();
    }
}
const runtime = new Runtime();
class Instance {
    name;
    id;
    constructor(name = "Instance", id = Math.floor(Math.random() * 1000)) {
        this.name = name;
        this.id = id;
    }
}

//tiles, actors, etc...
class WorldObject extends Instance {
    position;
    orientation;
    imgSrc;
    stage;
    constructor(position, orientation, imgSrc, stage, name) {
        super(name);
        this.position = position;
        this.orientation = orientation;
        this.imgSrc = imgSrc;
        this.stage = stage;
    }
    render() {
        let canvas = this.stage.canvas;
        let context = canvas.getContext('2d');
        let canvasPercent = {
            width: 1,
            height: 1
        };
        if (this.stage.displayType === DisplayType.wideScreen || this.stage.displayType === DisplayType.stretch) {
            canvasPercent = {
                width: canvas.width / 1280,
                height: canvas.height / 720
            };
        }
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
        this.render();
    }
}
//stages can change... will add later
class Stage {
    world;
    displayType;
    canvas;
    context;
    aspect_ratio;
    constructor(canvas, DisplayType, aspect_ratio) {
        this.world = [];
        this.displayType = DisplayType;
        this.canvas = canvas || document.createElement('canvas');
        this.context = canvas.getContext('2d');
        this.aspect_ratio = aspect_ratio || 9 / 16;
    }
    setCanvasDimensions() {
        if (this.displayType === DisplayType.stretch) {
            this.canvas.style.width = window.innerWidth + 'px';
            this.canvas.style.height = window.innerHeight + 'px';
        }
        else {
            this.canvas.width = window.innerWidth;
            if (this.displayType === DisplayType.fill) {
                this.canvas.height = window.innerHeight;
            }
            else {
                // Default to DisplayType.widescreen
                this.canvas.height = window.innerWidth * this.aspect_ratio;
            }
        }
    }
    render() {
        this.setCanvasDimensions();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.world.forEach(object => {
            if (typeof object.update === 'function') {
                object.update();
            }
            else {
                console.warn('Object does not have a update method:', object);
            }
        });
    }
    stepPhysics() {
    }
}
//services
class InputService {
    keyState;
    mouse;
    constructor() {
        this.keyState = {};
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.mouse = { x: 0, y: 0 };
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        document.addEventListener('mousemove', this.getMouse.bind(this)); // Bind getMouse to the current instance
    }
    handleKeyDown(event) {
        this.keyState[event.key] = true;
    }
    handleKeyUp(event) {
        this.keyState[event.key] = false;
    }
    isKeyDown(key) {
        return this.keyState[key] || false;
    }
    getMouse(event) {
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
    x;
    y;
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
}
var DisplayType;
(function (DisplayType) {
    //used in stage resizing
    DisplayType[DisplayType["wideScreen"] = 0] = "wideScreen";
    DisplayType[DisplayType["fill"] = 1] = "fill";
    DisplayType[DisplayType["stretch"] = 2] = "stretch";
})(DisplayType || (DisplayType = {}));
//world object types
class Actor extends WorldObject {
    //moving character
    health;
    maxHealth;
    script;
    constructor(position, orientation, imgSrc, stage, name, script = 'console.log("Hello World!")') {
        super(position, orientation, imgSrc, stage, name);
        this.script = script;
        this.health = 100;
        this.maxHealth = 100;
        this.runScript();
    }
    runScript() {
        const libraries = {
            console,
            actor: this,
            inputService: new InputService(),
            onUpdate: runtime.onUpdate.bind(runtime)
        };
        const sandbox = { private: libraries };
        const script = new Function(`with(this.private) { ${this.script} }`);
        script.call(sandbox);
    }
}
let canvas = document.getElementById('main');
let main = new Stage(canvas, DisplayType.wideScreen, 9 / 16);
let image = new Image();
image.src = "./assets/player.svg";
let script = `
let xv = 0
let yv = 0
onUpdate(() => {
    console.log('test')
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

    actor.position.x += xv
    actor.position.y += -yv
    actor.orientation += xv
})
`;
let newactor = new Actor(new Vector2(Math.random() * canvas.width, 100), Math.random() * 360, image, main, "player", script);
main.world.push(newactor);
runtime.loop();
//# sourceMappingURL=index.js.map