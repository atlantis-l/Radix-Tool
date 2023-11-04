import { Wallet } from "../models";
declare class CustomManifestExecutor {
    networkId: number;
    executorWallet: Wallet;
    constructor(networkId: number, executorWallet: Wallet);
    execute(manifestString: string, signatoryWallets: Wallet[], message: string | undefined): Promise<import("../models/result").Result>;
    executePreview(manifestString: string, signatoryWallets: Wallet[]): Promise<import("../models").PreviewResult>;
}
export { CustomManifestExecutor };
