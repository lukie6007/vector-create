declare class Instance {
    name: string;
    id: number;
    constructor(name?: string, id?: number);
}
declare class WorldObject extends Instance {
    position: Vector2;
    imgSrc: HTMLImageElement;
    constructor(position: Vector2, imgSrc: HTMLImageElement);
    render(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void;
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
    newObject(position: Vector2, image: HTMLImageElement): void;
}
declare class Vector2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
}
declare enum DisplayType {
    wideScreen = 0,
    fill = 1
}
declare class Actor extends WorldObject {
    health: number;
    maxHealth: number;
    script: string;
    constructor(position: Vector2, imgSrc: HTMLImageElement, script?: string);
    runScript(): void;
}
declare let canvas: HTMLCanvasElement;
declare let main: Stage;
declare function loop(): void;
declare let image: HTMLImageElement;
