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
exports.PaidOrder = void 0;
const crypto_js_1 = __importStar(require("crypto-js"));
const PaidOrder_1 = require("../PaidOrder");
const PayMethods_1 = require("../PayMethods");
const Locales_1 = require("../Locales");
const _1 = require("./");
const Configuration_1 = require("./Configuration");
//===================================
// End of Types
//===================================
const API_VERSION = '2.0';
class PaidOrder extends PaidOrder_1.PaidOrder {
    /**
     *
     * @param payMethod
     * @param params 訂單資訊
     */
    constructor(payMethod, params, options) {
        super(payMethod, params, options);
        this.parseTradeInfo();
    }
    getEnvParams() {
        var _a;
        return (_a = this._options.env) !== null && _a !== void 0 ? _a : Configuration_1.configuration.getEnvParams();
    }
    parseTradeInfo() {
        var _a, _b, _c, _d, _e;
        const payMethods = this.payMethod();
        const params = this.params;
        const env = this.getEnvParams();
        const langType = params.locale === Locales_1.Locales.en_US ? 'en' : params.locale === Locales_1.Locales.ja ? 'jp' : 'zh-tw';
        const args = {
            MerchantID: env.merchantId,
            LoginType: 0,
            Email: params.userEmail,
            MerchantOrderNo: params.orderNo,
            ItemDesc: params.orderInfo,
            Amt: params.amount,
            TimeStamp: (Date.now() / 1000).toFixed(0),
            TradeLimit: params.timeLimit,
            LangType: langType,
            EmailModify: params.userEmailModify ? 1 : 0,
            ReturnURL: (_b = (_a = params.returnUrl) !== null && _a !== void 0 ? _a : env.returnUrl) !== null && _b !== void 0 ? _b : undefined,
            NotifyURL: (_d = (_c = params.notifyUrl) !== null && _c !== void 0 ? _c : env.notifyUrl) !== null && _d !== void 0 ? _d : undefined,
            CustomerURL: undefined,
            ClientBackURL: params.backUrl,
            RespondType: 'JSON',
            Version: API_VERSION,
            CREDIT: payMethods.includes(PayMethods_1.PayMethods.Credit) ? 1 : 0,
            APPLEPAY: payMethods.includes(PayMethods_1.PayMethods.ApplePay) ? 1 : 0,
            ANDROIDPAY: payMethods.includes(PayMethods_1.PayMethods.GooglePay) ? 1 : 0,
            SAMSUNGPAY: payMethods.includes(PayMethods_1.PayMethods.SamsungPay) ? 1 : 0,
            LINEPAY: payMethods.includes(PayMethods_1.PayMethods.LinePay) ? 1 : 0,
            CreditRed: payMethods.includes(PayMethods_1.PayMethods.CreditReward) ? 1 : 0,
            UNIONPAY: payMethods.includes(PayMethods_1.PayMethods.UnionPay) ? 1 : 0,
            WEBATM: payMethods.includes(PayMethods_1.PayMethods.WebATM) ? 1 : 0,
            VACC: payMethods.includes(PayMethods_1.PayMethods.VACC) ? 1 : 0,
            CVS: payMethods.includes(PayMethods_1.PayMethods.CVS) ? 1 : 0,
            BARCODE: payMethods.includes(PayMethods_1.PayMethods.CVSBarcode) ? 1 : 0,
            EZPAY: payMethods.includes(PayMethods_1.PayMethods.ezPay) ? 1 : 0,
            EZPWECHAT: payMethods.includes(PayMethods_1.PayMethods.ezPay_Wechat) ? 1 : 0,
            EZPALIPAY: payMethods.includes(PayMethods_1.PayMethods.ezPay_Alipay) ? 1 : 0,
            ESUNWALLET: payMethods.includes(PayMethods_1.PayMethods.EsunWallet) ? 1 : 0,
            TAIWANPAY: payMethods.includes(PayMethods_1.PayMethods.TaiwanPay) ? 1 : 0,
            CVSCOM: payMethods.includes(PayMethods_1.PayMethods.CVSCOM) ? 1 : 0,
        };
        for (const payMethod of payMethods) {
            switch (payMethod) {
                case PayMethods_1.PayMethods.LinePay:
                    args.ImageUrl = (_e = params.linePay) === null || _e === void 0 ? void 0 : _e.imageUrl;
                    break;
                case PayMethods_1.PayMethods.CreditInst:
                    args.InstFlag = params.installment;
                    break;
                case PayMethods_1.PayMethods.CVSCOM:
                    if (!params.cvscom)
                        break;
                    args.CVSCOM = {
                        [PayMethods_1.CVSCOM_Types.PickupAndPay]: 1,
                        [PayMethods_1.CVSCOM_Types.PickupWithoutPay]: 2,
                        [PayMethods_1.CVSCOM_Types.Both]: 3,
                    }[params.cvscom.type];
                    break;
            }
        }
        const encryptedTradeInfo = PaidOrder.encryptTradeInfo(args, env);
        this._apiParams = {
            TradeInfo: encryptedTradeInfo,
            TradeSha: PaidOrder.hashTradeInfo(encryptedTradeInfo, env),
            MerchantID: env.merchantId,
            Version: API_VERSION,
        };
        this._tradeInfo = args;
    }
    static encryptTradeInfo(tradeInfo, envParams) {
        const params = new URLSearchParams();
        Object.entries(tradeInfo).forEach(([k, v]) => v !== undefined && v !== null && params.set(k, v));
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
        return _1.PoweredBy;
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
exports.PaidOrder = PaidOrder;
