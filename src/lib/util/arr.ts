export function arr<T>(iterable: Iterable<T>): T[] {
  return Array.from(iterable);
}

export function zip<T, V>(a: Iterable<T>, b: Iterable<V>): [T, V][] {
  const z: [T, V][] = [];

  const iterator_a = a[Symbol.iterator]();
  const iterator_b = b[Symbol.iterator]();

  let ca = iterator_a.next();
  let cb = iterator_b.next();

  while (!ca.done && !cb.done) {
    z.push([ca.value, cb.value]);

    ca = iterator_a.next();
    cb = iterator_b.next();
  }

  return z;
}
