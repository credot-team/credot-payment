import dayjs from 'dayjs';
import CryptoJS, { AES, SHA256 } from 'crypto-js';

import { PaidResult as IPaidResult, PaidResultOptions, PayInfo } from '../PaidResult';
import { PayMethods } from '../PayMethods';
import { OrderStatus } from '../OrderStatus';
import { StoreTypes } from '../StoreTypes';
import { PoweredBy } from './';
import { PaidResultFields } from './PaidResultFields';
import { parseErrorCode, parseErrorMessage } from './ErrorCode';
import { AcceptMethods, configuration, NewebpayEnvironmentParameters } from './Configuration';
import { CreditType, PaymentTypes } from './PaymentMethod';

type TradeResult<PayMethod extends PayMethods | unknown> = PaidResultFields<
  true,
  PayMethod
>['TradeInfo']['Result'];

export class PaidResult extends IPaidResult<
  AcceptMethods,
  PaidResultFields<true, unknown>,
  NewebpayEnvironmentParameters
> {
  poweredBy(): string {
    return PoweredBy;
  }

  private _payInfo: PayInfo | undefined;
  private readonly _result: TradeResult<unknown>;
  private readonly _isValid: boolean;
  private readonly _finishedAt: Date;
  private readonly _isSucceed: boolean;
  private readonly _status: OrderStatus;

  constructor(
    result: PaidResultFields<false, AcceptMethods>,
    options?: PaidResultOptions<AcceptMethods, NewebpayEnvironmentParameters>,
  ) {
    const env = options?.env ?? configuration.getEnvParams();
    const tradeInfo: PaidResultFields<true, unknown>['TradeInfo'] = JSON.parse(
      PaidResult.decryptTradeInfo(result.TradeInfo, env),
    );
    super(
      { ...result, TradeInfo: tradeInfo },
      { payMethod: options?.payMethod ?? (PaymentTypes[tradeInfo.Result.PaymentType] as any) },
    );

    this._isValid = result.TradeSha === PaidResult.hashTradeInfo(result.TradeInfo, env);
    this._result = tradeInfo.Result;
    this._finishedAt =
      options?.finishedAt ??
      (this._result.PayTime ? dayjs(this._result.PayTime + '+08:00').toDate() : new Date());
    this._status = parseErrorCode(this._rawData.TradeInfo.Status ?? '');
    this._isSucceed = this._status === OrderStatus.success;
    this.parse();
  }

  getEnvParams() {
    return this._options.env ?? configuration.getEnvParams();
  }

  parse() {
    const data = this.rawData();
    const unknownResult = data.TradeInfo.Result as unknown;
    const payInfo: PayInfo = {
      payerName: this._options.payerName ?? '',
    };
    let result;
    switch (this.payMethod()) {
      case PayMethods.CreditReward:
      case PayMethods.CreditInst:
      case PayMethods.SamsungPay:
      case PayMethods.GooglePay:
      case PayMethods.ApplePay:
      case PayMethods.UnionPay:
      case PayMethods.Credit:
        result = unknownResult as TradeResult<PayMethods.Credit>;
        payInfo.credit = {
          creditNo: `****-****-****-${result.Card4No ?? ''}`,
          method: CreditType[result.PaymentMethod] ?? '未知',
        };
        break;
      case PayMethods.WebATM:
      case PayMethods.VACC:
        result = unknownResult as TradeResult<PayMethods.VACC>;
        payInfo.atm = {
          bankCode: result.PayBankCode,
          account: `***......**${result.PayerAccount5Code}`,
        };
        break;
      case PayMethods.CVS:
        result = unknownResult as TradeResult<PayMethods.CVS>;
        payInfo.cvs = {
          type: 'code',
          codeNo: result.CodeNo,
          storeType: {
            1: StoreTypes.Seven,
            2: StoreTypes.Family,
            3: StoreTypes.OK,
            4: StoreTypes.HiLife,
          }[result.StoreType],
          storeID: result.StoreID,
        };
        break;
      case PayMethods.CVSBarcode:
        result = unknownResult as TradeResult<PayMethods.CVSBarcode>;
        payInfo.cvs = {
          type: 'barcode',
          storeType:
            {
              SEVEN: StoreTypes.Seven,
              FAMILY: StoreTypes.Family,
              OK: StoreTypes.OK,
              HILIFE: StoreTypes.HiLife,
            }[result.PayStore] ?? StoreTypes.UNKNOWN,
          barcode_1: result.Barcode_1,
          barcode_2: result.Barcode_2,
          barcode_3: result.Barcode_3,
        };
        break;
      case PayMethods.ezPay:
      case PayMethods.ezPay_Wechat:
      case PayMethods.ezPay_Alipay:
        result = unknownResult as TradeResult<PayMethods.ezPay>;
        payInfo.thirdParty = {
          paymentType: result.ChannelID,
          tradeNo: result.ChannelNo,
          amount: result.Amt,
        };
        break;
      case PayMethods.CVSCOM:
        result = unknownResult as TradeResult<PayMethods.CVSCOM>;
        payInfo.delivery = {
          name: result.CVSCOMName,
          phone: result.CVSCOMPhone,
          orderNo: result.LgsNo,
          payAtPickup: result.TradeType === 1,
          addressDescription: `${result.StoreType}:${result.StoreName}(${result.StoreCode})`,
          fullAddress: result.StoreAddr,
        };
        break;
    }
    this._payInfo = payInfo;
  }

  static decryptTradeInfo(tradeInfo: string, envParams: NewebpayEnvironmentParameters) {
    const str = CryptoJS.enc.Hex.parse(tradeInfo);
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: str,
      padding: CryptoJS.pad.Pkcs7,
    });
    return AES.decrypt(cipherParams, CryptoJS.enc.Utf8.parse(envParams.hashKey), {
      iv: CryptoJS.enc.Utf8.parse(envParams.hashIV),
      mode: CryptoJS.mode.CBC,
    }).toString(CryptoJS.enc.Utf8);
  }

  static hashTradeInfo(tradeInfo: string, envParams: NewebpayEnvironmentParameters) {
    return SHA256(`HashKey=${envParams.hashKey}&${tradeInfo}&HashIV=${envParams.hashIV}`)
      .toString()
      .toUpperCase();
  }

  merchantId(): string {
    return this._result.MerchantID;
  }

  merchantName(): string | undefined {
    return this._options.merchantName;
  }

  isPaid(): boolean {
    return this._isSucceed && this._result.PayTime !== undefined;
  }

  payInfo(): PayInfo {
    return this._payInfo!;
  }

  amount(): string {
    return this._result.Amt.toString();
  }

  finishedAt(): Date {
    return this._finishedAt;
  }

  status(): OrderStatus {
    return this._status;
  }

  isFromBrowser(): boolean {
    return this._options.isFromBrowser ?? false;
  }

  applyNo(): string {
    return this._result.TradeNo;
  }

  orderNo(): string {
    return this._result.MerchantOrderNo ?? '';
  }

  errorCode(): string | null {
    return this._rawData.Status ?? null;
  }

  errorMessage(): string | null {
    return parseErrorMessage(this._rawData.Status);
  }

  isValid(): boolean {
    return this._isValid;
  }

  successResponse(): string | undefined {
    return undefined;
  }
}
