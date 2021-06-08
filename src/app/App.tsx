import React, { FC, useState, useEffect } from "react";
import manager from "./state/manager";
import useGameState from "./state/useGameState";

const App: FC = () => {
  const count = useGameState<number>("var/count", manager);

  function inc() {
    manager.setState("var/count", count + 1);
  }

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={inc}>Increment</button>
    </div>
  );
};

export default App;
