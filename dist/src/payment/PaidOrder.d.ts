import { CVSCOM_Types, PayMethods } from './PayMethods';
import { Locales } from './Locales';
export interface HtmlFormPostParams {
    properties: {
        method: 'get' | 'post';
        url: string;
    };
    data: Record<string, any>;
}
export interface OrderApplyResult {
    method: 'redirect' | 'page' | 'json';
    payload: any;
}
export interface CustomFieldsType {
    installment?: any;
    locale?: Locales;
    timeLimit?: number;
    userEmailModify?: boolean;
}
/**
 * LinePay 參數
 */
declare type LinePayParameters = {
    imageUrl: string;
};
/**
 * 超商物流 參數
 */
declare type CVSCOMParameters = {
    type: CVSCOM_Types;
};
/**
 * 訂單資訊
 */
export declare type PaidOrderParams<AcceptMethods extends PayMethods, Custom extends CustomFieldsType> = {
    orderNo: string;
    orderInfo: string;
    amount: number;
    userName: string;
    userPhone: string;
    userEmail: string;
    memo?: string;
    notifyUrl?: string;
    returnUrl?: string;
    backUrl?: string;
    locale?: Custom['locale'];
    timeLimit?: Custom['timeLimit'];
    userEmailModify?: Custom['userEmailModify'];
    installment?: AcceptMethods extends PayMethods.CreditInst ? Custom['installment'] : undefined;
    linePay?: AcceptMethods extends PayMethods.LinePay ? LinePayParameters : undefined;
    cvscom?: AcceptMethods extends PayMethods.CVSCOM ? CVSCOMParameters : undefined;
};
/**
 * 付款訂單
 */
export declare abstract class PaidOrder<AcceptMethods extends PayMethods, Custom extends CustomFieldsType> {
    private readonly _payMethods;
    private readonly _params;
    get params(): PaidOrderParams<AcceptMethods, Custom>;
    /**
     *
     * @param payMethod
     * @param params 訂單資訊
     */
    protected constructor(payMethod: AcceptMethods | AcceptMethods[], params: PaidOrderParams<AcceptMethods, Custom>);
    abstract poweredBy(): string;
    payMethod(): AcceptMethods[];
    orderNo(): string;
    amount(): number;
    abstract checksum(): string;
    abstract apply(): Promise<OrderApplyResult>;
}
export {};
