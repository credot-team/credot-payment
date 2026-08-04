import dayjs from 'dayjs';
import axios from 'axios';

import { PaidResult as IPaidResult, PaidResultOptions } from '../../PaidResult';
import { PayMethods } from '../../PayMethods';
import { OrderStatus } from '../../OrderStatus';
import { PoweredBy } from '../';
import { PaidResult } from '../PaidResult';
import { PaidResultFields } from '../PaidResultFields';
import { parseErrorCode, parseErrorMessage } from '../ErrorCode';
import { AgreementOrderResult } from './Fields';

type RawAgreementResult = PaidResultFields<false, PayMethods.Credit>;

/**
 * 解析 NPA-F011 幕前約定付款回傳（NotifyURL / ReturnURL）
 */
export class AgreementResult extends IPaidResult<PayMethods.Credit, PaidResultFields<true, PayMethods.Credit>> {
  private readonly _result: AgreementOrderResult;
  private readonly _isValid: boolean;
  private readonly _isSucceed: boolean;
  private readonly _status: OrderStatus;
  private readonly _finishedAt: Date;

  constructor(result: RawAgreementResult, options?: PaidResultOptions<PayMethods.Credit>) {
    const tradeInfo: PaidResultFields<true, PayMethods.Credit>['TradeInfo'] = JSON.parse(
      PaidResult.decryptTradeInfo(result.TradeInfo),
    );
    super(
      { ...result, TradeInfo: tradeInfo },
      { payMethod: PayMethods.Credit, ...options },
    );

    this._isValid = result.TradeSha === PaidResult.hashTradeInfo(result.TradeInfo);
    this._result = tradeInfo.Result as AgreementOrderResult;
    this._status = parseErrorCode(tradeInfo.Status ?? '');
    this._isSucceed = this._status === OrderStatus.success;
    this._finishedAt =
      options?.finishedAt ??
      (this._result.PayTime ? dayjs(this._result.PayTime + '+08:00').toDate() : new Date());
  }

  poweredBy(): string {
    return PoweredBy;
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

  payInfo() {
    return {
      payerName: this._options.payerName ?? '',
      credit: {
        creditNo: `****-****-****-${this._result.Card4No ?? ''}`,
        method: '信用卡',
      },
    };
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

  /** 約定 Token，供後續 Pn 使用 */
  tokenValue(): string | undefined {
    return this._result.TokenValue;
  }

  /** Token 有效日期，格式 yyyy-mm-dd */
  tokenLife(): string | undefined {
    return this._result.TokenLife;
  }

  /** 信用卡快速結帳使用狀態 */
  tokenUseStatus(): 0 | 1 | 2 | 9 | undefined {
    return this._result.TokenUseStatus;
  }

  result(): AgreementOrderResult {
    return { ...this._result };
  }
}
