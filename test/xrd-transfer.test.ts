import { NetworkId } from "@radixdlt/radix-engine-toolkit";
import { FungibleTokenSender } from "../src/tools";
import { Status } from "../src/models";

const networkId = NetworkId.Stokenet;

const XRD_ADDRESS =
  "resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc";

const privateKey =
  "c2de054684b1f81199803355e6080ef416bbfed34c759e1bb2aade89d572dfdd";

const toAccount =
  "account_tdx_2_12yj5zqaljqcxhhgd77h9gvgjs2t8l4fz346gkknat4mxgfaadvd622";

const transferAmount = "1000";

test("XRD Transfer", async () => {
  const sender = await FungibleTokenSender.new(networkId, privateKey);

  const result = await sender.send(toAccount, XRD_ADDRESS, transferAmount);

  expect(result.status).toBe(Status.SUCCESS);
});
