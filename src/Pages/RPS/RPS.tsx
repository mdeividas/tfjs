import React from "react";
import * as tf from "@tensorflow/tfjs";
import { observer, Provider } from "mobx-react";
import { loadModel } from "./tensorflow";
import Camera from "./../../services/Camera";
import { GeneralErrorView } from "../../components/GeneralErrorView";
import { Loader } from "../../components/Loader";
import { PlayView } from "./components/PlayView";
import { ResultView } from "./components/ResultView.tsx";
import { IntroView } from "../../components/IntroView";
import { CATEGORIES, EMOJI_BY_CATEGORIES, HEIGHT, WIDTH } from "./constants";
import { store, Store } from "./store";

let camera: Camera;
let model: tf.LayersModel;

interface IProps {
  store: Store;
}

const RPS = observer((props: IProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handleWebCamera = async () => {
    camera = new Camera(videoRef.current!, WIDTH, HEIGHT);

    await camera.setup();
  };

  const takeCapture = () => {
    const image = camera.capture();

    const prediction = model.predict(image);

    (prediction as tf.Tensor<tf.Rank>)
      .softmax()
      .array()
      .then((array) => {
        const probabilities = (array as number[][])[0]; // Since the output shape is [1, 3]

        const predictedClass = probabilities.indexOf(
          Math.max(...probabilities),
        );

        props.store.setResult(predictedClass);
      });
  };

  React.useEffect(() => {
    (async () => {
      try {
        model = await loadModel();

        await handleWebCamera();

        props.store.setReady();
      } catch (error) {
        props.store.setError(error);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col mx-auto max-w-screen-xl p-4">
      <h1 className="text-5xl mt-8 font-bold text-center uppercase">
        {CATEGORIES.join(" ")}
      </h1>
      <h2 className="text-center text-6xl mt-8 mb-8">
        {CATEGORIES.map((category) => EMOJI_BY_CATEGORIES[category])}
      </h2>

      {!props.store.error && (
        <>
          <IntroView
            onClick={() =>
              videoRef.current!.scrollIntoView({ behavior: "smooth" })
            }
            text="The project showcases the implementation of a TensorFlow model using
                  TensorFlow.js. It involves using TensorFlow to train the model, with
                  transfer learning techniques applied from MobileNetV2 using a custom
                  dataset. After training, the model, originally in Keras format, was
                  converted to JSON for compatibility with TensorFlow.js. This conversion
                  enables the use of the model in web environments, facilitating predictions
                  directly in the browser using TensorFlow.js."
            htpLink="https://www.youtube.com/embed/xPoNhrZ36k4?si=O6MzqJGjqxRP-oDY"
          />
          <div className="relative flex flex-col md:flex-row justify-center items-center">
            <div className="w-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="rounded-md"
                width={window.innerWidth}
                height={window.innerHeight}
              />
            </div>
            {props.store.isReady ? (
              <>
                {props.store.result.player !== null && (
                  <div className="relative md:absolute flex flex-row justify-around items-center bottom-[100] pt-4 md:pt-0 w-full">
                    <ResultView
                      result={props.store.result.player}
                      title="You"
                    />
                    <ResultView result={props.store.result.ai!} title="AI" />
                  </div>
                )}
                <div className="relateive shadow-2xl md:shadow-none mt-4 md:mt-0 md:absolute bg-white md:bg-transparent flex justify-center items-center bottom-4 w-full md:w-[100] p-4 md:p-0">
                  <PlayView onFinish={takeCapture} />
                </div>
              </>
            ) : (
              <Loader />
            )}
          </div>
        </>
      )}
      {!!props.store.error && <GeneralErrorView error={props.store.error} />}
    </div>
  );
});

const RpsPage = () => (
  <Provider store={store}>
    <RPS store={store} />
  </Provider>
);

export default RpsPage;
