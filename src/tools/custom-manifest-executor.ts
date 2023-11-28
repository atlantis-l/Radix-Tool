import {
  PublicKey,
  PrivateKey,
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
    signerPrivateKeys: PrivateKey[],
    message: string | undefined,
    currentEpoch: number,
  ) {
    return processTransaction(this.networkId, async () => {
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

      const builder = await TransactionBuilder.new();

      const manifestStep = builder.header(header);

      message !== undefined && manifestStep.plainTextMessage(message);

      const intentSignaturesStep = manifestStep.manifest(manifest);

      signerPrivateKeys.forEach((privateKey) => {
        intentSignaturesStep.sign(privateKey);
      });

      return await intentSignaturesStep.notarize(
        this.executorWallet.privateKey,
      );
    });
  }

  executePreview(
    manifestString: string,
    signerPublicKeys: PublicKey[],
    currentEpoch: number,
  ) {
    const manifest: TransactionManifest = {
      instructions: {
        kind: "String",
        value: manifestString,
      },
      blobs: [],
    };

    return previewTransaction(
      this.networkId,
      manifest,
      this.executorWallet.publicKey,
      signerPublicKeys,
      [],
      currentEpoch,
    );
  }
}

export { CustomManifestExecutor };
