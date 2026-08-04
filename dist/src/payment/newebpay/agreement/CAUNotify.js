"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CAUNotify = void 0;
/**
 * 4.6 信用卡更新通知（CAU）
 *
 * 藍新金流透過商店申請 CAU 服務時設定的 Notify URL 回傳最新卡片狀態。
 */
class CAUNotify {
    constructor(payload) {
        this._payload = typeof payload === 'string' ? JSON.parse(payload) : payload;
    }
    static fromBody(body) {
        var _a, _b;
        if (typeof body.Result === 'string') {
            return new CAUNotify({
                Message: String((_a = body.Message) !== null && _a !== void 0 ? _a : ''),
                Result: JSON.parse(body.Result),
            });
        }
        return new CAUNotify({
            Message: String((_b = body.Message) !== null && _b !== void 0 ? _b : ''),
            Result: body.Result,
        });
    }
    message() {
        return this._payload.Message;
    }
    result() {
        return Object.assign({}, this._payload.Result);
    }
    tokenTerm() {
        return this._payload.Result.TokenTerm;
    }
    tokenLife() {
        return this._payload.Result.TokenLife;
    }
    /** ACTIVE=可正常扣款；非 ACTIVE 時應暫停扣款並提示持卡人重新綁卡 */
    cardStatus() {
        return this._payload.Result.cardStatus;
    }
    isActive() {
        return this._payload.Result.cardStatus === 'ACTIVE';
    }
    /** 持卡人續卡後的最新效期，例：2030-05 */
    newExpiry() {
        return this._payload.Result.newExpiry;
    }
    raw() {
        return Object.assign(Object.assign({}, this._payload), { Result: Object.assign({}, this._payload.Result) });
    }
}
exports.CAUNotify = CAUNotify;
