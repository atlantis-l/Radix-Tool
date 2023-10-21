import {
  TransactionBuilder,
  TransactionHeader,
  TransactionManifest,
  generateRandomNonce,
} from "@radixdlt/radix-engine-toolkit";
import { processTransaction } from "../common";
import { Wallet } from "../models";

class CustomManifestExecutor {
  networkId: number;
  feePayerWallet: Wallet;

  constructor(networkId: number, feePayerWallet: Wallet) {
    this.networkId = networkId;
    this.feePayerWallet = feePayerWallet;
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
        notaryPublicKey: this.feePayerWallet.publicKey,
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

        if (message !== undefined) {
          manifestStep.plainTextMessage(message);
        }

        const intentSignaturesStep = manifestStep.manifest(manifest);

        const walletSet = new Set(signatoryWallets);

        walletSet.forEach((wallet) => {
          intentSignaturesStep.sign(wallet.privateKey);
        });

        return intentSignaturesStep.notarize(this.feePayerWallet.privateKey);
      });
    });
  }
}

export { CustomManifestExecutor };
