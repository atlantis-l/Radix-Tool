import {
  Amount,
  Expression,
  ManifestBuilder,
  TransactionBuilder,
  TransactionHeader,
  Value,
  ValueKind,
  address,
  decimal,
  enumeration,
  expression,
  generateRandomNonce,
  nonFungibleLocalId,
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

  async sendFungible(
    toAddress: string,
    tokenAddress: string,
    amount: Amount,
    message: string | undefined,
  ) {
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

      return TransactionBuilder.new().then((builder) => {
        const transactionBuilderManifestStep = builder.header(header);
        if (message !== undefined) {
          transactionBuilderManifestStep.plainTextMessage(message);
        }
        return transactionBuilderManifestStep
          .manifest(manifest)
          .sign(this.feePayer.privateKey)
          .notarize(this.wallet.privateKey);
      });
    });
  }

  async sendNonFungible(
    toAddress: string,
    tokenAddress: string,
    nonFungibleLocalIds: string[],
    message: string | undefined,
  ) {
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

      const nonFungibleIdArray: Value = {
        kind: ValueKind.Array,
        elementValueKind: ValueKind.NonFungibleLocalId,
        elements: nonFungibleLocalIds.map((id) => {
          return nonFungibleLocalId(id);
        }),
      };

      const manifest = new ManifestBuilder()
        .callMethod(this.feePayer.address, "lock_fee", [decimal(this.feeLock)])
        .callMethod(this.wallet.address, "withdraw_non_fungibles", [
          address(tokenAddress),
          nonFungibleIdArray,
        ])
        .callMethod(toAddress, "try_deposit_batch_or_abort", [
          expression(Expression.EntireWorktop),
          enumeration(0),
        ])
        .build();

      return TransactionBuilder.new().then((builder) => {
        const transactionBuilderManifestStep = builder.header(header);
        if (message !== undefined) {
          transactionBuilderManifestStep.plainTextMessage(message);
        }
        return transactionBuilderManifestStep
          .manifest(manifest)
          .sign(this.feePayer.privateKey)
          .notarize(this.wallet.privateKey);
      });
    });
  }
}

export { TokenSender };
