import sha1 from 'crypto-js/sha1';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { PaidResult as IPaidResult, PaidResultOptions, PayInfo } from '../PaidResult';
import { PayMethods } from '../PayMethods';
import { OrderStatus } from '../OrderStatus';
import { PaidResultFields } from './PaidResultFields';
import { PoweredBy } from './';
import { parseErrorCode } from './ErrorCode';
import { AcceptMethods, configuration } from './Configuration';

dayjs.extend(customParseFormat);

export class PaidResult extends IPaidResult<AcceptMethods, PaidResultFields> {
  poweredBy(): string {
    return PoweredBy;
  }

  private readonly _finishedAt: Date;
  private readonly _isSucceed: boolean;
  private readonly _status: OrderStatus;

  constructor(result: PaidResultFields, options: PaidResultOptions<AcceptMethods>) {
    if (!options?.payMethod)
      throw new Error(`options.payMethod should be provided for ${PoweredBy} result`);

    super(result, { payMethod: options.payMethod });
    if (this.isFromBrowser()) {
      const data = this._rawData as any;
      for (const key of ['webname', 'Name', 'note1', 'note2', 'errmsg', 'StoreName', 'StoreMsg']) {
        if (data[key]) data[key] = decodeURIComponent(data[key]);
      }
    }

    this._finishedAt =
      options.finishedAt ??
      (this._rawData.PayDate && this._rawData.PayTime
        ? dayjs(this._rawData.PayDate + this._rawData.PayTime, 'YYYYMMDDHHmm').toDate()
        : new Date());
    this._status = parseErrorCode(this._rawData.errcode ?? '');
    this._isSucceed = this._status === OrderStatus.success;
  }

  payInfo(): PayInfo {
    return {
      payerName: this._rawData.Name,
      credit: {
        creditNo: `****-****-****-${this._rawData.Card_NO}`,
        method: 'credit-card',
      },
    };
  }

  isPaid(): boolean {
    return this._isSucceed;
  }

  merchantId(): string {
    return this._rawData.web;
  }

  merchantName(): string | undefined {
    return this._options.merchantName ?? this._rawData.webname;
  }

  amount(): string {
    return this._rawData.MN;
  }

  finishedAt(): Date {
    return this._finishedAt;
  }

  status(): OrderStatus {
    return this._status;
  }

  isFromBrowser(): boolean {
    return this._rawData.SendType === '2';
  }

  applyNo(): string {
    return this._rawData.buysafeno;
  }

  orderNo(): string {
    return this._rawData.Td ?? '';
  }

  errorCode(): string | null {
    return this._rawData.errcode ?? null;
  }

  errorMessage(): string | null {
    return this._rawData.errmsg ?? null;
  }

  isValid(): boolean {
    let localChkValue = '';
    const env = configuration.getEnvParams();
    switch (this.payMethod()) {
      case PayMethods.Credit:
      case PayMethods.CreditInst:
        localChkValue = sha1(
          env.merchantId[PayMethods.Credit] +
            env.transPassword +
            this._rawData.buysafeno +
            this._rawData.MN +
            this._rawData.errcode +
            this._rawData.CargoNo,
        )
          .toString()
          .toUpperCase();
        break;
    }

    return localChkValue === this._rawData.ChkValue;
  }

  successResponse(): string {
    return '0000';
  }
}
