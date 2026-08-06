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
exports.verifyCheckCode = exports.buildCheckCode = exports.hashEncrypted = exports.decryptAes = exports.encryptJson = exports.encryptQueryString = void 0;
const crypto_js_1 = __importStar(require("crypto-js"));
const Configuration_1 = require("../Configuration");
function resolveCryptoEnv(envParams) {
    return envParams !== null && envParams !== void 0 ? envParams : Configuration_1.configuration.getEnvParams();
}
function toQueryString(data) {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.set(key, String(value));
        }
    });
    return params.toString();
}
function encryptQueryString(data, envParams) {
    const { hashKey, hashIV } = resolveCryptoEnv(envParams);
    return crypto_js_1.AES.encrypt(toQueryString(data), crypto_js_1.default.enc.Utf8.parse(hashKey), {
        iv: crypto_js_1.default.enc.Utf8.parse(hashIV),
        mode: crypto_js_1.default.mode.CBC,
        padding: crypto_js_1.default.pad.Pkcs7,
    }).toString(crypto_js_1.default.format.Hex);
}
exports.encryptQueryString = encryptQueryString;
function encryptJson(data, envParams) {
    const { hashKey, hashIV } = resolveCryptoEnv(envParams);
    return crypto_js_1.AES.encrypt(JSON.stringify(data), crypto_js_1.default.enc.Utf8.parse(hashKey), {
        iv: crypto_js_1.default.enc.Utf8.parse(hashIV),
        mode: crypto_js_1.default.mode.CBC,
        padding: crypto_js_1.default.pad.Pkcs7,
    }).toString(crypto_js_1.default.format.Hex);
}
exports.encryptJson = encryptJson;
function decryptAes(encrypted, envParams) {
    const { hashKey, hashIV } = resolveCryptoEnv(envParams);
    const str = crypto_js_1.default.enc.Hex.parse(encrypted);
    const cipherParams = crypto_js_1.default.lib.CipherParams.create({
        ciphertext: str,
        padding: crypto_js_1.default.pad.Pkcs7,
    });
    return crypto_js_1.AES.decrypt(cipherParams, crypto_js_1.default.enc.Utf8.parse(hashKey), {
        iv: crypto_js_1.default.enc.Utf8.parse(hashIV),
        mode: crypto_js_1.default.mode.CBC,
    }).toString(crypto_js_1.default.enc.Utf8);
}
exports.decryptAes = decryptAes;
function hashEncrypted(encrypted, envParams) {
    const { hashKey, hashIV } = resolveCryptoEnv(envParams);
    return (0, crypto_js_1.SHA256)(`HashKey=${hashKey}&${encrypted}&HashIV=${hashIV}`).toString().toUpperCase();
}
exports.hashEncrypted = hashEncrypted;
function buildCheckCode(result, envParams) {
    const { hashKey, hashIV } = resolveCryptoEnv(envParams);
    const checkStr = toQueryString({
        Amt: result.Amt,
        MerchantID: result.MerchantID,
        MerchantOrderNo: result.MerchantOrderNo,
        TradeNo: result.TradeNo,
    });
    return (0, crypto_js_1.SHA256)(`HashIV=${hashIV}&${checkStr}&HashKey=${hashKey}`).toString().toUpperCase();
}
exports.buildCheckCode = buildCheckCode;
function verifyCheckCode(result, envParams) {
    return buildCheckCode(result, envParams) === result.CheckCode;
}
exports.verifyCheckCode = verifyCheckCode;
