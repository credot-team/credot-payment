import http from 'http';
import * as querystring from 'node:querystring';

import { newebpay } from '../../index';

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
    const payload: any = querystring.parse(body);

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
