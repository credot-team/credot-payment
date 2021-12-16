/**
 * @version v1.2
 * 發票相關結構
 *
 * 參考電子發票串接手冊版本號 v1.2
 *
 * 電子發票串接手冊連結: {@link https://einvoicetest.esafe.com.tw/Merchant/Download}
 */

/**
 * 發票資料欄位
 */
export interface InvoiceFields {
  /**
   * 訂單編號
   *
   * 必填、英+數長度至多 32 字元，特殊符號只允許連字號「-」
   *
   * 訂單編號請勿與已經開立過的發票重複，以免系統發生異常
   */
  OrderNo: string;

  /**
   * 買家統編
   *
   * 若無需求則留空
   */
  BuyerId?: string;

  /**
   * 買家名稱
   *
   * 必填、長度至多 30 字元（一個中文字或一個英文字均算一個字元）
   */
  BuyerName: string;

  /**
   * 買家地址 (郵遞區號+地址)
   *
   * 若無需求則留空、長度至多 200 字元（一個中文字或一個英文字均算一個字元）
   *
   * 範例：10430 臺北市中山區松江路 207 號 9 樓
   *
   * ※如果需要寄送紙本發票，則必須填寫此欄位
   */
  BuyerAddress?: string;

  /**
   * 買家電話
   *
   * 若無需求則留空、數字長度至多 20 字元
   *
   * ※如果需要發送電子發票副本的簡訊通知，則必須填寫此欄位
   */
  BuyerPhone?: string;

  /**
   * 買家 Email
   *
   * 若無需求則留空、長度至多 80 字元
   *
   * ※如果需要發送電子發票副本的 Email 通知，則必須填寫此欄位
   */
  BuyerEmail?: string;

  /**
   * 課稅別
   *
   * 必填，應稅：1; 零稅：2; 免稅：3
   */
  TaxType: '1' | '2' | '3';

  /**
   * 通關方式
   *
   * 若無需求則留空 (若為零稅率發票，此為必填欄位)
   *
   * 非經海關出口：1; 經海關出口：2
   */
  IsCustoms?: '1' | '2';

  /**
   * 載具類別
   *
   * 若無需求則留空
   *
   * 悠遊卡：1K0001; 手機條碼：3J0002; 自然人憑證：CQ0001
   */
  CarrierType?: '1K0001' | '3J0002' | 'CQ0001';

  /**
   * 載具
   *
   * 請填寫載具內容，例如手機條碼「/ABC+123」
   *
   * 若無需求則留空，長度至多 50 字元
   */
  CarrierId?: string;

  /**
   * 愛心碼
   *
   * 若無需求則留空，長度至多 20 字元
   */
  NPOBAN?: string;

  /**
   * 品名
   *
   * 必填、長度至多 100 字元（一個中文字或一個英文字均算一個字元）
   */
  Description: string;

  /**
   * 數量
   *
   * 必填、不可有小數點
   */
  Quantity: number;

  /**
   * 單價(含稅)
   *
   * 必填、不可有小數點
   */
  UnitPrice: number;

  /**
   * 小計金額
   *
   * 必填、不可有小數點
   */
  Amount: number;

  /**
   * 備註
   *
   * 若無需求則留空，長度至多 200 字元（一個中文字或一個英文字均算一個字元）
   */
  Remark?: string;

  /**
   * 寄送發票
   *
   * 如有需要寄送紙本發票，則買家地址欄必須填寫
   *
   * 寄送：1; 不寄送：0
   */
  IsSend: '0' | '1';

  /**
   * 傳送簡訊
   *
   * 如有需要傳送簡訊，則買家電話欄必須填寫
   *
   * 寄送：1; 不寄送：0
   */
  IsSendSms: '0' | '1';
}

/**
 * 作廢發票參數
 */
export interface InvoiceCancelFields {
  /**
   * 發票號碼 (必填)
   */
  InvoiceNumber: string;

  /**
   * 發票時間 (必填)
   *
   * 格式為 yyyyMMdd
   */
  InvoiceDate: string;
}

/**
 * 註銷發票參數
 */
export interface InvoiceDiscardFields {
  /**
   * 發票號碼 (必填)
   */
  InvoiceNumber: string;

  /**
   * 發票時間 (必填)
   *
   * 格式為 yyyyMMdd
   */
  InvoiceDate: string;
}

/**
 * 折讓資料欄位
 */
export interface AllowanceFields {
  /**
   * 折讓單號碼
   *
   * 必填、英+數長度至多 16
   *
   * 折讓單號碼請勿重複以免系統發生錯誤.
   */
  AllowanceNumber: string;

  /**
   * 原發票號碼
   */
  OrInvoiceNumber: string;

  /**
   * 原發票日期
   *
   * 必填、格式為 yyyyMMdd
   */
  OrInvoiceDate: string;

  /**
   * 課稅別
   *
   * 必填，應稅：1; 零稅：2; 免稅：3
   */
  TaxType: '1' | '2' | '3';

  /**
   * 品名
   *
   * 必填、長度至多 100
   */
  OrDescription: string;

  /**
   * 數量
   *
   * 必填、不可有小數點
   */
  Quantity: number;

  /**
   * 單價(含稅)
   *
   * 必填、不可有小數點
   */
  UnitPrice: number;

  /**
   * 小計金額
   *
   * 必填、不可有小數點
   */
  Amount: number;
}

/**
 * 折讓作廢參數
 */
export interface AllowanceCancelFields {
  /**
   * 折讓單號碼 (必填)
   */
  AllowanceNumber: string;

  /**
   * 折讓時間 (必填)
   *
   * 格式為 yyyyMMdd
   */
  AllowanceDate: string;
}
