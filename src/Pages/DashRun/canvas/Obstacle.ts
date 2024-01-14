interface IParams {
  size: number;
  x: number;
  totalHeight: number;
}

export default class Obstacle {
  #params: IParams;

  #context: CanvasRenderingContext2D;

  #passGate: number;

  #size: number;

  #dimensions: { x: number; y: number; width: number; height: number }[];

  static getPassGatePosition(min: number, max: number) {
    return Math.ceil(Math.random() * (max - min) + min);
  }

  constructor(props: IParams, context: CanvasRenderingContext2D) {
    this.#params = props;

    this.#context = context;

    this.#size = this.#params.size * 1.2;

    this.#passGate = Obstacle.getPassGatePosition(
      this.#size,
      this.#params.totalHeight - this.#size - this.#size,
    );

    const x = Math.round(this.#params.x - this.#params.size / 2);

    this.#dimensions = [
      { x, y: 0, width: this.#size, height: this.#passGate },
      {
        x,
        y: this.#passGate + this.#size * 1.8,
        width: this.#size,
        height: this.#params.totalHeight,
      },
    ];
  }

  get dimensions() {
    return this.#dimensions;
  }

  draw() {
    this.#context.beginPath();
    this.#context.lineWidth = 5;
    this.#context.strokeStyle = "#34d399";
    this.#context.fillStyle = "#6ee7b7";

    this.#dimensions.forEach((dimention) => {
      this.#context.rect(
        dimention.x,
        dimention.y,
        dimention.width,
        dimention.height,
      );
    });

    this.#context.stroke();
    this.#context.fill();
  }
}
