import {
  Amount,
  SimpleTransactionBuilder,
} from "@radixdlt/radix-engine-toolkit";
import { process } from "../common";
import { RadixWalletGenerator } from "./radix-wallet-generator";
import { Wallet } from "../models";

class FungibleTokenSender {
  private networkId: number | undefined;
  private wallet: Wallet | undefined;

  private constructor() {}

  static new(networkId: number, privateKey: string) {
    return new FungibleTokenSender().build(networkId, privateKey);
  }

  private async build(networkId: number, privateKey: string) {
    this.networkId = networkId;

    this.wallet = await RadixWalletGenerator.generateWalletByPrivateKey(
      networkId,
      privateKey,
    );

    return this;
  }

  async send(toAddress: string, tokenAddress: string, amount: Amount) {
    return process(this.networkId, async (currentEpoch) => {
      const builder = await SimpleTransactionBuilder.new({
        //@ts-ignore
        networkId: this.networkId,
        validFromEpoch: currentEpoch,
        //@ts-ignore
        fromAccount: this.wallet.address,
        //@ts-ignore
        signerPublicKey: this.wallet.publicKey,
      });

      return builder
        .transferFungible({
          toAccount: toAddress,
          resourceAddress: tokenAddress,
          amount: amount,
        })
        .compileIntent()
        .compileNotarized((hash) => {
          //@ts-ignore
          return this.wallet.privateKey.signToSignature(hash);
        });
    });
  }
}

export { FungibleTokenSender };
