import {
  ManifestBuilder,
  NetworkId,
  PrivateKey,
  PublicKey,
  RadixEngineToolkit,
  TransactionBuilder,
  TransactionHeader,
  bucket,
  decimal,
  enumeration,
  generateRandomNonce,
} from "@radixdlt/radix-engine-toolkit";
import { ed25519 } from "@noble/curves/ed25519";
import { process, generateTransaction } from "../common";
import Decimal from "decimal.js";

const NETWORK_ID = NetworkId.Stokenet;

class XRDFaucet {
  static async getXRD(toAddress: string) {
    return process(NETWORK_ID, async (currentEpoch) => {
      return generateTransaction(async () => {
        const {
          componentAddresses: { faucet: FAUCET_ADDRESS },
          resourceAddresses: { xrd: XRD_ADDRESS },
        } = await RadixEngineToolkit.Utils.knownAddresses(NETWORK_ID);

        const privateKey = ed25519.utils.randomPrivateKey();
        const publicKey = new PublicKey.Ed25519(
          ed25519.getPublicKey(privateKey),
        );

        const header: TransactionHeader = {
          networkId: NETWORK_ID,
          startEpochInclusive: currentEpoch,
          endEpochExclusive: currentEpoch + 2,
          nonce: generateRandomNonce(),
          notaryPublicKey: publicKey,
          notaryIsSignatory: true,
          tipPercentage: 0,
        };

        const manifest = new ManifestBuilder()
          .callMethod(FAUCET_ADDRESS, "lock_fee", [decimal("10")])
          .callMethod(FAUCET_ADDRESS, "free", [])
          .takeFromWorktop(
            XRD_ADDRESS,
            new Decimal("10000"),
            (builder, bucketId) => {
              return builder.callMethod(toAddress, "try_deposit_or_abort", [
                bucket(bucketId),
                enumeration(0),
              ]);
            },
          )
          .build();

        return TransactionBuilder.new().then((builder) =>
          builder
            .header(header)
            .manifest(manifest)
            .notarize((hash) =>
              new PrivateKey.Ed25519(privateKey).signToSignature(hash),
            ),
        );
      });
    });
  }
}

export { XRDFaucet };
