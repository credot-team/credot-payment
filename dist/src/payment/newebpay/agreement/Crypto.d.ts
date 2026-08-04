export declare function encryptQueryString(data: Record<string, string | number | undefined | null>): string;
export declare function encryptJson(data: Record<string, string | number | undefined | null>): string;
export declare function decryptAes(encrypted: string): string;
export declare function hashEncrypted(encrypted: string): string;
export declare function buildCheckCode(result: {
    Amt: number | string;
    MerchantID: string;
    MerchantOrderNo: string;
    TradeNo: string;
}): string;
export declare function verifyCheckCode(result: {
    Amt: number | string;
    MerchantID: string;
    MerchantOrderNo: string;
    TradeNo: string;
    CheckCode: string;
}): boolean;
