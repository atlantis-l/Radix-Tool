import { Amount } from "@radixdlt/radix-engine-toolkit";
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
    amount?: Amount;
    nonFungibleLocalIds?: string[];
}
export { TokenType, CustomOption };
