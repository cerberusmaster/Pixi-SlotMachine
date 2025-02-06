import { Container, Loader } from "pixi.js";

export type ConstructorOfScene = new (...args: any[]) => Scene;

export abstract class Scene extends Container {
    public readonly loader = new Loader();

    public preload?(): void;

    public create?(): void;

    public update?(deltaTime: number, elapsedTime: number): void;

    public resize?(width: number, height: number): void;
}
