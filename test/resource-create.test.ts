import {
  NetworkId,
  RadixNetworkChecker,
  RadixWalletGenerator,
  CustomManifestExecutor,
} from "../src";
import path from "path";
import { readFileSync } from "fs";

const NETWORK_ID = NetworkId.Stokenet;

const WalletGenerator = new RadixWalletGenerator(NETWORK_ID);

const privateKey =
  "c2de054684b1f81199803355e6080ef416bbfed34c759e1bb2aade89d572dfdd";

const checker = new RadixNetworkChecker(NETWORK_ID);

test("Create Fungible", async () => {
  const message = "Create Fungible";

  const wallet = await WalletGenerator.generateWalletByPrivateKey(privateKey);

  const executor = new CustomManifestExecutor(NETWORK_ID, wallet);

  const manifestString = readFileSync(
    path.join(__dirname, "radix-transaction-manifest/fungible-create.rtm"),
  ).toString("utf8");

  const previewResult = await executor.executePreview(manifestString, []);

  console.log(`Preview Result: `, {});
  console.log(previewResult);

  const result = await executor.execute(manifestString, [], message);

  await new Promise((r) => setTimeout(r, 5000));

  const tx = await checker.checkTransaction(result.transactionId as string);

  console.log(`Fee Paid: ${tx.transaction.fee_paid}`);
});

test("Create Non Fungible", async () => {
  const message = "Create Non Fungible";

  const wallet = await WalletGenerator.generateWalletByPrivateKey(privateKey);

  const executor = new CustomManifestExecutor(NETWORK_ID, wallet);

  const manifestString = readFileSync(
    path.join(__dirname, "radix-transaction-manifest/non-fungible-create.rtm"),
  ).toString("utf8");

  const previewResult = await executor.executePreview(manifestString, []);

  console.log(`Preview Result: `, {});
  console.log(previewResult);

  const result = await executor.execute(manifestString, [], message);

  await new Promise((r) => setTimeout(r, 5000));

  const tx = await checker.checkTransaction(result.transactionId as string);

  console.log(`Fee Paid: ${tx.transaction.fee_paid}`);
});
