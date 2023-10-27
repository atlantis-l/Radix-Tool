import {
  PrivateKey,
  PublicKey,
  RadixEngineToolkit,
} from "@radixdlt/radix-engine-toolkit";
import { Buffer } from "buffer";
import { Wallet } from "../models";
import { ed25519 } from "@noble/curves/ed25519";

class RadixWalletGenerator {
  networkId: number;

  constructor(networkId: number) {
    this.networkId = networkId;
  }

  generateNewWallet() {
    const privateKey = ed25519.utils.randomPrivateKey();

    return this.generateWalletByPrivateKey(
      Buffer.from(privateKey).toString("hex"),
    );
  }

  async generateWalletByPrivateKey(privateKey: string) {
    const publicKey = new PublicKey.Ed25519(ed25519.getPublicKey(privateKey));

    const address =
      await RadixEngineToolkit.Derive.virtualAccountAddressFromPublicKey(
        publicKey,
        this.networkId,
      );

    return new Wallet(address, publicKey, new PrivateKey.Ed25519(privateKey));
  }
}

export { RadixWalletGenerator };
