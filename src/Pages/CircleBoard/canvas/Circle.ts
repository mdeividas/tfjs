interface IProps {
  x: number;
  y: number;
  radius: number;
  color: string;
}

export default class Circle {
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

    if (props.x === 40) {
      window.addEventListener("mousemove", (event) => {
        this.update(event.clientX, event.clientY);
      });
    }
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

  #calculateDistance(x: number, y: number) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }

  #calculateMinCoordinate(
    x2: number,
    y: number,
    y2: number,
    r: number,
    r2: number,
  ) {
    const distanceSquared = Math.pow(r + r2, 2) - Math.pow(y - y2, 2);

    const root = Math.sqrt(distanceSquared);

    // Calculate the two possible solutions for x
    return [x2 + root, x2 - root];
  }

  checkXColliding(x1: number, x2: number) {
    if (this.#params.x - this.#params.radius <= x1) {
      this.#params.x = x1 + this.#params.radius;
      this.#speedX *= -1;
    }

    if (this.#params.x + this.#params.radius >= x2) {
      this.#params.x = x2 - this.#params.radius;
      this.#speedX *= -1;
    }
  }

  checkYColliding(y1: number, y2: number) {
    if (this.#params.y - this.#params.radius <= y1) {
      this.#params.y = y1 + this.#params.radius;
      this.#speedY *= -1;
    }

    if (this.#params.y + this.#params.radius >= y2) {
      this.#params.y = y2 - this.#params.radius;
      this.#speedY *= -1;
    }
  }

  checkColliding(x: number, y: number, radius: number) {
    const dx = this.#params.x - x;
    const dy = this.#params.y - y;
    const distance = this.#calculateDistance(dx, dy);
    const radiusSum = radius + this.#params.radius;

    if (distance <= radiusSum) {
      this.#speedX *= -1;
      this.#speedY *= -1;

      const newXs = this.#calculateMinCoordinate(
        x,
        this.#params.y,
        y,
        this.#params.radius,
        radius,
      );

      this.#params.x =
        this.#params.x < x ? Math.min(...newXs) : Math.max(...newXs);

      return {
        speedX: this.#speedX / 2,
        speedY: this.#speedY / 2,
      };
    }

    return null;
  }

  hit(speedX: number, speedY: number) {
    this.#shouldMoveX = true;
    this.#speedX = speedX;

    this.#shouldMoveY = true;
    this.#speedY = speedY;
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

  getCoordinates() {
    return {
      x: this.#params.x,
      y: this.#params.y,
      radius: this.#params.radius,
    };
  }
}
