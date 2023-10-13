import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
import { CompiledNotarizedTransaction } from "@radixdlt/radix-engine-toolkit";

class TransactionSubmitter {
  static submit(
    networkApi: GatewayApiClient,
    transaction: CompiledNotarizedTransaction,
  ) {
    return networkApi.transaction.innerClient.transactionSubmit({
      transactionSubmitRequest: {
        notarized_transaction_hex: transaction.toHex(),
      },
    });
  }
}

export { TransactionSubmitter };
