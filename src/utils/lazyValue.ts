const UNDEFINED = Symbol.for('UNDEFINED');

interface LazyValue<T> {
  (): T;
  drop(): void;
}

function lazyValue<T extends () => any>(this: any, initializer: T): LazyValue<ReturnType<T>> {
  let value: ReturnType<T> = UNDEFINED as any;
  const f = () => (value === UNDEFINED ? (value = initializer()) : value);
  f.drop = () => {
    value = UNDEFINED as any;
  };
  return f;
}

export default lazyValue;
