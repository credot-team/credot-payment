"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseErrorMessage = exports.parseErrorCode = void 0;
const OrderStatus_1 = require("../OrderStatus");
const ERROR_CODE_TABLE = {
    SUCCESS: OrderStatus_1.OrderStatus.success,
};
function parseErrorCode(code) {
    var _a;
    return (_a = ERROR_CODE_TABLE[code]) !== null && _a !== void 0 ? _a : OrderStatus_1.OrderStatus.error;
}
exports.parseErrorCode = parseErrorCode;
const ERROR_CODE_MESSAGE = {
    SUCCESS: '交易成功',
    MPG01001: '會員參數 不可空白/設定錯誤',
    MPG01002: '時間戳記不可空白',
    MPG01005: 'TokenTerm 不可空白/設定錯誤',
    MPG01008: '分期參數設定錯誤',
    MPG01009: '商店代號不可空白',
    MPG01010: '程式版本設定錯誤',
    MPG01011: '回傳規格設定錯誤',
    MPG01012: '商店訂單編號不可空白/設定錯誤',
    MPG01013: '付款人電子信箱設定錯誤',
    MPG01014: '網址設定錯誤 (ReturnURL、NotifyURL、CustomerURL、ClientBackURL)',
    MPG01015: `訂單金額不可空白/設定錯誤
  此筆交易超過商店單筆金額限制，請與商店連繫`,
    MPG01016: '檢查碼不可空白',
    MPG01017: '商品資訊不可空白',
    MPG01018: '繳費有效期限設定錯誤',
    MPG01023: '交易加密資料不可空白',
    MPG01024: '交易加密 SHA 資料不可空白',
    MPG02001: '檢查碼錯誤',
    MPG02002: '查無商店開啟任何金流服務',
    MPG02003: '支付方式未啟用，請洽客服中心',
    MPG02004: `匯率時間戳記不存在，請確認
  已過匯率鎖定時限，請重新交易
  送出後檢查，交易失敗，頁面超過 180 秒`,
    MPG02005: '送出後檢查，驗證資料錯誤',
    MPG02006: '信用卡收單機構系統發生異常，請洽客服中心',
    MPG03001: 'FormPost 加密失敗',
    MPG03002: '拒絕交易 IP',
    MPG03003: 'IP 交易次數限制 N 分鐘內不可交易達 M 次',
    MPG03004: '商店狀態已被暫停或是關閉，無法進行交易',
    MPG03005: '回傳參數資料不存在/解密失敗',
    MPG03006: '回傳參數資料不存在/解密失敗',
    MPG03007: `該筆訂單交易資訊不存在，請重新交易(物流服務)
查無此商店代號
TradeInfo 裡的 MerchantID 參數與回傳 MerchantID
參數不一致`,
    MPG03008: '已存在相同的商店訂單編號',
    MPG03009: `交易失敗
(交易資料 SHA 256 檢查不符合
交易資料 TradeInfo 解密失敗
銀行回覆此筆交易授權失敗原因)`,
    MPG03010: `驗證資料不存在或錯誤 (玉山 Wallet 及 台灣 Pay 的錯誤代碼)`,
    MPG03011: `訂單資料已不存在，請重新交易 (玉山 Wallet 及 台灣 Pay 的錯誤代碼)`,
    MPG05001: `未有信用卡驗證資料
信用卡驗證資料解密失敗`,
    MPG05002: `信用卡卡號長度不足
未有商店代號
本商店不支援此信用卡付款，請改用其它發卡行所核發之信用卡`,
    MPG05003: `此信用卡不支援一次付清，請改用可一次付清之信用卡或改用其他支付方式
此信用卡不支援分期付款，請改用可分期付款之信用卡或改用其他支付方式
此信用卡不支援紅利付款，請改用可紅利折抵之信用卡或改用其他支付方式`,
    MPG05004: '發卡行暫時無法提供信用卡分期付款服務',
    MPG05005: '警示交易',
};
function parseErrorMessage(code) {
    var _a;
    return (_a = ERROR_CODE_MESSAGE[code]) !== null && _a !== void 0 ? _a : 'UNKNOWN';
}
exports.parseErrorMessage = parseErrorMessage;
