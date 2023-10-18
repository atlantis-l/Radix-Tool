import {
  NetworkId,
  TransactionBuilder,
  TransactionHeader,
  TransactionManifest,
  generateRandomNonce,
} from "@radixdlt/radix-engine-toolkit";
import { RadixWalletGenerator, processTransaction } from "../src";
import { readFileSync } from "fs";
import path from "path";

const NETWORK_ID = NetworkId.Stokenet;

const WalletGenerator = new RadixWalletGenerator(NETWORK_ID);

const privateKey =
  "c2de054684b1f81199803355e6080ef416bbfed34c759e1bb2aade89d572dfdd";

const message = "Deploy NonFungible Resource";

test("Create Non Fungible", async () => {
  const wallet = await WalletGenerator.generateWalletByPrivateKey(privateKey);

  await processTransaction(NETWORK_ID, async (currentEpoch) => {
    const header: TransactionHeader = {
      networkId: NETWORK_ID,
      startEpochInclusive: currentEpoch,
      endEpochExclusive: currentEpoch + 2,
      nonce: generateRandomNonce(),
      notaryPublicKey: wallet.publicKey,
      notaryIsSignatory: true,
      tipPercentage: 0,
    };

    const rtm = readFileSync(
      path.join(__dirname.replace("test", "rtm"), "create-non-fungible.rtm"),
    ).toString("utf8");

    const manifest: TransactionManifest = {
      instructions: {
        kind: "String",
        value: rtm,
      },
      blobs: [],
    };

    return TransactionBuilder.new().then((builder) =>
      builder
        .header(header)
        .plainTextMessage(message)
        .manifest(manifest)
        .notarize(wallet.privateKey),
    );
  });
});
