import React from "react";
import { Provider } from "mobx-react";
import { store } from "./store";
import { RPS } from "./RPS";

export const RpsPage: React.FC = () => (
  <Provider store={store}>
    <RPS store={store} />
  </Provider>
);
