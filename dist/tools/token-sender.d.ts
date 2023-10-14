import { Amount } from "@radixdlt/radix-engine-toolkit";
import { Wallet } from "../models";
declare class TokenSender {
    networkId: number;
    wallet: Wallet;
    feePayer: Wallet;
    feeLock: string;
    constructor(networkId: number, wallet: Wallet);
    sendFungible(toAddress: string, tokenAddress: string, amount: Amount): Promise<import("../models/result").Result>;
}
export { TokenSender };
