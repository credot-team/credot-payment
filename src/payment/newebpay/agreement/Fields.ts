/**
 * @version NDNT-1.1.7
 * 約定信用卡付款授權技術串接手冊
 */

export type UseFor = 0 | 1 | 2;
export type MobileVerify = 0 | 1 | 2;
export type TokenStatus = 0 | 1;
export type CAUTokenCreateStatus = 0 | 1;
export type CardStatus = 'ACTIVE' | 'CARD_NOT_ALLOWED' | string;

/** NPA-F011 TradeInfo 請求參數 */
export type AgreementOrderTradeInfo = {
  MerchantID: string;
  RespondType: 'JSON';
  TimeStamp: string;
  Version: '2.3';
  P3D?: '0' | '1';
  LangType?: 'zh-tw' | 'en' | 'jp';
  MerchantOrderNo: string;
  Amt: number;
  ItemDesc: string;
  ReturnURL?: string;
  NotifyURL?: string;
  ClientBackURL?: string;
  Email?: string;
  EmailModify?: 0 | 1;
  CREDITAEAGREEMENT?: 0 | 1;
  InstFlag?: string;
  OrderComment?: string;
  CREDITAGREEMENT: 1;
  CREDIT: 1;
  TokenTerm: string;
  TokenLife?: string;
  UseFor?: UseFor;
  MobileVerify?: MobileVerify;
  MobileNumber?: string;
  MobileNumberModify?: 0 | 1;
};

/** NPA-B101 PostData_ 請求參數 */
export type AgreementP1PostData = {
  TimeStamp: string;
  Version: '2.5';
  P3D?: '0' | '1';
  UseFor?: UseFor;
  MobileVerify?: MobileVerify;
  MobileNumber?: string;
  CardHolderFirstName: string;
  CardHolderLastName: string;
  CardHolderPhoneCountryCode?: string;
  CardHolderPhone?: string;
  NotifyURL?: string;
  ReturnURL?: string;
  MerchantOrderNo: string;
  Amt: number;
  ProdDesc: string;
  PayerEmail?: string;
  Inst?: string;
  CardNo: string;
  Exp: string;
  CVC: string;
  TokenSwitch: 'get';
  TokenTerm: string;
  TokenLife?: string;
};

/** NPA-B102 PostData_ 請求參數 */
export type AgreementPnPostData = {
  TimeStamp: string;
  Version: '2.5';
  P3D?: '0' | '1';
  UseFor?: UseFor;
  MobileVerify?: MobileVerify;
  MobileNumber?: string;
  CardHolderFirstName: string;
  CardHolderLastName: string;
  CardHolderPhoneCountryCode?: string;
  CardHolderPhone?: string;
  NotifyURL?: string;
  ReturnURL?: string;
  MerchantOrderNo: string;
  Amt: number;
  ProdDesc: string;
  PayerEmail?: string;
  Inst?: string;
  TokenValue: string;
  TokenTerm: string;
  TokenSwitch: 'on';
};

/** NPA-B101 / NPA-B102 幕後回應 Result */
export type AgreementBackendResult = {
  MerchantID: string;
  Amt: number;
  TradeNo: string;
  MerchantOrderNo: string;
  RespondCode: string;
  AuthBank?: string;
  Auth?: string;
  AuthDate?: string;
  AuthTime?: string;
  Card6No?: string;
  Card4No?: string;
  Exp?: string;
  Inst?: number;
  InstFirst?: number;
  InstEach?: number;
  ECI?: string;
  PaymentMethod?: string;
  IP?: string;
  EscrowBank?: string;
  CheckCode: string;
  TokenValue?: string;
  TokenLife?: string;
};

export type AgreementBackendResponse = {
  Status: 'SUCCESS' | '3dVerify' | string;
  Message: string;
  Result: AgreementBackendResult | string;
};

/** NPA-B103 / NPA-B104 EncryptData 請求參數 */
export type TokenCardRequestData = {
  MerchantID: string;
  TimeStamp: string;
  TokenTerm: string;
  TokenValue: string;
};

/** NPA-B103 查詢回應 EncryptData 內容 */
export type TokenQueryResult = {
  MemberID?: string;
  TokenTerm: string;
  TokenLife?: string;
  TokenStatus: TokenStatus;
  Card6No?: string;
  Card4No?: string;
  CAUtokenCreateStatus?: CAUTokenCreateStatus;
  CAUtokenCreateDate?: string;
};

/** NPA-B104 解綁回應 EncryptData 內容 */
export type TokenUnbindResult = {
  MerchantID: string;
  TokenTerm: string;
  TokenStatus: TokenStatus;
};

export type TokenCardResponse<T> = {
  Status: 'SUCCESS' | string;
  Message: string;
  EncryptData: string;
  HashData: string;
  UID: string;
  Version: string;
  decrypted?: T;
};

/** NPA-F011 回應 Result（NotifyURL / ReturnURL） */
export type AgreementOrderResult = {
  MerchantID: string;
  Amt: number;
  TradeNo: string;
  MerchantOrderNo: string;
  PaymentType?: string;
  RespondType?: string;
  PayTime?: string;
  IP?: string;
  EscrowBank?: string;
  AuthBank?: string;
  RespondCode?: string;
  Auth?: string;
  Card6No?: string;
  Card4No?: string;
  Exp?: string;
  Inst?: number;
  InstFirst?: number;
  InstEach?: number;
  ECI?: string;
  TokenUseStatus?: 0 | 1 | 2 | 9;
  TokenValue?: string;
  TokenLife?: string;
};

/** 4.6 CAU 信用卡更新通知 */
export type CAUNotifyResult = {
  TokenTerm: string;
  TokenLife?: string;
  cardStatus: CardStatus;
  newExpiry?: string;
};

export type CAUNotifyPayload = {
  Message: string;
  Result: CAUNotifyResult;
};
