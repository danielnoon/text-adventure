import { Group, Store } from "../Store";
import { UtilityFactory } from "../utility-types";

function setGroup(state: Store, group: Group, path: string) {
  for (const [name, item] of group) {
    const p1 = `${path}/${name}`;
    if (item instanceof Group) {
      setGroup(state, item, p1);
    } else {
      state.set(p1, item);
    }
  }
}

const clone: UtilityFactory = (state) => {
  return function (from, to) {
    const source = state.get<Group | unknown>(from as string);
    if (source instanceof Group) {
      setGroup(state, source, to as string);
    } else {
      state.set(to as string, source);
    }
  };
};

clone.signatures = [["path", "path"]];

export default clone;
