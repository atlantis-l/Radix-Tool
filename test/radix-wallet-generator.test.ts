import assert from "assert";
import { RadixWalletGenerator } from "../src";
import { NetworkId } from "@radixdlt/radix-engine-toolkit";

const networkId = NetworkId.Stokenet;

test("Radix Wallet Generator", async () => {
  const wallet = await RadixWalletGenerator.generateNewWallet(networkId);

  assert(wallet.privateKey !== undefined);

  // console.log(wallet);

  const result = await RadixWalletGenerator.generateWalletByPrivateKey(
    networkId,
    wallet.privateKeyHexString(),
  );

  expect(result.address).toBe(wallet.address);
  expect(result.publicKey.hexString()).toBe(wallet.publicKey.hexString());

  // const start = Date.now();

  // for (let i = 0; i < 10000; i++) {
  //   //Test No.1
  //   await RadixWalletGenerator.generateNewWallet(networkId);
  //   //Test No.2
  //   await RadixWalletGenerator.generateWalletByPrivateKey(
  //     networkId,
  //     wallet.privateKeyHexString(),
  //   );
  // }

  // const end = Date.now();

  // console.log(`Time:${(end - start) / 1000}s`);
});
