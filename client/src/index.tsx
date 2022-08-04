import "normalize.css";
import React from "react";
import ReactDOM from "react-dom";
import { worker } from "test/mocks/worker";
import App from "App";
import AppProviders from "app-context/app-providers";
import "index.css";

const { NODE_ENV, REACT_APP_MSW_DEV } = process.env;
if (NODE_ENV === "development" && REACT_APP_MSW_DEV === "on") {
  worker.start();
}

ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
  document.getElementById("root")
);
