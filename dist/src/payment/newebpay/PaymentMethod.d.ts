import { PayMethods } from '../PayMethods';
export declare const PaymentTypes: {
    /**
     * 信用卡
     */
    CREDIT: PayMethods;
    /**
     * WebATM
     */
    WEBATM: PayMethods;
    /**
     * ATM 轉帳
     */
    VACC: PayMethods;
    /**
     * 超商代碼繳費
     */
    CVS: PayMethods;
    /**
     * 超商條碼繳費
     */
    BARCODE: PayMethods;
    /**
     * 超商取貨付款
     */
    CVSCOM: PayMethods;
    /**
     * 支付寶
     */
    ALIPAY: PayMethods;
    /**
     * ezPay 電子錢包
     */
    P2GEACC: PayMethods;
    /**
     * LINE Pay
     */
    LINEPAY: PayMethods;
    /**
     * 玉山 Wallet
     */
    ESUNWALLET: PayMethods;
    /**
     * 台灣 Pay
     */
    TAIWANPAY: PayMethods;
};
export declare const CreditType: {
    /**
     * 台灣發卡機構核發之信用卡
     */
    CREDIT: string;
    /**
     * 國外發卡機構核發之卡
     */
    FOREIGN: string;
    /**
     * 銀聯卡
     */
    UNIONPAY: string;
    /**
     * Google Pay
     */
    GOOGLEPAY: string;
    /**
     * Samsung Pay
     */
    SAMSUNGPAY: string;
    /**
     * 動態貨幣轉換
     *
     * 僅支援台新銀行一次付清之代收商店。
     */
    DCC: string;
};
