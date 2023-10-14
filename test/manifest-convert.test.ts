import {
  Expression,
  ManifestBuilder,
  NetworkId,
  RadixEngineToolkit,
  decimal,
  enumeration,
  expression,
} from "@radixdlt/radix-engine-toolkit";
import { convertManifestTo } from "../src";

const NETWORK_ID = NetworkId.Stokenet;

const toAddress =
  "account_tdx_2_1294v3qk9kg2v9q2xtgsv3yeqzudev9kkew93jqha8phcg6wsz0tzd4";

test("Manifest Convert", async () => {
  const {
    componentAddresses: { faucet: FAUCET_ADDRESS },
  } = await RadixEngineToolkit.Utils.knownAddresses(NETWORK_ID);

  const manifest = new ManifestBuilder()
    .callMethod(FAUCET_ADDRESS, "lock_fee", [decimal("10")])
    .callMethod(FAUCET_ADDRESS, "free", [])
    .callMethod(toAddress, "try_deposit_batch_or_abort", [
      expression(Expression.EntireWorktop),
      enumeration(0),
    ])
    .build();

  await convertManifestTo("String", manifest, NETWORK_ID);

  expect(manifest.instructions.kind).toBe("String");

  // console.log(manifest.instructions.value);
});
