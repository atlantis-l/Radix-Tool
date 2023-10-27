/// <reference types="node" />
import { Buffer } from "buffer";
import { Wallet } from "../models";
declare class PackageDeployer {
    networkId: number;
    deployerWallet: Wallet;
    feePayerWallet: Wallet;
    feeLock: string;
    constructor(networkId: number, deployerWallet: Wallet);
    deployWithOwner(wasm: Buffer, rpd: Buffer, nonFungibleGlobalId: string, message: string | undefined): Promise<import("../models/result").Result>;
    deploy(wasm: Buffer, rpd: Buffer, message: string | undefined): Promise<import("../models/result").Result>;
}
export { PackageDeployer };
