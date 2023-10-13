import { PrivateKey, PublicKey } from "@radixdlt/radix-engine-toolkit";
declare class Wallet {
    address: string;
    publicKey: PublicKey;
    privateKey: PrivateKey;
    constructor(address: string, publicKey: PublicKey, privateKey: PrivateKey);
    privateKeyHexString(): string;
}
export { Wallet };
