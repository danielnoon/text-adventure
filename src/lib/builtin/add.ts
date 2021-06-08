import { UtilityFactory } from "../utility-types";

const add: UtilityFactory = (state, util) => {
  return function (path, num) {
    const current = state.get<number>(path as string);
    if (typeof num === "number") {
      const update = current + num;
      state.set(path as string, update);
    } else {
      const n = state.get<number>(num as string);
      state.set(path as string, n + current);
    }
    return state.get<number>(path as string).toString();
  };
};

add.signatures = [
  ["path", "number"],
  ["path", "path"],
];

export default add;
