"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaidOrder = void 0;
/**
 * 付款訂單
 */
class PaidOrder {
    /**
     *
     * @param payMethod
     * @param params 訂單資訊
     */
    constructor(payMethod, params) {
        this._payMethods = Array.isArray(payMethod) ? payMethod : [payMethod];
        this._params = Object.assign({}, params);
    }
    get params() {
        return this._params;
    }
    payMethod() {
        return [...this._payMethods];
    }
    orderNo() {
        return this._params.orderNo;
    }
    amount() {
        return this._params.amount;
    }
}
exports.PaidOrder = PaidOrder;
