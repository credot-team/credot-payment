import { Configuration } from '../Configuration';

interface NewebpayEnvironmentParameters {
  //付款API host
  paymentApiHost: string;

  //商家代號
  merchantId: string;

  // HashKey
  hashKey: string;

  // HashIV
  hashIV: string;
}

let _env: NewebpayEnvironmentParameters | null = null;

export const configuration: Configuration<NewebpayEnvironmentParameters> = {
  getEnvParams(): NewebpayEnvironmentParameters {
    if (_env === null)
      throw new Error('Must set environment parameters before use payment functions');
    return _env;
  },

  setEnvParams(params: NewebpayEnvironmentParameters): void {
    _env = params;
  },
};
