import {
  NetworkId,
  CompiledNotarizedTransaction,
} from "@radixdlt/radix-engine-toolkit";
import { NETWORK_API } from "./gateway-api";
import { DUPLICATE_RESULT, FAIL_RESULT, SUCCESS_RESULT } from "./result";
import { TransactionSubmitter } from "../tools";

function selectNetwork(networkId: number) {
  return networkId === NetworkId.Mainnet
    ? NETWORK_API.MAINNET_API
    : NETWORK_API.STOKENET_API;
}

async function process(
  networkId: number | undefined,
  f: (currentEpoch: number) => Promise<CompiledNotarizedTransaction>,
) {
  try {
    //@ts-ignore
    const NETWORK_API = selectNetwork(networkId);

    const currentStatus = await NETWORK_API.status.getCurrent();

    const transaction = await f(currentStatus.ledger_state.epoch);

    const result = await TransactionSubmitter.submit(NETWORK_API, transaction);

    return result.duplicate ? DUPLICATE_RESULT : SUCCESS_RESULT;
  } catch (e) {
    console.error(e);
    return FAIL_RESULT;
  }
}

export { selectNetwork, process };
