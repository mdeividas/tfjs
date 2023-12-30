import React from "react";

interface IProps {
  error: string;
}

export const ErrorView: React.FC<IProps> = (props) => (
  <>
    <div role="alert" className="mt-8">
      <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
        Something when wrong
      </div>
      <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
        <p>Error message: {props.error}</p>
        <p>
          Apologies for the inconvenience. Please try reloading the page, visit
          again later, or contact me for further assistance.
        </p>
        <div className="flex w-full justify-center items-center mt-4">
          <hr />
          <button
            onClick={() => window.location.reload()}
            className="bg-red-300 hover:bg-red-400 text-white font-semibold py-2 px-4 border border-red-200 rounded shadow"
          >
            Try to reload page
          </button>
        </div>
      </div>
    </div>
    <h3 className="text-3xl mt-8 mb-3 font-bold text-center uppercase">
      It might help you
    </h3>
    <div role="alert" className="mt-8">
      <div className="bg-blue-500 text-white font-bold rounded-t px-4 py-2">
        Make sure your camera is enabled.
      </div>
      <div className="border border-t-0 border-blue-400 rounded-b bg-blue-100 px-4 py-3 text-blue-700">
        <p>
          For this example, it is essential to have the camera enabled. &nbsp;
          <a
            className="link underline"
            target="_blank"
            href="https://help.vouchfor.com/en/articles/5950228-enabling-camera-on-your-browser"
          >
            Check for more details on how to enable it.
          </a>
        </p>
        <p>
          No luck? &nbsp;
          <a
            className="link underline"
            target="_blank"
            href="https://www.google.com/search?q=how+to+enable+camera+on+my+device&rlz=1C5CHFA_enES1051ES1051&oq=how+to+enable+camera+on+my+device&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQIRigATIHCAIQIRigATIHCAMQIRigATIKCAQQIRgWGB0YHjIKCAUQIRgWGB0YHtIBCTEwNTk3ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8"
          >
            Try google!
          </a>
        </p>
      </div>
    </div>
  </>
);
