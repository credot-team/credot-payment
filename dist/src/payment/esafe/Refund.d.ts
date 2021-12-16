import { Refund as IRefund, RefundParams, RefundResult } from '../Refund';
export declare class Refund implements IRefund {
    private readonly _orderNo;
    private readonly _applyNo;
    private readonly _amount;
    private readonly _reason;
    private _success;
    private _errorCode;
    private _errorMessage;
    constructor(params: RefundParams);
    execute(): Promise<RefundResult>;
    amount(): string;
    reason(): string;
    applyNo(): string;
    errorCode(): string | undefined;
    errorMessage(): string | undefined;
    isSuccess(): boolean;
}
