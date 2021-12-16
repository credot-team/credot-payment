import sha1 from 'crypto-js/sha1';

import { PaidResult as IPaidResult } from '../PaidResult';
import { PayMethods } from '../PayMethods';
import { PaidResultFields } from './PaidResultFields';
import { PoweredBy } from './index';
import { parseErrorCode } from './ErrorCode';
import { configuration } from './Configuration';
import { OrderStatus } from '../OrderStatus';

export class PaidResult implements IPaidResult {
  poweredBy(): string {
    return PoweredBy;
  }

  private readonly _rawData: PaidResultFields;
  private readonly _method: PayMethods;
  private readonly _finishTime: Date;
  private readonly _isSucceed: boolean;
  private readonly _status: OrderStatus;

  constructor(method: PayMethods, result: PaidResultFields, finishTime: Date) {
    this._rawData = result;
    if (this.isFromBrowser()) {
      const data = this._rawData as any;
      for (const key of ['webname', 'Name', 'note1', 'note2', 'errmsg', 'StoreName', 'StoreMsg']) {
        if (data[key]) data[key] = decodeURIComponent(data[key]);
      }
    }

    this._finishTime = finishTime;
    this._method = method;

    this._status = parseErrorCode(this._rawData.errcode ?? '');
    this._isSucceed = this._status === OrderStatus.success;
  }

  shopName(): string | undefined {
    return this._rawData.webname;
  }

  payer(): string {
    return this._rawData.Name;
  }

  cardNo(): string | undefined {
    return `****-****-****-${this._rawData.Card_NO}`;
  }

  payMethod(): PayMethods {
    return this._method;
  }

  amount(): string {
    return this._rawData.MN;
  }

  finishTime(): Date {
    return this._finishTime;
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

  rawData(): any {
    return this._rawData;
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
