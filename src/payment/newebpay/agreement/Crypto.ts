import CryptoJS, { AES, SHA256 } from 'crypto-js';

import { configuration } from '../Configuration';

function env() {
  return configuration.getEnvParams();
}

function toQueryString(data: Record<string, string | number | undefined | null>): string {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function encryptQueryString(data: Record<string, string | number | undefined | null>): string {
  const { hashKey, hashIV } = env();
  return AES.encrypt(toQueryString(data), CryptoJS.enc.Utf8.parse(hashKey), {
    iv: CryptoJS.enc.Utf8.parse(hashIV),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.format.Hex);
}

export function encryptJson(data: Record<string, string | number | undefined | null>): string {
  const { hashKey, hashIV } = env();
  return AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(hashKey), {
    iv: CryptoJS.enc.Utf8.parse(hashIV),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.format.Hex);
}

export function decryptAes(encrypted: string): string {
  const { hashKey, hashIV } = env();
  const str = CryptoJS.enc.Hex.parse(encrypted);
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: str,
    padding: CryptoJS.pad.Pkcs7,
  });
  return AES.decrypt(cipherParams, CryptoJS.enc.Utf8.parse(hashKey), {
    iv: CryptoJS.enc.Utf8.parse(hashIV),
    mode: CryptoJS.mode.CBC,
  }).toString(CryptoJS.enc.Utf8);
}

export function hashEncrypted(encrypted: string): string {
  const { hashKey, hashIV } = env();
  return SHA256(`HashKey=${hashKey}&${encrypted}&HashIV=${hashIV}`).toString().toUpperCase();
}

export function buildCheckCode(result: {
  Amt: number | string;
  MerchantID: string;
  MerchantOrderNo: string;
  TradeNo: string;
}): string {
  const { hashKey, hashIV } = env();
  const checkStr = toQueryString({
    Amt: result.Amt,
    MerchantID: result.MerchantID,
    MerchantOrderNo: result.MerchantOrderNo,
    TradeNo: result.TradeNo,
  });
  return SHA256(`HashIV=${hashIV}&${checkStr}&HashKey=${hashKey}`).toString().toUpperCase();
}

export function verifyCheckCode(
  result: {
    Amt: number | string;
    MerchantID: string;
    MerchantOrderNo: string;
    TradeNo: string;
    CheckCode: string;
  },
): boolean {
  return buildCheckCode(result) === result.CheckCode;
}
