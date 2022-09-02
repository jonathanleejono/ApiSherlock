import App from "App";
import AppProviders from "app-context/app-providers";
import { cleanEnv, makeValidator } from "envalid";
import "index.css";
import "normalize.css";
import React from "react";
import ReactDOM from "react-dom";
import { worker } from "test/mocks/worker";

const { NODE_ENV, REACT_APP_MSW_DEV } = process.env;

if (NODE_ENV === "development" && REACT_APP_MSW_DEV === "on") {
  worker.start();
}

//throws error if env variable (value) is missing
const nonEmptyStr = makeValidator((x) => {
  if (!x) throw new Error("Value is empty");
});

//throws error if env variable (key) is missing
cleanEnv(process.env, {
  REACT_APP_YAHOO: nonEmptyStr(),
  REACT_APP_MONITOR_URL: nonEmptyStr(),
});

ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
  document.getElementById("root")
);
