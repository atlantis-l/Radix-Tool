import { NetworkId, RadixEngineToolkit } from "@radixdlt/radix-engine-toolkit";
import { TokenSender, Status, RadixWalletGenerator } from "../src";

const NETWORK_ID = NetworkId.Stokenet;

const WalletGenerator = new RadixWalletGenerator(NETWORK_ID);

const privateKey =
  "c2de054684b1f81199803355e6080ef416bbfed34c759e1bb2aade89d572dfdd";

const feePayerPrivateKey =
  "fad00ca5423259eed376222b69db92d535c8c6a7a642fabed5049e5c3f5e99c7";

const toAddress =
  "account_tdx_2_12yj5zqaljqcxhhgd77h9gvgjs2t8l4fz346gkknat4mxgfaadvd622";

const amount = "100";

const message = "Hello Radix!";

test("XRD Transfer", async () => {
  const {
    resourceAddresses: { xrd: XRD_ADDRESS },
  } = await RadixEngineToolkit.Utils.knownAddresses(NETWORK_ID);

  const wallet = await WalletGenerator.generateWalletByPrivateKey(privateKey);

  const feePayer =
    await WalletGenerator.generateWalletByPrivateKey(feePayerPrivateKey);

  const sender = new TokenSender(NETWORK_ID, wallet);

  sender.feePayer = feePayer;
  sender.feeLock = "5";

  const result = await sender.sendFungible(
    toAddress,
    XRD_ADDRESS,
    amount,
    message,
  );

  expect(result.status).toBe(Status.SUCCESS);
});
