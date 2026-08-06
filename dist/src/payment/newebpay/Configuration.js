"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
;
function resolveApiBase(paymentApiUrl) {
    return paymentApiUrl.replace(/\/MPG\/mpg_gateway\/?$/i, '');
}
function resolveEnv(params) {
    var _a, _b, _c;
    const base = resolveApiBase(params.paymentApiUrl);
    return Object.assign(Object.assign({}, params), { creditCardApiUrl: (_a = params.creditCardApiUrl) !== null && _a !== void 0 ? _a : `${base}/API/CreditCard`, tokenQueryApiUrl: (_b = params.tokenQueryApiUrl) !== null && _b !== void 0 ? _b : `${base}/API/TokenCard/query`, tokenUnbindApiUrl: (_c = params.tokenUnbindApiUrl) !== null && _c !== void 0 ? _c : `${base}/API/TokenCard/unbinding` });
}
let _env = null;
exports.configuration = {
    getEnvParams() {
        if (_env === null)
            throw new Error('Must set environment parameters before use payment functions');
        return resolveEnv(_env);
    },
    setEnvParams(params) {
        _env = params;
    },
};
