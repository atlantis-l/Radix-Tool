import {
  Amount,
  ManifestBuilder,
  TransactionBuilder,
  TransactionHeader,
  address,
  bucket,
  decimal,
  enumeration,
  generateRandomNonce,
} from "@radixdlt/radix-engine-toolkit";
import { generateTransaction, process, calculateFee } from "../common";
import { RadixWalletGenerator } from "./radix-wallet-generator";
import { Wallet } from "../models";
import Decimal from "decimal.js";

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
      return generateTransaction(async () => {
        const header: TransactionHeader = {
          //@ts-ignore
          networkId: this.networkId,
          startEpochInclusive: currentEpoch,
          endEpochExclusive: currentEpoch + 2,
          nonce: generateRandomNonce(),
          //@ts-ignore
          notaryPublicKey: this.wallet.publicKey,
          notaryIsSignatory: true,
          tipPercentage: 0,
        };

        const manifest = new ManifestBuilder()
          //@ts-ignore
          .callMethod(this.wallet.address, "lock_fee", [decimal("10")])
          //@ts-ignore
          .callMethod(this.wallet.address, "withdraw", [
            address(tokenAddress),
            decimal(amount),
          ])
          .takeFromWorktop(
            tokenAddress,
            new Decimal(amount),
            (builder, bucketId) => {
              return builder.callMethod(toAddress, "try_deposit_or_abort", [
                bucket(bucketId),
                enumeration(0),
              ]);
            },
          )
          .build();

        //TODO
        const fee = await calculateFee(
          this.networkId,
          currentEpoch,
          manifest,
          //@ts-ignore
          this.wallet.publicKey,
        );

        return TransactionBuilder.new().then((builder) =>
          builder
            .header(header)
            .manifest(manifest)
            .notarize((hash) =>
              //@ts-ignore
              this.wallet.privateKey.signToSignature(hash),
            ),
        );
      });
    });
  }
}

export { FungibleTokenSender };
