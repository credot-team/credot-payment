import { CAUNotifyPayload, CAUNotifyResult } from './Fields';
/**
 * 4.6 信用卡更新通知（CAU）
 *
 * 藍新金流透過商店申請 CAU 服務時設定的 Notify URL 回傳最新卡片狀態。
 */
export declare class CAUNotify {
    private readonly _payload;
    constructor(payload: CAUNotifyPayload | string);
    static fromBody(body: Record<string, unknown>): CAUNotify;
    message(): string;
    result(): CAUNotifyResult;
    tokenTerm(): string;
    tokenLife(): string | undefined;
    /** ACTIVE=可正常扣款；非 ACTIVE 時應暫停扣款並提示持卡人重新綁卡 */
    cardStatus(): string;
    isActive(): boolean;
    /** 持卡人續卡後的最新效期，例：2030-05 */
    newExpiry(): string | undefined;
    raw(): CAUNotifyPayload;
}
