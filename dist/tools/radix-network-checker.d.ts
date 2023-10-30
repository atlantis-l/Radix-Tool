import { NameAndSymbol, ResourcesOfAccount } from "../models";
declare class RadixNetworkChecker {
    networkId: number;
    constructor(networkId: number);
    checkEntities(addresses: string[]): Promise<import("@radixdlt/babylon-gateway-api-sdk").StateEntityDetailsResponse>;
    checkResourcesOfAccounts(addresses: string[]): Promise<ResourcesOfAccount[]>;
    checkSymbolsOfResources(resourceAddresses: string[]): Promise<Map<string, NameAndSymbol>>;
    checkTransaction(transactionId: string): Promise<import("@radixdlt/babylon-gateway-api-sdk").TransactionCommittedDetailsResponse>;
}
export { RadixNetworkChecker };
