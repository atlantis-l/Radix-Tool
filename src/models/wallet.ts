import { PrivateKey, PublicKey } from "@radixdlt/radix-engine-toolkit";

class Wallet {
  address: string;
  publicKey: PublicKey;
  privateKey: PrivateKey;

  constructor(address: string, publicKey: PublicKey, privateKey: PrivateKey) {
    this.address = address;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  privateKeyHexString() {
    return Buffer.from(this.privateKey.bytes).toString("hex");
  }
}

export { Wallet };
