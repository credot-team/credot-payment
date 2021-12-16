import { PayMethods } from './PayMethods';

export interface OrderApplyResult {
  method: 'redirect' | 'page' | 'json';
  payload: any;
}

export interface CustomFieldsType {
  // 信用卡分期
  term: any;
}

export type CreateFunction<C extends CustomFieldsType> = <P extends PayMethods>(
  payMethod: P,
  params: PaidOrderParams<P, C>,
) => PaidOrder<P, C>;

export type PaidOrderParams<P extends PayMethods, C extends CustomFieldsType> = {
  // 付款方式
  payMethod: P;
  // 訂單號
  orderNo: string;
  // 訂單內容
  orderInfo: string;
  // 金額
  amount: number;
  // 消費者姓名
  userName: string;
  // 消費者電話
  userPhone: string;
  // 消費者電子信箱
  userEmail: string;
  // 備註
  memo?: string;
} & C;

export abstract class PaidOrder<PayMethod extends PayMethods, Custom extends CustomFieldsType> {
  protected constructor(payMethod: PayMethod, params: PaidOrderParams<PayMethod, Custom>) {}

  abstract poweredBy(): string;

  abstract payMethod(): PayMethods;

  abstract orderNo(): string;

  abstract amount(): string;

  abstract checksum(): string;

  abstract apply(): Promise<OrderApplyResult>;
}
