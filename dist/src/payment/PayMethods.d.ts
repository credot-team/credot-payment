export declare enum PayMethods {
    /**
     * 信用卡
     */
    Credit = "credit",
    /**
     * 信用卡分期
     */
    CreditInst = "credit-installment",
    /**
     * 信用卡紅利
     */
    CreditReward = "credit-reward",
    /**
     * 銀聯卡
     */
    UnionPay = "union-pay",
    /**
     * WebATM
     */
    WebATM = "web-atm",
    /**
     * Google Pay
     */
    GooglePay = "google-pay",
    /**
     * Samsung Pay
     */
    SamsungPay = "samsung-pay",
    /**
     * LINE Pay
     */
    LinePay = "line-pay",
    /**
     * 玉山 Wallet
     */
    EsunWallet = "esun-wallet",
    /**
     * 台灣 Pay
     */
    TaiwanPay = "taiwan-pay",
    /**
     * 超商代碼繳費
     */
    CVS = "cvs",
    /**
     * 超商條碼繳費
     */
    CVSBarcode = "cvs-barcode",
    /**
     * ATM 轉帳
     */
    VACC = "vacc",
    /**
     * 超商取貨付款
     */
    CVSCOM = "cvscom",
    /**
     * ezPay 電子錢包
     */
    ezPay = "ezpay",
    /**
     * ezPay-微信支付
     */
    ezPay_Wechat = "ezpay-wechat",
    /**
     * ezPay-支付寶
     */
    ezPay_Alipay = "ezpay-alipay"
}
export declare enum CVSCOM_Types {
    /**
     * 取貨付款
     */
    PickupAndPay = 0,
    /**
     * 取貨不付款
     */
    PickupWithoutPay = 1,
    /**
     * 取貨付款 或 取貨不付款
     */
    Both = 2
}
