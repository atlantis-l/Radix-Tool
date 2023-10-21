import { NetworkId } from "@radixdlt/radix-engine-toolkit";
import {
  CustomManifestExecutor,
  RadixNetworkChecker,
  RadixWalletGenerator,
  Status,
} from "../src";
import { readFileSync } from "fs";
import path from "path";
import { TransactionStatus } from "@radixdlt/babylon-gateway-api-sdk";

const NETWORK_ID = NetworkId.Stokenet;

const privateKey1 =
  "c2de054684b1f81199803355e6080ef416bbfed34c759e1bb2aade89d572dfdd";

const privateKey2 =
  "fad00ca5423259eed376222b69db92d535c8c6a7a642fabed5049e5c3f5e99c7";

test("Custom Manifest Execute", async () => {
  const generator = new RadixWalletGenerator(NETWORK_ID);

  const wallet1 = await generator.generateWalletByPrivateKey(privateKey1);

  const wallet2 = await generator.generateWalletByPrivateKey(privateKey2);

  const executor = new CustomManifestExecutor(NETWORK_ID, wallet1);

  const manifestString = readFileSync(
    path.join(
      __dirname,
      "radix-transaction-manifest/custom-manifest-execute.rtm",
    ),
  ).toString("utf8");

  const result = await executor.execute(
    manifestString,
    [wallet1, wallet2],
    "Custom Manifest Execute",
  );

  expect(result.status).toBe(Status.SUCCESS);

  const checker = new RadixNetworkChecker(NETWORK_ID);

  await new Promise((r) => setTimeout(r, 5000));

  //@ts-ignore
  const tx = await checker.checkTransaction(result.transactionId);

  expect(tx.transaction.transaction_status).toBe(
    TransactionStatus.CommittedSuccess,
  );
}, 30000);
