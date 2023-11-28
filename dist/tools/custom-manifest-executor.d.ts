import { PublicKey, PrivateKey } from "@radixdlt/radix-engine-toolkit";
import { Wallet } from "../models";
declare class CustomManifestExecutor {
    networkId: number;
    executorWallet: Wallet;
    constructor(networkId: number, executorWallet: Wallet);
    execute(manifestString: string, signerPrivateKeys: PrivateKey[], message: string | undefined, currentEpoch: number): Promise<import("../models/result").Result>;
    executePreview(manifestString: string, signerPublicKeys: PublicKey[], currentEpoch: number): Promise<import("../models").PreviewResult>;
}
export { CustomManifestExecutor };
