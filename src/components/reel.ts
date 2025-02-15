import { BlurFilter, Container, Graphics } from 'pixi.js';
import { Tile } from './tile.ts';

export class Reel extends Container {
    private static readonly reelMaxSpeed: number = 50;
    private static readonly inTime: number = 30;
    private static readonly outTime: number = 30;
    private static readonly visibleTiles: number = 3;
    private static readonly totalTiles: number = 5;

    public id: number;
    public tiles: Tile[];

    private finalOrders = [1, 2, 3, 4, 5];
    private foi = 0;

    private realWidth: number;
    private realHeight: number;
    private tileHeight: number;
    private container: Container;
    private time: number = 0;
    private timeStop: number = 0;
    private spinning: boolean = false;
    private stopping: boolean = false;
    private finalizing: boolean = false;
    private blurFilter: BlurFilter;

    private finalOffset: number = 0;
    private finalPosition: number = 0;

    constructor(width: number, height: number, id: number) {
        super();

        this.realWidth = width;
        this.realHeight = height;
        this.tileHeight = height / Reel.visibleTiles; // 3 visible tiles
        this.id = id;

        // mask
        const rectMask = new Graphics();
        rectMask.rect(0, 0, width, height).fill(0);
        this.addChild(rectMask);

        this.container = new Container();
        this.container.mask = rectMask;
        this.addChild(this.container);

        this.tiles = [];
        for (let i = 0; i < Reel.totalTiles; i++) {
            const tile = new Tile(this.realWidth, this.tileHeight);
            tile.position.set(0, this.tileHeight * i - this.tileHeight);
            this.container.addChild(tile);
            this.tiles.push(tile);
        }

        // instantiates blur filter
        this.blurFilter = new BlurFilter(0, 1, window.devicePixelRatio);
        this.filters = [this.blurFilter];
    }

    public spin(orders: []): void {
        this.time = 0;
        this.spinning = true;

        // applies blur filter
        this.blurFilter.blurYFilter.strength = 0;
        this.filters = [this.blurFilter];
        
        this.foi = Reel.totalTiles;
        this.finalOrders = [0, 1, 2, 3, 4];
    }

    public stop(): void {
        this.finalizing = true;
    }

    public update(delta: number): void {
        if (!this.spinning) return;

        // update elapse time
        this.time += delta;

        // update tiles Y position
        const speed = this.getSpeed(delta);
        for (const tile of this.tiles) {
            tile.y += speed;
        }

        this.blurFilter.blurYFilter.strength = speed * 0.3;

        const limitY: number = this.realHeight + this.tileHeight;
        for (let i: number = this.tiles.length - 1; i >= 0; i--) {
            
            if (this.container.y + this.tiles[i].y > limitY) {
                this.tiles[i].y = this.container.children[0].y - this.tileHeight;
                this.container.addChildAt(this.tiles[i], 0);
                if (this.finalizing === true) {
                    // console.log(j)
                    this.tiles[i].swap(this.finalOrders[this.foi]);
                    // console.log(this.id, i, this.foi)
                    this.foi --;
                    if (this.foi === -1) {
                        this.finalizing = false;
                        this.stopping = true;
                        this.finalOffset = 1;
                        this.finalPosition = this.realHeight - this.tileHeight - this.container.children[0].y;
                        this.timeStop = this.time;
                    }
                } else if (!this.stopping) this.tiles[i].swap();
            }
        }
    }

    private getSpeed(delta: number): number {
        let speed = delta * Reel.reelMaxSpeed;
        if (this.stopping) {
            const n = 1 - (this.time - this.timeStop) / Reel.outTime;
            const r = this.easeInBack(n);
            speed = (this.finalOffset - r) * this.finalPosition;
            this.finalOffset = r;
            if (n <= 0) {
                this.onComplete();
            }
        } else if (this.time < Reel.inTime) {
            const n = this.time / Reel.inTime;
            speed *= this.easeInBack(n);
        }

        return speed;
    }

    private onComplete(): void {
        this.stopping = false;
        this.spinning = false;
        this.reorderTiles();
        // @ts-ignore
        this.emit('spincomplete', { target: this, id: this.id });

        // removes blur filter
        this.filters = [];

        console.log(this.tiles.map(t => t.id).join(", "))
    }

    private reorderTiles(): void {
        this.tiles.sort(this.compareTiles.bind(this));
    }

    private compareTiles(a: Tile, b: Tile): number {
        return this.container.getChildIndex(a) > this.container.getChildIndex(b) ? 1 : (this.container.getChildIndex(a) < this.container.getChildIndex(b) ? -1 : 1);
    }

    private easeInBack(n: number): number {
        const s = 1.70158;
        return n * n * ((s + 1) * n - s);
    }
}
