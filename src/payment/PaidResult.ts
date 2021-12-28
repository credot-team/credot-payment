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
  // 付款人姓名
  payerName: string;
  // 付款人電話
  phone?: string;
  // 付款人 E-mail 地址
  email?: string;
  // 信用卡資訊
  credit?: {
    // 卡號
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
  // atm 轉帳資訊
  atm?: {
    // 金融機構代碼
    bankCode: string;
    // 金融機構帳號
    account: string;
  };
  // 超商繳費資訊
  cvs?: {
    // 繳費類型: code/barcode (代碼/條碼繳費)
    type: 'code' | 'barcode';
    // 超商類型
    storeType: StoreTypes;
    // 門市代號
    storeID?: string;
    // 繳費代碼 (type = 'code')
    codeNo?: string;
    // 第一段條碼 (type = 'barcode')
    barcode_1?: string;
    // 第二段條碼 (type = 'barcode')
    barcode_2?: string;
    // 第三段條碼 (type = 'barcode')
    barcode_3?: string;
  };
  // 第三方付款資訊
  thirdParty?: {
    tradeNo: string;
    paymentType: string;
    amount: number;
  };
  // 物流資訊
  delivery?: {
    // 物流單號
    orderNo: string;
    // 取貨人姓名
    name: string;
    // 取貨人電話
    phone?: string;
    // 取貨時付款
    payAtPickup: boolean;
    // 地址描述
    addressDescription: string;
    // 縣市
    county?: string;
    // 區
    district?: string;
    // 第一段地址
    address_1?: string;
    // 第二段地址
    address_2?: string;
    // 完整地址
    fullAddress: string;
  };
}

export abstract class PaidResult<
  AcceptMethods extends PayMethods,
  PaidResultFields extends Record<string, any>,
> {
  protected readonly _options: PaidResultOptions<AcceptMethods>;
  protected readonly _rawData: PaidResultFields;
  private readonly _payMethod: AcceptMethods;

  protected constructor(result: PaidResultFields, options: PaidResultOptions<AcceptMethods>) {
    this._rawData = { ...result };
    this._payMethod = options.payMethod;
    this._options = options;
  }

  /**
   * 原始資料 (若資料經過加密，則回傳解密後的資料)
   */
  rawData(): PaidResultFields {
    return { ...this._rawData };
  }

  /**
   * 付款方式
   */
  payMethod(): AcceptMethods {
    return this._payMethod;
  }

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
