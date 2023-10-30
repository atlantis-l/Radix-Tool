import { RadixWalletGenerator, NetworkId } from "../src";

const NETWORK_ID = NetworkId.Stokenet;

const privateKey =
  "c2de054684b1f81199803355e6080ef416bbfed34c759e1bb2aade89d572dfdd";

test("Wallet Test", async () => {
  const wallet = await new RadixWalletGenerator(
    NETWORK_ID,
  ).generateWalletByPrivateKey(privateKey);

  expect(wallet.privateKeyHexString()).toBe(privateKey);
});
