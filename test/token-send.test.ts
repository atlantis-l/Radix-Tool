import { NetworkId, RadixEngineToolkit } from "@radixdlt/radix-engine-toolkit";
import { TokenSender, Status, RadixWalletGenerator } from "../src";

const NETWORK_ID = NetworkId.Stokenet;

const WalletGenerator = new RadixWalletGenerator(NETWORK_ID);

const privateKey =
  "c2de054684b1f81199803355e6080ef416bbfed34c759e1bb2aade89d572dfdd";

const feePayerPrivateKey =
  "fad00ca5423259eed376222b69db92d535c8c6a7a642fabed5049e5c3f5e99c7";

const toAddress =
  "account_tdx_2_12x36yex0ufyjn43xr85vn4jq89yuz8wdsssw2gh4g3jp4lxfdsp27h";

const amount = "100";

test("XRD Transfer", async () => {
  const message = "XRD Transfer";

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

const NFT_ADDRESS =
  "resource_tdx_2_1n22a2xx6yyx4dfwzg8s7cgrnyvdc69fr7n9swm6d8vuj658mgvz694";

const localIds = ["#14#", "#15#"];

test("NonFungible Transfer", async () => {
  const message = "NonFungible Transfer";

  const wallet = await WalletGenerator.generateWalletByPrivateKey(privateKey);

  const sender = new TokenSender(NETWORK_ID, wallet);

  sender.feeLock = "5";

  const result = await sender.sendNonFungible(
    toAddress,
    NFT_ADDRESS,
    localIds,
    message,
  );

  expect(result.status).toBe(Status.SUCCESS);
});
