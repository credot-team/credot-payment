import sha1 from 'crypto-js/sha1';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { isEmpty } from '../../utils/convert';
import {
  CustomFieldsType,
  HtmlFormPostParams,
  OrderApplyResult,
  PaidOrder as IPaidOrder,
  PaidOrderParams,
  PaidOrderOptions,
} from '../PaidOrder';
import { PayMethods } from '../PayMethods';
import { Locales } from '../Locales';
import { PoweredBy } from './';
import { PaidOrderFields } from './PaidOrderFields';
import { PaidResult } from './PaidResult';
import { AcceptMethods, configuration, EsafeEnvironmentParameters } from './Configuration';

dayjs.extend(customParseFormat);

type FetchStatusArgs = { applyNo?: string; orderNo?: string };
type IncludeAnyOne<T, U> = (Extract<keyof T, keyof U> extends never
  ? 'please enter at least 1 field.'
  : T) &
  U;

interface CustomFields extends CustomFieldsType {
  installment: PaidOrderFields['Term'];
  locale: Locales.zh_TW | Locales.en_US | Locales.ja;
}

//=============================
// End of Types
//=============================

export class PaidOrder<EnableMethods extends AcceptMethods> extends IPaidOrder<
  AcceptMethods,
  CustomFields,
  EsafeEnvironmentParameters
> {
  private readonly _checksum: string;

  constructor(
    payMethod: EnableMethods | EnableMethods[],
    params: PaidOrderParams<EnableMethods, CustomFields>,
    options?: PaidOrderOptions<EsafeEnvironmentParameters>,
  ) {
    super(payMethod, params, options);

    const env = this._options.env ?? configuration.getEnvParams();
    const _params = this.params;
    this._checksum = sha1(
      env.merchantId[PayMethods.Credit] +
        env.transPassword +
        _params.amount +
        (_params.installment ?? ''),
    )
      .toString()
      .toUpperCase();
  }

  getEnvParams() {
    return this._options.env ?? configuration.getEnvParams();
  }

  poweredBy(): string {
    return PoweredBy;
  }

  checksum(): string {
    return this._checksum;
  }

  apply(): Promise<OrderApplyResult> {
    const env = this.getEnvParams();
    const params = this.params;

    const args: PaidOrderFields = {
      web: env.merchantId[PayMethods.Credit],
      MN: params.amount.toString(),
      Td: params.orderNo,
      OrderInfo: params.orderInfo,
      sna: params.userName,
      sdt: params.userPhone,
      email: params.userEmail,
      note1: params.memo ?? undefined,
      note2: undefined,
      Card_Type: '0',
      Country_Type:
        params.locale === Locales.en_US ? 'EN' : params.locale === Locales.ja ? 'JIS' : '',
      Term: params.installment,
      ChkValue: this.checksum(),
    };

    const data: HtmlFormPostParams = {
      properties: {
        method: 'post',
        url: env.paymentApiHost + '/Etopm.aspx',
      },
      data: {
        web: args.web,
        MN: args.MN,
        OrderInfo: args.OrderInfo,
        Td: args.Td,
        sna: encodeURIComponent(args.sna),
        sdt: args.sdt,
        email: args.email,
        note1: encodeURIComponent(args.note1 ?? ''),
        note2: encodeURIComponent(args.note2 ?? ''),
        Card_Type: args.Card_Type,
        Country_Type: args.Country_Type,
        Term: args.Term,
        ChkValue: args.ChkValue,
      },
    };
    return Promise.resolve({ method: 'json', payload: data });
  }

  /**
   * 即時交易查詢
   * @param args
   */
  public static fetchStatus<T>(
    args: IncludeAnyOne<T, FetchStatusArgs>,
    envParams?: EsafeEnvironmentParameters,
  ) {
    const env = envParams ?? configuration.getEnvParams();
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
          {
            payMethod: PayMethods.Credit,
            finishedAt: dayjs(fields[3], 'YYYYMMDDHHmm').toDate(),
          },
        );
      });
      resolve(paidResults);
    });
  }
}
