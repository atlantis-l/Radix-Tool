import {
  TransactionHeader,
  TransactionBuilder,
  TransactionManifest,
  generateRandomNonce,
} from "@radixdlt/radix-engine-toolkit";
import path from "path";
import { readFileSync } from "fs";
import { RadixWalletGenerator, processTransaction, NetworkId } from "../src";

const NETWORK_ID = NetworkId.Stokenet;

const WalletGenerator = new RadixWalletGenerator(NETWORK_ID);

const privateKey =
  "c2de054684b1f81199803355e6080ef416bbfed34c759e1bb2aade89d572dfdd";

test("Create Fungible", async () => {
  const message = "Create Fungible";

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

    const manifestString = readFileSync(
      path.join(__dirname, "radix-transaction-manifest/create-fungible.rtm"),
    ).toString("utf8");

    const manifest: TransactionManifest = {
      instructions: {
        kind: "String",
        value: manifestString,
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

test("Create Non Fungible", async () => {
  const message = "Create Non Fungible";

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

    const manifestString = readFileSync(
      path.join(
        __dirname,
        "radix-transaction-manifest/create-non-fungible.rtm",
      ),
    ).toString("utf8");

    const manifest: TransactionManifest = {
      instructions: {
        kind: "String",
        value: manifestString,
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
