import { formatConvert } from "../src/common";

test("Format Convert", async () => {
  const address =
    "account_sim1294v3qk9kg2v9q2xtgsv3yeqzudev9kkew93jqha8phcg6ws0te3wn";

  const hexString =
    "516ac882c5b214c281465a20c89320171b9616d6cb8b1902fd386f8469d0";

  console.log(`Raw Account:${address}`);
  console.log(`Raw HexString:${hexString}`);

  let result = await formatConvert(address);

  console.log(`Result HexString:${result}`);

  expect(result).toEqual(hexString);

  result = await formatConvert(hexString);

  console.log(`Result:${JSON.stringify(result)}`);
});
