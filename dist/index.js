"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const esafe_1 = __importDefault(require("./esafe"));
const newebpay_1 = __importDefault(require("./newebpay"));
module.exports = { esafe: esafe_1.default, newebpay: newebpay_1.default };
