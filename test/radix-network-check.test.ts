import { RadixNetworkChecker } from "../src";
import { NetworkId } from "@radixdlt/radix-engine-toolkit";

const NETWORK_ID = NetworkId.Stokenet;

const addresses = [
  "account_tdx_2_1294v3qk9kg2v9q2xtgsv3yeqzudev9kkew93jqha8phcg6wsz0tzd4",
  "account_tdx_2_12yj5zqaljqcxhhgd77h9gvgjs2t8l4fz346gkknat4mxgfaadvd622",
];

const transactionId =
  "txid_tdx_2_1ya5hsekd5u42s9z878yg7f49wh3uu255ganv7zh9v9xe5napsydq9mac8u";

test("Entities Check", async () => {
  const entityChecker = new RadixNetworkChecker(NETWORK_ID);

  const result = await entityChecker.checkEntities(addresses);

  expect(result.items.length).toBe(2);

  console.log(result.items);
});

test("Transaction Check", async () => {
  const transactionChecker = new RadixNetworkChecker(NETWORK_ID);

  const result = await transactionChecker.checkTransaction(transactionId);

  expect(result.transaction.intent_hash).toBe(transactionId);

  console.log(result.transaction);
});
