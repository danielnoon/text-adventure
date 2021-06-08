import { UtilityFactory } from "../utility-types";

const set: UtilityFactory = (store) => {
  return function (location, value) {
    store.set(location as string, value);
  };
};

set.signatures = [["path", "any"]];

export default set;
