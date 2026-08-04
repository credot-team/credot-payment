import axios from 'axios';

import { configuration } from '../Configuration';
import { decryptAes, encryptJson, hashEncrypted } from './Crypto';
import { TokenCardRequestData, TokenCardResponse, TokenUnbindResult } from './Fields';

export type TokenUnbindParams = Pick<TokenCardRequestData, 'TokenTerm' | 'TokenValue'>;

/**
 * 4.5 解除約定付款綁定 [NPA-B104]
 */
export class TokenUnbind {
  private readonly _params: TokenUnbindParams;

  constructor(params: TokenUnbindParams) {
    this._params = { ...params };
  }

  async execute(): Promise<TokenCardResponse<TokenUnbindResult>> {
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
      Version_: '1.0',
      RespondType_: 'JSON',
    });

    const response = await axios.post<TokenCardResponse<TokenUnbindResult>>(
      env.tokenUnbindApiUrl,
      body.toString(),
      { headers: { 'content-type': 'application/x-www-form-urlencoded' } },
    );

    const data = response.data;
    if (data.EncryptData && typeof data.EncryptData === 'string') {
      const decrypted = JSON.parse(decryptAes(data.EncryptData)) as TokenUnbindResult;
      data.decrypted = decrypted;
    }
    return data;
  }
}
