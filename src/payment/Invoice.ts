export type ApiResult<T> = { error: string | undefined; result?: T };

export interface Invoice {
  issueInvoice(...args: any[]): Promise<ApiResult<any>>;
  cancelInvoice(...args: any[]): Promise<ApiResult<any>>;
  discardInvoice(...args: any[]): Promise<ApiResult<any>>;
  fetchInvoiceState(...args: any[]): Promise<ApiResult<any>>;
  downloadInvoicePdf(...args: any[]): Promise<ApiResult<any>>;

  issueAllowance(...args: any[]): Promise<ApiResult<any>>;
  cancelAllowance(...args: any[]): Promise<ApiResult<any>>;
  fetchAllowanceState(...args: any[]): Promise<ApiResult<any>>;
  downloadAllowancePdf(...args: any[]): Promise<ApiResult<any>>;
}
