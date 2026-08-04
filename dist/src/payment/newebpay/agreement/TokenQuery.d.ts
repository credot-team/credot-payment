import { TokenCardRequestData, TokenCardResponse, TokenQueryResult } from './Fields';
export declare type TokenQueryParams = Pick<TokenCardRequestData, 'TokenTerm' | 'TokenValue'>;
/**
 * 4.4 查詢約定付款綁定狀態 [NPA-B103]
 */
export declare class TokenQuery {
    private readonly _params;
    constructor(params: TokenQueryParams);
    execute(): Promise<TokenCardResponse<TokenQueryResult>>;
}
