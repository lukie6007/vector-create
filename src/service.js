"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputService = exports.Runtime = void 0;
class Runtime {
    updateCallbacks = [];
    main;
    constructor(stage) {
        this.main = stage;
    }
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
        this.main.render();
    }
}
exports.Runtime = Runtime;
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
exports.InputService = InputService;
//# sourceMappingURL=service.js.map