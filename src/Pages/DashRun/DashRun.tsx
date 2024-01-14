import React from "react";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs-backend-webgl";

import Board from "./canvas/Board.ts";
import Webcam from "../../services/Camera.ts";
import {
  createKeyMap,
  getHandPoseEstimationsDistances,
  interpolate,
  KMeansCentroidsSearch,
} from "./utils.ts";

let camera: Webcam;
const model = handPoseDetection.SupportedModels.MediaPipeHands;

let detector: handPoseDetection.HandDetector;

const DashRun: React.FC = () => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const board = React.useRef<Board>();
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handleWebCamera = async () => {
    camera = new Webcam(videoRef.current!, 640, 480);

    await camera.setup();
  };

  const onFinish = () => {
    onStart();
  };

  const onLost = () => {
    if (confirm("You touched the wall! Play again?")) {
      onStart();
    }
  };

  const onStart = () => {
    board.current!.start();
  };

  const handleDetection = async (): Promise<void> => {
    const hands = await detector.estimateHands(videoRef.current!);

    if (hands.length) {
      const data = createKeyMap(hands[0].keypoints);
      const points = getHandPoseEstimationsDistances(data);
      const category = KMeansCentroidsSearch(points);

      board.current!.setCursor(
        interpolate(data.wrist.x, 0, 300, window.innerWidth, 0),
        interpolate(data.wrist.y, 0, 240, 0, window.innerHeight),
        category === 0, // indicates that the hand pose is fist
      );
    }

    return handleDetection();
  };

  React.useEffect(() => {
    board.current = new Board(canvas.current!);

    board.current.init();

    board.current.onLost = onLost;
    board.current.onWin = onFinish;

    (async () => {
      detector = await handPoseDetection.createDetector(model, {
        runtime: "tfjs", // 'mediapipe',
        modelType: "full",
        // maxHands: 1,
      });

      await handleWebCamera();

      await handleDetection();
    })();
  }, []);

  React.useEffect(() => {}, []);

  return (
    <div className="flex flex-col gap-8">
      Circle board
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="rounded-md absolute right-0 bottom-0"
        width={340}
        height={240}
      />
      <canvas className="flex-1" ref={canvas} />
    </div>
  );
};

export default DashRun;
