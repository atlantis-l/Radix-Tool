import { NetworkId, RadixNetworkChecker } from "../src";

const NETWORK_ID = NetworkId.Stokenet;

const checker = new RadixNetworkChecker(NETWORK_ID);

const transactionId =
  "txid_tdx_2_1ya5hsekd5u42s9z878yg7f49wh3uu255ganv7zh9v9xe5napsydq9mac8u";

const addresses = [
  "account_tdx_2_12x36yex0ufyjn43xr85vn4jq89yuz8wdsssw2gh4g3jp4lxfdsp27h",
  "account_tdx_2_12yj5zqaljqcxhhgd77h9gvgjs2t8l4fz346gkknat4mxgfaadvd622",
  "account_tdx_2_1294v3qk9kg2v9q2xtgsv3yeqzudev9kkew93jqha8phcg6wsz0tzd4",
];

test("getEntityDetailsVaultAggregated", async () => {
  const resourcesOfAccounts = await checker.checkResourcesOfAccounts(addresses);

  resourcesOfAccounts.forEach((resourcesOfAccount) => {
    console.log(resourcesOfAccount.address);
    console.log(resourcesOfAccount.fungible);
    console.log(resourcesOfAccount.nonFungible);
  });
});

test("Entities Check", async () => {
  const result = await checker.checkEntities(addresses);

  expect(result.items.length).toBe(3);

  console.log(result.items);
});

test("Transaction Check", async () => {
  const result = await checker.checkTransaction(transactionId);

  expect(result.transaction.intent_hash).toBe(transactionId);

  console.log(result.transaction);
});
