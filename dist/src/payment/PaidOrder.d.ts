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
    payload: HtmlFormPostParams;
}
export interface CustomFieldsType {
    /**
     * 信用卡分期
     */
    installment?: any;
    /**
     * 語言
     */
    locale?: Locales;
    /**
     * 限制交易時長(秒)
     */
    timeLimit?: number;
    /**
     * 開放修改信箱地址
     */
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
    /**
     * 訂單號
     */
    orderNo: string;
    /**
     * 訂單內容
     */
    orderInfo: string;
    /**
     * 金額
     */
    amount: number;
    /**
     * 消費者姓名
     */
    userName: string;
    /**
     * 消費者電話
     */
    userPhone: string;
    /**
     * 消費者電子信箱
     */
    userEmail: string;
    /**
     * 備註
     */
    memo?: string;
    /**
     * 交易完成後通知地址
     */
    notifyUrl?: string;
    /**
     * 交易完成後前端導向地址
     */
    returnUrl?: string;
    /**
     * 返回上一頁地址
     */
    backUrl?: string;
    /**
     * 語言
     */
    locale?: Custom['locale'];
    /**
     * 限制交易時長(秒)
     */
    timeLimit?: Custom['timeLimit'];
    /**
     * 開放修改信箱地址
     */
    userEmailModify?: Custom['userEmailModify'];
    /**
     * 信用卡分期
     */
    installment?: AcceptMethods extends PayMethods.CreditInst ? Custom['installment'] : undefined;
    /**
     * linePay
     */
    linePay?: AcceptMethods extends PayMethods.LinePay ? LinePayParameters : undefined;
    /**
     * 超商物流
     */
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
