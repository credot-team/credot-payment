import axios from 'axios';

import { configuration } from '../Configuration';
import { encryptQueryString, verifyCheckCode } from './Crypto';
import { AgreementBackendResponse, AgreementPnPostData } from './Fields';

export type AgreementPnParams = Omit<AgreementPnPostData, 'TimeStamp' | 'Version' | 'TokenSwitch'>;

/**
 * 4.3 後續約定付款(Pn) - 幕後情境 [NPA-B102]
 */
export class AgreementPn {
  private readonly _params: AgreementPnParams;

  constructor(params: AgreementPnParams) {
    this._params = { ...params };
  }

  async execute(): Promise<AgreementBackendResponse> {
    const env = configuration.getEnvParams();
    const postData: AgreementPnPostData = {
      ...this._params,
      TimeStamp: (Date.now() / 1000).toFixed(0),
      Version: '2.5',
      TokenSwitch: 'on',
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
