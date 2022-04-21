import { Configuration } from '../Configuration';
import { PayMethods } from '../PayMethods';
export declare type AcceptMethods = PayMethods.Credit | PayMethods.CreditInst | PayMethods.CreditReward | PayMethods.GooglePay | PayMethods.SamsungPay | PayMethods.LinePay | PayMethods.UnionPay | PayMethods.WebATM | PayMethods.VACC | PayMethods.CVS | PayMethods.CVSBarcode | PayMethods.EsunWallet | PayMethods.TaiwanPay | PayMethods.CVSCOM | PayMethods.ezPay | PayMethods.ezPay_Wechat | PayMethods.ezPay_Alipay;
interface NewebpayEnvironmentParameters {
    paymentApiUrl: string;
    merchantId: string;
    notifyUrl?: string;
    returnUrl?: string;
    hashKey: string;
    hashIV: string;
}
export declare const configuration: Configuration<NewebpayEnvironmentParameters>;
export {};
