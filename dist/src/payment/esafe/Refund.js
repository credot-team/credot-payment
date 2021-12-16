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
exports.Refund = void 0;
const axios_1 = __importDefault(require("axios"));
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const Configuration_1 = require("./Configuration");
const PayMethods_1 = require("../PayMethods");
class Refund {
    constructor(params) {
        this._success = false;
        this._orderNo = params.orderNo;
        this._applyNo = params.applyNo;
        this._amount = params.amount.toString();
        this._reason = params.reason;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const env = Configuration_1.configuration.getEnvParams();
            const params = {
                web: env.merchantId[PayMethods_1.PayMethods.Credit],
                MN: this._amount,
                buysafeno: this._applyNo,
                Td: this._orderNo,
                RefundMemo: encodeURIComponent(this._reason),
                ChkValue: '',
            };
            params.ChkValue = (0, sha256_1.default)(params.web + env.transPassword + params.buysafeno + params.MN + params.Td).toString();
            const query = new URLSearchParams(params).toString();
            const result = yield axios_1.default.post(env.paymentApiHost + '/Hx_CardRefund.ashx', query, {
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
            });
            if (result.status !== 200)
                throw new Error(`response status ${result.status}: ${result.statusText}; body: ${result.data}`);
            this._success = result.data === 'E0';
            if (!this._success)
                this._errorMessage = result.data;
            return {
                success: this._success,
                errorMessage: this._errorMessage,
            };
        });
    }
    amount() {
        return '';
    }
    reason() {
        return this._reason;
    }
    applyNo() {
        return '';
    }
    errorCode() {
        return this._errorCode;
    }
    errorMessage() {
        return this._errorMessage;
    }
    isSuccess() {
        return false;
    }
}
exports.Refund = Refund;
