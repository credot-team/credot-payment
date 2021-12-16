"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaidResult = void 0;
class PaidResult {
    constructor(result, options) {
        this._rawData = Object.assign({}, result);
        this._payMethod = options.payMethod;
        this._options = options;
    }
    /**
     * 原始資料 (若資料經過加密，則回傳解密後的資料)
     */
    rawData() {
        return Object.assign({}, this._rawData);
    }
    /**
     * 付款方式
     */
    payMethod() {
        return this._payMethod;
    }
}
exports.PaidResult = PaidResult;
