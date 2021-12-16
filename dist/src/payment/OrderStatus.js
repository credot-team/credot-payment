"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    /**
     * 交易成功
     */
    OrderStatus[OrderStatus["success"] = 0] = "success";
    /**
     * 錯誤
     */
    OrderStatus[OrderStatus["error"] = 1] = "error";
    /**
     * 交易失敗
     */
    OrderStatus[OrderStatus["failed"] = 2] = "failed";
    /**
     * 取消交易
     */
    OrderStatus[OrderStatus["canceled"] = 3] = "canceled";
    /**
     * 繳款金額異常
     */
    OrderStatus[OrderStatus["abnormalAmount"] = 4] = "abnormalAmount";
    /**
     * 3D驗證中
     */
    OrderStatus[OrderStatus["threeDSecure"] = 5] = "threeDSecure";
    /**
     * 已退貨
     */
    OrderStatus[OrderStatus["refunded"] = 6] = "refunded";
    /**
     * 退貨審核中
     */
    OrderStatus[OrderStatus["refundReviewing"] = 7] = "refundReviewing";
    /**
     * 已部分退貨
     */
    OrderStatus[OrderStatus["partialRefunded"] = 8] = "partialRefunded";
    /**
     * 部分退貨審核中
     */
    OrderStatus[OrderStatus["partialRefundReviewing"] = 9] = "partialRefundReviewing";
    /**
     * 不明狀態
     */
    OrderStatus[OrderStatus["unknown"] = 10] = "unknown";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
