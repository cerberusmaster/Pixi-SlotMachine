import { Container } from "pixi.js";

export class Paylines extends Container {
    public static readonly lines: number[][] = [
        [1, 1, 1, 1, 1],
        [1, 1, 2, 3, 3],
        [1, 2, 3, 2, 1],
        [1, 2, 1, 2, 1],
        [2, 2, 2, 2, 2],
        [2, 1, 1, 1, 2],
        [2, 3, 3, 3, 2],
        [2, 3, 2, 3, 2],
        [3, 3, 3, 3, 3],
        [3, 3, 2, 1, 1],
        [3, 2, 1, 2, 3],
        [3, 2, 3, 2, 3],
    ];
}
