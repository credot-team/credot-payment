import { Configuration } from '../Configuration';
import { PayMethods } from '../PayMethods';
export declare type AcceptMethods = PayMethods.Credit | PayMethods.CreditInst;
interface EsafeEnvironmentParameters {
    paymentApiHost: string;
    merchantId: {
        [key in PayMethods]: string;
    };
    transPassword: string;
    invoiceApiHost: string;
    invoiceAccount: string;
    invoicePassword: string;
}
export declare const configuration: Configuration<EsafeEnvironmentParameters>;
export {};
