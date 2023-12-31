interface IProps {
  x: number;
  y: number;
  radius: number;
  color: string;
}

class Circle {
  #interval: number = 0;

  #params: IProps;

  #context: CanvasRenderingContext2D;

  #speedX: number = 0;

  #speedY: number = 0;

  #shouldMoveX: boolean = false;

  #shouldMoveY: boolean = false;

  static DECELERATION = 0.7;

  constructor(props: IProps, context: CanvasRenderingContext2D) {
    this.#params = props;
    this.#context = context;

    window.addEventListener("mousemove", (event) => {
      this.update(event.clientX, event.clientY);
    });
  }

  #moveX() {
    if (Math.abs(this.#speedX) < 0.3 || !this.#shouldMoveX) {
      this.#shouldMoveX = false;
      return;
    }

    this.#params.x += this.#speedX * -1;

    this.#speedX = this.#speedX * Circle.DECELERATION;
  }

  #moveY() {
    if (Math.abs(this.#speedY) < 0.3 || !this.#shouldMoveY) {
      this.#shouldMoveY = false;
      return;
    }

    this.#params.y += this.#speedY * -1;

    this.#speedY = this.#speedY * Circle.DECELERATION;
  }

  update(x: number, y: number) {
    this.#shouldMoveX = false;
    this.#shouldMoveY = false;

    this.#speedX = this.#params.x - x;
    this.#speedY = this.#params.y - y;

    this.#params.x = x;
    this.#params.y = y;

    window.clearTimeout(this.#interval);

    this.#interval = window.setTimeout(() => {
      this.#shouldMoveX = true;
      this.#shouldMoveY = true;
    }, 50);
  }

  draw() {
    this.#context.beginPath();
    this.#context.arc(
      this.#params.x,
      this.#params.y,
      this.#params.radius,
      0,
      2 * Math.PI,
    );
    this.#context.fillStyle = this.#params.color;
    this.#context.fill();

    this.#moveX();
    this.#moveY();
  }
}

interface IAnimation {
  id: number;
  lastTime: number;
  timer: number;
}

export default class Board {
  canvas: HTMLCanvasElement;

  context: CanvasRenderingContext2D;

  #circles: Circle[];

  #animation: IAnimation = {
    id: -1,
    lastTime: 0,
    timer: 0,
  };

  static FRAME_INTERVAL = 1000 / 60;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.context = canvas.getContext("2d")!;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.#circles = [
      new Circle({ x: 40, y: 40, radius: 150, color: "red" }, this.context),
    ];
  }

  #draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

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
