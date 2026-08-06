import CryptoJS, { AES, SHA256 } from 'crypto-js';

import {
  HtmlFormPostParams,
  OrderApplyResult,
  PaidOrderOptions,
  PaidOrderParams,
} from '../../PaidOrder';
import { Locales } from '../../Locales';
import { configuration, NewebpayEnvironmentParameters } from '../Configuration';
import { PoweredBy } from '../';
import { AgreementOrderTradeInfo } from './Fields';

const API_VERSION = '2.3';

export type AgreementOrderApiParams = {
  MerchantID: string;
  TradeInfo: string;
  TradeSha: string;
  Version: typeof API_VERSION;
  EncryptType?: 0 | 1;
};

export type AgreementOrderParams = Omit<
  PaidOrderParams<never, { locale?: Locales }>,
  'userName' | 'userPhone' | 'memo' | 'installment' | 'linePay' | 'cvscom'
> & {
  /** 付款人綁定識別，例：會員編號、Email */
  tokenTerm: string;
  /** Token 有效日期，格式 yymm，例 1912 */
  tokenLife?: string;
  /** 約定事項，將顯示於 MPG 頁面 */
  orderComment?: string;
  /** 使用情境：0=WEB, 1=APP, 2=定期定額 */
  useFor?: 0 | 1 | 2;
  /** 3D 交易：1=啟用 */
  p3d?: '0' | '1';
  /** 信用卡分期，例 '3,6,12' */
  instFlag?: string;
  /** 啟用美國運通卡 */
  creditAeAgreement?: 0 | 1;
  /** 手機驗證方式（UseFor=1 時） */
  mobileVerify?: 0 | 1 | 2;
  /** 付款人電話號碼 */
  mobileNumber?: string;
  /** 付款人電話是否可修改 */
  mobileNumberModify?: 0 | 1;
};

/**
 * 4.1 首次約定付款(P1) - 幕前情境 [NPA-F011]
 */
export class AgreementOrder {
  private readonly _params: AgreementOrderParams;
  private readonly _options: PaidOrderOptions<NewebpayEnvironmentParameters>;
  private readonly _tradeInfo: AgreementOrderTradeInfo;
  private readonly _apiParams: AgreementOrderApiParams;

  constructor(
    params: AgreementOrderParams,
    options?: PaidOrderOptions<NewebpayEnvironmentParameters>,
  ) {
    this._params = { ...params };
    this._options = options ?? {};
    this._tradeInfo = this.buildTradeInfo();
    const env = this.getEnvParams();
    const encryptedTradeInfo = AgreementOrder.encryptTradeInfo(this._tradeInfo, env);
    this._apiParams = {
      TradeInfo: encryptedTradeInfo,
      TradeSha: AgreementOrder.hashTradeInfo(encryptedTradeInfo, env),
      MerchantID: env.merchantId,
      Version: API_VERSION,
    };
  }

  getEnvParams() {
    return this._options.env ?? configuration.getEnvParams();
  }

  private buildTradeInfo(): AgreementOrderTradeInfo {
    const env = this.getEnvParams();
    const params = this._params;
    const langType: AgreementOrderTradeInfo['LangType'] =
      params.locale === Locales.en_US ? 'en' : params.locale === Locales.ja ? 'jp' : 'zh-tw';

    return {
      MerchantID: env.merchantId,
      RespondType: 'JSON',
      TimeStamp: (Date.now() / 1000).toFixed(0),
      Version: API_VERSION,
      P3D: params.p3d,
      LangType: langType,
      MerchantOrderNo: params.orderNo,
      Amt: params.amount,
      ItemDesc: params.orderInfo,
      ReturnURL: params.returnUrl ?? env.returnUrl,
      NotifyURL: params.notifyUrl ?? env.notifyUrl,
      ClientBackURL: params.backUrl,
      Email: params.userEmail,
      EmailModify: params.userEmailModify === false ? 0 : params.userEmailModify ? 1 : undefined,
      CREDITAEAGREEMENT: params.creditAeAgreement,
      InstFlag: params.instFlag,
      OrderComment: params.orderComment,
      CREDITAGREEMENT: 1,
      CREDIT: 1,
      TokenTerm: params.tokenTerm,
      TokenLife: params.tokenLife,
      UseFor: params.useFor,
      MobileVerify: params.mobileVerify,
      MobileNumber: params.mobileNumber,
      MobileNumberModify: params.mobileNumberModify,
    };
  }

  static encryptTradeInfo(
    tradeInfo: AgreementOrderTradeInfo,
    envParams: NewebpayEnvironmentParameters,
  ): string {
    const params = new URLSearchParams();
    Object.entries(tradeInfo).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        params.set(k, String(v));
      }
    });
    const qs = params.toString();
    return AES.encrypt(qs, CryptoJS.enc.Utf8.parse(envParams.hashKey), {
      iv: CryptoJS.enc.Utf8.parse(envParams.hashIV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.format.Hex);
  }

  static hashTradeInfo(tradeInfo: string, envParams: NewebpayEnvironmentParameters): string {
    return SHA256(`HashKey=${envParams.hashKey}&${tradeInfo}&HashIV=${envParams.hashIV}`)
      .toString()
      .toUpperCase();
  }

  poweredBy(): string {
    return PoweredBy;
  }

  orderNo(): string {
    return this._params.orderNo;
  }

  amount(): number {
    return this._params.amount;
  }

  tokenTerm(): string {
    return this._params.tokenTerm;
  }

  tradeInfo(): AgreementOrderTradeInfo {
    return { ...this._tradeInfo };
  }

  checksum(): string {
    return this._apiParams.TradeSha;
  }

  apply(): Promise<OrderApplyResult> {
    const env = this.getEnvParams();
    const data: HtmlFormPostParams = {
      properties: {
        method: 'post',
        url: env.paymentApiUrl,
      },
      data: this._apiParams,
    };
    return Promise.resolve({ method: 'json', payload: data });
  }
}
