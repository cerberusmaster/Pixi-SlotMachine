import { GameScene } from "./scenes/game-scene";
import { Game } from "./core/game";
import { Assets } from "pixi.js";


window.onload = () => {

    const game = new Game({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: '0x333333',
        resolution: window.devicePixelRatio,
        scenes: {
            'game-scene': GameScene,
        },
    });

    window.addEventListener('resize', () =>
        game.resize(window.innerWidth, window.innerHeight),
    );

    game.load('game-scene');

    game.resize(window.innerWidth, window.innerHeight);
};
