import { Configuration } from '../Configuration';
import { PayMethods } from '../PayMethods';

interface EsafeEnvironmentParameters {
  //付款API host
  paymentApiHost: string;

  //商家代號
  merchantId: { [key in PayMethods]: string };

  //交易密碼
  transPassword: string;

  //發票系統 API host
  invoiceApiHost: string;

  //發票系統帳號
  invoiceAccount: string;

  //發票系統密碼
  invoicePassword: string;
}

let _env: EsafeEnvironmentParameters | null = null;

export const configuration: Configuration<EsafeEnvironmentParameters> = {
  getEnvParams(): EsafeEnvironmentParameters {
    if (_env === null)
      throw new Error('Must set environment parameters before use payment functions');
    return _env;
  },

  setEnvParams(params: EsafeEnvironmentParameters): void {
    _env = params;
  },
};
