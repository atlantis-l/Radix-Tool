import {
  ManifestBuilder,
  address,
  decimal,
  enumeration,
  NetworkId,
  RadixEngineToolkit,
  expression,
  Expression,
} from "@radixdlt/radix-engine-toolkit";
import {
  calculateFee,
  getCurrentEpoch,
  selectNetwork,
  RadixWalletGenerator,
} from "../src";

const NETWORK_ID = NetworkId.Stokenet;

const NETWORK_API = selectNetwork(NETWORK_ID);

const privateKey =
  "c2de054684b1f81199803355e6080ef416bbfed34c759e1bb2aade89d572dfdd";

const toAddress =
  "account_tdx_2_12yj5zqaljqcxhhgd77h9gvgjs2t8l4fz346gkknat4mxgfaadvd622";

const amount = "1000";

test("Transaction Preview", async () => {
  const {
    resourceAddresses: { xrd: XRD_ADDRESS },
  } = await RadixEngineToolkit.Utils.knownAddresses(NETWORK_ID);

  const wallet = await new RadixWalletGenerator(
    NETWORK_ID,
  ).generateWalletByPrivateKey(privateKey);

  const manifest = new ManifestBuilder()
    .callMethod(wallet.address, "lock_fee", [decimal("10")])
    .callMethod(wallet.address, "withdraw", [
      address(XRD_ADDRESS),
      decimal(amount),
    ])
    .callMethod(toAddress, "try_deposit_batch_or_abort", [
      expression(Expression.EntireWorktop),
      enumeration(0),
    ])
    .build();

  //TODO
  const fee = await calculateFee(
    NETWORK_ID,
    await getCurrentEpoch(NETWORK_API),
    manifest,
    wallet.publicKey,
  );

  // console.log(fee);
});
