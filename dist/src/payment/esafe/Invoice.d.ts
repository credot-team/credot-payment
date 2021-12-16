/// <reference types="node" />
import { ApiResult, Invoice as IInvoice } from '../Invoice';
import { AllowanceCancelFields, AllowanceFields, InvoiceCancelFields, InvoiceDiscardFields, InvoiceFields } from './InvoiceStructs';
declare type InvoiceItemInfoFields = Extract<keyof InvoiceFields, 'Description' | 'Quantity' | 'UnitPrice' | 'Amount'>;
declare type InvoiceItemInfo = Pick<InvoiceFields, InvoiceItemInfoFields>;
declare type InvoiceIssueArgs = Omit<InvoiceFields, InvoiceItemInfoFields>;
declare type AllowanceItemInfoFields = Extract<keyof AllowanceFields, 'OrDescription' | 'Quantity' | 'UnitPrice' | 'Amount'>;
declare type AllowanceItemInfo = Pick<AllowanceFields, AllowanceItemInfoFields>;
declare type AllowanceIssueArgs = Omit<AllowanceFields, AllowanceItemInfoFields>;
declare type InvoiceIssueResponse = {
    OrderNo: string;
    InvoiceNumber: string;
    InvoiceUrl: string;
};
declare class Invoice implements IInvoice {
    /**
     * 開立發票
     * @param info
     * @param items
     */
    issueInvoice(info: InvoiceIssueArgs, items: InvoiceItemInfo[]): Promise<ApiResult<InvoiceIssueResponse>>;
    /**
     * 作廢發票
     * @param data
     */
    cancelInvoice(data: InvoiceCancelFields): Promise<ApiResult<void>>;
    /**
     * 註銷發票
     * @param data
     */
    discardInvoice(data: InvoiceDiscardFields): Promise<ApiResult<void>>;
    /**
     * 查詢發票狀態
     * @param orderNo
     */
    fetchInvoiceState(orderNo: string): Promise<ApiResult<string>>;
    /**
     * 下載發票 PDF
     * @param invoiceNumber
     */
    downloadInvoicePdf(invoiceNumber: string): Promise<ApiResult<Buffer>>;
    /**
     * 開立折讓
     * @param info
     * @param items
     */
    issueAllowance(info: AllowanceIssueArgs, items: AllowanceItemInfo[]): Promise<ApiResult<any>>;
    /**
     * 作廢折讓
     * @param data
     */
    cancelAllowance(data: AllowanceCancelFields): Promise<ApiResult<void>>;
    /**
     * 查詢折讓狀態
     * @param allowanceNumber
     */
    fetchAllowanceState(allowanceNumber: string): Promise<ApiResult<string>>;
    /**
     * 下載折讓 PDF
     * @param allowanceNumber
     */
    downloadAllowancePdf(allowanceNumber: string): Promise<ApiResult<Buffer>>;
    private static request;
    private static cryptoPassword;
    private static toCSV;
    private static textNormalization;
    private static base64Encode;
    private static base64Decode;
}
declare const invoiceInstance: Invoice;
export { invoiceInstance as Invoice };
