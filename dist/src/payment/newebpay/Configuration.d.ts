import { PayMethods } from '../PayMethods';
export declare type AcceptMethods = PayMethods.Credit | PayMethods.CreditInst | PayMethods.CreditReward | PayMethods.ApplePay | PayMethods.GooglePay | PayMethods.SamsungPay | PayMethods.LinePay | PayMethods.UnionPay | PayMethods.WebATM | PayMethods.VACC | PayMethods.CVS | PayMethods.CVSBarcode | PayMethods.EsunWallet | PayMethods.TaiwanPay | PayMethods.CVSCOM | PayMethods.ezPay | PayMethods.ezPay_Wechat | PayMethods.ezPay_Alipay;
export interface NewebpayEnvironmentParameters {
    /**
     * 付款API host (MPG 幕前)
     */
    paymentApiUrl: string;
    /**
     * 信用卡幕後授權 API (NPA-B101 / NPA-B102)
     * 未設定時依 paymentApiUrl 自動推導
     */
    creditCardApiUrl?: string;
    /**
     * 查詢約定付款綁定狀態 API (NPA-B103)
     * 未設定時依 paymentApiUrl 自動推導
     */
    tokenQueryApiUrl?: string;
    /**
     * 解除約定付款綁定 API (NPA-B104)
     * 未設定時依 paymentApiUrl 自動推導
     */
    tokenUnbindApiUrl?: string;
    /**
     * 商家代號
     */
    merchantId: string;
    /**
     * 交易完成後通知地址
     */
    notifyUrl?: string;
    /**
     * 交易完成後前端導向地址
     */
    returnUrl?: string;
    /**
     * HashKey
     */
    hashKey: string;
    /**
     * HashIV
     */
    hashIV: string;
}
export declare const configuration: Configuration<NewebpayEnvironmentParameters>;
export {};
