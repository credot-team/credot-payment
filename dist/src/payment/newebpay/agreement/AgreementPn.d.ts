import { PaidOrderOptions } from '../../PaidOrder';
import { NewebpayEnvironmentParameters } from '../Configuration';
import { AgreementBackendResponse, AgreementPnPostData } from './Fields';
export declare type AgreementPnParams = Omit<AgreementPnPostData, 'TimeStamp' | 'Version' | 'TokenSwitch'>;
/**
 * 4.3 後續約定付款(Pn) - 幕後情境 [NPA-B102]
 */
export declare class AgreementPn {
    private readonly _params;
    private readonly _options;
    constructor(params: AgreementPnParams, options?: PaidOrderOptions<NewebpayEnvironmentParameters>);
    getEnvParams(): import("../Configuration").ResolvedNewebpayEnvironmentParameters;
    execute(): Promise<AgreementBackendResponse>;
}
