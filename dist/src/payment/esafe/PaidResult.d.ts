import { PaidResult as IPaidResult, PaidResultOptions, PayInfo } from '../PaidResult';
import { OrderStatus } from '../OrderStatus';
import { PaidResultFields } from './PaidResultFields';
import { AcceptMethods, EsafeEnvironmentParameters } from './Configuration';
export declare class PaidResult extends IPaidResult<AcceptMethods, PaidResultFields, EsafeEnvironmentParameters> {
    poweredBy(): string;
    private readonly _finishedAt;
    private readonly _isSucceed;
    private readonly _status;
    constructor(result: PaidResultFields, options: PaidResultOptions<AcceptMethods, EsafeEnvironmentParameters>);
    getEnvParams(): EsafeEnvironmentParameters;
    payInfo(): PayInfo;
    isPaid(): boolean;
    merchantId(): string;
    merchantName(): string | undefined;
    amount(): string;
    finishedAt(): Date;
    status(): OrderStatus;
    isFromBrowser(): boolean;
    applyNo(): string;
    orderNo(): string;
    errorCode(): string | null;
    errorMessage(): string | null;
    isValid(): boolean;
    successResponse(): string;
}
