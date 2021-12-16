"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = exports.toNumber = void 0;
/**
 * 嘗試將任何值轉換為 number，當 value 不是 string, number 或轉換失敗時，回傳 NaN
 * @param value
 */
function toNumber(value) {
    if (value === undefined || value === null || value === '')
        return NaN;
    if (typeof value === 'string')
        return Number(value);
    if (typeof value === 'number')
        return value;
    return NaN;
}
exports.toNumber = toNumber;
/**
 * 如果 value 是以下其中之一 undefined, null, 空字串("") 則返回 true
 * @param value
 */
function isEmpty(value) {
    return value === undefined || value === null || value === '';
}
exports.isEmpty = isEmpty;
