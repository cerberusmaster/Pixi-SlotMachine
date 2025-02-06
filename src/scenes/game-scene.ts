
import { Circle, Graphics, Sprite, Text, TextStyle } from 'pixi.js';
import { Scene } from '../core/scene';
import { default as data } from './../data';
import { Machine } from '../components/machine';

const TEXT_STYLE = new TextStyle({
    fontSize: 36,
    fill: 0xffffff,
    stroke: 0x000000,
    align: 'center',
});

const NUMBER_FORMAT = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
});

export class GameScene extends Scene {
    private machine: Machine = new Machine(1340, 780, 5);

    private txtBalance: Text = new Text(TEXT_STYLE);
    private txtWin: Text = new Text(TEXT_STYLE);
    private txtBet: Text = new Text(TEXT_STYLE);

    private valBalance: number = 0;
    private valWin: number = 0;
    private valBet: number = 0;
    private btnSpin: Graphics = new Graphics();
    // private template: TextureSourceLike;

    public preload(): void {
    }

    public create(): void {
        const template = Sprite.from('template');
        template.alpha = 0.2;
        this.addChildAt(template, 0);

        this.machine = new Machine(1340, 780, 5);
        this.machine.position.set(350, 370);
        this.addChild(this.machine);

        // adds button spin
        this.btnSpin
            .circle(0, 0, 120)
            .fill({
                color: 0xaa0f0a,
                alpha: .5,
            });
        this.btnSpin.position.set(1880, 1000);
        //@ts-ignore
        this.btnSpin.interactive = true;
        //@ts-ignore
        this.btnSpin.buttonMode = true;
        //@ts-ignore
        this.btnSpin.on('pointerdown', () => {
            this.spin();
        });
        this.addChild(this.btnSpin);

        // adds balance value text
        this.txtBalance = new Text('990.50', TEXT_STYLE);
        this.txtBalance.anchor.set(0.5, 0.5);
        this.txtBalance.position.set(450, 1260);
        this.addChild(this.txtBalance);
        this.balance = 9000;

        // adds win value text
        this.txtWin = new Text('1.50', TEXT_STYLE);
        this.txtWin.anchor.set(0.5, 0.5);
        this.txtWin.position.set(704, 1260);
        this.addChild(this.txtWin);
        this.win = 0;

        // adds bet value text
        this.txtBet = new Text('2.50', TEXT_STYLE);
        this.txtBet.anchor.set(0.5, 0.5);
        this.txtBet.position.set(958, 1260);
        this.addChild(this.txtBet);
        this.bet = 0.1;
    }

    public update(deltaTime: number): void {
        if (this.machine) {
            this.machine.update(deltaTime);
        }
    }

    private spin(): void {
        this.machine.spinReels();
        this.balance -= this.bet;
    }

    private get balance(): number {
        return this.valBalance;
    }

    private set balance(value: number) {
        this.valBalance = value;
        this.txtBalance.text = NUMBER_FORMAT.format(this.valBalance);
    }

    private get win(): number {
        return this.valWin;
    }

    private set win(value: number) {
        this.valWin = value;
        this.txtWin.text = NUMBER_FORMAT.format(this.valWin);
    }

    private get bet(): number {
        return this.valBet;
    }

    private set bet(value: number) {
        this.valBet = value;
        this.txtBet.text = NUMBER_FORMAT.format(this.valBet);
    }
}
