import { useEffect, useState } from "react";
import { Observable } from "../../lib/Observable";

export default function useObserver<T>(obs: Observable<T>, defaultValue?: T) {
  const [val, setVal] = useState<T>(defaultValue);

  useEffect(() => {
    const subscription = obs.subscribe((val) => setVal(val));

    return () => void subscription.unsubscribe();
  }, [obs]);

  return val;
}
