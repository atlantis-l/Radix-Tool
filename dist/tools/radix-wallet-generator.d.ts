import { Wallet } from "../models";
declare class RadixWalletGenerator {
    networkId: number;
    constructor(networkId: number);
    generateNewWallet(): Promise<Wallet>;
    generateWalletByPrivateKey(privateKey: string): Promise<Wallet>;
}
export { RadixWalletGenerator };
