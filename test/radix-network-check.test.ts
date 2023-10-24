import { RadixNetworkChecker } from "../src";
import { NetworkId } from "@radixdlt/radix-engine-toolkit";

const NETWORK_ID = NetworkId.Stokenet;

const addresses = [
  "account_tdx_2_12x36yex0ufyjn43xr85vn4jq89yuz8wdsssw2gh4g3jp4lxfdsp27h",
  "account_tdx_2_12yj5zqaljqcxhhgd77h9gvgjs2t8l4fz346gkknat4mxgfaadvd622",
];

const checker = new RadixNetworkChecker(NETWORK_ID);

const transactionId =
  "txid_tdx_2_1ya5hsekd5u42s9z878yg7f49wh3uu255ganv7zh9v9xe5napsydq9mac8u";

test("Entities Check", async () => {
  const result = await checker.checkEntities(addresses);

  expect(result.items.length).toBe(2);

  console.log(result.items);
});

test("Transaction Check", async () => {
  const result = await checker.checkTransaction(transactionId);

  expect(result.transaction.intent_hash).toBe(transactionId);

  console.log(result.transaction);
});

test("Transaction Check", async () => {
  const result = await checker.checkResourcesOfAccounts(addresses);

  expect(result.length).toBe(2);

  const resourceAddresses: string[] = [];

  result.forEach((resourceOfAccount) => {
    resourceOfAccount.fungible.forEach((fungible) => {
      resourceAddresses.push(fungible.resourceAddress);
    });

    resourceOfAccount.nonFungible.forEach((nonFungible) => {
      resourceAddresses.push(nonFungible.resourceAddress);
    });
  });

  const map = await checker.checkSymbolsOfResources(resourceAddresses);

  map.forEach((nameAndSymbol, address) => {
    console.log(`${nameAndSymbol.symbol}\n${nameAndSymbol.name}\n${address}`);
  });
});
