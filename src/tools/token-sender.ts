import {
  Amount,
  Expression,
  ManifestBuilder,
  TransactionBuilder,
  TransactionHeader,
  address,
  decimal,
  enumeration,
  expression,
  generateRandomNonce,
} from "@radixdlt/radix-engine-toolkit";
import { processTransaction } from "../common";
import { Wallet } from "../models";

const DEFAULT_FEE_LOCK = "10";

class TokenSender {
  networkId: number;
  wallet: Wallet;
  feePayer: Wallet;
  feeLock: string;

  constructor(networkId: number, wallet: Wallet) {
    this.networkId = networkId;
    this.wallet = wallet;
    this.feePayer = wallet;
    this.feeLock = DEFAULT_FEE_LOCK;
  }

  async sendFungible(toAddress: string, tokenAddress: string, amount: Amount) {
    return processTransaction(this.networkId, async (currentEpoch) => {
      const header: TransactionHeader = {
        networkId: this.networkId,
        startEpochInclusive: currentEpoch,
        endEpochExclusive: currentEpoch + 2,
        nonce: generateRandomNonce(),
        notaryPublicKey: this.wallet.publicKey,
        notaryIsSignatory: true,
        tipPercentage: 0,
      };

      const manifest = new ManifestBuilder()
        .callMethod(this.feePayer.address, "lock_fee", [decimal(this.feeLock)])
        .callMethod(this.wallet.address, "withdraw", [
          address(tokenAddress),
          decimal(amount),
        ])
        .callMethod(toAddress, "try_deposit_batch_or_abort", [
          expression(Expression.EntireWorktop),
          enumeration(0),
        ])
        .build();

      return TransactionBuilder.new().then((builder) =>
        builder
          .header(header)
          .manifest(manifest)
          .sign(this.feePayer.privateKey)
          .notarize(this.wallet.privateKey),
      );
    });
  }

  // TODO
  // async sendNonFungible
}

export { TokenSender };
