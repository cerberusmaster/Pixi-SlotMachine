import { Application, Assets, Ticker } from "pixi.js";
import { ConstructorOfScene, Scene } from "./scene";
import { GameScene } from "../scenes/game-scene";

// TODO: Make it dynamic.
const WIDTH = 2048;
const HEIGHT = 1343;

type GameConfig = {
    width?: number;
    height?: number;
    backgroundColor?: string;
    resolution?: number;
};

export class Game<
    T extends { [key: string]: ConstructorOfScene },
    K extends keyof T,
> {
    private app: Application;
    private scenes: T;
    private currentScene: Scene = new GameScene();

    constructor(config: GameConfig & { scenes: T }) {
        this.app = new Application();
        this.app.init({
            width: config.width || 800,
            height: config.height || 600,
            backgroundColor: config.backgroundColor || '0x000000',
            // resolution: config.resolution || 1,
            // autoDensity: true,
            // antialias: true,
        }).then(() => {
            document.getElementById("pixi-container")!.appendChild(this.app.canvas);
        })

        this.scenes = config.scenes;

        this.app.ticker = new Ticker();
        this.app.ticker.add(this.update, this);
        this.app.ticker.start();
    }

    public load(key: K): void {
        // Game.scenes.startScene(key);
        this.currentScene = new this.scenes[key]();

        Assets.load([
            {
                alias: 'template',
                src: '/assets/template.png',
            },
            {
                alias: 'tobacco',
                src: '/assets/images/tobacco.png',
            },
            {
                alias: 'cactus',
                src: '/assets/images/cactus.png',
            },
            {
                alias: 'boots',
                src: '/assets/images/boots.png',
            },
            {
                alias: 'gun',
                src: '/assets/images/gun.png',
            },
            {
                alias: 'sheriff',
                src: '/assets/images/sheriff.png',
            },
            {
                alias: 'whisky',
                src: '/assets/images/whisky.png',
            },
            {
                alias: 'horse',
                src: '/assets/images/horse.png',
            },
            {
                alias: 'hat',
                src: '/assets/images/hat.png',
            },
            {
              alias: 'spineSkeleton',
              src: '/assets/spineboy-pro.skel',
            },
            {
              alias: 'spineAtlas',
              src: 'https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pma.atlas',
            },
        ]).then((v) => {
            console.log("Assetss", this.currentScene, v);
            this.currentScene.preload && this.currentScene.preload();
            this.currentScene.create && this.currentScene.create();
            this.app.stage.addChild(this.currentScene);
        });
    }
    
    public update(ticker: Ticker): void {
        // (deltaTime: number)
        
        if (this.currentScene?.parent === undefined) return;
        this.currentScene.update && this.currentScene.update(ticker.deltaTime, this.app.ticker.elapsedMS);
    }

    public resize(width: number, height: number): void {
        this.app?.renderer?.resize(width, height);

        if (this.currentScene?.parent === undefined) return;
        const ratio = Math.min(width / WIDTH, height / HEIGHT);
        this.currentScene.scale.set(ratio);
        this.currentScene.position.set(
            (width - WIDTH * ratio) * 0.5,
            (height - HEIGHT * ratio) * 0.5,
        );
    }
}
