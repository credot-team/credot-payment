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
exports.TokenQuery = void 0;
const axios_1 = __importDefault(require("axios"));
const Configuration_1 = require("../Configuration");
const Crypto_1 = require("./Crypto");
/**
 * 4.4 查詢約定付款綁定狀態 [NPA-B103]
 */
class TokenQuery {
    constructor(params) {
        this._params = Object.assign({}, params);
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const env = Configuration_1.configuration.getEnvParams();
            const requestData = {
                MerchantID: env.merchantId,
                TimeStamp: (Date.now() / 1000).toFixed(0),
                TokenTerm: this._params.TokenTerm,
                TokenValue: this._params.TokenValue,
            };
            const encrypted = (0, Crypto_1.encryptJson)(requestData);
            const body = new URLSearchParams({
                UID_: env.merchantId,
                EncryptData_: encrypted,
                HashData_: (0, Crypto_1.hashEncrypted)(encrypted),
                Version_: '2.0',
                RespondType_: 'JSON',
            });
            const response = yield axios_1.default.post(env.tokenQueryApiUrl, body.toString(), { headers: { 'content-type': 'application/x-www-form-urlencoded' } });
            const data = response.data;
            if (data.EncryptData && typeof data.EncryptData === 'string') {
                const decrypted = JSON.parse((0, Crypto_1.decryptAes)(data.EncryptData));
                data.decrypted = decrypted;
            }
            return data;
        });
    }
}
exports.TokenQuery = TokenQuery;
