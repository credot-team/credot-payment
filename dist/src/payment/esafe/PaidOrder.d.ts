import { CustomFieldsType, OrderApplyResult, PaidOrder as IPaidOrder, PaidOrderParams, PaidOrderOptions } from '../PaidOrder';
import { Locales } from '../Locales';
import { PaidOrderFields } from './PaidOrderFields';
import { PaidResult } from './PaidResult';
import { AcceptMethods, EsafeEnvironmentParameters } from './Configuration';
declare type FetchStatusArgs = {
    applyNo?: string;
    orderNo?: string;
};
declare type IncludeAnyOne<T, U> = (Extract<keyof T, keyof U> extends never ? 'please enter at least 1 field.' : T) & U;
interface CustomFields extends CustomFieldsType {
    installment: PaidOrderFields['Term'];
    locale: Locales.zh_TW | Locales.en_US | Locales.ja;
}
export declare class PaidOrder<EnableMethods extends AcceptMethods> extends IPaidOrder<AcceptMethods, CustomFields, EsafeEnvironmentParameters> {
    private readonly _checksum;
    constructor(payMethod: EnableMethods | EnableMethods[], params: PaidOrderParams<EnableMethods, CustomFields>, options?: PaidOrderOptions<EsafeEnvironmentParameters>);
    getEnvParams(): EsafeEnvironmentParameters;
    poweredBy(): string;
    checksum(): string;
    apply(): Promise<OrderApplyResult>;
    /**
     * 即時交易查詢
     * @param args
     */
    static fetchStatus<T>(args: IncludeAnyOne<T, FetchStatusArgs>, envParams?: EsafeEnvironmentParameters): Promise<undefined> | Promise<PaidResult[]>;
}
export {};
