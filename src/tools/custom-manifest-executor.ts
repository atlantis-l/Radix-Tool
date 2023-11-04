import {
  PublicKey,
  TransactionHeader,
  TransactionBuilder,
  TransactionManifest,
  generateRandomNonce,
} from "@radixdlt/radix-engine-toolkit";
import { Wallet } from "../models";
import { processTransaction, previewTransaction } from "../common";

class CustomManifestExecutor {
  networkId: number;
  executorWallet: Wallet;

  constructor(networkId: number, executorWallet: Wallet) {
    this.networkId = networkId;
    this.executorWallet = executorWallet;
  }

  execute(
    manifestString: string,
    signatoryWallets: Wallet[],
    message: string | undefined,
  ) {
    return processTransaction(this.networkId, async (currentEpoch) => {
      const header: TransactionHeader = {
        networkId: this.networkId,
        startEpochInclusive: currentEpoch,
        endEpochExclusive: currentEpoch + 2,
        nonce: generateRandomNonce(),
        notaryPublicKey: this.executorWallet.publicKey,
        notaryIsSignatory: true,
        tipPercentage: 0,
      };

      const manifest: TransactionManifest = {
        instructions: {
          kind: "String",
          value: manifestString,
        },
        blobs: [],
      };

      return TransactionBuilder.new().then((builder) => {
        const manifestStep = builder.header(header);

        message !== undefined && manifestStep.plainTextMessage(message);

        const intentSignaturesStep = manifestStep.manifest(manifest);

        const map = new Map<string, Wallet>();

        signatoryWallets.forEach((wallet) => {
          map.set(wallet.address, wallet);
        });

        map.forEach((wallet) => {
          intentSignaturesStep.sign(wallet.privateKey);
        });

        return intentSignaturesStep.notarize(this.executorWallet.privateKey);
      });
    });
  }

  executePreview(manifestString: string, signatoryWallets: Wallet[]) {
    const manifest: TransactionManifest = {
      instructions: {
        kind: "String",
        value: manifestString,
      },
      blobs: [],
    };

    const map = new Map<string, PublicKey>();

    signatoryWallets.forEach((wallet) => {
      map.set(wallet.address, wallet.publicKey);
    });

    return previewTransaction(
      this.networkId,
      manifest,
      this.executorWallet.publicKey,
      [...map.values()],
      [],
    );
  }
}

export { CustomManifestExecutor };
