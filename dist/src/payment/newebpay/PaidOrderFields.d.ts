import { NTCBLocate } from './NTCBLocate';
declare type InstFlags = '3' | '6' | '12' | '18' | '24' | '30';
declare type InstFlag = '1' | '0' | InstFlags | `${InstFlags},${InstFlags}` | `${InstFlags},${InstFlags},${InstFlags}` | `${InstFlags},${InstFlags},${InstFlags},${InstFlags}` | `${InstFlags},${InstFlags},${InstFlags},${InstFlags},${InstFlags}` | `${InstFlags},${InstFlags},${InstFlags},${InstFlags},${InstFlags},${InstFlags}`;
/**
 * @version v1.1.1
 * 支付請求結構
 *
 * 參考技術文件版本號 Gateway_MPG_1.1.1
 *
 * 技術文件連結: {@link https://www.newebpay.com/website/Page/download_file?name=Newebpay_MPG_1.1.1.pdf}
 */
export interface PaidOrderFields {
    /**
     * 商店代號
     *
     * 藍新金流商店代號
     */
    MerchantID: string;
    /**
     * 交易資料 AES 加密
     *
     * 將交易資料參數（下方列表中參數）透過商店 Key 及 IV 進行 AES 加密。
     */
    TradeInfo: TradeInfo | string;
    /**
     * 交易資料 SHA256 加密
     *
     * 將交易資料經過上述 AES 加密過的字串，透過商店 Key 及 IV 進行 SHA256 加密。
     */
    TradeSha: string;
    /**
     * 串接程式版本
     *
     * 請帶 1.6。
     */
    Version: '1.6';
}
/**
 * 交易資料
 */
export declare type TradeInfo = {
    /**
     * 商店代號
     *
     * 藍新金流商店代號
     */
    MerchantID: string;
    /**
     * 回傳格式
     *
     * JSON 或是 String (本套件一慮使用 JSON 格式)
     */
    RespondType: 'JSON';
    /**
     * 時間戳記 (秒)
     *
     * 以 1970-01-01 00:00:00 為起點
     */
    TimeStamp: string;
    /**
     * 串接程式版本
     *
     * 請帶 1.6
     */
    Version: '1.6';
    /**
     * MPG 頁面顯示的文字語系
     *
     * - 繁體中文: zh-tw;
     * - 英文: en;
     * - 日文: jp;
     *
     * 預設為繁體中文 (zh-tw)
     */
    LangType?: 'en' | 'zh-tw' | 'jp';
    /**
     * 商店訂單編號
     *
     * 商店自訂訂單編號，限英、數字、”_ ”格式。同一商店中此編號不可重覆。
     *
     * 長度限制為 30 字元
     */
    MerchantOrderNo: string;
    /**
     * 訂單金額 (新台幣)
     *
     * 純數字不含符號
     */
    Amt: number;
    /**
     * 商品資訊
     *
     * 編碼為 Utf-8 格式，限制長度 50 字元。
     *
     * 請勿使用斷行符號、單引號等特殊符號，避免無法顯示完整付款頁面。
     *
     * 若使用特殊符號，系統將自動過濾。
     */
    ItemDesc: string;
    /**
     * 交易限制秒數
     *
     * 限制交易的秒數，當秒數倒數至 0 時，交易當做失敗。
     *
     * 需大於 60 或小於 900 (當提供的值不在範圍內時，將使用較接近的值取代)
     *
     * 若未帶此參數，或是為 0 時，會視作為不啟用交易限制秒數
     */
    TradeLimit?: number;
    /**
     * 繳費有效期限 (適用於非即時交易)
     *
     * 格式為 'YYYYMMDD'，例：20140620
     *
     * 此參數若為空值，系統預設為 7 天。自取號時間起算至第 7 天 23:59:59。
     * 例：2014-06-23 14:35:51 完成取號，則繳費有效期限為 2014-06-29 23:59:59。
     *
     * 可接受最大值為 180 天。
     */
    ExpireDate?: string;
    /**
     * 支付完成返回商店網址
     *
     * 交易完成後，以 Form Post 方式導回商店頁面。
     *
     * 若支付工具為玉山 Wallet、台灣 Pay 或本欄位為空值，於交易完成後，消費者將停留在藍新金流付款或取號結果頁面。
     *
     * 只接受 80 與 443 Port。
     */
    ReturnURL?: string;
    /**
     * 支付通知網址
     *
     * 以幕後方式回傳給商店相關支付結果資料；請參考七、交易支付系統回傳參數說明。
     *
     * 只接受 80 與 443 Port
     */
    NotifyURL?: string;
    /**
     * 商店取號網址
     *
     * 系統取號後以  form post 方式將結果導回商店指定的網址；請參考八、取號完成系統回傳參數說明。
     *
     * 此參數若為空值，則會顯示取號結果在藍新金流頁面。
     */
    CustomerURL?: string;
    /**
     * 返回商店網址
     *
     * 在藍新支付頁或藍新交易結果頁面上所呈現之返回鈕，我方將依據此參數之設定值進行設定，引導商店消費者依以此參數  網址返回商店指定的頁面。
     *
     * 此參數若為空值時，則無返回鈕。
     */
    ClientBackURL?: string;
    /**
     * 付款人電子信箱
     *
     * 於交易完成或付款完成時，通知付款人使用
     */
    Email: string;
    /**
     * 付款人電子信箱是否開放修改
     *
     * 設定於 MPG 頁面，付款人電子信箱欄位是否開放讓付款人修改。
     * - 1=可修改
     * - 0=不可修改
     *
     * 當未提供此參數時，將預設為可修改。
     */
    EmailModify?: 0 | 1;
    /**
     * 藍新金流會員
     *
     * - 1 = 須要登入藍新金流會員
     * - 0 = 不須登入藍新金流會員
     */
    LoginType: 0 | 1;
    /**
     * 商店備註
     *
     * 限制長度為 300 字。
     *
     * 若有提供此參數，將會於 MPG 頁面呈現商店備註內容。
     */
    OrderComment?: string;
    /**
     * 信用卡一次付清啟用
     *
     * 設定是否啟用信用卡一次付清支付方式。
     * - 1 = 啟用
     * - 0 = 不啟用
     *
     * 當未提供此參數時表示不啟用。
     */
    CREDIT?: 0 | 1;
    /**
     * Google Pay 啟用
     *
     * 設定是否啟用 Google Pay 支付方式。
     * - 1 = 啟用
     * - 0 = 不啟用
     *
     * 當未提供此參數時表示不啟用。
     */
    ANDROIDPAY?: 0 | 1;
    /**
     * Samsung Pay 啟用
     *
     * 設定是否啟用 Samsung Pay 支付方式。
     * - 1 = 啟用
     * - 0 = 不啟用
     *
     * 當未提供此參數時表示不啟用。
     */
    SAMSUNGPAY?: 0 | 1;
    /**
     * LINE Pay 啟用
     *
     * 設定是否啟用 LINE Pay 支付方式。
     * - 1 = 啟用
     * - 0 = 不啟用
     *
     * 當未提供此參數時表示不啟用。
     */
    LINEPAY?: 0 | 1;
    /**
     * LINE PAY 產品圖檔連結網址
     *
     * LINE Pay[啟用]時，會員(商店)視需求傳遞此參數。
     *
     * 此連結的圖檔將顯示於 LinePay 付款前的產品圖片區，若無產品圖檔連結網址，會使用藍新系統預設圖檔。
     *
     * 圖片建議使用 84*84 像素(若大於或小於該尺寸有可能造成破圖或變形)。
     *
     * 檔案類型僅支援  jpg 或 png。
     */
    ImageUrl?: string;
    /**
     * 信用卡分期付款啟用
     *
     * 此欄位值=1 時，即代表開啟所有分期期別，且不可帶入其他期別參數。
     *
     * 此欄位值為下列數值時，即代表開啟該分期期別。
     * - 3=分 3 期功能
     * - 6=分 6 期功能
     * - 12=分 12 期功能
     * - 18=分 18 期功能
     * - 24=分 24 期功能
     * - 30=分 30 期功能
     *
     * 同時開啟多期別時，將此參數用 ”，”(半形) 分隔，例如：3,6,12，代表開啟分 3、6、12 期的功能。
     *
     * 此欄位值 =0 或未提供此參數時，即代表不開啟分期。
     */
    InstFlag?: InstFlag;
    /**
     * 信用卡紅利啟用
     *
     * 設定是否啟用信用卡紅利支付方式。
     * - 1 = 啟用
     * - 0 = 不啟用
     *
     * 當未提供此參數時表示不啟用。
     */
    CreditRed?: 0 | 1;
    /**
     * 信用卡銀聯卡啟用啟用
     *
     * 設定是否啟用信用卡銀聯卡支付方式。
     * - 1 = 啟用
     * - 0 = 不啟用
     *
     * 當未提供此參數時表示不啟用。
     */
    UNIONPAY?: 0 | 1;
    /**
     * WEBATM 啟用
     *
     * 設定是否啟用 WEBATM 支付方式。
     * - 1 = 啟用
     * - 0 = 不啟用
     *
     * 當未提供此參數時表示不啟用。
     */
    WEBATM?: 0 | 1;
    /**
     * ATM 轉帳啟用
     *
     * 設定是否啟用 ATM 轉帳支付方式。
     * - 1 = 啟用
     * - 0 = 不啟用
     *
     * 當未提供此參數時表示不啟用。
     */
    VACC?: 0 | 1;
    /**
     * 超商代碼繳費啟用
     *
     * 設定是否啟用超商代碼繳費支付方式。
     * - 1 = 啟用
     * - 0 = 不啟用
     *
     * 當該筆訂單金額小於 30 元或超過 2 萬元時，即使此參數設定為啟用，MPG 付款頁面仍不會顯示此支付方式選項。
     *
     * 當未提供此參數時表示不啟用。
     */
    CVS?: 0 | 1;
    /**
     * 超商條碼繳費啟用
     *
     * 設定是否啟用超商條碼繳費支付方式。
     * - 1 = 啟用
     * - 0 = 不啟用
     *
     * 當該筆訂單金額小於 20 元或超過 4 萬元時，即使此參數設定為啟用，MPG 付款頁面仍不會顯示此支付方式選項。
     *
     * 當未提供此參數時表示不啟用。
     */
    BARCODE?: 0 | 1;
    /**
     * 支付寶啟用
     *
     * 設定是否啟用支付寶支付方式。
     * - 1 = 啟用
     * - 0 = 不啟用
     *
     * 當未提供此參數時表示不啟用。
     */
    ALIPAY?: 0 | 1;
    /**
     * ezPay 電子錢包啟用
     *
     * 設定是否啟用 ezPay 電子錢包支付方式。
     * - 1 = 啟用
     * - 0 = 不啟用
     *
     * 當未提供此參數時表示不啟用。
     */
    P2G?: 0 | 1;
    /**
     * 玉山 Wallet 啟用
     *
     * 設定是否啟用玉山 Wallet支付方式。
     * - 1 = 啟用
     * - 0 = 不啟用
     *
     * 當未提供此參數時表示不啟用。
     */
    ESUNWALLET?: 0 | 1;
    /**
     * 台灣 Pay 啟用
     *
     * 設定是否啟用台灣 Pay 支付方式。
     * - 1 = 啟用
     * - 0 = 不啟用
     *
     * 當未提供此參數時表示不啟用。
     */
    TAIWANPAY?: 0 | 1;
    /**
     * 物流啟用
     *
     * 使用前，須先登入藍新金流會員專區啟用物流並設定退貨門市與取貨人相關資訊。
     * - 1 = 啟用超商取貨不付款
     * - 2 = 啟用超商取貨付款
     * - 3 = 啟用超商取貨不付款及超商取貨付款
     * - 0 = 不啟用
     *
     * 當該筆訂單金額小於 30 元或大於 2 萬元時，即使此參數設定為啟用，MPG 付款頁面仍不會顯示此支付方式選項。
     *
     * 當未提供此參數時表示不啟用。
     */
    CVSCOM?: 0 | 1 | 2 | 3;
} & Partial<AliPayFields> & NTCBFields & Partial<CreditToken>;
declare type AliPaySerialField<F extends string, T> = {
    [k in `${F}${number}`]: T;
};
/**
 * 適用跨境支付參數說明
 *
 * 當有啟用支付寶支付方式時，提供下列參數。
 */
declare type AliPayFields = {
    /**
     * 收貨人姓名
     */
    Receiver: string;
    /**
     * 收貨人主要聯絡電話
     */
    Tel1: string;
    /**
     * 收貨人次要聯絡電話
     */
    Tel2: string;
    /**
     * 商品項次
     *
     * 此次交易的商品項次。例：此訂單包含商品 A、商品 B 兩種商品品項時，此參數為 2。
     */
    Count: number;
    /**
     * 商品編號
     *
     * 長度限制為 12 字元
     *
     * Pid 參數數量需與 Count 參數中的數值相同。
     * - 例：當 Count=2 時，則需有 2 個 Pid 參數「Pid1」、「Pid2」。「Pid1」為商品 A 的商品編號，「Pid2」為商品 B 的商品編號。
     */
    Pid1: number;
    /**
     * 商品名稱
     *
     * 長度限制為 60 字元。
     *
     * Title 參數數量需與 Count 參數中的數值相同。
     * - 例：當 Count=2 時，則需有 2 個 Title 參數「Title1」、「Title2」。「Title1」為商品 A的商品名稱，「Title2」為商品 B 的商品名稱。
     */
    Title1: string;
    /**
     * 商品說明
     *
     * 長度限制為 100 字元。
     *
     * Desc 參數數量需與 Count 參數中的數值相同。
     * - 例：當 Count=2 時，則需有 2 個 Desc 參數「Desc1」、「Desc2」。「Desc1」為商品 A的商品說明，「Desc2」為商品 B 的商品說明。
     */
    Desc1: string;
    /**
     * 商品單價(台幣)
     *
     * Price 參數數量需與 Count 參數中的數值相同。
     * - 例：當 Count=2 時，則需有 2 個 Price 參數「Price 1」、「Price 2」。「Price 1」為商品A 的商品單價，「Price 2」為商品 B 的商品單價。
     */
    Price1: number;
    /**
     * 商品數量
     *
     * Qty 參數數量需與 Count 參數中的數值相同。
     * - 例：當 Count=2 時，則需有 2 個 Qty 參數「Qty 1」、「Qty 2」。「Qty 1」為商品 A的商品數量，「Qty 2」為商品 B 的商品數量。
     */
    Qty1: number;
} & AliPaySerialField<'Pid', number> & AliPaySerialField<'Title', string> & AliPaySerialField<'Desc', string> & AliPaySerialField<'Price', number> & AliPaySerialField<'Qty', number>;
/**
 * 用國民旅遊卡交易參數
 */
declare type NTCBFields = {
    /**
     * 信用卡國民旅遊卡交易註記
     *
     * 註記此筆交易是否為國民旅遊卡交易。
     * - 1 = 國民旅遊卡交易
     * - 0 = 非國民旅遊卡交易
     *
     * 當未提供此參數時表示非國民旅遊卡交易。
     */
    NTCB?: 0 | 1;
    /**
     * 旅遊地區代號，請參考旅遊地區代號對照表。
     * - 例：如旅遊地區為台北市則此欄位為 001。
     */
    NTCBLocate?: NTCBLocate;
    /**
     * 國民旅遊卡起始日期
     *
     * 格式為：YYYY-MM-DD
     * - 例：2015-01-01
     */
    NTCBStartDate?: string;
    /**
     * 國民旅遊卡結束日期
     *
     * 格式為：YYYY-MM-DD
     * - 例：2015-01-01
     */
    NTCBEndDate?: string;
};
/**
 * 信用卡快速結帳參數
 *
 * 當商店欲提供信用卡快速結帳功能，需於傳送交易參數時同步提供下列參數。
 */
declare type CreditToken = {
    /**
     * 付款人綁定資料，長度限制為 20 字元。
     *
     * 可對應付款人之資料，用於綁定付款人與信用卡卡號時使用，例：會員編號、Email。
     *
     * 限英、數字，「.」、「_」、「@」、「-」格式。
     */
    TokenTerm: string;
    /**
     * 指定付款人信用卡快速結帳必填欄位
     *
     * 可指定付款人需填寫的信用卡資訊，不同的參數值對應填寫不同的資訊，參數值與對應資訊說明如下：
     * - 1 = 必填信用卡到期日與背面末三碼
     * - 2 = 必填信用卡到期日
     * - 3 = 必填背面末三碼
     *
     * 未有此參數或帶入其他無效參數，系統預設為參數 1。
     */
    TokenTermDemand?: 1 | 2 | 3;
};
export {};
