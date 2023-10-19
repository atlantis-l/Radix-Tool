import { Wallet } from "./wallet";
declare enum TokenType {
    FUNGIBLE = 0,
    NONFUNGIBLE = 1
}
interface CustomOption {
    fromWallet: Wallet;
    toAddress: string;
    tokenType: TokenType;
    tokenAddress: string;
    amount?: string;
    nonFungibleLocalIds?: string[];
}
export { TokenType, CustomOption };
