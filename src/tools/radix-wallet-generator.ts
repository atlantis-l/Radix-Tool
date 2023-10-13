import {
  PrivateKey,
  PublicKey,
  RadixEngineToolkit,
} from "@radixdlt/radix-engine-toolkit";

import { ed25519 } from "@noble/curves/ed25519";
import { Wallet } from "../models";

class RadixWalletGenerator {
  static async generateNewWallet(networdId: number) {
    const privateKey = ed25519.utils.randomPrivateKey();

    return this.generateWalletByPrivateKey(
      networdId,
      Buffer.from(privateKey).toString("hex"),
    );
  }

  static async generateWalletByPrivateKey(
    networdId: number,
    privateKey: string,
  ) {
    const publicKey = new PublicKey.Ed25519(ed25519.getPublicKey(privateKey));

    const address =
      await RadixEngineToolkit.Derive.virtualAccountAddressFromPublicKey(
        publicKey,
        networdId,
      );

    return new Wallet(address, publicKey, new PrivateKey.Ed25519(privateKey));
  }
}

export { RadixWalletGenerator };
