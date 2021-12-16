"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseErrorCode = void 0;
const OrderStatus_1 = require("../OrderStatus");
const ERROR_CODE_TABLE = {
    '00': OrderStatus_1.OrderStatus.success,
    E0E0: OrderStatus_1.OrderStatus.refunded,
    E0EX: OrderStatus_1.OrderStatus.refundReviewing,
    EBEB: OrderStatus_1.OrderStatus.canceled,
    ECEC: OrderStatus_1.OrderStatus.partialRefunded,
    ECEX: OrderStatus_1.OrderStatus.partialRefundReviewing,
    E9E9: OrderStatus_1.OrderStatus.abnormalAmount,
    '3DXX': OrderStatus_1.OrderStatus.threeDSecure,
};
function parseErrorCode(code) {
    var _a;
    return (_a = ERROR_CODE_TABLE[code]) !== null && _a !== void 0 ? _a : OrderStatus_1.OrderStatus.unknown;
}
exports.parseErrorCode = parseErrorCode;
