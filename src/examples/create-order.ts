import { newebpay, PayMethods } from '../../index';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { generateHtmlForm } from '../utils/generate-html-form';

async function main() {
  newebpay.configuration.setEnvParams({
    hashIV: '',
    hashKey: '',
    merchantId: '',
    paymentApiUrl: 'https://ccore.newebpay.com/MPG/mpg_gateway',
  });

  const now = new Date();
  const order = new newebpay.PaidOrder(PayMethods.Credit, {
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

  const applyResult = await order.apply();
  console.log('Order No.: ', order.orderNo());
  console.log('Apply result: ', applyResult);

  console.log('\nGenerating html file for test (./demo.html).....');
  await fs.writeFile(path.join('.', 'demo.html'), generateHtmlForm(applyResult));
  console.log('please open ./demo.html with web browser to test');
}

void main();
