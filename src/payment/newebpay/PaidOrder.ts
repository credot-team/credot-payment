import CryptoJS, { AES, SHA256 } from 'crypto-js';
import {
  CreateFunction,
  OrderApplyResult,
  PaidOrder as IPaidOrder,
  PaidOrderParams,
} from '../PaidOrder';
import { PayMethods } from '../PayMethods';
import { PaidOrderFields, PoweredBy } from './';
import { configuration } from './Configuration';

interface CustomFields {
  term: PaidOrderFields['TradeInfo']['InstFlag'];
}

export const create: CreateFunction<CustomFields> = (payMethod, params) => {
  return new PaidOrder<typeof payMethod>(payMethod, params);
};

export class PaidOrder<P extends PayMethods> extends IPaidOrder<P, CustomFields> {
  private readonly _payMethod: PayMethods;
  private readonly _term: CustomFields['term'];
  private readonly _orderNo: string;
  private readonly _orderInfo: string;
  private readonly _amount: number;
  private readonly _userName: string;
  private readonly _userPhone: string;
  private readonly _userEmail: string;
  private readonly _memo: string | null | undefined;
  private readonly _checksum: string;

  /**
   *
   * @param payMethod
   * @param params 訂單資訊
   */
  constructor(payMethod: P, params: PaidOrderParams<P, CustomFields>) {
    super(payMethod, params);
    this._payMethod = params.payMethod;
    this._term = params.term ?? undefined;
    this._orderNo = params.orderNo;
    this._orderInfo = params.orderInfo;
    this._amount = params.amount;
    this._userName = params.userName;
    this._userPhone = params.userPhone;
    this._userEmail = params.userEmail;
    this._memo = params.memo ?? '';

    this._checksum = '';
  }

  static encryptTradeInfo(tradeInfo: object) {
    const env = configuration.getEnvParams();
    const qs = new URLSearchParams(tradeInfo as any).toString();
    return AES.encrypt(qs, CryptoJS.enc.Utf8.parse(env.hashKey), {
      iv: CryptoJS.enc.Utf8.parse(env.hashIV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.format.Hex);
  }

  static decryptTradeInfo(tradeInfo: string) {
    const env = configuration.getEnvParams();
    const str = CryptoJS.enc.Hex.parse(tradeInfo);
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: str,
      padding: CryptoJS.pad.Pkcs7,
    });
    return AES.decrypt(cipherParams, CryptoJS.enc.Utf8.parse(env.hashKey), {
      iv: CryptoJS.enc.Utf8.parse(env.hashIV),
      mode: CryptoJS.mode.CBC,
    }).toString(CryptoJS.enc.Utf8);
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

  payMethod(): PayMethods {
    return this._payMethod;
  }

  orderNo(): string {
    return this._orderNo;
  }

  amount(): string {
    return this._amount.toString();
  }

  checksum(): string {
    return this._checksum;
  }

  apply(): Promise<OrderApplyResult> {
    return {} as any;
  }
}
