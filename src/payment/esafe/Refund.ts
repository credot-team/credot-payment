import axios from 'axios';
import sha256 from 'crypto-js/sha256';

import { Refund as IRefund, RefundParams, RefundResult } from '../Refund';
import { configuration } from './Configuration';
import { PayMethods } from '../PayMethods';

export class Refund implements IRefund {
  private readonly _orderNo: string;
  private readonly _applyNo: string;
  private readonly _amount: string;
  private readonly _reason: string;

  private _success: boolean = false;
  private _errorCode: string | undefined;
  private _errorMessage: string | undefined;

  constructor(params: RefundParams) {
    this._orderNo = params.orderNo!;
    this._applyNo = params.applyNo!;
    this._amount = params.amount.toString();
    this._reason = params.reason;
  }

  async execute(): Promise<RefundResult> {
    const env = configuration.getEnvParams();
    const params = {
      web: env.merchantId[PayMethods.Credit],
      MN: this._amount,
      buysafeno: this._applyNo,
      Td: this._orderNo,
      RefundMemo: encodeURIComponent(this._reason),
      ChkValue: '',
    };
    params.ChkValue = sha256(
      params.web + env.transPassword + params.buysafeno + params.MN + params.Td,
    ).toString();

    const query = new URLSearchParams(params).toString();
    const result = await axios.post(env.paymentApiHost + '/Hx_CardRefund.ashx', query, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });
    if (result.status !== 200)
      throw new Error(
        `response status ${result.status}: ${result.statusText}; body: ${result.data}`,
      );

    this._success = result.data === 'E0';
    if (!this._success) this._errorMessage = result.data;

    return {
      success: this._success,
      errorMessage: this._errorMessage,
    };
  }

  amount(): string {
    return '';
  }

  reason(): string {
    return this._reason;
  }

  applyNo(): string {
    return '';
  }

  errorCode(): string | undefined {
    return this._errorCode;
  }

  errorMessage(): string | undefined {
    return this._errorMessage;
  }

  isSuccess(): boolean {
    return false;
  }
}
