import { Configuration } from '../Configuration';
import { PayMethods } from '../PayMethods';
export declare type AcceptMethods = PayMethods.Credit | PayMethods.CreditInst | PayMethods.CreditReward | PayMethods.ApplePay | PayMethods.GooglePay | PayMethods.SamsungPay | PayMethods.LinePay | PayMethods.UnionPay | PayMethods.WebATM | PayMethods.VACC | PayMethods.CVS | PayMethods.CVSBarcode | PayMethods.EsunWallet | PayMethods.TaiwanPay | PayMethods.CVSCOM | PayMethods.ezPay | PayMethods.ezPay_Wechat | PayMethods.ezPay_Alipay;
export interface NewebpayEnvironmentParameters {
    /**
     * 付款API host
     */
    paymentApiUrl: string;
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
