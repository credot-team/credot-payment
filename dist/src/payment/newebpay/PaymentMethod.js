"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditType = exports.PaymentTypes = void 0;
const PayMethods_1 = require("../PayMethods");
exports.PaymentTypes = {
    /**
     * 信用卡
     */
    CREDIT: PayMethods_1.PayMethods.Credit,
    /**
     * WebATM
     */
    WEBATM: PayMethods_1.PayMethods.WebATM,
    /**
     * ATM 轉帳
     */
    VACC: PayMethods_1.PayMethods.VACC,
    /**
     * 超商代碼繳費
     */
    CVS: PayMethods_1.PayMethods.CVS,
    /**
     * 超商條碼繳費
     */
    BARCODE: PayMethods_1.PayMethods.CVSBarcode,
    /**
     * 超商取貨付款
     */
    CVSCOM: PayMethods_1.PayMethods.CVSCOM,
    /**
     * 微信支付-簡單付
     */
    EZPWECHAT: PayMethods_1.PayMethods.ezPay_Wechat,
    /**
     * 支付寶-簡單付
     */
    EZPALIPAY: PayMethods_1.PayMethods.ezPay_Alipay,
    /**
     * ezPay 電子錢包
     */
    EZPAY: PayMethods_1.PayMethods.ezPay,
    /**
     * LINE Pay
     */
    LINEPAY: PayMethods_1.PayMethods.LinePay,
    /**
     * 玉山 Wallet
     */
    ESUNWALLET: PayMethods_1.PayMethods.EsunWallet,
    /**
     * 台灣 Pay
     */
    TAIWANPAY: PayMethods_1.PayMethods.TaiwanPay,
};
exports.CreditType = {
    /**
     * 台灣發卡機構核發之信用卡
     */
    CREDIT: '台灣發卡機構核發之信用卡',
    /**
     * 國外發卡機構核發之卡
     */
    FOREIGN: '國外發卡機構核發之卡',
    /**
     * 銀聯卡
     */
    UNIONPAY: '銀聯卡',
    /**
     * Apple Pay
     */
    APPLEPAY: 'ApplePay',
    /**
     * Google Pay
     */
    GOOGLEPAY: 'GooglePay',
    /**
     * Samsung Pay
     */
    SAMSUNGPAY: 'SamsungPay',
    /**
     * 動態貨幣轉換
     *
     * 僅支援台新銀行一次付清之代收商店。
     */
    DCC: '動態貨幣轉換',
};
