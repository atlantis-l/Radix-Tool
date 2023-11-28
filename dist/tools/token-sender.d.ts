import { Amount, PublicKey, PrivateKey } from "@radixdlt/radix-engine-toolkit";
import { CustomOption, Wallet, TransferInfo } from "../models";
declare class TokenSender {
    networkId: number;
    mainWallet: Wallet;
    feePayerWallet: Wallet;
    feeLock: string;
    constructor(networkId: number, mainWallet: Wallet);
    sendFungibleToken(toAddress: string, tokenAddress: string, amount: Amount, signerPrivateKeys: PrivateKey[], message: string | undefined, currentEpoch: number): Promise<import("../models/result").Result>;
    sendNonFungibleToken(toAddress: string, tokenAddress: string, nonFungibleLocalIds: string[], signerPrivateKeys: PrivateKey[], message: string | undefined, currentEpoch: number): Promise<import("../models/result").Result>;
    sendTokens(toAddress: string, transferInfos: TransferInfo[], signerPrivateKeys: PrivateKey[], message: string | undefined, currentEpoch: number): Promise<import("../models/result").Result>;
    sendCustom(customOptions: CustomOption[], signerPrivateKeys: PrivateKey[], message: string | undefined, currentEpoch: number): Promise<import("../models/result").Result>;
    sendCustomPreview(customOptions: CustomOption[], signerPublicKeys: PublicKey[], currentEpoch: number): Promise<import("../models").PreviewResult>;
}
export { TokenSender };
