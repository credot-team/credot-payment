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
exports.AgreementPn = void 0;
const axios_1 = __importDefault(require("axios"));
const Configuration_1 = require("../Configuration");
const Crypto_1 = require("./Crypto");
/**
 * 4.3 後續約定付款(Pn) - 幕後情境 [NPA-B102]
 */
class AgreementPn {
    constructor(params, options) {
        this._params = Object.assign({}, params);
        this._options = options !== null && options !== void 0 ? options : {};
    }
    getEnvParams() {
        return this._options.env
            ? (0, Configuration_1.resolveEnv)(this._options.env)
            : Configuration_1.configuration.getEnvParams();
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const env = this.getEnvParams();
            const postData = Object.assign(Object.assign({}, this._params), { TimeStamp: (Date.now() / 1000).toFixed(0), Version: '2.5', TokenSwitch: 'on' });
            const body = new URLSearchParams({
                MerchantID_: env.merchantId,
                PostData_: (0, Crypto_1.encryptQueryString)(postData, env),
                Pos_: 'JSON',
            });
            const response = yield axios_1.default.post(env.creditCardApiUrl, body.toString(), { headers: { 'content-type': 'application/x-www-form-urlencoded' } });
            const data = response.data;
            if (data.Result && typeof data.Result === 'object' && 'CheckCode' in data.Result) {
                Object.assign(data.Result, { checkCodeValid: (0, Crypto_1.verifyCheckCode)(data.Result, env) });
            }
            return data;
        });
    }
}
exports.AgreementPn = AgreementPn;
