import axios from 'axios';
import CryptoJS, { SHA256 } from 'crypto-js';

import { ApiResult, Invoice as IInvoice } from '../Invoice';
import {
  AllowanceCancelFields,
  AllowanceFields,
  InvoiceCancelFields,
  InvoiceDiscardFields,
  InvoiceFields,
} from './InvoiceStructs';
import { configuration } from './Configuration';

interface ApiResponse {
  RtCode: string;
  RtMessage: string;
  [k: string]: any;
}

type InvoiceItemInfoFields = Extract<
  keyof InvoiceFields,
  'Description' | 'Quantity' | 'UnitPrice' | 'Amount'
>;
type InvoiceItemInfo = Pick<InvoiceFields, InvoiceItemInfoFields>;
type InvoiceIssueArgs = Omit<InvoiceFields, InvoiceItemInfoFields>;

type AllowanceItemInfoFields = Extract<
  keyof AllowanceFields,
  'OrDescription' | 'Quantity' | 'UnitPrice' | 'Amount'
>;
type AllowanceItemInfo = Pick<AllowanceFields, AllowanceItemInfoFields>;
type AllowanceIssueArgs = Omit<AllowanceFields, AllowanceItemInfoFields>;

//==================================
// API Response types
//==================================

type InvoiceIssueResponse = {
  OrderNo: string;
  InvoiceNumber: string;
  InvoiceUrl: string;
};

//==================================
// Types End
//==================================

const INVOICE_ISSUE_ARGS_TEMPLATE: Partial<InvoiceFields> = {
  OrderNo: undefined,
  BuyerId: undefined,
  BuyerName: undefined,
  BuyerAddress: undefined,
  BuyerPhone: undefined,
  BuyerEmail: undefined,
  TaxType: undefined,
  IsCustoms: undefined,
  CarrierType: undefined,
  CarrierId: undefined,
  NPOBAN: undefined,
  Description: undefined,
  Quantity: undefined,
  UnitPrice: undefined,
  Amount: undefined,
  Remark: undefined,
  IsSend: undefined,
  IsSendSms: undefined,
};

const INVOICE_CANCEL_ARGS_TEMPLATE: Partial<InvoiceCancelFields> = {
  InvoiceNumber: undefined,
  InvoiceDate: undefined,
};

const INVOICE_DISCARD_ARGS_TEMPLATE: Partial<InvoiceDiscardFields> = {
  InvoiceNumber: undefined,
  InvoiceDate: undefined,
};

const ALLOWANCE_ISSUE_ARGS_TEMPLATE: Partial<AllowanceFields> = {
  AllowanceNumber: undefined,
  OrInvoiceNumber: undefined,
  OrInvoiceDate: undefined,
  TaxType: undefined,
  OrDescription: undefined,
  Quantity: undefined,
  UnitPrice: undefined,
  Amount: undefined,
};

const ALLOWANCE_CANCEL_ARGS_TEMPLATE: Partial<AllowanceCancelFields> = {
  AllowanceNumber: undefined,
  AllowanceDate: undefined,
};

class Invoice implements IInvoice {
  /**
   * 開立發票
   * @param info
   * @param items
   */
  issueInvoice(
    info: InvoiceIssueArgs,
    items: InvoiceItemInfo[],
  ): Promise<ApiResult<InvoiceIssueResponse>> {
    const invoices: InvoiceFields[] = [];
    items.forEach((item) => {
      invoices.push({ ...INVOICE_ISSUE_ARGS_TEMPLATE, ...info, ...item });
    });

    return (async () => {
      const result = await Invoice.request('/c0401', undefined, invoices);
      if (result.RtCode !== '0000') {
        return { error: result.RtMessage };
      }
      const invoiceData = JSON.parse(
        Invoice.base64Decode(result.RtInvoice),
      ) as InvoiceIssueResponse[];
      return { error: undefined, result: invoiceData[0] };
    })();
  }

  /**
   * 作廢發票
   * @param data
   */
  cancelInvoice(data: InvoiceCancelFields): Promise<ApiResult<void>> {
    const args = { ...INVOICE_CANCEL_ARGS_TEMPLATE, ...data };
    return (async () => {
      const result = await Invoice.request('/c0501', undefined, args);
      if (result.RtCode !== '0000') {
        return { error: result.RtMessage };
      }
      return { error: undefined };
    })();
  }

  /**
   * 註銷發票
   * @param data
   */
  discardInvoice(data: InvoiceDiscardFields): Promise<ApiResult<void>> {
    const args = { ...INVOICE_DISCARD_ARGS_TEMPLATE, ...data };
    return (async () => {
      const result = await Invoice.request('/c0701', undefined, args);
      if (result.RtCode !== '0000') {
        return { error: result.RtMessage };
      }
      return { error: undefined };
    })();
  }

  /**
   * 查詢發票狀態
   * @param orderNo
   */
  fetchInvoiceState(orderNo: string): Promise<ApiResult<string>> {
    return (async () => {
      const result = await Invoice.request('/Get_Order_State', { OrderNo: orderNo });
      if (result.RtCode !== '0000') {
        return { error: result.RtMessage };
      }
      return { error: undefined, result: result.RtState };
    })();
  }

  /**
   * 下載發票 PDF
   * @param invoiceNumber
   */
  downloadInvoicePdf(invoiceNumber: string): Promise<ApiResult<Buffer>> {
    return (async () => {
      const result = await Invoice.request('/InvoicePdf', {
        Num: invoiceNumber,
        Type: 1,
      });
      if (result.RtCode !== '0000') {
        return { error: result.RtMessage };
      }

      return { error: undefined, result: Buffer.from(result.RtData as Uint8Array) };
    })();
  }

  /**
   * 開立折讓
   * @param info
   * @param items
   */
  issueAllowance(info: AllowanceIssueArgs, items: AllowanceItemInfo[]): Promise<ApiResult<any>> {
    const allowances: AllowanceFields[] = [];
    items.forEach((item) => {
      allowances.push({ ...ALLOWANCE_ISSUE_ARGS_TEMPLATE, ...info, ...item });
    });

    return (async () => {
      const result = await Invoice.request('/d0401', undefined, allowances);
      if (result.RtCode !== '0000') {
        return { error: result.RtMessage };
      }
      return { error: undefined, result: result };
    })();
  }

  /**
   * 作廢折讓
   * @param data
   */
  cancelAllowance(data: AllowanceCancelFields): Promise<ApiResult<void>> {
    const args = { ...ALLOWANCE_CANCEL_ARGS_TEMPLATE, ...data };
    return (async () => {
      const result = await Invoice.request('/d0501', undefined, args);
      if (result.RtCode !== '0000') {
        return { error: result.RtMessage };
      }
      return { error: undefined };
    })();
  }

  /**
   * 查詢折讓狀態
   * @param allowanceNumber
   */
  fetchAllowanceState(allowanceNumber: string): Promise<ApiResult<string>> {
    return (async () => {
      const result = await Invoice.request('/Get_AllowanceNumber_State', {
        AllowanceNumber: allowanceNumber,
      });
      if (result.RtCode !== '0000') {
        return { error: result.RtMessage };
      }
      return { error: undefined, result: result.RtState };
    })();
  }

  /**
   * 下載折讓 PDF
   * @param allowanceNumber
   */
  downloadAllowancePdf(allowanceNumber: string): Promise<ApiResult<Buffer>> {
    return (async () => {
      const result = await Invoice.request('/AllowancePdf', {
        Num: allowanceNumber,
        Type: 1,
      });
      if (result.RtCode !== '0000') {
        return { error: result.RtMessage };
      }
      return { error: undefined, result: Buffer.from(result.RtData as Uint8Array) };
    })();
  }

  //================================
  // Utility Methods
  //================================

  private static async request(
    path: string,
    params?: Record<string, any>,
    payload?: any,
  ): Promise<ApiResponse> {
    const env = configuration.getEnvParams();
    const csvPayload = payload
      ? Invoice.toCSV(Array.isArray(payload) ? payload : [payload])
      : undefined;
    const postData = {
      ...params,
      Account: env.invoiceAccount,
      Passwd: Invoice.cryptoPassword(env.invoicePassword),
      Csv: csvPayload ? Invoice.base64Encode(csvPayload) : undefined,
    };

    const result = await axios.post(`${env.invoiceApiHost}${path}`, postData);
    if (result.status !== 200) throw new Error("response status is not '200'");
    return result.data;
  }

  private static cryptoPassword(passwd: string): string {
    // 密碼經過 SHA256 雜湊後，保持 bytes 的形式直接轉為 Base64 編碼
    return CryptoJS.enc.Base64.stringify(SHA256(passwd));
  }

  private static toCSV(data: any[]): string {
    if (!data.length) return '';
    const lines = Array(data.length + 1)
      .fill(undefined)
      .map((_) => [] as string[]);
    Object.keys(data[0]).forEach((key) => {
      lines[0].push(key);
      data.forEach((row, idx) => {
        const value = row[key];
        lines[idx + 1].push(Invoice.textNormalization(value));
      });
    });
    return lines.map((line) => line.join(',')).join('\n');
  }

  private static textNormalization(text: string | number | undefined | null): string {
    if (text === undefined || text === null) return '';
    const t = typeof text === 'string' ? text : text.toString();
    const replaceMap: Record<string, string> = {
      ',': '，',
      '*': '＊',
      '<': '＜',
      '>': '＞',
      '[': '［',
      ']': '］',
    };
    return t.replace(/[*<>\[\]]/g, (substring, args) => {
      return replaceMap[substring] ?? '〿';
    });
  }

  private static base64Encode(value: string): string {
    const words = CryptoJS.enc.Utf8.parse(value);
    return CryptoJS.enc.Base64.stringify(words);
  }

  private static base64Decode(value: string): string {
    const words = CryptoJS.enc.Base64.parse(value);
    return CryptoJS.enc.Utf8.stringify(words);
  }
}

const invoiceInstance = new Invoice();
export { invoiceInstance as Invoice };
