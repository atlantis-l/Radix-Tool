import { Wallet } from "../models";
declare class CustomManifestExecutor {
    networkId: number;
    feePayerWallet: Wallet;
    constructor(networkId: number, feePayerWallet: Wallet);
    execute(manifestString: string, signatoryWallets: Wallet[], message: string | undefined): Promise<import("../models/result").Result>;
}
export { CustomManifestExecutor };
