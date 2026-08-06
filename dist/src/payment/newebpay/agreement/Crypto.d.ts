import { NewebpayEnvironmentParameters } from '../Configuration';
export declare function encryptQueryString(data: Record<string, string | number | undefined | null>, envParams?: NewebpayEnvironmentParameters): string;
export declare function encryptJson(data: Record<string, string | number | undefined | null>, envParams?: NewebpayEnvironmentParameters): string;
export declare function decryptAes(encrypted: string, envParams?: NewebpayEnvironmentParameters): string;
export declare function hashEncrypted(encrypted: string, envParams?: NewebpayEnvironmentParameters): string;
export declare function buildCheckCode(result: {
    Amt: number | string;
    MerchantID: string;
    MerchantOrderNo: string;
    TradeNo: string;
}, envParams?: NewebpayEnvironmentParameters): string;
export declare function verifyCheckCode(result: {
    Amt: number | string;
    MerchantID: string;
    MerchantOrderNo: string;
    TradeNo: string;
    CheckCode: string;
}, envParams?: NewebpayEnvironmentParameters): boolean;
