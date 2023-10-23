import {
  PackageDeployer,
  RadixNetworkChecker,
  RadixWalletGenerator,
  Status,
} from "../src";
import path from "path";
import { readFileSync } from "fs";
import { NetworkId } from "@radixdlt/radix-engine-toolkit";
import { TransactionStatus } from "@radixdlt/babylon-gateway-api-sdk";

const NETWORK_ID = NetworkId.Stokenet;

const privateKey =
  "c2de054684b1f81199803355e6080ef416bbfed34c759e1bb2aade89d572dfdd";

test("Package Deploy", async () => {
  const generator = new RadixWalletGenerator(NETWORK_ID);

  const wallet = await generator.generateWalletByPrivateKey(privateKey);

  const packageDeployer = new PackageDeployer(NETWORK_ID, wallet);

  packageDeployer.feeLock = "200";

  const wasm = readFileSync(path.join(__dirname, "package-deploy/hello.wasm"));

  const rpd = readFileSync(path.join(__dirname, "package-deploy/hello.rpd"));

  const message = "Package Deploy";

  const globalId =
    "resource_tdx_2_1nta7utvejl0axmn3hj3tpheappgl9tu5kfwlsl0l5ykajh4zl44uuc:#16#";

  const result1 = await packageDeployer.deployWithOwner(
    wasm,
    rpd,
    globalId,
    message,
  );

  const result2 = await packageDeployer.deploy(wasm, rpd, message);

  expect(result1.status).toBe(Status.SUCCESS);

  console.log(result1.transactionId);

  expect(result2.status).toBe(Status.SUCCESS);

  console.log(result2.transactionId);

  const checker = new RadixNetworkChecker(NETWORK_ID);

  await new Promise((r) => setTimeout(r, 5000));

  //@ts-ignore
  const tx1 = await checker.checkTransaction(result1.transactionId);

  expect(tx1.transaction.transaction_status).toBe(
    TransactionStatus.CommittedSuccess,
  );

  //@ts-ignore
  const tx2 = await checker.checkTransaction(result2.transactionId);

  expect(tx2.transaction.transaction_status).toBe(
    TransactionStatus.CommittedSuccess,
  );
}, 30000);
