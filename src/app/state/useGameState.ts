import { Manager } from "../../lib/Manager";
import useObserver from "./useObserver";

export default function useGameState<T>(path: string, manager: Manager) {
  const value = useObserver<T>(manager.state(path), manager.getState(path));

  return value;
}
