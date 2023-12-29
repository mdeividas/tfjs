import React from "react";
import * as tf from "@tensorflow/tfjs";
import { loadModel } from "./tensorflow";
import Webcam from "./../../services/Camera.ts";
import { WIDTH, HEIGHT } from "./constants.ts";

export const RPS: React.FC = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const cameraRef = React.useRef<Webcam>(null);
  const model = React.useRef<tf.Sequential>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const handleWebCamera = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    cameraRef.current = new Webcam(videoRef.current!, WIDTH, HEIGHT);

    await cameraRef.current.setup();
  };

  const takeCapture = () => {
    const image = cameraRef.current!.capture();

    const prediction = model.current!.predict(image);

    prediction
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //   @ts-expect-error
      .softmax()
      .array()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //   @ts-expect-error
      .then((array) => {
        const probabilities = array[0]; // Since the output shape is [1, 3]
        const predictedClass = probabilities.indexOf(
          Math.max(...probabilities),
        );

        const classNames = ["rock", "paper", "scissors"];

        console.log(`Predicted class: ${classNames[predictedClass]}`);
      });
  };

  React.useEffect(() => {
    (async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      model.current = await loadModel();

      console.log(model.current!.outputs[0].shape);
    })();

    handleWebCamera();
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} />
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width={600}
        height={600}
      />
      <button onClick={takeCapture}>Capture</button>
    </div>
  );
};
