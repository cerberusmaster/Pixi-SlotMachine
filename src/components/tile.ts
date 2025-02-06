// import { Spine } from '@esotericsoftware/spine-pixi-v8';

import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import { default as data } from './../data';
import { Spine } from '@esotericsoftware/spine-pixi-v8';

export class Tile extends Container {
    public id: number = 0;

    private border: Graphics;
    private sprite: Sprite = new Sprite();
    private spine: Spine = null;

    constructor(width: number, height: number) {
        super();

        this.width = width;
        this.height = height;

        // Add border (rect).
        this.border = new Graphics();
        this.border.rect(0, 0, width, height).fill({
            color: 0xaa0000,
            alpha: 0.2
        }).stroke({
            width: 2,
            color: 0xaa0000
        });
        this.addChild(this.border);

        // Add sprite.
        if (data.symbols[this.id].texture) {
            this.sprite.scale.set(0.4, 0.4);
            this.sprite.anchor.set(0.5, 0.5);
            this.sprite.position.set(width * 0.5, height * 0.5);
            this.addChild(this.sprite);
            this.swap();
        } else if (data.symbols[this.id].skeleton) {
            // Add Spine animation.
            try {
                this.spine = Spine.from({
                    skeleton: 'spineSkeleton',
                    atlas: 'spineAtlas',
                });
                this.spine.scale.set(0.4, 0.4);
                this.spine.position.set(this.width * 0.5, this.height * 0.5);
                this.addChild(this.spine);
            } catch (e) {

            }
        }
    }

    public swap(): void {
        this.id = Math.floor(Math.random() * data.symbols.length);
        const t = data.symbols[this.id];
        if (t.texture) {
            // get a random symbol id

            // set the data
            this.sprite.texture = Texture.from(
                t.texture,
            );
            this.sprite.alpha = 1
            if (this.spine)
                this.spine.visible = false;
        } else if (t.skeleton) {
            try {
                if (this.spine) {
                    this.removeChild(this.spine);
                }
                this.spine = Spine.from({
                    skeleton: t.skeleton,
                    atlas: t.atlas,
                });
                this.spine.scale.set(0.4, 0.4);
                this.spine.position.set(this.width * 0.5, this.height);
                this.addChild(this.spine)
                this.spine.visible = true;
                this.sprite.alpha = 0
            } catch (e) { }
        }
    }
}
