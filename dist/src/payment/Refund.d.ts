export interface RefundParams {
    orderNo?: string;
    applyNo?: string;
    amount: number;
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
