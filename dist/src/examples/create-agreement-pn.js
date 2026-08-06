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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
/**
 * 4.3 後續約定付款(Pn) - 幕後情境 [NPA-B102]
 *
 * 需先完成 P1（create-agreement-order.ts），從 Notify 取得 TokenValue 後再執行本範例。
 */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        index_1.newebpay.configuration.setEnvParams({
            hashIV: '',
            hashKey: '',
            merchantId: '',
            paymentApiUrl: 'https://ccore.newebpay.com/MPG/mpg_gateway',
            // creditCardApiUrl 未設定時會自動推導為 .../API/CreditCard
        });
        const now = new Date();
        const orderNo = now.toISOString().replace(/[-T:.]/g, '');
        // TokenTerm / TokenValue 來自首次約定付款 P1 成功後的 Notify
        const response = yield new index_1.newebpay.agreement.AgreementPn({
            MerchantOrderNo: orderNo,
            Amt: 1000,
            ProdDesc: '訂閱服務月費',
            TokenTerm: 'member-001',
            TokenValue: '',
            CardHolderFirstName: 'WEI LUN',
            CardHolderLastName: 'CHEN',
            PayerEmail: 'user@example.com',
            // CardHolderPhone: '0912345678', // Passkey 驗證時必填
            // P3D: '1', // 若需 3D，並一併帶 NotifyURL / ReturnURL
        }).execute();
        console.log('Status:', response.Status);
        console.log('Message:', response.Message);
        if (typeof response.Result === 'string') {
            // Status === '3dVerify' 時，Result 為需導向消費者的 HTML
            console.log('3D Verify HTML length:', response.Result.length);
            return;
        }
        console.log('Result:', {
            orderNo: response.Result.MerchantOrderNo,
            tradeNo: response.Result.TradeNo,
            amount: response.Result.Amt,
            respondCode: response.Result.RespondCode,
            auth: response.Result.Auth,
            authBank: response.Result.AuthBank,
            card6No: response.Result.Card6No,
            card4No: response.Result.Card4No,
            checkCodeValid: response.Result.checkCodeValid,
        });
    });
}
void main();
