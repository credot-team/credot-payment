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
const http_1 = __importDefault(require("http"));
const querystring = __importStar(require("node:querystring"));
const index_1 = require("../../index");
// set these variables before you run the server.
index_1.newebpay.configuration.setEnvParams({
    hashIV: '',
    hashKey: '',
    merchantId: '',
    paymentApiUrl: 'https://ccore.newebpay.com/MPG/mpg_gateway',
});
const newebpayConfig = index_1.newebpay.configuration.getEnvParams();
if (!newebpayConfig.hashIV || !newebpayConfig.hashKey || !newebpayConfig.merchantId) {
    throw new Error('newebpay environment variable missing');
}
function getReqBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            resolve(body);
        });
        req.on('error', (err) => reject(err));
    });
}
const routes = {
    '/': (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello, World!\n');
    },
    '/newebpay/notify': (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const body = yield getReqBody(req);
        const payload = querystring.parse(body);
        const paidResult = new index_1.newebpay.PaidResult(payload);
        console.log('PaidResult Object:', paidResult);
        console.log('PaidResult info:', {
            isValid: paidResult.isValid(),
            amount: paidResult.amount(),
            paidSuccess: paidResult.isPaid(),
            status: paidResult.status(),
            payInfo: paidResult.payInfo(),
        });
        // you MUST return 200(OK) to tell the 3rd-party server this notify is success, or it will try to notify again and again
        res.statusCode = 200;
        res.end(paidResult.successResponse());
    }),
    '/esafe/notify': (req, res) => {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('404 Not Found\n');
    },
    '/404': (req, res) => {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('404 Not Found\n');
    },
};
const server = http_1.default.createServer((req, res) => {
    const url = req.url;
    console.log(`${req.method} ${url}`);
    const handler = url ? routes[url] || routes['/404'] : routes['/404'];
    void handler(req, res);
});
const port = 80;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
