import { PublicKey, RadixEngineToolkit } from "@radixdlt/radix-engine-toolkit";

import { ed25519 } from "@noble/curves/ed25519";

class Wallet {
  address: string | undefined;
  publicKey: string | undefined;
  privateKey: string | undefined;

  constructor(address: string, publicKey: string, privateKey: string) {
    this.address = address;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }
}

class RadixWalletGenerator {
  static async generateNewWallet(networdId: number): Promise<Wallet> {
    const privateKey = ed25519.utils.randomPrivateKey();

    const publicKey = new PublicKey.Ed25519(ed25519.getPublicKey(privateKey));

    const address =
      await RadixEngineToolkit.Derive.virtualAccountAddressFromPublicKey(
        publicKey,
        networdId,
      );

    return new Wallet(
      address,
      publicKey.hexString(),
      Buffer.from(privateKey).toString("hex"),
    );
  }

  static async generateWalletByPrivateKey(
    networdId: number,
    privateKey: string,
  ): Promise<Wallet> {
    const publicKey = new PublicKey.Ed25519(ed25519.getPublicKey(privateKey));

    const address =
      await RadixEngineToolkit.Derive.virtualAccountAddressFromPublicKey(
        publicKey,
        networdId,
      );

    return new Wallet(address, publicKey.hexString(), privateKey);
  }
}

export { RadixWalletGenerator };
