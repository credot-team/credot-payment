"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
let _env = null;
exports.configuration = {
    getEnvParams() {
        if (_env === null)
            throw new Error('Must set environment parameters before use payment functions');
        return _env;
    },
    setEnvParams(params) {
        _env = params;
    },
};
