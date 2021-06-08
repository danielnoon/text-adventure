import { Group, Store } from "../Store";

export function transformUtilityParameters(
  [sig, value]: [string, string],
  state: Store
): [success: boolean, value?: string | boolean | number | Group] {
  if (sig === "boolean" || sig === "any") {
    if (["true", "false"].includes(value)) {
      return [true, Boolean(value)];
    }
  }
  if (sig === "integer" || sig === "any") {
    if (Number.isInteger(Number(value))) {
      return [true, Number(value)];
    }
  }
  if (sig === "number" || sig === "any") {
    if (!Number.isNaN(Number(value))) {
      return [true, Number(value)];
    }
  }
  if (sig === "group") {
    if (["var/", "tmp/"].includes(value.substring(0, 4))) {
      const d = state.get(value);
      if (d && d instanceof Group) {
        return [true, d];
      }
    }
  }
  if (sig === "path" || sig === "any") {
    if (["var/", "tmp/"].includes(value.substring(0, 4))) {
      return [true, value];
    }
  }
  if (sig === "string" || sig === "any") {
    return [true, value];
  }
  return [false];
}
