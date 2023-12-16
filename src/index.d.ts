declare class Runtime {
    private updateCallbacks;
    constructor();
    loop: () => void;
    onUpdate(callback: () => void): void;
    update(): void;
}
declare const runtime: Runtime;
declare class Instance {
    name: string;
    id: number;
    children: WorldObject[];
    constructor(options: any);
}
declare class WorldObject extends Instance {
    position: Vector2;
    orientation: number;
    img: HTMLImageElement;
    stage: Stage;
    colliding: WorldObject[];
    constructor(options: any);
    render(): void;
    update(): void;
    stepCollision(rect: collisionRectangle, stage: Stage, id: number): collisionRectangle;
}
declare class Camera extends Instance {
    position: Vector2;
    constructor(options: any);
}
declare class Stage extends Instance {
    displayType: DisplayType;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    aspect_ratio: number;
    tile_size: number;
    camera: Camera;
    constructor(options: any);
    setCanvasDimensions(): void;
    render(): void;
}
declare class InputService {
    keyState: {
        [key: string]: boolean;
    };
    mouse: {
        x: number;
        y: number;
    };
    constructor();
    handleKeyDown(event: KeyboardEvent): void;
    handleKeyUp(event: KeyboardEvent): void;
    isKeyDown(key: string): boolean;
    getMouse(event: MouseEvent): void;
    removeEventListeners(): void;
}
declare class Vector2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
}
declare enum DisplayType {
    wideScreen = 0,
    fill = 1,
    stretch = 2
}
declare class collisionRectangle {
    position: Vector2;
    size: Vector2;
    constructor(position: Vector2, size: Vector2);
}
declare class Actor extends WorldObject {
    health: number;
    maxHealth: number;
    script: string;
    constructor(options: any);
    runScript(): void;
    update(): void;
}
declare class Tile extends WorldObject {
    tile_size: number;
    tilePosition: Vector2;
    constructor(options: any);
    update(): void;
}
declare let canvas: HTMLCanvasElement;
declare let main: Stage;
declare let image: HTMLImageElement;
declare let script: string;
