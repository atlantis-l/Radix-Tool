import { Amount } from "@radixdlt/radix-engine-toolkit";
import { CustomOption, Wallet } from "../models";
declare class TokenSender {
    networkId: number;
    mainWallet: Wallet;
    feePayer: Wallet;
    feeLock: string;
    constructor(networkId: number, mainWallet: Wallet);
    sendFungible(toAddress: string, tokenAddress: string, amount: Amount, message: string | undefined): Promise<import("../models/result").Result>;
    sendNonFungible(toAddress: string, tokenAddress: string, nonFungibleLocalIds: string[], message: string | undefined): Promise<import("../models/result").Result>;
    sendCustom(customOptions: CustomOption[], message: string | undefined): Promise<import("../models/result").Result>;
}
export { TokenSender };
