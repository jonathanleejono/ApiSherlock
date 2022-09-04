import App from "App";
import AppProviders from "app-context/app-providers";
import { cleanEnv, makeValidator, str } from "envalid";
import "index.css";
import "normalize.css";
import React from "react";
import ReactDOM from "react-dom";
import { worker } from "test/mocks/worker";

const { NODE_ENV, REACT_APP_MSW_DEV } = process.env;

if (NODE_ENV === "development" && REACT_APP_MSW_DEV === "on") {
  worker.start();
}

const validateStr = makeValidator((x) => {
  if (!x) throw new Error("Value is empty");
  else return str();
});

//throws error if env variable is missing
cleanEnv(process.env, {
  REACT_APP_SECRET_KEY: validateStr(),
  REACT_APP_MONITOR_URL: validateStr(),
});

ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
  document.getElementById("root")
);
