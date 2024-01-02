import React from "react";
import Board from "./canvas/Board.ts";

const CircleBoard: React.FC = () => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const board = React.useRef<Board>();

  React.useEffect(() => {
    board.current = new Board(canvas.current!);

    board.current.init();

    window.addEventListener("mousemove", (event) => {
      board.current!.setCursor(event.clientX, event.clientY);
    });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      Circle board
      <canvas className="flex-1" ref={canvas} />
    </div>
  );
};

export default CircleBoard;
