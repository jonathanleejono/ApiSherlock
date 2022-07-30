import "normalize.css";
import React from "react";
import ReactDOM from "react-dom";
import { worker } from "test/server/worker";
import App from "./App";
import AppProviders from "./app-context/app-providers";
import "./index.css";

if (process.env.NODE_ENV === "development") {
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
