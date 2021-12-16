export interface Configuration<T> {
    setEnvParams(params: T): void;
    getEnvParams(): T;
}
