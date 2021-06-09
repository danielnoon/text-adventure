import React, { FC } from "react";
import useGameState from "../lib/hooks/useGameState";
import useOptions from "../lib/hooks/useOptions";
import manager from "./state/manager";

const App: FC = () => {
  const scene = useGameState("var/scene", manager);
  const options = useOptions(manager);

  return (
    <div>
      <h1>My Story</h1>
      <p>{scene}</p>
      {options.map((opt, i) => (
        <button onClick={opt.action} disabled={!opt.active} key={i}>
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default App;
