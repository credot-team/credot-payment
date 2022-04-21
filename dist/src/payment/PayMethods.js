"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CVSCOM_Types = exports.PayMethods = void 0;
var PayMethods;
(function (PayMethods) {
    /**
     * 信用卡
     */
    PayMethods["Credit"] = "credit";
    /**
     * 信用卡分期
     */
    PayMethods["CreditInst"] = "credit-installment";
    /**
     * 信用卡紅利
     */
    PayMethods["CreditReward"] = "credit-reward";
    /**
     * 銀聯卡
     */
    PayMethods["UnionPay"] = "union-pay";
    /**
     * WebATM
     */
    PayMethods["WebATM"] = "web-atm";
    /**
     * Google Pay
     */
    PayMethods["GooglePay"] = "google-pay";
    /**
     * Samsung Pay
     */
    PayMethods["SamsungPay"] = "samsung-pay";
    /**
     * LINE Pay
     */
    PayMethods["LinePay"] = "line-pay";
    /**
     * 玉山 Wallet
     */
    PayMethods["EsunWallet"] = "esun-wallet";
    /**
     * 台灣 Pay
     */
    PayMethods["TaiwanPay"] = "taiwan-pay";
    /**
     * 超商代碼繳費
     */
    PayMethods["CVS"] = "cvs";
    /**
     * 超商條碼繳費
     */
    PayMethods["CVSBarcode"] = "cvs-barcode";
    /**
     * ATM 轉帳
     */
    PayMethods["VACC"] = "vacc";
    /**
     * 超商取貨付款
     */
    PayMethods["CVSCOM"] = "cvscom";
    /**
     * ezPay 電子錢包
     */
    PayMethods["ezPay"] = "ezpay";
    /**
     * ezPay-微信支付
     */
    PayMethods["ezPay_Wechat"] = "ezpay-wechat";
    /**
     * ezPay-支付寶
     */
    PayMethods["ezPay_Alipay"] = "ezpay-alipay";
})(PayMethods = exports.PayMethods || (exports.PayMethods = {}));
var CVSCOM_Types;
(function (CVSCOM_Types) {
    /**
     * 取貨付款
     */
    CVSCOM_Types[CVSCOM_Types["PickupAndPay"] = 0] = "PickupAndPay";
    /**
     * 取貨不付款
     */
    CVSCOM_Types[CVSCOM_Types["PickupWithoutPay"] = 1] = "PickupWithoutPay";
    /**
     * 取貨付款 或 取貨不付款
     */
    CVSCOM_Types[CVSCOM_Types["Both"] = 2] = "Both";
})(CVSCOM_Types = exports.CVSCOM_Types || (exports.CVSCOM_Types = {}));
