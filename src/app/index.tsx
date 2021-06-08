import React from "react";
import { render } from "react-dom";
import App from "./App";
import initState from "./state/init";

initState();

render(<App />, document.getElementById("root"));
