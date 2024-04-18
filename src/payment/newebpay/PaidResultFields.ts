import { CreditType, PaymentTypes } from './PaymentMethod';
import { AuthBanks } from './AuthBanks';
import { PayMethods } from '../PayMethods';

type KeyofPaymentTypes = keyof typeof PaymentTypes;

/**
 * @version v1.1.1
 * 支付請求結構
 *
 * 參考技術文件版本號 Gateway_MPG_1.1.3
 *
 * 技術文件連結: {@link https://www.newebpay.com/website/Page/download_file?name=NewebPay_MPG%20API%20Specification_MPG_1.1.3.pdf}
 */
export interface PaidResultFields<Decoded extends boolean, PayMethod extends PayMethods | unknown> {
  /**
   * 回傳狀態
   *
   * - 若交易付款成功，則回傳 SUCCESS。
   * - 若交易付款失敗，則回傳錯誤代碼。
   *
   * 錯誤代碼請參考十一、錯誤代碼。
   */
  Status: 'SUCCESS' | string;

  /**
   * 商店代號
   */
  MerchantID: string;

  /**
   * 交易資料 AES 加密
   *
   * 將交易資料參數（下方列表中參數）透過商店 Key 及 IV 進行 AES 加密。
   *
   * 範例請參考九、交易資料 AES 加解密
   */
  TradeInfo: Decoded extends true ? TradeInfo<PayMethod> : string;

  /**
   * 交易資料 SHA256 加密
   *
   * 將交易資料經過上述 AES 加密過的字串，透過商店 Key 及 IV 再進行 SHA256 加密。
   *
   * 範例請參考十、交易資料 SHA256 加密
   */
  TradeSha: string;

  /**
   * 串接程式版本
   */
  Version: string;

  /**
   * 加密模式
   *
   * - 若商店設定 EncryptType 為 1，則會回傳此參數
   * - 若商店設定 EncryptType 為 0 或未有此參數，則不會回傳此參數
   */
  EncryptType?: 1;
}

type TradeInfo<PayMethod extends PayMethods | unknown> = {
  /**
   * 回傳狀態
   *
   * - 若交易付款成功，則回傳 SUCCESS。
   * - 若交易付款失敗，則回傳錯誤代碼。
   *
   * 錯誤代碼請參考十一、錯誤代碼。
   */
  Status: string;

  /**
   * 回傳訊息
   *
   * 文字，敘述此次交易狀態。
   */
  Message: string;

  /**
   * 回傳參數
   *
   * 當 RespondType 為 JSON 時，回傳參數會放至此;
   */
  Result: Result<PayMethod>;
};

/**
 * 回傳參數，根據提供的泛型型別決定不同付款方式的資料欄位
 */
type Result<PayMethod extends PayMethods | unknown> = GeneralFields &
  (PayMethod extends
    | PayMethods.Credit
    | PayMethods.CreditInst
    | PayMethods.CreditReward
    | PayMethods.SamsungPay
    | PayMethods.GooglePay
    | PayMethods.UnionPay
    ? CreditCardFields
    : PayMethod extends PayMethods.WebATM | PayMethods.VACC
      ? ATMFields
      : PayMethod extends PayMethods.CVS
        ? CVSCodeFields
        : PayMethod extends PayMethods.CVSBarcode
          ? CVSBarcodeFields
          : PayMethod extends PayMethods.CVSCOM
            ? CVSCOMFields
            : PayMethod extends PayMethods.ezPay | PayMethods.ezPay_Wechat | PayMethods.ezPay_Alipay
              ? CrossBorderFields
              : PayMethod extends PayMethods.EsunWallet
                ? EsunWalletFields
                : PayMethod extends PayMethods.TaiwanPay
                  ? TaiwanPayFields
                  : Partial<CreditCardFields> &
                      Partial<CVSCodeFields> &
                      Partial<CVSBarcodeFields> &
                      Partial<CVSCOMFields> &
                      Partial<CrossBorderFields> &
                      Partial<EsunWalletFields> &
                      Partial<TaiwanPayFields>);

/**
 * 所有支付方式共同回傳參數
 */
type GeneralFields = {
  /**
   * 藍新金流商店代號
   */
  MerchantID: string;

  /**
   * 交易金額 (新台幣)
   *
   * 純數字不含符號
   */
  Amt: number;

  /**
   * 藍新金流交易序號
   *
   * 藍新金流在此筆交易成功時所產生的序號。
   */
  TradeNo: string;

  /**
   * 商店訂單編號
   */
  MerchantOrderNo: string;

  /**
   * 支付方式 (請參考 附件一)
   */
  PaymentType: KeyofPaymentTypes;

  /**
   * 回傳格式
   *
   * JSON 格式
   */
  RespondType: string;

  /**
   * 支付完成時間
   *
   * 回傳格式為：2014-06-25 16:43:49
   */
  PayTime?: string;

  /**
   * 交易 IP
   *
   * 付款人取號或交易時的 IP。
   */
  IP: string;

  /**
   * 該筆交易款項保管銀行。
   *
   * 如商店是直接與收單機構簽約的閘道模式如：支付寶-玉山銀行、ezPay 電子錢包、LINE Pay，當使用信用卡支付時，本欄位的值會以空值回傳。
   *
   * 款項保管銀行英文代碼與中文名稱對應如下：
   * - ［HNCB］：華南銀行
   */
  EscrowBank: string;
};

/**
 * 信用卡支付回傳參數（一次付清、Google Pay、Samaung Pay、國民旅遊卡、銀聯）
 */
type CreditCardFields = {
  /**
   * 收單金融機構
   */
  AuthBank: keyof typeof AuthBanks;

  /**
   * 金融機構回應碼
   *
   * 由收單機構所回應的回應碼。
   *
   * 若交易送至收單機構授權時已是失敗狀態，則本欄位的值會以空值回傳。
   */
  RespondCode: string;

  /**
   * 授權碼
   *
   * 由收單機構所回應的授權碼。
   *
   * 若交易送至收單機構授權時已是失敗狀態，則本欄位的值會以空值回傳。
   */
  Auth: string;

  /**
   * 卡號前六碼
   *
   * 若交易送至收單機構授權時已是失敗狀態，則本欄位的值會以空值回傳。
   */
  Card6No: string;

  /**
   * 卡號末四碼
   *
   * 若交易送至收單機構授權時已是失敗狀態，則本欄位的值會以空值回傳。
   */
  Card4No: string;

  /**
   * 信用卡分期交易期別
   */
  Inst: number;

  /**
   * 信用卡分期交易首期金額
   */
  InstFirst: number;

  /**
   * 信用卡分期交易每期金額
   */
  InstEach: number;

  /**
   * ECI 值
   *
   * 3D 回傳值 eci=1,2,5,6，代表為 3D 交易。
   *
   * 若交易送至收單機構授權時已是失敗狀態，則本欄位的值會以空值回傳
   */
  ECI: string;

  /**
   * 信用卡快速結帳使用狀態
   * - 0 = 該筆交易為非使用信用卡快速結帳功能。
   * - 1 = 該筆交易為首次設定信用卡快速結帳功能。
   * - 2 = 該筆交易為使用信用卡快速結帳功能。
   * - 9 = 該筆交易為取消信用卡快速結帳功能功能。
   */
  TokenUseStatus: 0 | 1 | 2 | 9;

  /**
   * 紅利折抵後實際金額
   *
   * 扣除紅利交易折抵後的實際授權金額。
   * - 例：1000 元之交易，紅利折抵 60 元，則紅利折抵後實際金額為 940 元。
   *
   * 若紅利點數不足，會有以下狀況：
   * - 紅利折抵交易失敗，回傳參數數值為 0。
   * - 紅利折抵交易成功，回傳參數數值為訂單金額。
   * - 紅利折抵交易是否成功，視該銀行之設定為準。
   *
   * 僅有使用紅利折抵交易時才會回傳此參數。
   *
   * 若紅利折抵掉全部金額，則此欄位回傳參數數值也會是 0，交易成功或交易失敗，請依回傳參數［Status］回覆為準。
   */
  RedAmt: number;

  /**
   * 交易類別
   *
   * 將依據此筆交易之信用卡類別回傳相對應的參數
   */
  PaymentMethod: keyof typeof CreditType;

  /**
   * 外幣金額 (浮點數)
   *
   * DCC 動態貨幣轉換交易才會回傳的參數
   *
   * 註：僅支援台新銀行一次付清之代收商店。
   */
  DCC_Amt?: number;

  /**
   * 匯率 (浮點數)
   *
   * DCC 動態貨幣轉換交易才會回傳的參數
   *
   * 註：僅支援台新銀行一次付清之代收商店。
   */
  DCC_Rate?: number;

  /**
   * 風險匯率 (浮點數)
   *
   * DCC 動態貨幣轉換交易才會回傳的參數
   *
   * 註：僅支援台新銀行一次付清之代收商店。
   */
  DCC_Markup?: number;

  /**
   * 幣別
   *
   * DCC 動態貨幣轉換交易才會回傳的參數
   * - 例如：USD、JPY、MOP...
   *
   * 註：僅支援台新銀行一次付清之代收商店。
   */
  DCC_Currency?: string;

  /**
   * 幣別代碼
   *
   * DCC 動態貨幣轉換交易才會回傳的參數
   * - 例如：MOP = 446...
   *
   * 註：僅支援台新銀行一次付清之代收商店。
   */
  DCC_Currency_Code?: number;
};

/**
 * WEBATM、ATM 繳費回傳參數
 */
type ATMFields = {
  /**
   * 付款人金融機構代碼
   *
   * 由代收款金融機構所回應的付款人金融機構代碼。
   */
  PayBankCode: string;

  /**
   * 付款人金融機構帳號末五碼
   *
   * 由代收款金融機構所回應的付款人金融機構帳號末五碼。
   *
   * 若收款金融機構無回覆付款人金融機構帳號末五碼則回傳空值
   */
  PayerAccount5Code: string;
};

/**
 * 超商代碼繳費回傳參數
 */
type CVSCodeFields = {
  /**
   * 繳費代碼
   */
  CodeNo: string;

  /**
   * 繳費門市類別
   * - 1 = 7-11 統一超商
   * - 2 = 全家便利商店
   * - 3 = OK 便利商店
   * - 4 = 萊爾富便利商店
   */
  StoreType: 1 | 2 | 3 | 4;

  /**
   * 繳費門市代號 (全家回傳門市中文名稱)
   */
  StoreID: string;
};

/**
 * 超商條碼繳費回傳參數
 */
type CVSBarcodeFields = {
  /**
   * 繳費條碼第一段條碼資料
   */
  Barcode_1: string;

  /**
   * 繳費條碼第二段條碼資料
   */
  Barcode_2: string;

  /**
   * 繳費條碼第三段條碼資料
   */
  Barcode_3: string;

  /**
   * 繳費超商
   *
   * 付款人至超商繳費，該收款超商的代碼
   * - SEVEN = 7-11
   * - FAMILY = 全家
   * - OK = OK 超商
   * - HILIFE = 萊爾富
   */
  PayStore: 'SEVEN' | 'FAMILY' | 'OK' | 'HILIFE';
};

/**
 * 超商物流回傳參數
 */
type CVSCOMFields = {
  /**
   * 取貨門市編號
   */
  StoreCode: string;

  /**
   * 取貨門市中文名稱
   */
  StoreName: string;

  /**
   * 超商類別名稱
   *
   * 回傳[全家]、[7-ELEVEN]
   */
  StoreType: string;

  /**
   * 取貨門市地址
   */
  StoreAddr: string;

  /**
   * 取件交易方式
   * - 1 = 取貨付款
   * - 3 = 取貨不付款
   */
  TradeType: 1 | 3;

  /**
   * 取貨人姓名
   */
  CVSCOMName: string;

  /**
   * 取貨人手機號碼
   */
  CVSCOMPhone: string;

  /**
   * 物流訂單序號 (即寄件代碼)
   */
  LgsNo: string;

  /**
   * 物流型態
   *
   * 回傳 B2C、C2C
   */
  LgsType: 'B2C' | 'C2C';
};

/**
 * 跨境支付回傳參數(包含簡單付電子錢包、簡單付微信支付、簡單付支付寶)
 */
type CrossBorderFields = {
  /**
   * 跨境通路類型
   *
   * 該筆交易之跨境收款通路。
   * - ALIPAY = 支付寶
   * - WECHATPAY = 微信支付
   * - ACCLINK = 約定連結帳戶
   * - CREDIT = 信用卡
   * - CVS = 超商代碼
   * - P2GEACC = 簡單付電子帳戶轉帳
   * - VACC = ATM 轉帳
   * - WEBATM = WebATM 轉帳
   */
  ChannelID: 'ALIPAY';

  /**
   * 跨境通路交易序號
   *
   * 為該筆交易於跨境通路的交易序號
   */
  ChannelNo: string;
};

/**
 * 玉山 Wallet 回傳參數
 */
type EsunWalletFields = {
  /**
   * 實際付款金額
   */
  PayAmt: number;

  /**
   * 紅利折抵金額 (若有使用紅利則會回傳本欄資訊)
   */
  RedDisAmt: number;
};

/**
 * 台灣 Pay 回傳參數
 */
type TaiwanPayFields = {
  /**
   * 該交易實際付款的金額
   */
  PayAmt: number;
};
