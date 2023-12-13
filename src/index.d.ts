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
    constructor(name?: string, id?: number);
}
declare class WorldObject extends Instance {
    position: Vector2;
    orientation: number;
    imgSrc: HTMLImageElement;
    stage: Stage;
    constructor(position: Vector2, orientation: number, imgSrc: HTMLImageElement, stage: Stage, name: string);
    render(): void;
    update(): void;
}
declare class Stage {
    world: WorldObject[];
    displayType: DisplayType;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    aspect_ratio: number;
    constructor(canvas: HTMLCanvasElement, DisplayType: DisplayType, aspect_ratio: number);
    setCanvasDimensions(): void;
    render(): void;
    stepPhysics(): void;
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
declare class Actor extends WorldObject {
    health: number;
    maxHealth: number;
    script: string;
    constructor(position: Vector2, orientation: number, imgSrc: HTMLImageElement, stage: Stage, name: string, script?: string);
    runScript(): void;
}
declare let canvas: HTMLCanvasElement;
declare let main: Stage;
declare let image: HTMLImageElement;
declare let script: string;
declare let newactor: Actor;
