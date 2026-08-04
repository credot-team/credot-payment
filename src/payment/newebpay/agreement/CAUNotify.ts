import { CAUNotifyPayload, CAUNotifyResult } from './Fields';

/**
 * 4.6 信用卡更新通知（CAU）
 *
 * 藍新金流透過商店申請 CAU 服務時設定的 Notify URL 回傳最新卡片狀態。
 */
export class CAUNotify {
  private readonly _payload: CAUNotifyPayload;

  constructor(payload: CAUNotifyPayload | string) {
    this._payload = typeof payload === 'string' ? JSON.parse(payload) : payload;
  }

  static fromBody(body: Record<string, unknown>): CAUNotify {
    if (typeof body.Result === 'string') {
      return new CAUNotify({
        Message: String(body.Message ?? ''),
        Result: JSON.parse(body.Result),
      });
    }
    return new CAUNotify({
      Message: String(body.Message ?? ''),
      Result: body.Result as CAUNotifyResult,
    });
  }

  message(): string {
    return this._payload.Message;
  }

  result(): CAUNotifyResult {
    return { ...this._payload.Result };
  }

  tokenTerm(): string {
    return this._payload.Result.TokenTerm;
  }

  tokenLife(): string | undefined {
    return this._payload.Result.TokenLife;
  }

  /** ACTIVE=可正常扣款；非 ACTIVE 時應暫停扣款並提示持卡人重新綁卡 */
  cardStatus(): string {
    return this._payload.Result.cardStatus;
  }

  isActive(): boolean {
    return this._payload.Result.cardStatus === 'ACTIVE';
  }

  /** 持卡人續卡後的最新效期，例：2030-05 */
  newExpiry(): string | undefined {
    return this._payload.Result.newExpiry;
  }

  raw(): CAUNotifyPayload {
    return { ...this._payload, Result: { ...this._payload.Result } };
  }
}
