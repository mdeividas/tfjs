import React from "react";
import { Blocks } from "react-loader-spinner";

export const Loader: React.FC = () => (
  <div className="absolute top-0 left-0 right-0 bottom-0 bg-zinc-50 bg-opacity-55 flex items-center justify-center">
    <Blocks height="300" width="300" visible={true} />
  </div>
);
