import { compressToBase64, decompressFromBase64 } from "lz-string";
import { Observable } from "./Observable";
import { zip } from "./util/arr";

interface SavedStore {
  children: SavedStoreChild[];
}

interface SavedDirectoryChild {
  key: string;
  type: "group";
  value: {
    children: SavedStoreChild[];
  };
}

interface SavedEntryChild {
  key: string;
  type: "item";
  value: unknown;
}

type SavedStoreChild = SavedDirectoryChild | SavedEntryChild;

export class Group {
  private children = new Map<string, unknown>();

  constructor(public name: string) {}

  get<T = Group>(key: string) {
    return this.children.get(key) as T;
  }

  set<T>(key: string, value: T) {
    const current = this.children.get(key);
    if (current && current instanceof Group) {
      throw new Error("Key is a directory.");
    } else {
      this.children.set(key, value);
    }
  }

  mkdir(key: string) {
    const current = this.children.get(key);
    if (current && current instanceof Group) {
      throw new Error("Directory key provided already exists.");
    } else {
      const n = new Group(key);
      this.children.set(key, n);
      return n;
    }
  }

  del(key: string) {
    this.children.delete(key);
  }

  has(key: string) {
    return this.children.has(key);
  }

  toJSON() {
    return {
      children: Array.from(this.children.entries()).map(([key, value]) =>
        value instanceof Group
          ? {
              type: "group",
              key,
              value,
            }
          : {
              type: "item",
              key,
              value,
            }
      ),
    };
  }

  loadChildren(children: SavedStoreChild[]) {
    children.forEach((child) => {
      if (child.type === "group") {
        this.mkdir(child.key).loadChildren(child.value.children);
      } else {
        this.set(child.key, child.value);
      }
    });
  }

  [Symbol.iterator]() {
    return this.children.entries();
  }

  iterate<T = Group>() {
    return this.children.entries() as Iterable<[key: string, value: T]>;
  }
}

export class Store {
  private root = new Group("root");
  private observables = new Map<string, Observable<unknown>>();

  constructor() {
    this.root.mkdir("var");
    this.root.mkdir("tmp");
  }

  set<T>(path: string, value: T) {
    const segments = path.split("/");
    const entry = segments.pop() as string;

    const parent = segments.reduce(
      (prev, curr) => (prev.has(curr) ? prev.get(curr) : prev.mkdir(curr)),
      this.root
    );

    parent.set(entry, value);

    for (const [key, value] of this.observables.entries()) {
      if (key.length <= path.length) {
        const target = path.split("/");
        const observer = key.split("/");
        if (zip(target, observer).every(([a, b]) => a === b)) {
          const observable = value as Observable<T>;
          observable.publish(this.get(key) as T);
        }
      }
    }
  }

  get<T>(path: string) {
    const segments = path.split("/");
    const entry = segments.pop() as string;

    const parent = segments.reduce(
      (prev, curr) => (prev.has(curr) ? prev.get(curr) : prev.mkdir(curr)),
      this.root
    );

    return parent.get<T>(entry);
  }

  save() {
    return compressToBase64(JSON.stringify(this.root.get<Group>("var")));
  }

  load(data: string) {
    const obj = JSON.parse(decompressFromBase64(data)!) as SavedStore;
    this.root.get<Group>("var").loadChildren(obj.children);
  }

  getObservableFor<T>(path: string): Observable<T> {
    if (this.observables.has(path)) {
      return this.observables.get(path) as Observable<T>;
    } else {
      const observable = new Observable<T>();
      this.observables.set(path, observable as Observable<unknown>);
      return observable;
    }
  }

  debug() {
    return JSON.stringify(this.root.get<Group>("var"));
  }
}
