import { OrderApplyResult, PaidOrderParams } from '../../PaidOrder';
import { Locales } from '../../Locales';
import { AgreementOrderTradeInfo } from './Fields';
declare const API_VERSION = "2.3";
export declare type AgreementOrderApiParams = {
    MerchantID: string;
    TradeInfo: string;
    TradeSha: string;
    Version: typeof API_VERSION;
    EncryptType?: 0 | 1;
};
export declare type AgreementOrderParams = Omit<PaidOrderParams<never, {
    locale?: Locales;
}>, 'userName' | 'userPhone' | 'memo' | 'installment' | 'linePay' | 'cvscom'> & {
    /** 付款人綁定識別，例：會員編號、Email */
    tokenTerm: string;
    /** Token 有效日期，格式 yymm，例 1912 */
    tokenLife?: string;
    /** 約定事項，將顯示於 MPG 頁面 */
    orderComment?: string;
    /** 使用情境：0=WEB, 1=APP, 2=定期定額 */
    useFor?: 0 | 1 | 2;
    /** 3D 交易：1=啟用 */
    p3d?: '0' | '1';
    /** 信用卡分期，例 '3,6,12' */
    instFlag?: string;
    /** 啟用美國運通卡 */
    creditAeAgreement?: 0 | 1;
    /** 手機驗證方式（UseFor=1 時） */
    mobileVerify?: 0 | 1 | 2;
    /** 付款人電話號碼 */
    mobileNumber?: string;
    /** 付款人電話是否可修改 */
    mobileNumberModify?: 0 | 1;
};
/**
 * 4.1 首次約定付款(P1) - 幕前情境 [NPA-F011]
 */
export declare class AgreementOrder {
    private readonly _params;
    private readonly _tradeInfo;
    private readonly _apiParams;
    constructor(params: AgreementOrderParams);
    private buildTradeInfo;
    static encryptTradeInfo(tradeInfo: AgreementOrderTradeInfo): string;
    static hashTradeInfo(tradeInfo: string): string;
    poweredBy(): string;
    orderNo(): string;
    amount(): number;
    tokenTerm(): string;
    tradeInfo(): AgreementOrderTradeInfo;
    checksum(): string;
    apply(): Promise<OrderApplyResult>;
}
export {};
