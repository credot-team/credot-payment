interface LazyValue<T> {
    (): T;
    drop(): void;
}
declare function lazyValue<T extends () => any>(this: any, initializer: T): LazyValue<ReturnType<T>>;
export default lazyValue;
