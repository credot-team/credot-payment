import axios from 'axios';

import { configuration } from '../Configuration';
import { encryptQueryString, verifyCheckCode } from './Crypto';
import { AgreementBackendResponse, AgreementP1PostData } from './Fields';

export type AgreementP1Params = Omit<AgreementP1PostData, 'TimeStamp' | 'Version' | 'TokenSwitch'>;

/**
 * 4.2 首次約定付款(P1) - 幕後情境 [NPA-B101]
 */
export class AgreementP1 {
  private readonly _params: AgreementP1Params;

  constructor(params: AgreementP1Params) {
    this._params = { ...params };
  }

  async execute(): Promise<AgreementBackendResponse> {
    const env = configuration.getEnvParams();
    const postData: AgreementP1PostData = {
      ...this._params,
      TimeStamp: (Date.now() / 1000).toFixed(0),
      Version: '2.5',
      TokenSwitch: 'get',
    };

    const body = new URLSearchParams({
      MerchantID_: env.merchantId,
      PostData_: encryptQueryString(postData),
      Pos_: 'JSON',
    });

    const response = await axios.post<AgreementBackendResponse>(
      env.creditCardApiUrl,
      body.toString(),
      { headers: { 'content-type': 'application/x-www-form-urlencoded' } },
    );

    const data = response.data;
    if (data.Result && typeof data.Result === 'object' && 'CheckCode' in data.Result) {
      Object.assign(data.Result, { checkCodeValid: verifyCheckCode(data.Result) });
    }
    return data;
  }
}
