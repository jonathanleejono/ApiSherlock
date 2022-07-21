import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import App from "./App";
import AppProviders from "./app-context/app-providers";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
  document.getElementById("root")
);
