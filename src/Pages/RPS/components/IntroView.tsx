import React from "react";

interface IProps {
  onClick(): void;
}

export const IntroView: React.FC<IProps> = (props) => (
  <div className="flex flex-col gap-8 justify-center items-center mt-2 mb-8 ">
    <p className="text-slate-700 text-justify w-full md:w-2/3">
      The project showcases the implementation of a TensorFlow model using
      TensorFlow.js. It involves using TensorFlow to train the model, with
      transfer learning techniques applied from MobileNetV2 using a custom
      dataset. After training, the model, originally in Keras format, was
      converted to JSON for compatibility with TensorFlow.js. This conversion
      enables the use of the model in web environments, facilitating predictions
      directly in the browser using TensorFlow.js.
    </p>

    <button
      onClick={props.onClick}
      className="text-3xl mt-8 mb-3 font-bold text-center uppercase"
    >
      Try now! ⬇️
    </button>
  </div>
);
