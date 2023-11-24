import { Wallet } from "../models";
declare class CustomManifestExecutor {
    networkId: number;
    executorWallet: Wallet;
    constructor(networkId: number, executorWallet: Wallet);
    execute(manifestString: string, signatoryWallets: Wallet[], message: string | undefined, currentEpoch: number): Promise<import("../models/result").Result>;
    executePreview(manifestString: string, signatoryWallets: Wallet[], currentEpoch: number): Promise<import("../models").PreviewResult>;
}
export { CustomManifestExecutor };
