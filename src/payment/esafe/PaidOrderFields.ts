/**
 * @version v4.1.2
 * 支付請求結構
 *
 * 參考技術文件版本號 v4.1.2
 *
 * 技術文件連結: {@link https://www.sunpay.com.tw/forms_download/紅陽科技-金流串接技術手冊v4.1.2.pdf}
 */
export interface PaidOrderFields {
  /**
   * 特店代號
   *
   * 注意：
   * - 銀聯卡需使用信用卡之特店代號
   * - ATM 轉帳（虛擬帳號）需使用超商代收（條碼繳費單）之特店代號
   */
  web: string;

  /**
   * 交易金額，需為整數，不可有小數點和千位符號，計價單位：新台幣。
   *
   * 注意：使用 ATM 轉帳（虛擬帳號），若交易金額大於 3 萬元時需臨櫃匯款。
   *
   * 長度限制:8
   */
  MN: string;

  /**
   * 交易內容，請傳送本次交易的商品內容，不可有特殊字元，例如：*'<>[]"
   *
   * 當需要透過紅陽金流系統於交易付款時開立電子發票，「交易內容」（OrderInfo）則為必要欄位，詳情請參考「電子發票」章節說明。
   *
   * 長度限制: 400
   */
  OrderInfo?: string;

  /**
   * 特店訂單編號，請避免訂單編號重複，紅陽金流系統不針對所有交易檢查訂單編號是否重複，僅阻擋同一個特店訂單編號在同瀏覽器上的未完成交易。（本參數內容以英數字為主）
   *
   * 長度限制: 20
   */
  Td?: string;

  /**
   * 消費者姓名，中、英文姓名均可接受，不可有特殊字元，例如：*'<>[]"。若搭配超商取貨時為必須資料
   *
   * 長度限制: 30
   */
  sna: string;

  /**
   * 消費者電話，請填入手機號碼（可接受國外手機號碼），不可有符號， 例如#( )+-等。若搭配超商取貨，貨到門市時將發送到 貨通知簡訊。（組成內容以全部數字為主）
   *
   * 長度限制: 20
   */
  sdt: string;

  /**
   * 消費者電子郵件，若有傳送，需符合 Email 格式內容。若有搭配超商取貨 服務時，為了避免消費者收不到貨到門市通知簡訊（例 如國外手機門號可能收不到簡訊），建議傳送消費者郵 件，以補足此方面的不足。
   *
   * 長度限制: 100
   */
  email?: string;

  /**
   * 備註1，不可有特殊字元，例如：*'<>[]"
   *
   * 長度限制: 400
   */
  note1?: string;

  /**
   * 備註1，不可有特殊字元，例如：*'<>[]"
   *
   * 長度限制: 400
   */
  note2?: string;

  /**
   * 交易類別 [信用卡、銀聯卡專屬欄位]
   * - 空字串：由消費者選擇刷卡種類（信用卡或銀聯卡）
   * - 0：信用卡交易
   * - 1：銀聯卡交易
   * - 3：Apple Pay、Google Pay™
   */
  Card_Type?: '' | '0' | '1' | '3';

  /**
   * 付款頁面語言 [信用卡、銀聯卡專屬欄位]
   * - 空字串：中文、英文混合介面
   * - EN：英文
   * - JIS：日文
   */
  Country_Type?: '' | 'EN' | 'JIS';

  /**
   * 分期期數 [信用卡專屬欄位]
   * 接受參數： 空字串、3、6、12、18、24、30
   *
   * 注意：
   * - 若一次付清（不分期）請使用空字串，不要填寫 0 或 1
   * - 分期付款限信用卡使用，銀聯卡無法分期（Card_Type 必須為 0）
   * - 並非每一家銀行發行之信用卡皆可分期付款，可分期銀行清單請參考紅陽科技網站： {@link https://www.esafe.com.tw}
   * - 本功能並非所有客戶均可使用，請聯繫紅陽科技客服或業務專員以了解是否支援分期付款服務。
   */
  Term?: '' | '3' | '6' | '12' | '18' | '24' | '30';

  /**
   * 繳款期限 [超商代收（條碼繳費單）、超商代收（代碼）、ATM 轉帳（虛擬帳號）專屬欄位]
   *
   * 特店需限制繳款期限，可設定 1~180 天，為了促使消費者儘早繳款，建議繳款期限不要設定過久，日期格式： YYYYMMDD，例如 20170824
   */
  DueDate?: string;

  /**
   * 用戶編號 [超商代收（條碼繳費單）、超商代收（代碼）專屬欄位]
   *
   * 本欄位可供特店自行定義，例如會員編號，不可有特殊字元，例如：*'<>[]"
   *
   * 長度限制: 15
   */
  UserNo?: string;

  /**
   * 列帳日期 [超商代收（條碼繳費單）、超商代收（代碼）專屬欄位]
   *
   * 特店自行定義帳單產生日，日期格式：YYYYMMDD，例如 20170824
   */
  BillDate?: string;

  /**
   * 商品名稱 [超商代收（條碼繳費單）專屬欄位]
   *
   * 最多接受 10 項商品，每項商品名稱最多 100 個字元， 不可有特殊字元。包含：*'<>[]"，如商品數量過多或金 額有負值，建議整合為單一商品名稱傳送，例如：百貨 商品
   *
   * 長度限制: 100
   */
  ProductName1?: string;

  /**
   * @see ProductName1
   */
  ProductName2?: string;

  /**
   * @see ProductName1
   */
  ProductName3?: string;

  /**
   * @see ProductName1
   */
  ProductName4?: string;

  /**
   * @see ProductName1
   */
  ProductName5?: string;

  /**
   * @see ProductName1
   */
  ProductName6?: string;

  /**
   * @see ProductName1
   */
  ProductName7?: string;

  /**
   * @see ProductName1
   */
  ProductName8?: string;

  /**
   * @see ProductName1
   */
  ProductName9?: string;

  /**
   * @see ProductName1
   */
  ProductName10?: string;

  /**
   * 商品單價 [超商代收（條碼繳費單）專屬欄位]
   *
   * 最多接受 10 項商品，每項商品之單價需大於 0，小於或 等於 99999，如商品數量過多或金額有負值，建議整合 為單一商品名稱傳送，例如：百貨商品。
   *
   * 注意：商品單價 x 商品數量之總和必須與交易金額相 符，不符者不允許交易。
   *
   * 長度限制: 5
   */
  ProductPrice1?: string;

  /**
   * @see ProductPrice1
   */
  ProductPrice2?: string;

  /**
   * @see ProductPrice1
   */
  ProductPrice3?: string;

  /**
   * @see ProductPrice1
   */
  ProductPrice4?: string;

  /**
   * @see ProductPrice1
   */
  ProductPrice5?: string;

  /**
   * @see ProductPrice1
   */
  ProductPrice6?: string;

  /**
   * @see ProductPrice1
   */
  ProductPrice7?: string;

  /**
   * @see ProductPrice1
   */
  ProductPrice8?: string;

  /**
   * @see ProductPrice1
   */
  ProductPrice9?: string;

  /**
   * @see ProductPrice1
   */
  ProductPrice10?: string;

  /**
   * 商品數量 [超商代收（條碼繳費單）專屬欄位]
   *
   * 最多接受 10 項商品，每項商品之數量需大於 0，小於或等於 99999
   *
   * 長度限制: 5
   */
  ProductQuantity1?: string;

  /**
   * @see ProductQuantity1
   */
  ProductQuantity2?: string;

  /**
   * @see ProductQuantity1
   */
  ProductQuantity3?: string;

  /**
   * @see ProductQuantity1
   */
  ProductQuantity4?: string;

  /**
   * @see ProductQuantity1
   */
  ProductQuantity5?: string;

  /**
   * @see ProductQuantity1
   */
  ProductQuantity6?: string;

  /**
   * @see ProductQuantity1
   */
  ProductQuantity7?: string;

  /**
   * @see ProductQuantity1
   */
  ProductQuantity8?: string;

  /**
   * @see ProductQuantity1
   */
  ProductQuantity9?: string;

  /**
   * @see ProductQuantity1
   */
  ProductQuantity10?: string;

  /**
   * 繳款方式 [超商代收（條碼繳費單）與 ATM 轉帳（虛擬帳號）專屬欄位]
   * - 空字串：產生繳費單包含條碼跟 ATM 轉帳帳號（虛擬帳號）
   * - 1：只產生條碼繳費單，發送給消費者的電子郵件中的繳 費單只有條碼繳費，沒有 ATM 轉帳帳號（虛擬帳號）， 注意：如交易金額超過 2 萬元則會拒絕交易
   * - 2：只產生 ATM 轉帳帳號（虛擬帳號），發送給消費者 的電子郵件中的繳費單只有 ATM 轉帳帳號（虛擬帳號），沒有條碼繳費的條碼資訊
   */
  AgencyType?: '' | '1' | '2';

  /**
   * ATM轉帳（虛擬帳號）轉入銀行別 [ATM 轉帳（虛擬帳號）專屬欄位]
   *
   * - T：合作金庫銀行
   */
  AgencyBank?: string;

  /**
   * 搭配物流，本選項為提供消費者至超商取貨之服務，相關說明請參考「超商取貨物流流程」一章
   * - 空字串或 0：不搭配物流
   * - 1：統一超商取貨；
   * - 2：全家超商取貨；
   * - 2B：全家大宗寄倉超商取貨；
   * - 3：OK 超商取貨；
   * - 4：萊爾富超商取貨；
   * - E：宅配通。
   */
  CargoFlag?: '' | '0' | '2' | '2B' | '3' | '4' | 'E';

  /**
   * 取貨門市店號，請在貴網站結帳流程中增加選擇超商門市功能（請參考「超商取貨物流流程」一章說明）。
   *
   * 若前述 CargoFlag 選擇搭配物流，但此欄位填入空字串時，則會在紅陽科技付款流程中安插選擇門市的流程。
   *
   * 長度限制: 6
   */
  StoreID?: string;

  /**
   * 取貨門市店名，請在貴網站結帳流程中增加選擇超商門市功能（請參考「超商取貨物流流程」一章說明）。
   *
   * 若前述 CargoFlag 選擇搭配物流，但此欄位填入空字串時，則會在紅陽科技付款流程中安插選擇門市的流程。
   *
   * 長度限制: 10
   */
  StoreName?: string;

  /**
   * 買方統一編號，若消費者欲開立三聯式發票，需提供公司統一編號。
   *
   * 請注意：
   * - 本功能需另外申請，請參考「電子發票」章節
   * - 買方統一編號及捐贈碼及手機條碼不能同時填寫
   */
  BuyerCid?: string;

  /**
   * 捐贈碼，消費者若想捐贈發票給指定的機關或團體，則提供該機關或團體的捐贈碼。
   *
   * 請注意：
   * - 本功能需另外申請，請參考「電子發票」章節
   * - 買方統一編號及捐贈碼及手機條碼不能同時填寫
   */
  DonationCode?: string;

  /**
   * 手機條碼，財政部手機條碼歸戶
   *
   * 請注意：
   * - 本功能需另外申請，請參考「電子發票」章節
   * - 買方統一編號及捐贈碼及手機條碼不能同時填寫
   */
  Carrier_ID?: string;

  /**
   * 物流其他資料，搭配物流時可使用這參數，
   *
   * 請參考金流串接技術手冊
   */
  EDI?: string;

  /**
   * 交易檢查碼，交易檢查碼請使用 SHA1 雜湊函數產生（產生後的雜湊值需轉為全部大寫）。
   *
   * 請參考金流串接技術手冊
   */
  ChkValue: string;
}
