import { NetworkId, setNetwork, RadixNetworkChecker } from "../src";

const walletAddress =
  "account_tdx_2_1294v3qk9kg2v9q2xtgsv3yeqzudev9kkew93jqha8phcg6wsz0tzd4";

const customNetworkBasePath = "https://stoknet.custom.com";

test("Custom Network", async () => {
  const checker = new RadixNetworkChecker(NetworkId.Stokenet);

  const result1 = await checker.checkEntities([walletAddress]);
  console.log(result1);

  setNetwork(NetworkId.Stokenet, false, customNetworkBasePath);

  const result2 = await checker.checkEntities([walletAddress]);

  console.log(result2);
});
