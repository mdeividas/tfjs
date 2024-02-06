import React from "react";
import { HowToPlay } from "../Modals";

interface IProps {
  onClick(): void;
  text: string;
  htpLink: string;
}

export const IntroView: React.FC<IProps> = (props) => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div className="flex flex-col gap-8 justify-center items-center mt-2 mb-8 ">
      <p className="text-slate-700 text-justify w-full md:w-2/3">
        {props.text}
      </p>

      <button
        onClick={props.onClick}
        className="text-3xl mt-8 mb-3 font-bold text-center uppercase"
      >
        Try now! ⬇️
      </button>

      {!!props.htpLink && (
        <a
          onClick={() => setShowModal(true)}
          className="font-medium text-blue-600 dark:text-blue-500 underline"
        >
          Click here to see how to play!
        </a>
      )}

      {showModal && (
        <HowToPlay url={props.htpLink} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};
