import { CompiledNotarizedTransaction } from "@radixdlt/radix-engine-toolkit";
declare function selectNetwork(networkId: number): import("@radixdlt/babylon-gateway-api-sdk").GatewayApiClient;
declare function process(networkId: number | undefined, f: (currentEpoch: number) => Promise<CompiledNotarizedTransaction>): Promise<import("../models/result").Result>;
export { selectNetwork, process };
