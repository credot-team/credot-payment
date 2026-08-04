import axios from 'axios';

import { configuration } from '../Configuration';
import { decryptAes, encryptJson, hashEncrypted } from './Crypto';
import { TokenCardRequestData, TokenCardResponse, TokenQueryResult } from './Fields';

export type TokenQueryParams = Pick<TokenCardRequestData, 'TokenTerm' | 'TokenValue'>;

/**
 * 4.4 查詢約定付款綁定狀態 [NPA-B103]
 */
export class TokenQuery {
  private readonly _params: TokenQueryParams;

  constructor(params: TokenQueryParams) {
    this._params = { ...params };
  }

  async execute(): Promise<TokenCardResponse<TokenQueryResult>> {
    const env = configuration.getEnvParams();
    const requestData: TokenCardRequestData = {
      MerchantID: env.merchantId,
      TimeStamp: (Date.now() / 1000).toFixed(0),
      TokenTerm: this._params.TokenTerm,
      TokenValue: this._params.TokenValue,
    };

    const encrypted = encryptJson(requestData);
    const body = new URLSearchParams({
      UID_: env.merchantId,
      EncryptData_: encrypted,
      HashData_: hashEncrypted(encrypted),
      Version_: '2.0',
      RespondType_: 'JSON',
    });

    const response = await axios.post<TokenCardResponse<TokenQueryResult>>(
      env.tokenQueryApiUrl,
      body.toString(),
      { headers: { 'content-type': 'application/x-www-form-urlencoded' } },
    );

    const data = response.data;
    if (data.EncryptData && typeof data.EncryptData === 'string') {
      const decrypted = JSON.parse(decryptAes(data.EncryptData)) as TokenQueryResult;
      data.decrypted = decrypted;
    }
    return data;
  }
}
