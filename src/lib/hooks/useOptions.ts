import { Manager } from "../Manager";
import useObserver from "./useObserver";

export default function useOptions(manager: Manager) {
  const observable = manager.watchOptions();
  const options = useObserver(observable, manager.currentOptions);

  const helpers = options.map((opt) => ({
    label: opt.label,
    active: opt.result,
    action: () => manager.call(opt.action),
  }));

  return helpers;
}
