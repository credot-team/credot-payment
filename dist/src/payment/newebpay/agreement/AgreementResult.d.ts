import { PaidResult as IPaidResult, PaidResultOptions } from '../../PaidResult';
import { PayMethods } from '../../PayMethods';
import { OrderStatus } from '../../OrderStatus';
import { PaidResultFields } from '../PaidResultFields';
import { AgreementOrderResult } from './Fields';
declare type RawAgreementResult = PaidResultFields<false, PayMethods.Credit>;
/**
 * 解析 NPA-F011 幕前約定付款回傳（NotifyURL / ReturnURL）
 */
export declare class AgreementResult extends IPaidResult<PayMethods.Credit, PaidResultFields<true, PayMethods.Credit>> {
    private readonly _result;
    private readonly _isValid;
    private readonly _isSucceed;
    private readonly _status;
    private readonly _finishedAt;
    constructor(result: RawAgreementResult, options?: PaidResultOptions<PayMethods.Credit>);
    poweredBy(): string;
    merchantId(): string;
    merchantName(): string | undefined;
    isPaid(): boolean;
    payInfo(): {
        payerName: string;
        credit: {
            creditNo: string;
            method: string;
        };
    };
    amount(): string;
    finishedAt(): Date;
    status(): OrderStatus;
    isFromBrowser(): boolean;
    applyNo(): string;
    orderNo(): string;
    errorCode(): string | null;
    errorMessage(): string | null;
    isValid(): boolean;
    successResponse(): string | undefined;
    /** 約定 Token，供後續 Pn 使用 */
    tokenValue(): string | undefined;
    /** Token 有效日期，格式 yyyy-mm-dd */
    tokenLife(): string | undefined;
    /** 信用卡快速結帳使用狀態 */
    tokenUseStatus(): 0 | 1 | 2 | 9 | undefined;
    result(): AgreementOrderResult;
}
export {};
