import { Vector2, DisplayType, Instance } from './common';
import { Runtime } from './service';
declare class collisionRectangle {
    position: Vector2;
    size: Vector2;
    constructor(position: Vector2, size: Vector2);
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
declare class Actor extends WorldObject {
    health: number;
    maxHealth: number;
    script: string;
    runtime: Runtime;
    constructor(options: any);
    runScript(): void;
    update(): void;
}
declare class Stage extends Instance {
    displayType: DisplayType;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    aspect_ratio: number;
    tile_size: number;
    camera: Camera;
    children: WorldObject[];
    constructor(options: any);
    setCanvasDimensions(): void;
    render(): void;
}
declare class Camera extends Instance {
    position: Vector2;
    constructor(options: any);
}
declare class Tile extends WorldObject {
    tile_size: number;
    tilePosition: Vector2;
    constructor(options: any);
    update(): void;
}
export { Tile, Camera, Actor, Stage, collisionRectangle, WorldObject };
