import Circle from "./Circle.ts";

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

  #circles: Circle[];

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
    this.#canvas.style.background = "black";

    this.#circles = [
      new Circle({ x: 40, y: 40, radius: 150, color: "red" }, this.#context),
      new Circle({ x: 600, y: 800, radius: 150, color: "blue" }, this.#context),
    ];
  }

  #draw() {
    this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

    this.#circles.forEach((circle, index) => {
      this.#circles.filter((childCircle, childIndex) => {
        if (index !== childIndex) {
          const { x, y, radius } = childCircle.getCoordinates();

          const speeds = circle.checkColliding(x, y, radius);

          if (speeds) {
            childCircle.hit(speeds.speedX, speeds.speedY);
          }

          circle.checkXColliding(this.#x, this.#canvas.width);
          circle.checkYColliding(this.#y, this.#canvas.height);
        }
      });
    });

    this.#circles.forEach((circle) => circle.draw());
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

  init() {
    this.#animate();
  }

  destroy() {
    if (this.#animation.id) {
      cancelAnimationFrame(this.#animation.id);
    }
  }
}
