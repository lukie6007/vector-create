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
declare class Instance {
    name: string;
    id: number;
    children: Instance[];
    constructor(options: any);
}
export { Vector2, DisplayType, Instance };
