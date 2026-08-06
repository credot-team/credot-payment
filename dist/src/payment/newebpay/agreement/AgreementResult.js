"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgreementResult = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const PaidResult_1 = require("../../PaidResult");
const PayMethods_1 = require("../../PayMethods");
const OrderStatus_1 = require("../../OrderStatus");
const __1 = require("../");
const PaidResult_2 = require("../PaidResult");
const ErrorCode_1 = require("../ErrorCode");
const Configuration_1 = require("../Configuration");
/**
 * 解析 NPA-F011 幕前約定付款回傳（NotifyURL / ReturnURL）
 */
class AgreementResult extends PaidResult_1.PaidResult {
    constructor(result, options) {
        var _a, _b, _c;
        const env = (_a = options === null || options === void 0 ? void 0 : options.env) !== null && _a !== void 0 ? _a : Configuration_1.configuration.getEnvParams();
        const tradeInfo = JSON.parse(PaidResult_2.PaidResult.decryptTradeInfo(result.TradeInfo, env));
        super(Object.assign(Object.assign({}, result), { TradeInfo: tradeInfo }), Object.assign({ payMethod: PayMethods_1.PayMethods.Credit }, options));
        this._isValid = result.TradeSha === PaidResult_2.PaidResult.hashTradeInfo(result.TradeInfo, env);
        this._result = tradeInfo.Result;
        this._status = (0, ErrorCode_1.parseErrorCode)((_b = tradeInfo.Status) !== null && _b !== void 0 ? _b : '');
        this._isSucceed = this._status === OrderStatus_1.OrderStatus.success;
        this._finishedAt =
            (_c = options === null || options === void 0 ? void 0 : options.finishedAt) !== null && _c !== void 0 ? _c : (this._result.PayTime ? (0, dayjs_1.default)(this._result.PayTime + '+08:00').toDate() : new Date());
    }
    getEnvParams() {
        var _a;
        return (_a = this._options.env) !== null && _a !== void 0 ? _a : Configuration_1.configuration.getEnvParams();
    }
    poweredBy() {
        return __1.PoweredBy;
    }
    merchantId() {
        return this._result.MerchantID;
    }
    merchantName() {
        return this._options.merchantName;
    }
    isPaid() {
        return this._isSucceed && this._result.PayTime !== undefined;
    }
    payInfo() {
        var _a, _b;
        return {
            payerName: (_a = this._options.payerName) !== null && _a !== void 0 ? _a : '',
            credit: {
                creditNo: `****-****-****-${(_b = this._result.Card4No) !== null && _b !== void 0 ? _b : ''}`,
                method: '信用卡',
            },
        };
    }
    amount() {
        return this._result.Amt.toString();
    }
    finishedAt() {
        return this._finishedAt;
    }
    status() {
        return this._status;
    }
    isFromBrowser() {
        var _a;
        return (_a = this._options.isFromBrowser) !== null && _a !== void 0 ? _a : false;
    }
    applyNo() {
        return this._result.TradeNo;
    }
    orderNo() {
        var _a;
        return (_a = this._result.MerchantOrderNo) !== null && _a !== void 0 ? _a : '';
    }
    errorCode() {
        var _a;
        return (_a = this._rawData.Status) !== null && _a !== void 0 ? _a : null;
    }
    errorMessage() {
        return (0, ErrorCode_1.parseErrorMessage)(this._rawData.Status);
    }
    isValid() {
        return this._isValid;
    }
    successResponse() {
        return undefined;
    }
    /** 約定 Token，供後續 Pn 使用 */
    tokenValue() {
        return this._result.TokenValue;
    }
    /** Token 有效日期，格式 yyyy-mm-dd */
    tokenLife() {
        return this._result.TokenLife;
    }
    /** 信用卡快速結帳使用狀態 */
    tokenUseStatus() {
        return this._result.TokenUseStatus;
    }
    result() {
        return Object.assign({}, this._result);
    }
}
exports.AgreementResult = AgreementResult;
