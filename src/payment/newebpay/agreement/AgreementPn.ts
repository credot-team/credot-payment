import axios from 'axios';

import { PaidOrderOptions } from '../../PaidOrder';
import {
  configuration,
  NewebpayEnvironmentParameters,
  resolveEnv,
} from '../Configuration';
import { encryptQueryString, verifyCheckCode } from './Crypto';
import { AgreementBackendResponse, AgreementPnPostData } from './Fields';

export type AgreementPnParams = Omit<AgreementPnPostData, 'TimeStamp' | 'Version' | 'TokenSwitch'>;

/**
 * 4.3 後續約定付款(Pn) - 幕後情境 [NPA-B102]
 */
export class AgreementPn {
  private readonly _params: AgreementPnParams;
  private readonly _options: PaidOrderOptions<NewebpayEnvironmentParameters>;

  constructor(
    params: AgreementPnParams,
    options?: PaidOrderOptions<NewebpayEnvironmentParameters>,
  ) {
    this._params = { ...params };
    this._options = options ?? {};
  }

  getEnvParams() {
    return this._options.env
      ? resolveEnv(this._options.env)
      : configuration.getEnvParams();
  }

  async execute(): Promise<AgreementBackendResponse> {
    const env = this.getEnvParams();
    const postData: AgreementPnPostData = {
      ...this._params,
      TimeStamp: (Date.now() / 1000).toFixed(0),
      Version: '2.5',
      TokenSwitch: 'on',
    };

    const body = new URLSearchParams({
      MerchantID_: env.merchantId,
      PostData_: encryptQueryString(postData, env),
      Pos_: 'JSON',
    });

    const response = await axios.post<AgreementBackendResponse>(
      env.creditCardApiUrl,
      body.toString(),
      { headers: { 'content-type': 'application/x-www-form-urlencoded' } },
    );

    const data = response.data;
    if (data.Result && typeof data.Result === 'object' && 'CheckCode' in data.Result) {
      Object.assign(data.Result, { checkCodeValid: verifyCheckCode(data.Result, env) });
    }
    return data;
  }
}
