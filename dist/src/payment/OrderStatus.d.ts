export declare enum OrderStatus {
    /**
     * 交易成功
     */
    success = 0,
    /**
     * 錯誤
     */
    error = 1,
    /**
     * 交易失敗
     */
    failed = 2,
    /**
     * 取消交易
     */
    canceled = 3,
    /**
     * 繳款金額異常
     */
    abnormalAmount = 4,
    /**
     * 3D驗證中
     */
    threeDSecure = 5,
    /**
     * 已退貨
     */
    refunded = 6,
    /**
     * 退貨審核中
     */
    refundReviewing = 7,
    /**
     * 已部分退貨
     */
    partialRefunded = 8,
    /**
     * 部分退貨審核中
     */
    partialRefundReviewing = 9,
    /**
     * 不明狀態
     */
    unknown = 10
}
