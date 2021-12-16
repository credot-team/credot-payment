import sha1 from 'crypto-js/sha1';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { PoweredBy } from './index';
import {
  CreateFunction,
  OrderApplyResult,
  PaidOrder as IPaidOrder,
  PaidOrderParams,
} from '../PaidOrder';
import { PayMethods } from '../PayMethods';
import { PaidOrderFields } from './PaidOrderFields';
import { PaidResult } from './PaidResult';
import { configuration } from './Configuration';
import { isEmpty } from '../../utils/convert';

dayjs.extend(customParseFormat);

type FetchStatusArgs = { applyNo?: string; orderNo?: string };
type IncludeAnyOne<T, U> = (Extract<keyof T, keyof U> extends never
  ? 'please enter at least 1 field.'
  : T) &
  U;

interface CustomFields {
  term: PaidOrderFields['Term'];
}

export const create: CreateFunction<CustomFields> = (payMethod, params) => {
  return new PaidOrder<typeof payMethod>(payMethod, params);
};

export class PaidOrder<P extends PayMethods> extends IPaidOrder<P, CustomFields> {
  private readonly _payMethod: P;
  private readonly _term: PaidOrderFields['Term'];
  private readonly _orderNo: string;
  private readonly _orderInfo: string;
  private readonly _amount: number;
  private readonly _userName: string;
  private readonly _userPhone: string;
  private readonly _userEmail: string;
  private readonly _memo: string | null | undefined;
  private readonly _checksum: string;

  /**
   *
   * @param payMethod
   * @param params 訂單資訊
   */
  constructor(payMethod: P, params: PaidOrderParams<P, CustomFields>) {
    super(payMethod, params);
    this._payMethod = params.payMethod;
    this._term = params.term ?? '';
    this._orderNo = params.orderNo;
    this._orderInfo = params.orderInfo;
    this._amount = params.amount;
    this._userName = params.userName;
    this._userPhone = params.userPhone;
    this._userEmail = params.userEmail;
    this._memo = params.memo ?? '';

    const env = configuration.getEnvParams();
    this._checksum = sha1(
      env.merchantId[PayMethods.Credit] + env.transPassword + this._amount + this._term,
    )
      .toString()
      .toUpperCase();
  }

  poweredBy(): string {
    return PoweredBy;
  }

  payMethod(): PayMethods {
    return this._payMethod;
  }

  orderNo(): string {
    return this._orderNo;
  }

  amount(): string {
    return this._amount.toString();
  }

  checksum(): string {
    return this._checksum;
  }

  apply(): Promise<OrderApplyResult> {
    const env = configuration.getEnvParams();
    const params: PaidOrderFields = {
      web: env.merchantId[PayMethods.Credit],
      MN: this._amount.toString(),
      Td: this._orderNo,
      OrderInfo: this._orderInfo,
      sna: this._userName,
      sdt: this._userPhone,
      email: this._userEmail,
      note1: this._memo ?? undefined,
      note2: undefined,
      Card_Type: '0',
      Country_Type: '',
      Term: '',
      ChkValue: this._checksum,
    };

    const data = {
      $method: 'POST',
      $url: env.paymentApiHost + '/Etopm.aspx',

      web: params.web,
      MN: params.MN,
      OrderInfo: params.OrderInfo,
      Td: params.Td,
      sna: encodeURIComponent(params.sna),
      sdt: params.sdt,
      email: params.email,
      note1: encodeURIComponent(params.note1 ?? ''),
      note2: encodeURIComponent(params.note2 ?? ''),
      Card_Type: params.Card_Type,
      Country_Type: params.Country_Type,
      Term: params.Term,
      ChkValue: params.ChkValue,
    };
    return Promise.resolve({ method: 'json', payload: data });
  }

  /**
   * 即時交易查詢
   * @param args
   */
  public static fetchStatus<T>(args: IncludeAnyOne<T, FetchStatusArgs>) {
    const env = configuration.getEnvParams();
    const url = env.paymentApiHost + '/PaymentCheck.aspx';
    if (isEmpty(args.orderNo) && isEmpty(args.applyNo)) return Promise.resolve(undefined);

    const params = {
      web: env.merchantId[PayMethods.Credit],
      buysafeno: args.applyNo,
      Td: args.orderNo,
      ChkValue: '',
    };
    params.ChkValue = sha1([params.web, env.transPassword, params.buysafeno, params.Td].join(''))
      .toString()
      .toUpperCase();

    return new Promise<PaidResult[]>(async (resolve, reject) => {
      const query = new URLSearchParams(params as any).toString();
      const result = await axios.post<string>(url, query, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      });
      const rows = result.data.split('\r\n').filter((s) => s);
      const paidResults = rows.map((row) => {
        const fields = row.split('##');
        // 無法被 ## 分割，表示API回傳的是錯誤訊息
        if (fields.length < 2) reject(new Error(result.data));

        return new PaidResult(
          PayMethods.Credit,
          {
            web: fields[0],
            buysafeno: fields[1],
            MN: fields[2],
            errcode: fields[4],
            Card_NO: fields[5],
            ApproveCode: fields[6],
            ChkValue: fields[7],
            Name: '',
          },
          dayjs(fields[3], 'YYYYMMDDHHmm').toDate(),
        );
      });
      resolve(paidResults);
    });
  }
}
