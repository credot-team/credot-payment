import CryptoJS, { AES, SHA256 } from 'crypto-js';

import {
  CustomFieldsType,
  HtmlFormPostParams,
  OrderApplyResult,
  PaidOrder as IPaidOrder,
  PaidOrderParams,
} from '../PaidOrder';
import { CVSCOM_Types, PayMethods } from '../PayMethods';
import { Locales } from '../Locales';
import { PoweredBy } from './';
import { PaidOrderFields, TradeInfo } from './PaidOrderFields';
import { AcceptMethods, configuration } from './Configuration';

interface CustomFields extends CustomFieldsType {
  installment: TradeInfo['InstFlag'];
  locale: Locales.zh_TW | Locales.en_US | Locales.ja;
}

//===================================
// End of Types
//===================================

export class PaidOrder<EnableMethods extends AcceptMethods> extends IPaidOrder<
  AcceptMethods,
  CustomFields
> {
  private _tradeInfo: TradeInfo | undefined;
  private _apiParams: PaidOrderFields | undefined;

  /**
   *
   * @param payMethod
   * @param params 訂單資訊
   */
  constructor(
    payMethod: EnableMethods | EnableMethods[],
    params: PaidOrderParams<EnableMethods, CustomFields>,
  ) {
    super(payMethod, params);
    this.parseTradeInfo();
  }

  parseTradeInfo() {
    const payMethods = this.payMethod();
    const params = this.params;
    const env = configuration.getEnvParams();

    const langType: TradeInfo['LangType'] =
      params.locale === Locales.en_US ? 'en' : params.locale === Locales.ja ? 'jp' : 'zh-tw';

    const args: TradeInfo = {
      MerchantID: env.merchantId,
      LoginType: 0,
      Email: params.userEmail,
      MerchantOrderNo: params.orderNo,
      ItemDesc: params.orderInfo,
      Amt: params.amount,
      TimeStamp: (Date.now() / 1000).toFixed(0),
      TradeLimit: params.timeLimit,
      LangType: langType,
      EmailModify: params.userEmailModify ? 1 : 0,
      ReturnURL: params.returnUrl ?? env.returnUrl ?? undefined,
      NotifyURL: params.notifyUrl ?? env.notifyUrl ?? undefined,
      CustomerURL: undefined,
      ClientBackURL: params.backUrl,
      RespondType: 'JSON',
      Version: '1.6',

      CREDIT: payMethods.includes(PayMethods.Credit) ? 1 : 0,
      ANDROIDPAY: payMethods.includes(PayMethods.GooglePay) ? 1 : 0,
      SAMSUNGPAY: payMethods.includes(PayMethods.SamsungPay) ? 1 : 0,
      LINEPAY: payMethods.includes(PayMethods.LinePay) ? 1 : 0,
      CreditRed: payMethods.includes(PayMethods.CreditReward) ? 1 : 0,
      UNIONPAY: payMethods.includes(PayMethods.UnionPay) ? 1 : 0,
      WEBATM: payMethods.includes(PayMethods.WebATM) ? 1 : 0,
      VACC: payMethods.includes(PayMethods.VACC) ? 1 : 0,
      CVS: payMethods.includes(PayMethods.CVS) ? 1 : 0,
      BARCODE: payMethods.includes(PayMethods.CVSBarcode) ? 1 : 0,
      P2G: payMethods.includes(PayMethods.ezPay) ? 1 : 0,
      ESUNWALLET: payMethods.includes(PayMethods.EsunWallet) ? 1 : 0,
      TAIWANPAY: payMethods.includes(PayMethods.TaiwanPay) ? 1 : 0,
      CVSCOM: payMethods.includes(PayMethods.CVSCOM) ? 1 : 0,
    };

    for (const payMethod of payMethods) {
      switch (payMethod) {
        case PayMethods.LinePay:
          args.ImageUrl = params.linePay?.imageUrl;
          break;
        case PayMethods.CreditInst:
          args.InstFlag = params.installment;
          break;
        case PayMethods.CVSCOM:
          if (!params.cvscom) break;
          args.CVSCOM = (<Record<any, 1 | 2 | 3>>{
            [CVSCOM_Types.PickupAndPay]: 1,
            [CVSCOM_Types.PickupWithoutPay]: 2,
            [CVSCOM_Types.Both]: 3,
          })[params.cvscom.type];
          break;
      }
    }

    const encryptedTradeInfo = PaidOrder.encryptTradeInfo(args);
    this._apiParams = {
      TradeInfo: encryptedTradeInfo,
      TradeSha: PaidOrder.hashTradeInfo(encryptedTradeInfo),
      MerchantID: env.merchantId,
      Version: '1.6',
    };
    this._tradeInfo = args;
  }

  static encryptTradeInfo(tradeInfo: TradeInfo) {
    const env = configuration.getEnvParams();
    const params = new URLSearchParams();
    Object.entries(tradeInfo).forEach(
      ([k, v]) => v !== undefined && v !== null && params.set(k, v as any),
    );
    const qs = params.toString();
    return AES.encrypt(qs, CryptoJS.enc.Utf8.parse(env.hashKey), {
      iv: CryptoJS.enc.Utf8.parse(env.hashIV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.format.Hex);
  }

  static hashTradeInfo(tradeInfo: string) {
    const env = configuration.getEnvParams();
    return SHA256(`HashKey=${env.hashKey}&${tradeInfo}&HashIV=${env.hashIV}`)
      .toString()
      .toUpperCase();
  }

  poweredBy(): string {
    return PoweredBy;
  }

  checksum(): string {
    return this._apiParams!.TradeSha;
  }

  apply(): Promise<OrderApplyResult> {
    const env = configuration.getEnvParams();
    const data: HtmlFormPostParams = {
      properties: {
        method: 'post',
        url: env.paymentApiUrl,
      },
      data: this._apiParams!,
    };
    return Promise.resolve({ method: 'json', payload: data });
  }
}
