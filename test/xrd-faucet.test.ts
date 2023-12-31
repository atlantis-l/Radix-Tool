import { Status, XRDFaucet, setNetwork, getCurrentEpoch } from "../src";

const toAddress =
  "account_tdx_2_1294v3qk9kg2v9q2xtgsv3yeqzudev9kkew93jqha8phcg6wsz0tzd4";

test("XRD Faucet", async () => {
  // setNetwork(2, false, "");
  const result = await XRDFaucet.getXRD(toAddress, await getCurrentEpoch(2));
  expect(result.status).toBe(Status.SUCCESS);
});
