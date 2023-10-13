import assert from "assert";
import { RadixWalletGenerator } from "../src";
import { NetworkId } from "@radixdlt/radix-engine-toolkit";

const NETWORK_ID = NetworkId.Stokenet;

test("Radix Wallet Generator", async () => {
  const wallet = await RadixWalletGenerator.generateNewWallet(NETWORK_ID);

  assert(wallet.privateKey !== undefined);

  // console.log(wallet);

  const result = await RadixWalletGenerator.generateWalletByPrivateKey(
    NETWORK_ID,
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
