import { AgreementBackendResponse, AgreementPnPostData } from './Fields';
export declare type AgreementPnParams = Omit<AgreementPnPostData, 'TimeStamp' | 'Version' | 'TokenSwitch'>;
/**
 * 4.3 後續約定付款(Pn) - 幕後情境 [NPA-B102]
 */
export declare class AgreementPn {
    private readonly _params;
    constructor(params: AgreementPnParams);
    execute(): Promise<AgreementBackendResponse>;
}
