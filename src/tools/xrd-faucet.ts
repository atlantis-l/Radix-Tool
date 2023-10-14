import {
  ManifestBuilder,
  NetworkId,
  RadixEngineToolkit,
  TransactionBuilder,
  TransactionHeader,
  bucket,
  decimal,
  enumeration,
  generateRandomNonce,
} from "@radixdlt/radix-engine-toolkit";
import { processTransaction } from "../common";
import { RadixWalletGenerator } from "../tools";

const NETWORK_ID = NetworkId.Stokenet;

class XRDFaucet {
  static async getXRD(toAddress: string) {
    return processTransaction(NETWORK_ID, async (currentEpoch) => {
      const {
        componentAddresses: { faucet: FAUCET_ADDRESS },
        resourceAddresses: { xrd: XRD_ADDRESS },
      } = await RadixEngineToolkit.Utils.knownAddresses(NETWORK_ID);

      const wallet = await new RadixWalletGenerator(
        NETWORK_ID,
      ).generateNewWallet();

      const header: TransactionHeader = {
        networkId: NETWORK_ID,
        startEpochInclusive: currentEpoch,
        endEpochExclusive: currentEpoch + 2,
        nonce: generateRandomNonce(),
        notaryPublicKey: wallet.publicKey,
        notaryIsSignatory: false,
        tipPercentage: 0,
      };

      const manifest = new ManifestBuilder()
        .callMethod(FAUCET_ADDRESS, "lock_fee", [decimal("10")])
        .callMethod(FAUCET_ADDRESS, "free", [])
        .takeAllFromWorktop(XRD_ADDRESS, (builder, bucketId) => {
          return builder.callMethod(toAddress, "try_deposit_or_abort", [
            bucket(bucketId),
            enumeration(0),
          ]);
        })
        .build();

      return TransactionBuilder.new().then((builder) =>
        builder.header(header).manifest(manifest).notarize(wallet.privateKey),
      );
    });
  }
}

export { XRDFaucet };
