import {
  TokenSender,
  Status,
  RadixWalletGenerator,
  CustomOption,
  TokenType,
} from "../src";
import { NetworkId, RadixEngineToolkit } from "@radixdlt/radix-engine-toolkit";

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

  const feePayerWallet =
    await WalletGenerator.generateWalletByPrivateKey(feePayerPrivateKey);

  const sender = new TokenSender(NETWORK_ID, wallet);

  sender.feePayerWallet = feePayerWallet;
  sender.feeLock = "5";

  const result = await sender.sendFungibleToken(
    toAddress,
    XRD_ADDRESS,
    amount,
    message,
  );

  expect(result.status).toBe(Status.SUCCESS);
});

const NFT_ADDRESS =
  "resource_tdx_2_1nta7utvejl0axmn3hj3tpheappgl9tu5kfwlsl0l5ykajh4zl44uuc";

const localIds = ["#14#", "#15#"];

test("NonFungible Transfer", async () => {
  const message = "NonFungible Transfer";

  const wallet = await WalletGenerator.generateWalletByPrivateKey(privateKey);

  const sender = new TokenSender(NETWORK_ID, wallet);

  sender.feeLock = "5";

  const result = await sender.sendNonFungibleToken(
    toAddress,
    NFT_ADDRESS,
    localIds,
    message,
  );

  expect(result.status).toBe(Status.SUCCESS);
});

test("Custom Transfer", async () => {
  const wallet = await WalletGenerator.generateWalletByPrivateKey(privateKey);
  const feePayer =
    await WalletGenerator.generateWalletByPrivateKey(feePayerPrivateKey);
  const sender = new TokenSender(NETWORK_ID, wallet);
  const message = "Send Custom Test";

  const {
    resourceAddresses: { xrd: XRD_ADDRESS },
  } = await RadixEngineToolkit.Utils.knownAddresses(NETWORK_ID);

  const customOptions: CustomOption[] = [];

  customOptions.push({
    fromWallet: wallet,
    toAddress: toAddress,
    transferInfos: [
      {
        tokenType: TokenType.NONFUNGIBLE,
        tokenAddress:
          "resource_tdx_2_1nta7utvejl0axmn3hj3tpheappgl9tu5kfwlsl0l5ykajh4zl44uuc",
        nonFungibleLocalIds: ["#12#", "#13#", "#14#"],
      },
      {
        tokenType: TokenType.FUNGIBLE,
        tokenAddress: XRD_ADDRESS,
        amount: "10000",
      },
    ],
  });

  customOptions.push({
    fromWallet: wallet,
    toAddress: feePayer.address,
    transferInfos: [
      {
        tokenType: TokenType.FUNGIBLE,
        tokenAddress: XRD_ADDRESS,
        amount: "9999",
      },
      {
        tokenType: TokenType.NONFUNGIBLE,
        tokenAddress:
          "resource_tdx_2_1nta7utvejl0axmn3hj3tpheappgl9tu5kfwlsl0l5ykajh4zl44uuc",
        nonFungibleLocalIds: ["#16#", "#17#"],
      },
    ],
  });

  customOptions.push({
    fromWallet: feePayer,
    toAddress: toAddress,
    transferInfos: [
      {
        tokenType: TokenType.FUNGIBLE,
        tokenAddress: XRD_ADDRESS,
        amount: "8888",
      },
      {
        tokenType: TokenType.NONFUNGIBLE,
        tokenAddress:
          "resource_tdx_2_1nf2mjpvhwpu46aj4kpfvjn4zzpm2a4chnt723qm4mz9rc7c8c73d7s",
        nonFungibleLocalIds: ["#16#", "#17#"],
      },
    ],
  });

  customOptions.push({
    fromWallet: feePayer,
    toAddress: wallet.address,
    transferInfos: [
      {
        tokenType: TokenType.FUNGIBLE,
        tokenAddress: XRD_ADDRESS,
        amount: "7777",
      },
      {
        tokenType: TokenType.NONFUNGIBLE,
        tokenAddress:
          "resource_tdx_2_1nf2mjpvhwpu46aj4kpfvjn4zzpm2a4chnt723qm4mz9rc7c8c73d7s",
        nonFungibleLocalIds: ["#14#", "#12#"],
      },
    ],
  });

  customOptions.push({
    fromWallet: wallet,
    toAddress: toAddress,
    transferInfos: [],
  });

  customOptions.push({
    fromWallet: wallet,
    toAddress: toAddress,
    transferInfos: [],
  });

  customOptions.push({
    fromWallet: wallet,
    toAddress: toAddress,
    transferInfos: [],
  });

  const result = await sender.sendCustom(customOptions, message);

  expect(result.status).toBe(Status.SUCCESS);
});
