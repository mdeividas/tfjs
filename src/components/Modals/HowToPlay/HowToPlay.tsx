import React from "react";
import { Modal } from "./../Common/Modal.tsx";
import { IModal } from "../interface.ts";

interface IProps extends IModal {
  url: string;
}

export const HowToPlay: React.FC<IProps> = (props) => {
  return (
    <Modal onClose={props.onClose} title="How to play">
      <iframe
        width="560"
        height="315"
        src={props.url}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
      <hr className="mt-2 mb-2 text-center" />
      <div className="flex justify-center">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 text-2xl rounded shadow"
          onClick={props.onClose}
        >
          Got it!
        </button>
      </div>
    </Modal>
  );
};
