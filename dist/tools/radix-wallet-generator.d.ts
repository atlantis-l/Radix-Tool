import { Wallet } from "../models";
declare class RadixWalletGenerator {
    static generateNewWallet(networdId: number): Promise<Wallet>;
    static generateWalletByPrivateKey(networdId: number, privateKey: string): Promise<Wallet>;
}
export { RadixWalletGenerator };
