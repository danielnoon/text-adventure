import manager from "./manager";
import * as scenes from "../../scenes/module";

export default function init() {
  manager.setState("var/name", "Daniel");
  manager.addScenes(scenes);
  manager.loadScene("main");
}
