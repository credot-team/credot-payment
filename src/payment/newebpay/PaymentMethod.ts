import { PayMethods } from '../PayMethods';

export const PaymentTypes = {
  /**
   * 信用卡
   */
  CREDIT: PayMethods.Credit,

  /**
   * WebATM
   */
  WEBATM: PayMethods.WebATM,

  /**
   * ATM 轉帳
   */
  VACC: PayMethods.VACC,

  /**
   * 超商代碼繳費
   */
  CVS: PayMethods.CVS,

  /**
   * 超商條碼繳費
   */
  BARCODE: PayMethods.CVSBarcode,

  /**
   * 超商取貨付款
   */
  CVSCOM: PayMethods.CVSCOM,

  /**
   * 微信支付-簡單付
   */
  EZPWECHAT: PayMethods.ezPay_Wechat,

  /**
   * 支付寶-簡單付
   */
  EZPALIPAY: PayMethods.ezPay_Alipay,

  /**
   * ezPay 電子錢包
   */
  EZPAY: PayMethods.ezPay,

  /**
   * LINE Pay
   */
  LINEPAY: PayMethods.LinePay,

  /**
   * 玉山 Wallet
   */
  ESUNWALLET: PayMethods.EsunWallet,

  /**
   * 台灣 Pay
   */
  TAIWANPAY: PayMethods.TaiwanPay,
};

export const CreditType = {
  /**
   * 台灣發卡機構核發之信用卡
   */
  CREDIT: '台灣發卡機構核發之信用卡',

  /**
   * 國外發卡機構核發之卡
   */
  FOREIGN: '國外發卡機構核發之卡',

  /**
   * 銀聯卡
   */
  UNIONPAY: '銀聯卡',

  /**
   * Google Pay
   */
  GOOGLEPAY: 'GooglePay',

  /**
   * Samsung Pay
   */
  SAMSUNGPAY: 'SamsungPay',

  /**
   * 動態貨幣轉換
   *
   * 僅支援台新銀行一次付清之代收商店。
   */
  DCC: '動態貨幣轉換',
};
