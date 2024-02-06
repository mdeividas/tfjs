import Circle from './Circle.ts';
import Cursor from './Cursor.ts';
import Obstacle from './Obstacle.ts';

interface IAnimation {
    id: number;
    lastTime: number;
    timer: number;
}

export default class Board {
    #canvas: HTMLCanvasElement;

    #x: number = 0;

    #y: number = 0;

    #context: CanvasRenderingContext2D | undefined;

    #circle: Circle | undefined;

    #cursor: Cursor | undefined;

    #obstacles: Obstacle[] | undefined;

    #animation: IAnimation = {
        id: -1,
        lastTime: 0,
        timer: 0,
    };

    #terminated: boolean = false;

    #onLost: (() => void) | undefined;

    #onWin: (() => void) | undefined;

    static FRAME_INTERVAL = 1000 / 60;

    constructor(canvas: HTMLCanvasElement) {
        this.#canvas = canvas;

        this.init();
    }

    set onLost(cb: () => void) {
        this.#onLost = cb;
    }

    set onWin(cb: () => void) {
        this.#onWin = cb;
    }

    #draw() {
        this.#context!.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

        this.#obstacles!.forEach((obstacle) => obstacle.dimensions.forEach(() => obstacle.draw()));

        this.#circle!.checkXColliding(this.#x, this.#canvas.width);
        this.#circle!.checkYColliding(this.#y, this.#canvas.height);
        this.#circle!.draw();

        this.#cursor!.draw();
    }

    #animate(timestamp = 0) {
        let overlap = false;
        const deltaTime = timestamp - this.#animation.lastTime;

        this.#obstacles!.forEach((obstacle) => {
            obstacle.dimensions.forEach((dimensions) => {
                overlap = this.#circle!.checkRectColliding(
                    dimensions.x,
                    dimensions.y,
                    dimensions.width,
                    dimensions.height,
                );

                if (overlap) {
                    this.#terminated = true;

                    if (this.#onLost) {
                        this.#onLost();
                        this.#draw();
                    }
                }
            });
        });

        if (this.#animation.timer > Board.FRAME_INTERVAL) {
            this.#draw();

            this.#animation.timer = 0;
        } else {
            this.#animation.timer += deltaTime;
        }

        this.#animation.lastTime = timestamp;
        this.#animation.id = requestAnimationFrame(this.#animate.bind(this));
    }

    #checkCursor(x: number, y: number, isFist: boolean) {
        const circle = this.#circle!;

        if (isFist) {
            if (circle.active) {
                circle.update(x, y);
                if (x >= this.#canvas.width - 200) {
                    if (this.#onWin) {
                        this.#onWin();
                    }
                }
            } else if (circle.isCursorOverCircle(x, y)) {
                circle.startActivating();
            }
        } else {
            circle.setActive(false);
        }
    }

    setCursor(x: number, y: number, isFist: boolean) {
        const nextX = x - this.#x;
        const nextY = y - this.#y;

        if (this.#terminated) {
            return;
        }

        this.#cursor!.update(nextX, nextY);

        this.#checkCursor(nextX, nextY, isFist);
    }

    init() {
        const bounds = this.#canvas.getBoundingClientRect();

        this.#x = bounds.x;

        this.#y = bounds.y - bounds.top;

        this.#context = this.#canvas.getContext('2d')!;

        this.#canvas.width = window.innerWidth;
        this.#canvas.height = window.innerHeight;
        this.#canvas.classList.add('border-neutral-300', 'border-2');

        this.#cursor = new Cursor(this.#context!);

        this.start();
    }

    start() {
        this.#terminated = false;

        this.#circle = new Circle(
            {
                x: 40,
                y: this.#canvas.height / 2,
                radius: 65,
                color: ['#a5f3fc', '#0891b2'],
            },
            this.#context!,
        );

        this.#obstacles = Array.from(
            {
                length: Math.floor((this.#canvas.width - 200) / 450),
            },
            (_: number, index: number) => (index + 1) * 400,
        ).map(
            (value) =>
                new Obstacle(
                    {
                        size: 60 * (2.2 + 0.2 * (Math.random() > 0.5 ? -1 : 1)),
                        x: value,
                        totalHeight: this.#canvas.height,
                    },
                    this.#context!,
                ),
        );

        if (this.#animation) {
            this.#animation.timer = 0;
            this.#animation.lastTime = 0;
        }

        this.#animate();
    }

    destroy() {
        if (this.#animation.id) {
            cancelAnimationFrame(this.#animation.id);
        }
    }
}
