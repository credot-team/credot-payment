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
const index_1 = require("../../index");
const fs = __importStar(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const generate_html_form_1 = require("../utils/generate-html-form");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        index_1.newebpay.configuration.setEnvParams({
            hashIV: '',
            hashKey: '',
            merchantId: '',
            paymentApiUrl: 'https://ccore.newebpay.com/MPG/mpg_gateway',
        });
        const now = new Date();
        const order = new index_1.newebpay.PaidOrder(index_1.PayMethods.Credit, {
            amount: 1200,
            cvscom: undefined,
            installment: undefined,
            linePay: undefined,
            locale: undefined,
            orderInfo: 'for test 1200$',
            orderNo: now.toISOString().replace(/[-T:.]/g, ''),
            timeLimit: 300,
            userEmail: 'user@example.com',
            userEmailModify: undefined,
            userName: 'User',
            userPhone: '0912345678',
        });
        const applyResult = yield order.apply();
        console.log('Order No.: ', order.orderNo());
        console.log('Apply result: ', applyResult);
        console.log('\nGenerating html file for test (./demo.html).....');
        yield fs.writeFile(node_path_1.default.join('.', 'demo.html'), (0, generate_html_form_1.generateHtmlForm)(applyResult));
        console.log('please open ./demo.html with web browser to test');
    });
}
void main();
