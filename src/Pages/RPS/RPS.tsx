import React from "react";
import * as tf from "@tensorflow/tfjs";
import { loadModel } from "./tensorflow";
import Webcam from "./../../services/Camera.ts";
import { WIDTH, HEIGHT } from "./constants.ts";

export const RPS: React.FC = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const cameraRef = React.useRef<Webcam>(null);
  const model = React.useRef<tf.Sequential>(null);
  const [result, setResult] = React.useState("");

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

        setResult(["rock", "paper", "scissors"][predictedClass]);
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
    <div className="flex flex-col mx-auto max-w-screen-xl">
      <h1 className="text-3xl font-bold">Rock Paper Scissors</h1>
      <div className="relative flex flex-col md:flex-row justify-center items-center gap-28">
        <div className="w-full flex items-center justify-center p-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="rounded-md"
            width={window.innerWidth}
            height={window.innerHeight}
          />
          <h1>{result}</h1>
        </div>
        <div className="absolute w-full md:w-[100] p-4 md:p-0">
          <button onClick={takeCapture}>Capture</button>
        </div>
        <div className="relative md:absolute right-4 bottom-4 w-full md:w-1/4 p-4 md:p-0 bg-red-300 rounded-md">
          Content
        </div>
      </div>
    </div>
  );
};
