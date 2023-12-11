"use strict";
//try to use less AI, document more, and use typescript
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
    imgSrc;
    constructor(position, imgSrc) {
        super();
        this.position = position;
        this.imgSrc = imgSrc;
    }
    render(context, canvas) {
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
        context.drawImage(this.imgSrc, renderObject.x, renderObject.y, renderObject.width, renderObject.height);
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
            }
            else {
                console.warn('Object does not have a render method:', object);
            }
        });
    }
    stepPhysics() {
    }
    newObject(position, image) {
        this.world.push(new WorldObject(position, image));
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
})(DisplayType || (DisplayType = {}));
//world object types
class Actor extends WorldObject {
    //moving character
    health;
    maxHealth;
    script;
    constructor(position, imgSrc, script = 'console.log("Hello World!")') {
        super(position, imgSrc);
        this.script = script;
        this.health = 100;
        this.maxHealth = 100;
        this.runScript();
    }
    runScript() {
        const script = new Function(this.script);
        const sandboxedObject = {
            console,
            actor: this
        };
        script.call(sandboxedObject);
    }
}
let canvas = document.getElementById('main');
let main = new Stage(canvas, DisplayType.wideScreen, 9 / 16);
//main loop
function loop() {
    main.render();
    main.stepPhysics();
    requestAnimationFrame(loop);
}
let image = new Image();
image.src = "./assets/player.svg";
new Actor(new Vector2(100, 100), image, 'alert("hello")');
loop();
//# sourceMappingURL=index.js.map