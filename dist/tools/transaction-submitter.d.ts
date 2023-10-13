import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
import { CompiledNotarizedTransaction } from "@radixdlt/radix-engine-toolkit";
declare class TransactionSubmitter {
    static submit(networkApi: GatewayApiClient, transaction: CompiledNotarizedTransaction): Promise<import("@radixdlt/babylon-gateway-api-sdk").TransactionSubmitResponse>;
}
export { TransactionSubmitter };
