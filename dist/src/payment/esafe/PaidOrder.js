"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaidOrder = void 0;
const sha1_1 = __importDefault(require("crypto-js/sha1"));
const axios_1 = __importDefault(require("axios"));
const dayjs_1 = __importDefault(require("dayjs"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const convert_1 = require("../../utils/convert");
const PaidOrder_1 = require("../PaidOrder");
const PayMethods_1 = require("../PayMethods");
const Locales_1 = require("../Locales");
const _1 = require("./");
const PaidResult_1 = require("./PaidResult");
const Configuration_1 = require("./Configuration");
dayjs_1.default.extend(customParseFormat_1.default);
//=============================
// End of Types
//=============================
class PaidOrder extends PaidOrder_1.PaidOrder {
    constructor(payMethod, params) {
        var _a;
        super(payMethod, params);
        const env = Configuration_1.configuration.getEnvParams();
        const _params = this.params;
        this._checksum = (0, sha1_1.default)(env.merchantId[PayMethods_1.PayMethods.Credit] +
            env.transPassword +
            _params.amount +
            ((_a = _params.installment) !== null && _a !== void 0 ? _a : ''))
            .toString()
            .toUpperCase();
    }
    poweredBy() {
        return _1.PoweredBy;
    }
    checksum() {
        return this._checksum;
    }
    apply() {
        var _a, _b, _c;
        const env = Configuration_1.configuration.getEnvParams();
        const params = this.params;
        const args = {
            web: env.merchantId[PayMethods_1.PayMethods.Credit],
            MN: params.amount.toString(),
            Td: params.orderNo,
            OrderInfo: params.orderInfo,
            sna: params.userName,
            sdt: params.userPhone,
            email: params.userEmail,
            note1: (_a = params.memo) !== null && _a !== void 0 ? _a : undefined,
            note2: undefined,
            Card_Type: '0',
            Country_Type: params.locale === Locales_1.Locales.en_US ? 'EN' : params.locale === Locales_1.Locales.ja ? 'JIS' : '',
            Term: params.installment,
            ChkValue: this.checksum(),
        };
        const data = {
            properties: {
                method: 'post',
                url: env.paymentApiHost + '/Etopm.aspx',
            },
            data: {
                web: args.web,
                MN: args.MN,
                OrderInfo: args.OrderInfo,
                Td: args.Td,
                sna: encodeURIComponent(args.sna),
                sdt: args.sdt,
                email: args.email,
                note1: encodeURIComponent((_b = args.note1) !== null && _b !== void 0 ? _b : ''),
                note2: encodeURIComponent((_c = args.note2) !== null && _c !== void 0 ? _c : ''),
                Card_Type: args.Card_Type,
                Country_Type: args.Country_Type,
                Term: args.Term,
                ChkValue: args.ChkValue,
            },
        };
        return Promise.resolve({ method: 'json', payload: data });
    }
    /**
     * 即時交易查詢
     * @param args
     */
    static fetchStatus(args) {
        const env = Configuration_1.configuration.getEnvParams();
        const url = env.paymentApiHost + '/PaymentCheck.aspx';
        if ((0, convert_1.isEmpty)(args.orderNo) && (0, convert_1.isEmpty)(args.applyNo))
            return Promise.resolve(undefined);
        const params = {
            web: env.merchantId[PayMethods_1.PayMethods.Credit],
            buysafeno: args.applyNo,
            Td: args.orderNo,
            ChkValue: '',
        };
        params.ChkValue = (0, sha1_1.default)([params.web, env.transPassword, params.buysafeno, params.Td].join(''))
            .toString()
            .toUpperCase();
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const query = new URLSearchParams(params).toString();
            const result = yield axios_1.default.post(url, query, {
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
            });
            const rows = result.data.split('\r\n').filter((s) => s);
            const paidResults = rows.map((row) => {
                const fields = row.split('##');
                // 無法被 ## 分割，表示API回傳的是錯誤訊息
                if (fields.length < 2)
                    reject(new Error(result.data));
                return new PaidResult_1.PaidResult({
                    web: fields[0],
                    buysafeno: fields[1],
                    MN: fields[2],
                    errcode: fields[4],
                    Card_NO: fields[5],
                    ApproveCode: fields[6],
                    ChkValue: fields[7],
                    Name: '',
                }, {
                    payMethod: PayMethods_1.PayMethods.Credit,
                    finishedAt: (0, dayjs_1.default)(fields[3], 'YYYYMMDDHHmm').toDate(),
                });
            });
            resolve(paidResults);
        }));
    }
}
exports.PaidOrder = PaidOrder;
