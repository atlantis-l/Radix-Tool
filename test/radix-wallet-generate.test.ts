import { RadixWalletGenerator, NetworkId } from "../src";

const NETWORK_ID = NetworkId.Stokenet;

const WalletGenerator = new RadixWalletGenerator(NETWORK_ID);

test("Radix Wallet Generator", async () => {
  const wallet = await WalletGenerator.generateNewWallet();

  // console.log(wallet);

  const result = await WalletGenerator.generateWalletByPrivateKey(
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
