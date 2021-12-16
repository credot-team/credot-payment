import { OrderStatus } from '../OrderStatus';

const ERROR_CODE_TABLE: Record<string, OrderStatus> = {
  '00': OrderStatus.success,
  E0E0: OrderStatus.refunded,
  E0EX: OrderStatus.refundReviewing,
  EBEB: OrderStatus.canceled,
  ECEC: OrderStatus.partialRefunded,
  ECEX: OrderStatus.partialRefundReviewing,
  E9E9: OrderStatus.abnormalAmount,
  '3DXX': OrderStatus.threeDSecure,
};

export function parseErrorCode(code: string): OrderStatus {
  return ERROR_CODE_TABLE[code] ?? OrderStatus.unknown;
}
