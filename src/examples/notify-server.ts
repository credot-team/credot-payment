import http from 'http';
import * as querystring from 'node:querystring';

import { newebpay } from '../../index';
import { AgreementOrderResult } from '../payment/newebpay/agreement/Fields';
import { PaidResultFields } from '../payment/newebpay/PaidResultFields';
import { AcceptMethods } from '../payment/newebpay/Configuration';
import { PayMethods } from '../payment/PayMethods';

// set these variables before you run the server.
newebpay.configuration.setEnvParams({
  hashIV: '',
  hashKey: '',
  merchantId: '',
  paymentApiUrl: 'https://ccore.newebpay.com/MPG/mpg_gateway',
});

const newebpayConfig = newebpay.configuration.getEnvParams();
if (!newebpayConfig.hashIV || !newebpayConfig.hashKey || !newebpayConfig.merchantId) {
  throw new Error('newebpay environment variable missing');
}

function getReqBody(req: http.IncomingMessage): Promise<string> {
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

type NotifyPayload = PaidResultFields<false, AcceptMethods>;

/**
 * 約定付款 P1 成功時，TradeInfo.Result 會包含 TokenValue。
 * 外層 Status / TradeInfo / TradeSha 格式與一般 MPG 相同，需解密後才能區分。
 */
function isAgreementNotify(payload: NotifyPayload): boolean {
  try {
    const decrypted = JSON.parse(
      newebpay.PaidResult.decryptTradeInfo(payload.TradeInfo, newebpayConfig),
    ) as PaidResultFields<true, PayMethods.Credit>['TradeInfo'];
    const result = decrypted.Result as AgreementOrderResult;
    return Boolean(result.TokenValue);
  } catch {
    return false;
  }
}

function parseNotifyPayload(body: string): NotifyPayload {
  return querystring.parse(body) as unknown as NotifyPayload;
}

const routes: Record<
  string,
  (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void> | void
> = {
  '/': (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!\n');
  },

  '/newebpay/notify': async (req, res) => {
    const body = await getReqBody(req);
    const payload = parseNotifyPayload(body);

    const paidResult = new newebpay.PaidResult(payload);
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
  },

  /**
   * 同一 Notify URL 同時接收一般 MPG 與約定付款 P1 時，
   * 依解密後的 Result.TokenValue 是否存在來分支處理。
   */
  '/newebpay/notify/auto': async (req, res) => {
    const body = await getReqBody(req);
    const payload = parseNotifyPayload(body);

    if (isAgreementNotify(payload)) {
      const agreementResult = new newebpay.agreement.AgreementResult(
        payload as PaidResultFields<false, PayMethods.Credit>,
      );
      console.log('[AgreementResult] 約定付款 P1 notify');
      console.log({
        isValid: agreementResult.isValid(),
        orderNo: agreementResult.orderNo(),
        amount: agreementResult.amount(),
        paidSuccess: agreementResult.isPaid(),
        status: agreementResult.status(),
        tokenValue: agreementResult.tokenValue(),
        tokenLife: agreementResult.tokenLife(),
        tokenUseStatus: agreementResult.tokenUseStatus(),
        payInfo: agreementResult.payInfo(),
      });
      // TODO: 持久化 tokenTerm + tokenValue + tokenLife，供後續 AgreementPn 使用
    } else {
      const paidResult = new newebpay.PaidResult(payload);
      console.log('[PaidResult] 一般 MPG notify');
      console.log({
        isValid: paidResult.isValid(),
        orderNo: paidResult.orderNo(),
        amount: paidResult.amount(),
        paidSuccess: paidResult.isPaid(),
        status: paidResult.status(),
        payInfo: paidResult.payInfo(),
      });
    }

    res.statusCode = 200;
    res.end();
  },

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

const server = http.createServer((req, res) => {
  const url = req.url;

  console.log(`${req.method} ${url}`);

  const handler = url ? routes[url] || routes['/404'] : routes['/404'];
  void handler(req, res);
});

const port: number = 80;

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
