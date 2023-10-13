import {
  NetworkId,
  SimpleTransactionBuilder,
} from "@radixdlt/radix-engine-toolkit";
import { process } from "../common";

class XRDFaucet {
  static async getXRD(toAddress: string) {
    return process(NetworkId.Stokenet, async (currentEpoch) => {
      return SimpleTransactionBuilder.freeXrdFromFaucet({
        networkId: NetworkId.Stokenet,
        validFromEpoch: currentEpoch,
        toAccount: toAddress,
      });
    });
  }
}

export { XRDFaucet };
