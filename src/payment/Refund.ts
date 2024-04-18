export interface RefundParams {
  /**
   * 原訂單編號
   */
  orderNo?: string;

  /**
   * 原第三方訂單號
   */
  applyNo?: string;

  /**
   * 金額
   */
  amount: number;

  /**
   * 退款原因
   */
  reason: string;
}

export interface RefundResult {
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
}

export interface Refund {
  execute(): Promise<RefundResult>;

  applyNo(): string;

  amount(): string;

  reason(): string;

  isSuccess(): boolean;

  errorCode(): string | undefined;

  errorMessage(): string | undefined;
}
