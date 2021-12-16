/**
 * @version v4.1.2
 * 支付結果結構
 *
 * 參考技術文件版本號 v4.1.2
 *
 * 技術文件連結: {@link https://www.sunpay.com.tw/forms_download/紅陽科技-金流串接技術手冊v4.1.2.pdf}
 */
export interface PaidResultFields {
    /**
     * 紅陽交易編號
     *
     * 該筆交易編號（組成內容以英數字為主）
     */
    buysafeno: string;
    /**
     * 特店代號
     */
    web: string;
    /**
     * 特店訂單編號
     */
    Td?: string;
    /**
     * 交易金額
     */
    MN: string;
    /**
     * 特店網站名稱，此為特店在紅陽金流系統備註的網站名稱
     */
    webname?: string;
    /**
     * 消費者姓名
     *
     * 因個資法規定，避免傳送時洩漏個資，因此會將部分字元轉換為隱藏。例：王○明
     */
    Name: string;
    /**
     * 備註 1，將交易送出時的內容，原封不動回傳到特店端系統
     */
    note1?: string;
    /**
     * 備註 2，將交易送出時的內容，原封不動回傳到特店端系統
     */
    note2?: string;
    /**
     * 交易授權碼 [信用卡專屬欄位]
     *
     * 信用卡授權成功時所取得的授權碼，銀聯卡交易不論成功失敗均無授權碼
     */
    ApproveCode?: string;
    /**
     * 信用卡號後4碼 [信用卡專屬欄位]
     *
     * 銀聯卡交易無法取得銀聯卡卡號後 4 碼
     */
    Card_NO?: string;
    /**
     * 傳送方式
     *
     * - 1：背景傳送
     * - 2：網頁傳送
     *
     * 銀聯卡交易因系統限制，僅以背景方式傳送至特店接收網址，請特別注意。
     */
    SendType?: string;
    /**
     * 回覆代碼 [信用卡、銀聯卡、網路 ATM、台灣 Pay 專屬欄位]
     *
     * 00(數字)代表付款成功，其餘為交易失敗
     */
    errcode?: string;
    /**
     * 回覆代碼解釋 [信用卡、銀聯卡、網路 ATM、台灣 Pay 專屬欄位]
     */
    errmsg?: string;
    /**
     * 交易類別 [信用卡、銀聯卡專屬欄位]
     *
     * - 0：信用卡交易
     * - 1：銀聯卡交易
     * - 3：Apple Pay、Google Pay
     */
    Card_Type?: string;
    /**
     * 用戶編號 [超商代收（條碼繳費單）、ATM 轉帳（虛擬帳號）專屬欄位]
     *
     * 本欄位可供特店自行定義，例如會員編號
     */
    UserNo?: string;
    /**
     * 超商繳款第 1~3 段條碼 [超商代收（條碼繳費單）專屬欄位]
     *
     * 超商繳款專用第 1~3 段條碼，順序不可顛倒，金額大於兩萬時無法使用超商條碼繳費單繳款。
     */
    BarcodeA?: string;
    /**
     * @see BarcodeA
     */
    BarcodeB?: string;
    /**
     * @see BarcodeA
     */
    BarcodeC?: string;
    /**
     * 郵局繳款第 1~3 段條碼 [超商代收（條碼繳費單）專屬欄位]
     *
     * 郵局繳款專用第 1~3 段條碼，順序不可顛倒，金額大於兩萬時無法使用超商條碼繳費單繳款。
     */
    PostBarcodeA?: string;
    /**
     * @see PostBarcodeA
     */
    PostBarcodeB?: string;
    /**
     * @see PostBarcodeA
     */
    PostBarcodeC?: string;
    /**
     * 銀行代碼
     *
     * [信用卡專屬欄位]
     *
     * 持卡人之信用卡所屬發卡銀行之代碼，例如 822 為中國信託、007 為第一銀行，完整代碼表可自行上網搜尋「銀行代碼」，如為外國信用卡則為空字串。
     *
     * [ATM 轉帳（虛擬帳號）專屬欄位]
     *
     * 此為該筆交易繳款專用轉帳帳號之銀行代碼（如需要時包含分行代碼）。若 AgencyType（繳款方式）指定為「1」（只產生條碼繳費單），則回傳空字串。更多說明請參考下述 ATM 轉帳帳號與分行名稱說明。
     */
    BankCode?: string;
    /**
     * ATM 轉帳帳號
     *
     * 此為該筆交易繳款專用轉帳帳號及分行名稱。若AgencyType（繳款方式）指定為「1」（只產生條碼繳費單），則回傳空字串。
     */
    EntityATM?: string;
    /**
     * ATM 轉帳分行名稱
     * @see EntityATM
     */
    BankName?: string;
    /**
     * 繳款代碼 [超商代收（代碼）專屬欄位]
     *
     * 此為該筆交易繳款專用代碼，無法繳交別的交易。
     */
    paycode?: string;
    /**
     * 可繳款超商 [超商代收（代碼）專屬欄位]
     *
     * - 4：全家超商
     * - 5：統一超商
     * - 6：OK 超商
     * - 7：萊爾富超商
     */
    PayType?: string;
    /**
     * 交貨便代碼
     *
     * - 若消費者選擇超商取貨，則會產生交貨便代碼供特店至超商寄件使用（請參考「超商取貨物流流程」一章說明）。
     * - 若未使用超商取貨、或交易失敗及產生交貨便代碼失敗時為空字串。（請參考「超商取貨物流流程」一章說明）。
     */
    CargoNo?: string;
    /**
     * 取貨門市店號
     *
     * 消費者選擇的超商門市資料，若交易失敗或產生交貨便代碼失敗則為空字串。
     */
    StoreID?: string;
    /**
     * 取貨門市店名
     * @see StoreID
     */
    StoreName?: string;
    /**
     * 發票號碼
     *
     * 請參考金流串接技術手冊
     */
    InvoiceNo?: string;
    /**
     * 日期格式： YYYYMMDD，例如 20170824
     */
    PayDate?: string;
    /**
     * 時間格式：HHMM，例如 1530
     */
    PayTime?: string;
    /**
     * 交易檢查碼
     *
     * 請參考金流串接技術手冊
     */
    ChkValue: string;
}
