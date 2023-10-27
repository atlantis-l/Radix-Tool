import {
  TransactionHeader,
  TransactionBuilder,
  TransactionManifest,
  generateRandomNonce,
} from "@radixdlt/radix-engine-toolkit";
import { Wallet } from "../models";
import { processTransaction } from "../common";

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

        new Set(signatoryWallets).forEach((wallet) => {
          intentSignaturesStep.sign(wallet.privateKey);
        });

        return intentSignaturesStep.notarize(this.executorWallet.privateKey);
      });
    });
  }
}

export { CustomManifestExecutor };
