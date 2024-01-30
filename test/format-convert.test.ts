import { formatConvert } from "../src/common";

test("Format Convert", async () => {
  const address =
    "account_tdx_2_1294v3qk9kg2v9q2xtgsv3yeqzudev9kkew93jqha8phcg6wsz0tzd4";

  const hexString =
    "516ac882c5b214c281465a20c89320171b9616d6cb8b1902fd386f8469d0";

  const networkId = 2;

  let result = await formatConvert(address, networkId);

  expect(result).toEqual(hexString);

  result = await formatConvert(hexString, networkId);

  expect(result).toEqual(address);
});
