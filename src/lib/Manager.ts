import add from "./builtin/add";
import clone from "./builtin/clone";
import get from "./builtin/get";
import set from "./builtin/set";
import { Observable } from "./Observable";
import { SceneMetadata } from "./Scene";
import { Store, Group } from "./Store";
import { zip } from "./util/arr";
import { getMeta } from "./util/getFrontMatter";
import { Option } from "./Scene";
import { Utilities, UtilityFactory, UtilityFunction } from "./utility-types";
import { transformUtilityParameters } from "./util/utilParameters";

interface InterpOption extends Option {
  result: boolean;
}

export class Manager {
  private store = new Store();
  private utilities: Utilities = new Map();
  private options = new Observable<InterpOption[]>();
  private scenes = new Map<string, string>();
  public currentOptions: InterpOption[] = [];

  constructor() {
    this.registerUtility("set", set);
    this.registerUtility("get", get);
    this.registerUtility("clone", clone);
    this.registerUtility("add", add);
    this.registerUtility("lds", () => (scene) => {
      this.loadScene(scene.toString());
    });
  }

  state<T>(path: string): Observable<T> {
    return this.store.getObservableFor(path);
  }

  setState<T>(path: string, value: T) {
    this.store.set(path, value);
  }

  getState<T = Group>(path: string) {
    return this.store.get(path) as T;
  }

  save() {
    return this.store.save();
  }

  load(data: string) {
    this.store.load(data);
  }

  registerUtility(name: string, factory: UtilityFactory) {
    const f = factory(this.store, this.callUtility.bind(this));
    this.utilities.set(name, [factory.signatures ?? "any", f]);
  }

  call(command: string) {
    return this.callUtility(...(command.split(" ") as [string, ...string[]]));
  }

  watchOptions() {
    return this.options;
  }

  private callUtility(name: string, ...args: string[]) {
    const [signature, utility] = this.utilities.get(name) ?? [];
    if (!utility) {
      console.error(`Utility ${name} does not exist.`);
      return `{ ERROR: Utility ${name} does not exist. }`;
    }
    if (signature === "any") return utility(...args) ?? "";
    if (signature) {
      for (const s of signature) {
        const values = zip(s, args).map((d) =>
          transformUtilityParameters(d, this.store)
        );
        if (values.every(([success]) => success)) {
          return utility(...values.map(([, value]) => value!));
        }
      }
    }

    console.error(`
    Parameters for utility "${name}" invalid!

    Got parameters: ${args.join(", ")}.
    Expected parameters matching any of the following signatures:\n
    ${signature?.map((s) => s.join(", ")).join("\n")}`);

    return `{ ERROR: Parameters for utility "${name}" invalid! }`;
  }

  addScenes(scenes: { [name: string]: string }) {
    for (const name of Object.keys(scenes)) {
      this.scenes.set(name, scenes[name]);
    }
  }

  loadScene(scene: string) {
    try {
      const raw = this.scenes.get(scene);
      if (!raw) {
        throw new Error(
          `Scene ${scene} has not been loaded or does not exist.`
        );
      }
      const text = this.executeScene(raw);
      this.setState("var/scene", text);
    } catch (err) {
      this.setState(
        "var/scene",
        "There was an error loading the scene. Check the console for more information."
      );
      console.error(err);
    }
  }

  executeScene(sceneText: string) {
    const { meta, body } = getMeta<SceneMetadata>(sceneText);
    if (!meta) throw new Error("Metadata missing for scene.");

    // run before actions
    meta.state?.before?.forEach((command) =>
      this.callUtility(
        ...(command.trim().split(/\s+/g) as [string, ...string[]])
      )
    );

    // run and interpolate inline actions
    const changed = body.replace(/{{(.*?)}}/g, (command) =>
      (
        this.callUtility(
          ...(command
            .slice(2, command.length - 2)
            .trim()
            .split(/\s+/g) as [string, ...string[]])
        ) || ""
      ).toString()
    );

    // determine activation of options
    const interpOptions = (meta.options ?? []).map((opt) => ({
      ...opt,
      result: opt.if
        ? !!this.callUtility(...(opt.if.split(" ") as [string, ...string[]]))
        : true,
    }));

    // run after actions
    meta.state?.after?.forEach((command) =>
      this.callUtility(...(command.split(" ") as [string, ...string[]]))
    );

    // publish new options
    this.options.publish(interpOptions);
    this.currentOptions = interpOptions;

    // return interpolated scene
    return changed;
  }
}
