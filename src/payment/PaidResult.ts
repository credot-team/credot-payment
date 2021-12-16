import { PayMethods } from './PayMethods';
import { OrderStatus } from './OrderStatus';

export interface PaidResult {
  isValid(): boolean;

  poweredBy(): string;

  payMethod(): PayMethods;

  applyNo(): string;

  orderNo(): string;

  shopName(): string | undefined;

  payer(): string;

  cardNo(): string | undefined;

  amount(): string;

  status(): OrderStatus;

  isFromBrowser(): boolean;

  errorCode(): string | null;

  errorMessage(): string | null;

  finishTime(): Date;

  rawData(): any;

  successResponse(): string;
}
