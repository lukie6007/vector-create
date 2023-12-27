//data types
class Vector2 {
    //used for positioning and sizing
    x: number
    y: number

    constructor(x?: number, y?: number) {
        this.x = x || 0
        this.y = y || 0
    }

}

enum DisplayType {
    wideScreen,
    fill,
    stretch
}

class Instance {
    name: string;
    id: number;
    children: Instance[]

    constructor(options: any) {
        options = options || {}
        this.name = options.name || 'Instance';
        this.id = options.id || Math.floor(Math.random() * 1000);
        this.children = options.children || []
    }

}


export { Vector2, DisplayType, Instance };