import { PublicKey, TransactionManifest, NotarizedTransaction, CompiledNotarizedTransaction } from "@radixdlt/radix-engine-toolkit";
import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
import { PreviewResult, Result } from "../models";
declare function selectNetwork(networkId: number): GatewayApiClient;
declare function formatConvert(str: string): Promise<string | {
    mainnet_address: `${Lowercase<string>}1${string}`;
    stokenet_address: `${Lowercase<string>}1${string}`;
    simulator_address: `${Lowercase<string>}1${string}`;
}>;
declare function getCurrentEpoch(networkId: number): Promise<number>;
declare function generateTransaction(transaction: NotarizedTransaction): Promise<CompiledNotarizedTransaction>;
declare function processTransaction(networkId: number, f: () => Promise<NotarizedTransaction>): Promise<Result>;
declare function previewTransaction(networkId: number, manifest: TransactionManifest, notaryPublicKey: PublicKey, signerPublicKeys: PublicKey[], blobsHex: string[], currentEpoch: number): Promise<PreviewResult>;
declare function convertManifestTo(kind: "String" | "Parsed", manifest: TransactionManifest, networkId: number): Promise<void>;
export { selectNetwork, formatConvert, getCurrentEpoch, convertManifestTo, previewTransaction, processTransaction, generateTransaction, };
