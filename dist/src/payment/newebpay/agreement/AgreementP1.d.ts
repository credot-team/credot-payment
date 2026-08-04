import { AgreementBackendResponse, AgreementP1PostData } from './Fields';
export declare type AgreementP1Params = Omit<AgreementP1PostData, 'TimeStamp' | 'Version' | 'TokenSwitch'>;
/**
 * 4.2 首次約定付款(P1) - 幕後情境 [NPA-B101]
 */
export declare class AgreementP1 {
    private readonly _params;
    constructor(params: AgreementP1Params);
    execute(): Promise<AgreementBackendResponse>;
}
