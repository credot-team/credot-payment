"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaidResult = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const crypto_js_1 = __importStar(require("crypto-js"));
const PaidResult_1 = require("../PaidResult");
const PayMethods_1 = require("../PayMethods");
const OrderStatus_1 = require("../OrderStatus");
const StoreTypes_1 = require("../StoreTypes");
const _1 = require("./");
const ErrorCode_1 = require("./ErrorCode");
const Configuration_1 = require("./Configuration");
const PaymentMethod_1 = require("./PaymentMethod");
class PaidResult extends PaidResult_1.PaidResult {
    constructor(result, options) {
        var _a, _b, _c;
        const tradeInfo = JSON.parse(PaidResult.decryptTradeInfo(result.TradeInfo));
        super(Object.assign(Object.assign({}, result), { TradeInfo: tradeInfo }), { payMethod: (_a = options === null || options === void 0 ? void 0 : options.payMethod) !== null && _a !== void 0 ? _a : PaymentMethod_1.PaymentTypes[tradeInfo.Result.PaymentType] });
        this._isValid = result.TradeSha === PaidResult.hashTradeInfo(result.TradeInfo);
        this._result = tradeInfo.Result;
        this._finishedAt =
            (_b = options === null || options === void 0 ? void 0 : options.finishedAt) !== null && _b !== void 0 ? _b : (this._result.PayTime ? (0, dayjs_1.default)(this._result.PayTime + '+08:00').toDate() : new Date());
        this._status = (0, ErrorCode_1.parseErrorCode)((_c = this._rawData.TradeInfo.Status) !== null && _c !== void 0 ? _c : '');
        this._isSucceed = this._status === OrderStatus_1.OrderStatus.success;
        this.parse();
    }
    poweredBy() {
        return _1.PoweredBy;
    }
    parse() {
        var _a, _b, _c, _d;
        const data = this.rawData();
        const unknownResult = data.TradeInfo.Result;
        const payInfo = {
            payerName: (_a = this._options.payerName) !== null && _a !== void 0 ? _a : '',
        };
        let result;
        switch (this.payMethod()) {
            case PayMethods_1.PayMethods.CreditReward:
            case PayMethods_1.PayMethods.CreditInst:
            case PayMethods_1.PayMethods.SamsungPay:
            case PayMethods_1.PayMethods.GooglePay:
            case PayMethods_1.PayMethods.UnionPay:
            case PayMethods_1.PayMethods.Credit:
                result = unknownResult;
                payInfo.credit = {
                    creditNo: `****-****-****-${(_b = result.Card4No) !== null && _b !== void 0 ? _b : ''}`,
                    method: (_c = PaymentMethod_1.CreditType[result.PaymentMethod]) !== null && _c !== void 0 ? _c : '未知',
                };
                break;
            case PayMethods_1.PayMethods.WebATM:
            case PayMethods_1.PayMethods.VACC:
                result = unknownResult;
                payInfo.atm = {
                    bankCode: result.PayBankCode,
                    account: `***......**${result.PayerAccount5Code}`,
                };
                break;
            case PayMethods_1.PayMethods.CVS:
                result = unknownResult;
                payInfo.cvs = {
                    type: 'code',
                    codeNo: result.CodeNo,
                    storeType: {
                        1: StoreTypes_1.StoreTypes.Seven,
                        2: StoreTypes_1.StoreTypes.Family,
                        3: StoreTypes_1.StoreTypes.OK,
                        4: StoreTypes_1.StoreTypes.HiLife,
                    }[result.StoreType],
                    storeID: result.StoreID,
                };
                break;
            case PayMethods_1.PayMethods.CVSBarcode:
                result = unknownResult;
                payInfo.cvs = {
                    type: 'barcode',
                    storeType: (_d = {
                        SEVEN: StoreTypes_1.StoreTypes.Seven,
                        FAMILY: StoreTypes_1.StoreTypes.Family,
                        OK: StoreTypes_1.StoreTypes.OK,
                        HILIFE: StoreTypes_1.StoreTypes.HiLife,
                    }[result.PayStore]) !== null && _d !== void 0 ? _d : StoreTypes_1.StoreTypes.UNKNOWN,
                    barcode_1: result.Barcode_1,
                    barcode_2: result.Barcode_2,
                    barcode_3: result.Barcode_3,
                };
                break;
            case PayMethods_1.PayMethods.ezPay:
                result = unknownResult;
                payInfo.thirdParty = {
                    tradeNo: result.P2GTradeNo,
                    amount: result.P2GAmt,
                    paymentType: result.P2GPaymentType,
                };
                break;
            case PayMethods_1.PayMethods.CVSCOM:
                result = unknownResult;
                payInfo.delivery = {
                    name: result.CVSCOMName,
                    phone: result.CVSCOMPhone,
                    orderNo: result.LgsNo,
                    payAtPickup: result.TradeType === 1,
                    addressDescription: `${result.StoreType}:${result.StoreName}(${result.StoreCode})`,
                    fullAddress: result.StoreAddr,
                };
                break;
        }
        this._payInfo = payInfo;
    }
    static decryptTradeInfo(tradeInfo) {
        const env = Configuration_1.configuration.getEnvParams();
        const str = crypto_js_1.default.enc.Hex.parse(tradeInfo);
        const cipherParams = crypto_js_1.default.lib.CipherParams.create({
            ciphertext: str,
            padding: crypto_js_1.default.pad.Pkcs7,
        });
        return crypto_js_1.AES.decrypt(cipherParams, crypto_js_1.default.enc.Utf8.parse(env.hashKey), {
            iv: crypto_js_1.default.enc.Utf8.parse(env.hashIV),
            mode: crypto_js_1.default.mode.CBC,
        }).toString(crypto_js_1.default.enc.Utf8);
    }
    static hashTradeInfo(tradeInfo) {
        const env = Configuration_1.configuration.getEnvParams();
        return (0, crypto_js_1.SHA256)(`HashKey=${env.hashKey}&${tradeInfo}&HashIV=${env.hashIV}`)
            .toString()
            .toUpperCase();
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
        return this._payInfo;
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
}
exports.PaidResult = PaidResult;
