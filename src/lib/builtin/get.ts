import { UtilityFactory } from "../utility-types";

const get: UtilityFactory = (state) => {
  return function (path) {
    return state.get<string>(path as string).toString();
  };
};

get.signatures = [["path"]];

export default get;
