"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instance = exports.DisplayType = exports.Vector2 = void 0;
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
exports.Vector2 = Vector2;
var DisplayType;
(function (DisplayType) {
    DisplayType[DisplayType["wideScreen"] = 0] = "wideScreen";
    DisplayType[DisplayType["fill"] = 1] = "fill";
    DisplayType[DisplayType["stretch"] = 2] = "stretch";
})(DisplayType || (exports.DisplayType = DisplayType = {}));
class Instance {
    name;
    id;
    children;
    constructor(options) {
        options = options || {};
        this.name = options.name || 'Instance';
        this.id = options.id || Math.floor(Math.random() * 1000);
        this.children = options.children || [];
    }
}
exports.Instance = Instance;
//# sourceMappingURL=common.js.map