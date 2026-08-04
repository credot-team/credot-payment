import { AgreementOrder } from './agreement/AgreementOrder';
import { AgreementP1 } from './agreement/AgreementP1';
import { AgreementPn } from './agreement/AgreementPn';
import { TokenQuery } from './agreement/TokenQuery';
import { TokenUnbind } from './agreement/TokenUnbind';

export namespace api {
  /**
   * 4.1 首次約定付款(P1) - 幕前情境 [NPA-F011]
   */
  export function createAgreementOrder(
    ...args: ConstructorParameters<typeof AgreementOrder>
  ): AgreementOrder {
    return new AgreementOrder(...args);
  }

  /**
   * 4.2 首次約定付款(P1) - 幕後情境 [NPA-B101]
   */
  export function agreementP1(...args: ConstructorParameters<typeof AgreementP1>): AgreementP1 {
    return new AgreementP1(...args);
  }

  /**
   * 4.3 後續約定付款(Pn) - 幕後情境 [NPA-B102]
   */
  export function agreementPn(...args: ConstructorParameters<typeof AgreementPn>): AgreementPn {
    return new AgreementPn(...args);
  }

  /**
   * 4.4 查詢約定付款綁定狀態 [NPA-B103]
   */
  export function queryTokenStatus(...args: ConstructorParameters<typeof TokenQuery>): TokenQuery {
    return new TokenQuery(...args);
  }

  /**
   * 4.5 解除約定付款綁定 [NPA-B104]
   */
  export function unbindToken(...args: ConstructorParameters<typeof TokenUnbind>): TokenUnbind {
    return new TokenUnbind(...args);
  }
}
