import { CompiledNotarizedTransaction, NotarizedTransaction, PublicKey, TransactionManifest } from "@radixdlt/radix-engine-toolkit";
import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
declare function selectNetwork(networkId: number): GatewayApiClient;
declare function getCurrentEpoch(NETWORK_API: GatewayApiClient): Promise<number>;
declare function processTransaction(networkId: number, f: (currentEpoch: number) => Promise<NotarizedTransaction>): Promise<import("../models/result").Result>;
declare function generateTransaction(transaction: NotarizedTransaction): Promise<CompiledNotarizedTransaction>;
declare function calculateFee(networkId: number, currentEpoch: number, manifest: TransactionManifest, publicKey: PublicKey): Promise<string>;
declare function convertManifestTo(kind: "String" | "Parsed", manifest: TransactionManifest, networkId: number): Promise<void>;
export { generateTransaction, selectNetwork, processTransaction, calculateFee, convertManifestTo, getCurrentEpoch, };
