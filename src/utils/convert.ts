/**
 * 嘗試將任何值轉換為 number，當 value 不是 string, number 或轉換失敗時，回傳 NaN
 * @param value
 */
export function toNumber(value: any): number {
  if (value === undefined || value === null || value === '') return NaN;
  if (typeof value === 'string') return Number(value);
  if (typeof value === 'number') return value;
  return NaN;
}

/**
 * 如果 value 是以下其中之一 undefined, null, 空字串("") 則返回 true
 * @param value
 */
export function isEmpty(value: any): boolean {
  return value === undefined || value === null || value === '';
}
