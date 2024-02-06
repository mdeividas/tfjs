import React from "react";

interface IProps {
  onClose(): void;
  title?: string;
}

export const Modal: React.FC<React.PropsWithChildren<IProps>> = (props) => {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      onClick={(event) => {
        if (!ref.current!.contains(event.target as unknown as Node)) {
          props.onClose();
        }
      }}
    >
      <div
        ref={ref}
        className="relative top-20 mx-auto p-5 border max-w-[600px] w-full shadow-lg rounded-md bg-white"
      >
        {props.title && (
          <div className="flex flex-col mb-2">
            <h3 className="text-2xl font-bold text-center uppercase">
              {props.title}
            </h3>
            <hr />
          </div>
        )}
        {props.children}
      </div>
    </div>
  );
};
