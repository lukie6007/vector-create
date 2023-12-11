"use strict";
//try to use less AI, document more, and use typescript
console.log('hello');
//used in stage resizing
var DisplayType;
(function (DisplayType) {
    DisplayType[DisplayType["wideScreen"] = 0] = "wideScreen";
    DisplayType[DisplayType["fill"] = 1] = "fill";
})(DisplayType || (DisplayType = {}));
//used for position and size
class Vector2 {
    x;
    y;
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
}
//tiles, actors, etc...
class WorldObject {
    position;
    imgSrc;
    constructor(position, imgSrc) {
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
main.newObject(new Vector2(100, 100), image);
loop();
//# sourceMappingURL=index.js.map