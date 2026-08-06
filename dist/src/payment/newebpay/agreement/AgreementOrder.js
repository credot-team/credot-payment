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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgreementOrder = void 0;
const crypto_js_1 = __importStar(require("crypto-js"));
const Locales_1 = require("../../Locales");
const Configuration_1 = require("../Configuration");
const __1 = require("../");
const API_VERSION = '2.3';
/**
 * 4.1 首次約定付款(P1) - 幕前情境 [NPA-F011]
 */
class AgreementOrder {
    constructor(params, options) {
        this._params = Object.assign({}, params);
        this._options = options !== null && options !== void 0 ? options : {};
        this._tradeInfo = this.buildTradeInfo();
        const env = this.getEnvParams();
        const encryptedTradeInfo = AgreementOrder.encryptTradeInfo(this._tradeInfo, env);
        this._apiParams = {
            TradeInfo: encryptedTradeInfo,
            TradeSha: AgreementOrder.hashTradeInfo(encryptedTradeInfo, env),
            MerchantID: env.merchantId,
            Version: API_VERSION,
        };
    }
    getEnvParams() {
        var _a;
        return (_a = this._options.env) !== null && _a !== void 0 ? _a : Configuration_1.configuration.getEnvParams();
    }
    buildTradeInfo() {
        var _a, _b;
        const env = this.getEnvParams();
        const params = this._params;
        const langType = params.locale === Locales_1.Locales.en_US ? 'en' : params.locale === Locales_1.Locales.ja ? 'jp' : 'zh-tw';
        return {
            MerchantID: env.merchantId,
            RespondType: 'JSON',
            TimeStamp: (Date.now() / 1000).toFixed(0),
            Version: API_VERSION,
            P3D: params.p3d,
            LangType: langType,
            MerchantOrderNo: params.orderNo,
            Amt: params.amount,
            ItemDesc: params.orderInfo,
            ReturnURL: (_a = params.returnUrl) !== null && _a !== void 0 ? _a : env.returnUrl,
            NotifyURL: (_b = params.notifyUrl) !== null && _b !== void 0 ? _b : env.notifyUrl,
            ClientBackURL: params.backUrl,
            Email: params.userEmail,
            EmailModify: params.userEmailModify === false ? 0 : params.userEmailModify ? 1 : undefined,
            CREDITAEAGREEMENT: params.creditAeAgreement,
            InstFlag: params.instFlag,
            OrderComment: params.orderComment,
            CREDITAGREEMENT: 1,
            CREDIT: 1,
            TokenTerm: params.tokenTerm,
            TokenLife: params.tokenLife,
            UseFor: params.useFor,
            MobileVerify: params.mobileVerify,
            MobileNumber: params.mobileNumber,
            MobileNumberModify: params.mobileNumberModify,
        };
    }
    static encryptTradeInfo(tradeInfo, envParams) {
        const params = new URLSearchParams();
        Object.entries(tradeInfo).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
                params.set(k, String(v));
            }
        });
        const qs = params.toString();
        return crypto_js_1.AES.encrypt(qs, crypto_js_1.default.enc.Utf8.parse(envParams.hashKey), {
            iv: crypto_js_1.default.enc.Utf8.parse(envParams.hashIV),
            mode: crypto_js_1.default.mode.CBC,
            padding: crypto_js_1.default.pad.Pkcs7,
        }).toString(crypto_js_1.default.format.Hex);
    }
    static hashTradeInfo(tradeInfo, envParams) {
        return (0, crypto_js_1.SHA256)(`HashKey=${envParams.hashKey}&${tradeInfo}&HashIV=${envParams.hashIV}`)
            .toString()
            .toUpperCase();
    }
    poweredBy() {
        return __1.PoweredBy;
    }
    orderNo() {
        return this._params.orderNo;
    }
    amount() {
        return this._params.amount;
    }
    tokenTerm() {
        return this._params.tokenTerm;
    }
    tradeInfo() {
        return Object.assign({}, this._tradeInfo);
    }
    checksum() {
        return this._apiParams.TradeSha;
    }
    apply() {
        const env = this.getEnvParams();
        const data = {
            properties: {
                method: 'post',
                url: env.paymentApiUrl,
            },
            data: this._apiParams,
        };
        return Promise.resolve({ method: 'json', payload: data });
    }
}
exports.AgreementOrder = AgreementOrder;
