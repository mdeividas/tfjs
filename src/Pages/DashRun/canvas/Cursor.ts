export default class Cursor {
  #context: CanvasRenderingContext2D;

  #x: number = -1;

  #y: number = -1;

  constructor(context: CanvasRenderingContext2D) {
    this.#context = context;
  }

  get coordinates() {
    return { x: this.#x, y: this.#y };
  }

  draw() {
    this.#context.beginPath();

    this.#context.arc(this.#x, this.#y, 15, 0, 2 * Math.PI);

    this.#context.strokeStyle = "#e11d48";
    this.#context.lineWidth = 2;
    this.#context.stroke();

    this.#context.fillStyle = "#fda4af";
    this.#context.fill();
  }

  update(x: number, y: number) {
    this.#x = x;
    this.#y = y;
  }
}
