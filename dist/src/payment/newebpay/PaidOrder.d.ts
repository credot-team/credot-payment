import { CustomFieldsType, OrderApplyResult, PaidOrder as IPaidOrder, PaidOrderParams, PaidOrderOptions } from '../PaidOrder';
import { Locales } from '../Locales';
import { TradeInfo } from './PaidOrderFields';
import { AcceptMethods, NewebpayEnvironmentParameters } from './Configuration';
interface CustomFields extends CustomFieldsType {
    /**
     * @see TradeInfo.InstFlag
     */
    installment: TradeInfo['InstFlag'];
    locale: Locales.zh_TW | Locales.en_US | Locales.ja;
}
export declare class PaidOrder<EnableMethods extends AcceptMethods> extends IPaidOrder<AcceptMethods, CustomFields, NewebpayEnvironmentParameters> {
    private _tradeInfo;
    private _apiParams;
    /**
     *
     * @param payMethod
     * @param params 訂單資訊
     */
    constructor(payMethod: EnableMethods | EnableMethods[], params: PaidOrderParams<EnableMethods, CustomFields>, options?: PaidOrderOptions<NewebpayEnvironmentParameters>);
    getEnvParams(): NewebpayEnvironmentParameters;
    parseTradeInfo(): void;
    static encryptTradeInfo(tradeInfo: TradeInfo, envParams: NewebpayEnvironmentParameters): string;
    static hashTradeInfo(tradeInfo: string, envParams: NewebpayEnvironmentParameters): string;
    poweredBy(): string;
    checksum(): string;
    apply(): Promise<OrderApplyResult>;
}
export {};
