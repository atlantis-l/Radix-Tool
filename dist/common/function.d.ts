import { CompiledNotarizedTransaction, NotarizedTransaction, PublicKey, TransactionManifest } from "@radixdlt/radix-engine-toolkit";
declare function selectNetwork(networkId: number): import("@radixdlt/babylon-gateway-api-sdk").GatewayApiClient;
declare function process(networkId: number | undefined, f: (currentEpoch: number) => Promise<CompiledNotarizedTransaction>): Promise<import("../models/result").Result>;
declare function generateTransaction(f: () => Promise<NotarizedTransaction>): Promise<CompiledNotarizedTransaction>;
declare function calculateFee(networkId: number | undefined, currentEpoch: number, manifest: TransactionManifest, publicKey: PublicKey): Promise<string>;
declare function convertManifestTo(kind: "String" | "Parsed", manifest: TransactionManifest, networkId: number): Promise<void>;
export { generateTransaction, selectNetwork, process, calculateFee, convertManifestTo, };
