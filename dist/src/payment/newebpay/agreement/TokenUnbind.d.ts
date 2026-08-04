import { TokenCardRequestData, TokenCardResponse, TokenUnbindResult } from './Fields';
export declare type TokenUnbindParams = Pick<TokenCardRequestData, 'TokenTerm' | 'TokenValue'>;
/**
 * 4.5 解除約定付款綁定 [NPA-B104]
 */
export declare class TokenUnbind {
    private readonly _params;
    constructor(params: TokenUnbindParams);
    execute(): Promise<TokenCardResponse<TokenUnbindResult>>;
}
