import Circle from "./Circle.ts";
import Cursor from "./Cursor.ts";

interface IAnimation {
  id: number;
  lastTime: number;
  timer: number;
}

export default class Board {
  #canvas: HTMLCanvasElement;

  #x: number;

  #y: number;

  #context: CanvasRenderingContext2D;

  #circle: Circle;

  #cursor: Cursor;

  #animation: IAnimation = {
    id: -1,
    lastTime: 0,
    timer: 0,
  };

  static FRAME_INTERVAL = 1000 / 60;

  constructor(canvas: HTMLCanvasElement) {
    const bounds = canvas.getBoundingClientRect();

    this.#canvas = canvas;

    this.#x = bounds.x;

    this.#y = bounds.y - bounds.top;

    this.#context = canvas.getContext("2d")!;

    this.#canvas.width = window.innerWidth;
    this.#canvas.height = window.innerHeight;
    this.#canvas.classList.add("border-neutral-300", "border-2");

    this.#circle = new Circle(
      { x: 40, y: 40, radius: 80, color: ["#a5f3fc", "#0891b2"] },
      this.#context,
    );

    this.#cursor = new Cursor(this.#context);
  }

  #draw() {
    this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

    this.#circle.checkXColliding(this.#x, this.#canvas.width);
    this.#circle.checkYColliding(this.#y, this.#canvas.height);
    this.#circle.draw();

    this.#cursor.draw();
  }

  #animate(timestamp = 0) {
    const deltaTime = timestamp - this.#animation.lastTime;

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
    if (isFist) {
      if (this.#circle.active) {
        this.#circle.update(x, y);
      } else if (this.#circle.isCursorOverCircle(x, y)) {
        this.#circle.startActivating();
      }
    } else {
      this.#circle.setActive(false);
    }
  }

  setCursor(x: number, y: number, isFist: boolean) {
    const nextX = x - this.#x;
    const nextY = y - this.#y;

    this.#cursor.update(nextX, nextY);

    this.#checkCursor(nextX, nextY, isFist);
  }

  init() {
    this.#animate();
  }

  destroy() {
    if (this.#animation.id) {
      cancelAnimationFrame(this.#animation.id);
    }
  }
}
