"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldObject = exports.collisionRectangle = exports.Stage = exports.Actor = exports.Camera = exports.Tile = void 0;
const common_1 = require("./common");
const service_1 = require("./service");
class collisionRectangle {
    position;
    size;
    constructor(position, size) {
        this.position = position;
        this.size = size;
    }
}
exports.collisionRectangle = collisionRectangle;
//tiles, actors, etc...
class WorldObject extends common_1.Instance {
    position;
    orientation;
    img;
    stage;
    colliding;
    constructor(options) {
        super(options);
        let placeholder = new Image();
        placeholder.src = "./assets/notexture.png";
        this.position = options.position || new common_1.Vector2();
        this.orientation = options.orientation || 0;
        this.img = options.img || placeholder;
        this.stage = options.stage || new Stage({
            canvas: document.createElement('canvas'), DisplayType: common_1.DisplayType.fill, aspect_ratio: 9 / 16
        });
        this.stage.children.push(this);
        this.colliding = [];
    }
    render() {
        let canvas = this.stage.canvas;
        let context = canvas.getContext('2d');
        let canvasPercent = {
            width: 1,
            height: 1
        };
        if (this.stage.displayType === common_1.DisplayType.wideScreen || this.stage.displayType === common_1.DisplayType.stretch) {
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
        this.render();
    }
    stepCollision(rect, stage, id) {
        this.colliding = [];
        const otherRectangles = stage.children.filter((object) => object instanceof WorldObject && object.id !== id);
        let rect1 = rect;
        for (const object of otherRectangles) {
            let rect2 = new collisionRectangle(object.position, new common_1.Vector2(object.img.width, object.img.height));
            if (rect1.position.x < rect2.position.x + rect2.size.x &&
                rect1.position.x + rect1.size.x > rect2.position.x &&
                rect1.position.y < rect2.position.y + rect2.size.y &&
                rect1.position.y + rect1.size.y > rect2.position.y) {
                this.colliding.push(object);
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
                }
                else {
                    rect1.position.y += overlapY * overlapDirectionY;
                }
                // You can use the overlapX and overlapY values for further calculations or actions
            }
        }
        return rect1;
    }
}
exports.WorldObject = WorldObject;
//world object types
class Actor extends WorldObject {
    //moving character
    health;
    maxHealth;
    script;
    runtime;
    constructor(options) {
        super(options);
        this.script = options.script || '';
        this.health = 100;
        this.maxHealth = 100;
        this.runScript();
        this.runtime = options.runtime || new service_1.Runtime(this.stage);
    }
    runScript() {
        const libraries = {
            console,
            actor: this,
            inputService: new service_1.InputService(),
            onUpdate: this.runtime.onUpdate.bind(this.runtime),
            camera: this.stage.camera
        };
        const sandbox = { private: libraries };
        const script = new Function(`with(this.private) { ${this.script} }`);
        script.call(sandbox);
    }
    update() {
        this.render();
    }
}
exports.Actor = Actor;
//stages can change... will add later
class Stage extends common_1.Instance {
    displayType;
    canvas;
    context;
    aspect_ratio;
    tile_size;
    camera;
    children;
    constructor(options) {
        options = options || {};
        super(options);
        this.displayType = options.DisplayType;
        this.canvas = options.canvas || document.createElement('canvas');
        this.context = options.canvas.getContext('2d');
        this.aspect_ratio = options.aspect_ratio || 9 / 16;
        this.tile_size = options.tile_size || 100;
        this.camera = new Camera({});
        this.children = [];
    }
    setCanvasDimensions() {
        if (this.displayType === common_1.DisplayType.stretch) {
            this.canvas.style.width = window.innerWidth + 'px';
            this.canvas.style.height = window.innerHeight + 'px';
        }
        else {
            this.canvas.width = window.innerWidth;
            if (this.displayType === common_1.DisplayType.fill) {
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
        this.children.forEach(object => {
            if (typeof object.update === 'function') {
                object.update();
            }
            else {
                console.warn('Object does not have a update method:', object);
            }
        });
    }
}
exports.Stage = Stage;
class Camera extends common_1.Instance {
    position;
    constructor(options) {
        super(options);
        this.position = options.position || new common_1.Vector2();
    }
}
exports.Camera = Camera;
class Tile extends WorldObject {
    tile_size;
    tilePosition;
    constructor(options) {
        super(options);
        this.tile_size = options.tile_size || this.stage.tile_size;
        this.tilePosition = options.tilePosition || new common_1.Vector2();
    }
    update() {
        this.position = new common_1.Vector2(this.tilePosition.x * this.tile_size, this.tilePosition.y * this.tile_size);
        this.img.width = this.tile_size + 1;
        this.img.height = this.tile_size + 1;
        this.render();
    }
}
exports.Tile = Tile;
//# sourceMappingURL=game-objects.js.map