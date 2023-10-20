import { Amount } from "@radixdlt/radix-engine-toolkit";
import { Wallet } from "./wallet";
declare enum TokenType {
    FUNGIBLE = 0,
    NONFUNGIBLE = 1
}
interface TransferInfo {
    tokenType: TokenType;
    tokenAddress: string;
    amount?: Amount;
    nonFungibleLocalIds?: string[];
}
interface CustomOption {
    fromWallet: Wallet;
    toAddress: string;
    transferInfos: TransferInfo[];
}
export { TokenType, CustomOption, TransferInfo };
