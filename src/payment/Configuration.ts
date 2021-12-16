export interface Configuration<T> {
  //設定環境參數
  setEnvParams(params: T): void;

  //取得環境參數
  getEnvParams(): T;
}
