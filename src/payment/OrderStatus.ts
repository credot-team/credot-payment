export enum OrderStatus {
  /**
   * 交易成功
   */
  success,

  /**
   * 錯誤
   */
  error,

  /**
   * 交易失敗
   */
  failed,

  /**
   * 取消交易
   */
  canceled,

  /**
   * 繳款金額異常
   */
  abnormalAmount,

  /**
   * 3D驗證中
   */
  threeDSecure,

  /**
   * 已退貨
   */
  refunded,

  /**
   * 退貨審核中
   */
  refundReviewing,

  /**
   * 已部分退貨
   */
  partialRefunded,

  /**
   * 部分退貨審核中
   */
  partialRefundReviewing,

  /**
   * 不明狀態
   */
  unknown,
}
