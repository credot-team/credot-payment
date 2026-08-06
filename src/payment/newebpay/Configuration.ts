import { PayMethods } from '../PayMethods';

export type AcceptMethods =
  | PayMethods.Credit
  | PayMethods.CreditInst
  | PayMethods.CreditReward
  | PayMethods.ApplePay
  | PayMethods.GooglePay
  | PayMethods.SamsungPay
  | PayMethods.LinePay
  | PayMethods.UnionPay
  | PayMethods.WebATM
  | PayMethods.VACC
  | PayMethods.CVS
  | PayMethods.CVSBarcode
  | PayMethods.EsunWallet
  | PayMethods.TaiwanPay
  | PayMethods.CVSCOM
  | PayMethods.ezPay
  | PayMethods.ezPay_Wechat
  | PayMethods.ezPay_Alipay;

export interface NewebpayEnvironmentParameters {
  /**
   * 付款API host (MPG 幕前)
   */
  paymentApiUrl: string;

  /**
   * 信用卡幕後授權 API (NPA-B101 / NPA-B102)
   * 未設定時依 paymentApiUrl 自動推導
   */
  creditCardApiUrl?: string;

  /**
   * 查詢約定付款綁定狀態 API (NPA-B103)
   * 未設定時依 paymentApiUrl 自動推導
   */
  tokenQueryApiUrl?: string;

  /**
   * 解除約定付款綁定 API (NPA-B104)
   * 未設定時依 paymentApiUrl 自動推導
   */
  tokenUnbindApiUrl?: string;

  /**
   * 商家代號
   */
  merchantId: string;

  /**
   * 交易完成後通知地址
   */
  notifyUrl?: string;

  /**
   * 交易完成後前端導向地址
   */
  returnUrl?: string;

  /**
   * HashKey
   */
  hashKey: string;

  /**
   * HashIV
   */
  hashIV: string;
};

export type ResolvedNewebpayEnvironmentParameters = NewebpayEnvironmentParameters & {
  creditCardApiUrl: string;
  tokenQueryApiUrl: string;
  tokenUnbindApiUrl: string;
};

function resolveApiBase(paymentApiUrl: string): string {
  return paymentApiUrl.replace(/\/MPG\/mpg_gateway\/?$/i, '');
}

export function resolveEnv(
  params: NewebpayEnvironmentParameters,
): ResolvedNewebpayEnvironmentParameters {
  const base = resolveApiBase(params.paymentApiUrl);
  return {
    ...params,
    creditCardApiUrl: params.creditCardApiUrl ?? `${base}/API/CreditCard`,
    tokenQueryApiUrl: params.tokenQueryApiUrl ?? `${base}/API/TokenCard/query`,
    tokenUnbindApiUrl: params.tokenUnbindApiUrl ?? `${base}/API/TokenCard/unbinding`,
  };
}

let _env: NewebpayEnvironmentParameters | null = null;

export const configuration = {
  getEnvParams(): ResolvedNewebpayEnvironmentParameters {
    if (_env === null)
      throw new Error('Must set environment parameters before use payment functions');
    return resolveEnv(_env);
  },

  setEnvParams(params: NewebpayEnvironmentParameters): void {
    _env = params;
  },
};
