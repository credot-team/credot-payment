"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaidResult = void 0;
const sha1_1 = __importDefault(require("crypto-js/sha1"));
const dayjs_1 = __importDefault(require("dayjs"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const PaidResult_1 = require("../PaidResult");
const PayMethods_1 = require("../PayMethods");
const OrderStatus_1 = require("../OrderStatus");
const _1 = require("./");
const ErrorCode_1 = require("./ErrorCode");
const Configuration_1 = require("./Configuration");
dayjs_1.default.extend(customParseFormat_1.default);
class PaidResult extends PaidResult_1.PaidResult {
    constructor(result, options) {
        var _a, _b;
        if (!(options === null || options === void 0 ? void 0 : options.payMethod))
            throw new Error(`options.payMethod should be provided for ${_1.PoweredBy} result`);
        super(result, { payMethod: options.payMethod });
        if (this.isFromBrowser()) {
            const data = this._rawData;
            for (const key of ['webname', 'Name', 'note1', 'note2', 'errmsg', 'StoreName', 'StoreMsg']) {
                if (data[key])
                    data[key] = decodeURIComponent(data[key]);
            }
        }
        this._finishedAt =
            (_a = options.finishedAt) !== null && _a !== void 0 ? _a : (this._rawData.PayDate && this._rawData.PayTime
                ? (0, dayjs_1.default)(this._rawData.PayDate + this._rawData.PayTime, 'YYYYMMDDHHmm').toDate()
                : new Date());
        this._status = (0, ErrorCode_1.parseErrorCode)((_b = this._rawData.errcode) !== null && _b !== void 0 ? _b : '');
        this._isSucceed = this._status === OrderStatus_1.OrderStatus.success;
    }
    poweredBy() {
        return _1.PoweredBy;
    }
    getEnvParams() {
        var _a;
        return (_a = this._options.env) !== null && _a !== void 0 ? _a : Configuration_1.configuration.getEnvParams();
    }
    payInfo() {
        return {
            payerName: this._rawData.Name,
            credit: {
                creditNo: `****-****-****-${this._rawData.Card_NO}`,
                method: 'credit-card',
            },
        };
    }
    isPaid() {
        return this._isSucceed;
    }
    merchantId() {
        return this._rawData.web;
    }
    merchantName() {
        var _a;
        return (_a = this._options.merchantName) !== null && _a !== void 0 ? _a : this._rawData.webname;
    }
    amount() {
        return this._rawData.MN;
    }
    finishedAt() {
        return this._finishedAt;
    }
    status() {
        return this._status;
    }
    isFromBrowser() {
        return this._rawData.SendType === '2';
    }
    applyNo() {
        return this._rawData.buysafeno;
    }
    orderNo() {
        var _a;
        return (_a = this._rawData.Td) !== null && _a !== void 0 ? _a : '';
    }
    errorCode() {
        var _a;
        return (_a = this._rawData.errcode) !== null && _a !== void 0 ? _a : null;
    }
    errorMessage() {
        var _a;
        return (_a = this._rawData.errmsg) !== null && _a !== void 0 ? _a : null;
    }
    isValid() {
        let localChkValue = '';
        const env = this.getEnvParams();
        switch (this.payMethod()) {
            case PayMethods_1.PayMethods.Credit:
            case PayMethods_1.PayMethods.CreditInst:
                localChkValue = (0, sha1_1.default)(env.merchantId[PayMethods_1.PayMethods.Credit] +
                    env.transPassword +
                    this._rawData.buysafeno +
                    this._rawData.MN +
                    this._rawData.errcode +
                    this._rawData.CargoNo)
                    .toString()
                    .toUpperCase();
                break;
        }
        return localChkValue === this._rawData.ChkValue;
    }
    successResponse() {
        return '0000';
    }
}
exports.PaidResult = PaidResult;
