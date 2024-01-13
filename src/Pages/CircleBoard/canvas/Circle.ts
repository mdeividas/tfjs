import { interpolate } from "../utils.ts";

interface IProps {
  x: number;
  y: number;
  radius: number;
  color: string[];
}

export default class Circle {
  #params: IProps;

  #context: CanvasRenderingContext2D;

  #active: boolean = false;

  #activatingProgress: number = 0;

  #activating: boolean = false;

  static DECELERATION = 0.7;

  static ACTIVATION_TIME = 500;

  constructor(props: IProps, context: CanvasRenderingContext2D) {
    this.#params = props;
    this.#context = context;
  }

  get active() {
    return this.#active;
  }

  setActive(flag: boolean) {
    this.#active = flag;

    this.#activatingProgress = 0;
    this.#activating = false;
  }

  startActivating() {
    if (!this.#activating) {
      this.#activatingProgress = 0;
      this.#activating = true;
    }
  }

  checkXColliding(x1: number, x2: number) {
    if (this.#params.x - this.#params.radius <= x1) {
      this.#params.x = x1 + this.#params.radius;
    }

    if (this.#params.x + this.#params.radius >= x2) {
      this.#params.x = x2 - this.#params.radius;
    }
  }

  checkYColliding(y1: number, y2: number) {
    if (this.#params.y - this.#params.radius <= y1) {
      this.#params.y = y1 + this.#params.radius;
    }

    if (this.#params.y + this.#params.radius >= y2) {
      this.#params.y = y2 - this.#params.radius;
    }
  }

  isCursorOverCircle(x: number, y: number) {
    const distance = Math.sqrt(
      Math.pow(this.#params.x - x, 2) + Math.pow(this.#params.y - y, 2),
    );

    return distance <= this.#params.radius;
  }

  update(x: number, y: number) {
    this.#params.x = x;
    this.#params.y = y;
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

    this.#context.fillStyle = this.#active
      ? this.#params.color[1]
      : this.#params.color[0];
    this.#context.fill();
    this.#context.closePath();

    if (this.#activating) {
      this.#activatingProgress += 1000 / 35;
      const progress = Math.min(
        interpolate(this.#activatingProgress, 0, Circle.ACTIVATION_TIME, 0, 1),
        1,
      );

      this.#context.beginPath();
      this.#context.arc(
        this.#params.x,
        this.#params.y,
        this.#params.radius,
        0,
        2 * Math.PI * progress,
      );

      this.#context.strokeStyle = this.#params.color[1];
      this.#context.lineWidth = 5;
      this.#context.stroke();

      if (progress === 1) {
        this.setActive(true);
      }
    }
  }

  getCoordinates() {
    return {
      x: this.#params.x,
      y: this.#params.y,
      radius: this.#params.radius,
    };
  }
}
