import {
  Status,
  NetworkId,
  RadixNetworkChecker,
  RadixWalletGenerator,
  CustomManifestExecutor,
} from "../src";
import path from "path";
import { readFileSync } from "fs";
import { TransactionStatus } from "@radixdlt/babylon-gateway-api-sdk";

const NETWORK_ID = NetworkId.Stokenet;

const privateKey1 =
  "c2de054684b1f81199803355e6080ef416bbfed34c759e1bb2aade89d572dfdd";

const privateKey2 =
  "fad00ca5423259eed376222b69db92d535c8c6a7a642fabed5049e5c3f5e99c7";

const packageAddress =
  "package_tdx_2_1pkcqcyvmlulkj3533g7lzraqsshg8w0js4h8qdntfpg4qy25qyv234";

test("Custom Manifest Execute", async () => {
  const generator = new RadixWalletGenerator(NETWORK_ID);

  const wallet1 = await generator.generateWalletByPrivateKey(privateKey1);

  const wallet2 = await generator.generateWalletByPrivateKey(privateKey2);

  const executor = new CustomManifestExecutor(NETWORK_ID, wallet1);

  const manifestString1 = readFileSync(
    path.join(
      __dirname,
      "radix-transaction-manifest/custom-manifest-execute.rtm",
    ),
  ).toString("utf8");

  const manifestString = `
  CALL_METHOD
  Address("${wallet1.address}")
  "lock_fee"
  Decimal("100");

  CALL_METHOD
  Address("${wallet1.address}")
  "create_proof_of_non_fungibles"
  Address("resource_tdx_2_1nta7utvejl0axmn3hj3tpheappgl9tu5kfwlsl0l5ykajh4zl44uuc")
  Array<NonFungibleLocalId>(
    NonFungibleLocalId("#16#")
  );

  SET_METADATA
  Address("${packageAddress}")
  "name"
  Enum<Metadata::String>(
    "Test Package"
  );
  `;

  const result = await executor.execute(
    manifestString,
    [],
    "Custom Manifest Execute",
  );

  expect(result.status).toBe(Status.SUCCESS);

  console.log(result.transactionId);

  const checker = new RadixNetworkChecker(NETWORK_ID);

  await new Promise((r) => setTimeout(r, 5000));

  //@ts-ignore
  const tx = await checker.checkTransaction(result.transactionId);

  expect(tx.transaction.transaction_status).toBe(
    TransactionStatus.CommittedSuccess,
  );
}, 30000);
