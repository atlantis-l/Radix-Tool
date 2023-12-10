import { Ownership, Wallet } from "../models";
declare class PackageDeployer {
    networkId: number;
    deployerWallet: Wallet;
    feePayerWallet: Wallet;
    feeLock: string;
    constructor(networkId: number, deployerWallet: Wallet);
    deployWithOwner(wasm: Uint8Array, rpd: Uint8Array, ownership: Ownership, ownerResource: string | undefined, lock: boolean, message: string | undefined, currentEpoch: number): Promise<import("../models/result").Result>;
    deploy(wasm: Uint8Array, rpd: Uint8Array, message: string | undefined, currentEpoch: number): Promise<import("../models/result").Result>;
    deployWithOwnerPreview(wasm: Uint8Array, rpd: Uint8Array, ownership: Ownership, ownerResource: string | undefined, lock: boolean, currentEpoch: number): Promise<import("../models").PreviewResult>;
    deployPreview(wasm: Uint8Array, rpd: Uint8Array, currentEpoch: number): Promise<import("../models").PreviewResult>;
}
export { PackageDeployer };
