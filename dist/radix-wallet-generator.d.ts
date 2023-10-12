declare class Wallet {
    address: string | undefined;
    publicKey: string | undefined;
    privateKey: string | undefined;
    constructor(address: string, publicKey: string, privateKey: string);
}
declare class RadixWalletGenerator {
    static generateNewWallet(networdId: number): Promise<Wallet>;
    static generateWalletByPrivateKey(networdId: number, privateKey: string): Promise<Wallet>;
}
export { RadixWalletGenerator };
