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
exports.Invoice = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_js_1 = __importStar(require("crypto-js"));
const Configuration_1 = require("./Configuration");
//==================================
// Types End
//==================================
const INVOICE_ISSUE_ARGS_TEMPLATE = {
    OrderNo: undefined,
    BuyerId: undefined,
    BuyerName: undefined,
    BuyerAddress: undefined,
    BuyerPhone: undefined,
    BuyerEmail: undefined,
    TaxType: undefined,
    IsCustoms: undefined,
    CarrierType: undefined,
    CarrierId: undefined,
    NPOBAN: undefined,
    Description: undefined,
    Quantity: undefined,
    UnitPrice: undefined,
    Amount: undefined,
    Remark: undefined,
    IsSend: undefined,
    IsSendSms: undefined,
};
const INVOICE_CANCEL_ARGS_TEMPLATE = {
    InvoiceNumber: undefined,
    InvoiceDate: undefined,
};
const INVOICE_DISCARD_ARGS_TEMPLATE = {
    InvoiceNumber: undefined,
    InvoiceDate: undefined,
};
const ALLOWANCE_ISSUE_ARGS_TEMPLATE = {
    AllowanceNumber: undefined,
    OrInvoiceNumber: undefined,
    OrInvoiceDate: undefined,
    TaxType: undefined,
    OrDescription: undefined,
    Quantity: undefined,
    UnitPrice: undefined,
    Amount: undefined,
};
const ALLOWANCE_CANCEL_ARGS_TEMPLATE = {
    AllowanceNumber: undefined,
    AllowanceDate: undefined,
};
class Invoice {
    /**
     * 開立發票
     * @param info
     * @param items
     */
    issueInvoice(info, items) {
        const invoices = [];
        items.forEach((item) => {
            invoices.push(Object.assign(Object.assign(Object.assign({}, INVOICE_ISSUE_ARGS_TEMPLATE), info), item));
        });
        return (() => __awaiter(this, void 0, void 0, function* () {
            const result = yield Invoice.request('/c0401', undefined, invoices);
            if (result.RtCode !== '0000') {
                return { error: result.RtMessage };
            }
            const invoiceData = JSON.parse(Invoice.base64Decode(result.RtInvoice));
            return { error: undefined, result: invoiceData[0] };
        }))();
    }
    /**
     * 作廢發票
     * @param data
     */
    cancelInvoice(data) {
        const args = Object.assign(Object.assign({}, INVOICE_CANCEL_ARGS_TEMPLATE), data);
        return (() => __awaiter(this, void 0, void 0, function* () {
            const result = yield Invoice.request('/c0501', undefined, args);
            if (result.RtCode !== '0000') {
                return { error: result.RtMessage };
            }
            return { error: undefined };
        }))();
    }
    /**
     * 註銷發票
     * @param data
     */
    discardInvoice(data) {
        const args = Object.assign(Object.assign({}, INVOICE_DISCARD_ARGS_TEMPLATE), data);
        return (() => __awaiter(this, void 0, void 0, function* () {
            const result = yield Invoice.request('/c0701', undefined, args);
            if (result.RtCode !== '0000') {
                return { error: result.RtMessage };
            }
            return { error: undefined };
        }))();
    }
    /**
     * 查詢發票狀態
     * @param orderNo
     */
    fetchInvoiceState(orderNo) {
        return (() => __awaiter(this, void 0, void 0, function* () {
            const result = yield Invoice.request('/Get_Order_State', { OrderNo: orderNo });
            if (result.RtCode !== '0000') {
                return { error: result.RtMessage };
            }
            return { error: undefined, result: result.RtState };
        }))();
    }
    /**
     * 下載發票 PDF
     * @param invoiceNumber
     */
    downloadInvoicePdf(invoiceNumber) {
        return (() => __awaiter(this, void 0, void 0, function* () {
            const result = yield Invoice.request('/InvoicePdf', {
                Num: invoiceNumber,
                Type: 1,
            });
            if (result.RtCode !== '0000') {
                return { error: result.RtMessage };
            }
            return { error: undefined, result: Buffer.from(result.RtData) };
        }))();
    }
    /**
     * 開立折讓
     * @param info
     * @param items
     */
    issueAllowance(info, items) {
        const allowances = [];
        items.forEach((item) => {
            allowances.push(Object.assign(Object.assign(Object.assign({}, ALLOWANCE_ISSUE_ARGS_TEMPLATE), info), item));
        });
        return (() => __awaiter(this, void 0, void 0, function* () {
            const result = yield Invoice.request('/d0401', undefined, allowances);
            if (result.RtCode !== '0000') {
                return { error: result.RtMessage };
            }
            return { error: undefined, result: result };
        }))();
    }
    /**
     * 作廢折讓
     * @param data
     */
    cancelAllowance(data) {
        const args = Object.assign(Object.assign({}, ALLOWANCE_CANCEL_ARGS_TEMPLATE), data);
        return (() => __awaiter(this, void 0, void 0, function* () {
            const result = yield Invoice.request('/d0501', undefined, args);
            if (result.RtCode !== '0000') {
                return { error: result.RtMessage };
            }
            return { error: undefined };
        }))();
    }
    /**
     * 查詢折讓狀態
     * @param allowanceNumber
     */
    fetchAllowanceState(allowanceNumber) {
        return (() => __awaiter(this, void 0, void 0, function* () {
            const result = yield Invoice.request('/Get_AllowanceNumber_State', {
                AllowanceNumber: allowanceNumber,
            });
            if (result.RtCode !== '0000') {
                return { error: result.RtMessage };
            }
            return { error: undefined, result: result.RtState };
        }))();
    }
    /**
     * 下載折讓 PDF
     * @param allowanceNumber
     */
    downloadAllowancePdf(allowanceNumber) {
        return (() => __awaiter(this, void 0, void 0, function* () {
            const result = yield Invoice.request('/AllowancePdf', {
                Num: allowanceNumber,
                Type: 1,
            });
            if (result.RtCode !== '0000') {
                return { error: result.RtMessage };
            }
            return { error: undefined, result: Buffer.from(result.RtData) };
        }))();
    }
    //================================
    // Utility Methods
    //================================
    static request(path, params, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const env = Configuration_1.configuration.getEnvParams();
            const csvPayload = payload
                ? Invoice.toCSV(Array.isArray(payload) ? payload : [payload])
                : undefined;
            const postData = Object.assign(Object.assign({}, params), { Account: env.invoiceAccount, Passwd: Invoice.cryptoPassword(env.invoicePassword), Csv: csvPayload ? Invoice.base64Encode(csvPayload) : undefined });
            const result = yield axios_1.default.post(`${env.invoiceApiHost}${path}`, postData);
            if (result.status !== 200)
                throw new Error("response status is not '200'");
            return result.data;
        });
    }
    static cryptoPassword(passwd) {
        // 密碼經過 SHA256 雜湊後，保持 bytes 的形式直接轉為 Base64 編碼
        return crypto_js_1.default.enc.Base64.stringify((0, crypto_js_1.SHA256)(passwd));
    }
    static toCSV(data) {
        if (!data.length)
            return '';
        const lines = Array(data.length + 1)
            .fill(undefined)
            .map((_) => []);
        Object.keys(data[0]).forEach((key) => {
            lines[0].push(key);
            data.forEach((row, idx) => {
                const value = row[key];
                lines[idx + 1].push(Invoice.textNormalization(value));
            });
        });
        return lines.map((line) => line.join(',')).join('\n');
    }
    static textNormalization(text) {
        if (text === undefined || text === null)
            return '';
        const t = typeof text === 'string' ? text : text.toString();
        const replaceMap = {
            ',': '，',
            '*': '＊',
            '<': '＜',
            '>': '＞',
            '[': '［',
            ']': '］',
        };
        return t.replace(/[*<>\[\]]/g, (substring, args) => {
            var _a;
            return (_a = replaceMap[substring]) !== null && _a !== void 0 ? _a : '〿';
        });
    }
    static base64Encode(value) {
        const words = crypto_js_1.default.enc.Utf8.parse(value);
        return crypto_js_1.default.enc.Base64.stringify(words);
    }
    static base64Decode(value) {
        const words = crypto_js_1.default.enc.Base64.parse(value);
        return crypto_js_1.default.enc.Utf8.stringify(words);
    }
}
const invoiceInstance = new Invoice();
exports.Invoice = invoiceInstance;
