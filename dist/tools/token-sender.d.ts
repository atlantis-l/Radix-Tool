import { Amount } from "@radixdlt/radix-engine-toolkit";
import { CustomOption, Wallet, TransferInfo } from "../models";
declare class TokenSender {
    networkId: number;
    mainWallet: Wallet;
    feePayerWallet: Wallet;
    feeLock: string;
    constructor(networkId: number, mainWallet: Wallet);
    sendFungibleToken(toAddress: string, tokenAddress: string, amount: Amount, message: string | undefined, currentEpoch: number): Promise<import("../models/result").Result>;
    sendNonFungibleToken(toAddress: string, tokenAddress: string, nonFungibleLocalIds: string[], message: string | undefined, currentEpoch: number): Promise<import("../models/result").Result>;
    sendTokens(toAddress: string, transferInfos: TransferInfo[], message: string | undefined, currentEpoch: number): Promise<import("../models/result").Result>;
    sendCustom(customOptions: CustomOption[], message: string | undefined, currentEpoch: number): Promise<import("../models/result").Result>;
    sendCustomPreview(customOptions: CustomOption[], currentEpoch: number): Promise<import("../models").PreviewResult>;
}
export { TokenSender };
