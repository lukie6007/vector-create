import { Stage } from "./game-objects";
declare class Runtime {
    private updateCallbacks;
    main: Stage;
    constructor(stage: Stage);
    loop: () => void;
    onUpdate(callback: () => void): void;
    update(): void;
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
export { Runtime, InputService };
