import { arr } from "./util/arr";

type ObserverCallback<T> = (value: T) => void;

export class Observable<T> {
  private subscriptionCounter = 0;
  private subscriptions = new Map<number, ObserverCallback<T>>();

  constructor() {}

  private unsubscribe(id: number) {
    this.subscriptions.delete(id);
  }

  subscribe(callback: ObserverCallback<T>): Subscription {
    const id = this.subscriptionCounter;
    this.subscriptionCounter += 1;

    const subscription = new Subscription(id, this.unsubscribe.bind(this));
    this.subscriptions.set(id, callback);

    return subscription;
  }

  publish(value: T): void {
    arr(this.subscriptions.values()).forEach((s) => s(value));
  }
}

export class Subscription {
  constructor(private id: number, private unsub: (id: number) => void) {}

  unsubscribe(): void {
    this.unsub(this.id);
  }
}
