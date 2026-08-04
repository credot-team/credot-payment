import { AgreementOrder } from './agreement/AgreementOrder';
import { AgreementP1 } from './agreement/AgreementP1';
import { AgreementPn } from './agreement/AgreementPn';
import { TokenQuery } from './agreement/TokenQuery';
import { TokenUnbind } from './agreement/TokenUnbind';
export declare namespace api {
    /**
     * 4.1 首次約定付款(P1) - 幕前情境 [NPA-F011]
     */
    function createAgreementOrder(...args: ConstructorParameters<typeof AgreementOrder>): AgreementOrder;
    /**
     * 4.2 首次約定付款(P1) - 幕後情境 [NPA-B101]
     */
    function agreementP1(...args: ConstructorParameters<typeof AgreementP1>): AgreementP1;
    /**
     * 4.3 後續約定付款(Pn) - 幕後情境 [NPA-B102]
     */
    function agreementPn(...args: ConstructorParameters<typeof AgreementPn>): AgreementPn;
    /**
     * 4.4 查詢約定付款綁定狀態 [NPA-B103]
     */
    function queryTokenStatus(...args: ConstructorParameters<typeof TokenQuery>): TokenQuery;
    /**
     * 4.5 解除約定付款綁定 [NPA-B104]
     */
    function unbindToken(...args: ConstructorParameters<typeof TokenUnbind>): TokenUnbind;
}
