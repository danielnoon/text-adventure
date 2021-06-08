import { Group, Store } from "./Store";

export type CallUtilityFunction = (
  name: string,
  ...args: string[]
) => string | void;

type SignatureParameter =
  | "string"
  | "path"
  | "number"
  | "integer"
  | "boolean"
  | "group"
  | "any";

type UtilityParameter = string | number | boolean | Group;

export type UtilityFunction = (...params: UtilityParameter[]) => void | string;

export type UtilityFactory = ((
  store: Store,
  util: CallUtilityFunction
) => UtilityFunction) & {
  signatures?: SignatureParameter[][] | "any";
};

export type Utility = UtilityFactory;

export type Utilities = Map<
  string,
  [SignatureParameter[][] | "any", UtilityFunction]
>;
