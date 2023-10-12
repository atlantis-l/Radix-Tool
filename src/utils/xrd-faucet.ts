import {
  NetworkId,
  SimpleTransactionBuilder,
} from "@radixdlt/radix-engine-toolkit";
import * as common from "../common";
import { Result } from "../models";

const STOKENET_API = common.STOKENET_API;

class XRDFaucet {
  static async getXRD(toAddress: string): Promise<Result> {
    let result;

    try {
      const currentStatus = await STOKENET_API.status.getCurrent();

      const transaction = await SimpleTransactionBuilder.freeXrdFromFaucet({
        networkId: NetworkId.Stokenet,
        validFromEpoch: currentStatus.ledger_state.epoch,
        toAccount: toAddress,
      });

      result = await STOKENET_API.transaction.innerClient.transactionSubmit({
        transactionSubmitRequest: {
          notarized_transaction_hex: transaction.toHex(),
        },
      });
    } catch (e) {
      console.error(e);
      return common.FAIL_RESULT;
    }

    if (result.duplicate) {
      return common.DUPLICATE_RESULT;
    }

    return common.SUCCESS_RESULT;
  }
}

export { XRDFaucet };
