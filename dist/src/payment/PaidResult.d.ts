import { PayMethods } from './PayMethods';
import { OrderStatus } from './OrderStatus';
import { StoreTypes } from './StoreTypes';
export interface PaidResultOptions<AcceptMethods extends PayMethods> {
    payMethod: AcceptMethods;
    finishedAt?: Date;
    isFromBrowser?: boolean;
    merchantName?: string;
    payerName?: string;
    payerPhone?: string;
    payerEmail?: string;
}
export interface PayInfo {
    payerName: string;
    phone?: string;
    email?: string;
    credit?: {
        creditNo: string;
        /**
         * 交易類型
         * - 台灣發卡機構核發之信用卡
         * - 國外發卡機構核發之卡
         * - 銀聯卡
         * - GooglePay
         * - ......
         */
        method: string;
    };
    atm?: {
        bankCode: string;
        account: string;
    };
    cvs?: {
        type: 'code' | 'barcode';
        storeType: StoreTypes;
        storeID?: string;
        codeNo?: string;
        barcode_1?: string;
        barcode_2?: string;
        barcode_3?: string;
    };
    thirdParty?: {
        tradeNo: string;
        paymentType: string;
        amount: number;
    };
    delivery?: {
        orderNo: string;
        name: string;
        phone?: string;
        payAtPickup: boolean;
        addressDescription: string;
        county?: string;
        district?: string;
        address_1?: string;
        address_2?: string;
        fullAddress: string;
    };
}
export declare abstract class PaidResult<AcceptMethods extends PayMethods, PaidResultFields extends Record<string, any>> {
    protected readonly _options: PaidResultOptions<AcceptMethods>;
    protected readonly _rawData: PaidResultFields;
    private readonly _payMethod;
    protected constructor(result: PaidResultFields, options: PaidResultOptions<AcceptMethods>);
    /**
     * 原始資料 (若資料經過加密，則回傳解密後的資料)
     */
    rawData(): PaidResultFields;
    /**
     * 付款方式
     */
    payMethod(): AcceptMethods;
    /**
     * 是否通過校驗
     */
    abstract isValid(): boolean;
    /**
     * 服務提供單位
     */
    abstract poweredBy(): string;
    /**
     * 是否已付款
     *
     * 用以判斷本次請求為付款完成，或只是中間狀態 (例如: 訂單成立通知)
     */
    abstract isPaid(): boolean;
    /**
     * 委託交易單號
     */
    abstract applyNo(): string;
    /**
     * 原始訂單號
     */
    abstract orderNo(): string;
    /**
     * 商店代號
     */
    abstract merchantId(): string;
    /**
     * 商店名稱
     */
    abstract merchantName(): string | undefined;
    /**
     * 付款資訊
     */
    abstract payInfo(): PayInfo;
    /**
     * 訂單金額
     */
    abstract amount(): string;
    /**
     * 付款狀態
     */
    abstract status(): OrderStatus;
    /**
     * 此請求是否來自瀏覽器端
     */
    abstract isFromBrowser(): boolean;
    /**
     * 錯誤代碼
     */
    abstract errorCode(): string | null;
    /**
     * 錯誤訊息
     */
    abstract errorMessage(): string | null;
    /**
     * 付款完成時間
     */
    abstract finishedAt(): Date;
    /**
     * 成功時回應請求的訊息
     */
    abstract successResponse(): string | undefined;
}
