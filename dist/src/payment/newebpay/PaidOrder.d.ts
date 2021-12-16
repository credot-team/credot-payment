import { CustomFieldsType, OrderApplyResult, PaidOrder as IPaidOrder, PaidOrderParams } from '../PaidOrder';
import { Locales } from '../Locales';
import { TradeInfo } from './PaidOrderFields';
import { AcceptMethods } from './Configuration';
interface CustomFields extends CustomFieldsType {
    installment: TradeInfo['InstFlag'];
    locale: Locales.zh_TW | Locales.en_US | Locales.ja;
}
export declare class PaidOrder<EnableMethods extends AcceptMethods> extends IPaidOrder<AcceptMethods, CustomFields> {
    private _tradeInfo;
    private _apiParams;
    /**
     *
     * @param payMethod
     * @param params 訂單資訊
     */
    constructor(payMethod: EnableMethods | EnableMethods[], params: PaidOrderParams<EnableMethods, CustomFields>);
    parseTradeInfo(): void;
    static encryptTradeInfo(tradeInfo: TradeInfo): string;
    static hashTradeInfo(tradeInfo: string): string;
    poweredBy(): string;
    checksum(): string;
    apply(): Promise<OrderApplyResult>;
}
export {};
