import { newebpay } from '../../index';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { generateHtmlForm } from '../utils/generate-html-form';

async function main() {
  newebpay.configuration.setEnvParams({
    hashIV: '',
    hashKey: '',
    merchantId: '',
    paymentApiUrl: 'https://ccore.newebpay.com/MPG/mpg_gateway',
    notifyUrl: 'https://test.newebpay.com/newebpay/agreement/notify',
    returnUrl: 'https://test.newebpay.com/newebpay/agreement/return',
  });

  const now = new Date();
  const orderNo = now.toISOString().replace(/[-T:.]/g, '');

  // 4.1 首次約定付款(P1) - 幕前情境 [NPA-F011]
  const order = new newebpay.agreement.AgreementOrder({
    orderNo,
    amount: 100,
    orderInfo: '訂閱服務首期',
    userEmail: 'user@example.com',
    tokenTerm: 'member-001',
    orderComment: '同意每月自動扣款',
    useFor: 0,
  });

  const applyResult = await order.apply();
  console.log('Order No.:', order.orderNo());
  console.log('Token Term:', order.tokenTerm());
  console.log('Apply result:', applyResult);

  console.log('\nGenerating html file for test (./demo-agreement.html).....');
  await fs.writeFile(path.join('.', 'demo-agreement.html'), generateHtmlForm(applyResult));
  console.log('please open ./demo-agreement.html with web browser to test');

  // 付款完成後，NotifyURL / ReturnURL 會收到回傳，可用 AgreementResult 解析：
  //
  // import * as querystring from 'node:querystring';
  // const payload = querystring.parse(body);
  // const result = new newebpay.agreement.AgreementResult(payload);
  // console.log(result.tokenValue(), result.tokenLife());
  //
  // 取得 TokenValue 後，後續扣款可呼叫：
  // await new newebpay.agreement.AgreementPn({ ... }).execute();
}

void main();
